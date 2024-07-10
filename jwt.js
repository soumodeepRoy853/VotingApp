const jwt = require ('jsonwebtoken')
const jwtAuthMiddleware = (req, res, next)=>{

    //Check headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'Invalid Token'})

    //Extract the jwt token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'})

        try{
            //verify the jwt token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Attacheduser information to the request object
            req.user = decoded
            next();
        }
        catch(err){
            console.log(err)
            res.status(401).json({error: 'Invalid token'})
        }
}

//Function to generate jwt token
const generateToken = (userData) =>{
    
    //Generate the new jwt token using user data
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn: 3000})
}

module.exports = {jwtAuthMiddleware, generateToken}