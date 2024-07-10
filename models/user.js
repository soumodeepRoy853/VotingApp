const mongoose = require ('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: String,
        required: true
    },
    aadharNumber:{
        type: Number,
        required: true,
        unique: true
    },
    aadress:{
        type: String,
        required: true
    },
    email:{
        type: String
    },
    mobile:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted:{
        type: Boolean,
        default: false
    }

})

userSchema.pre('save', async function (next){
    const user = this

    //Hash the password only if it has been modified (or new)
    if(!user.isModified('password')) return next()

    try{
      //Hash password generation
      const salt = await bcrypt.genSalt(10)

      //Hash password
      const hashPassword = await bcrypt.hash(user.password, salt)

      //override the plain password with hashpassword
      user.password = hashPassword
      next();
    }
    catch(err){
      return next(err);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
    //Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch
    }
    catch(err){
        throw err
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User;