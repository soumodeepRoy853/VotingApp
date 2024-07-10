const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {jwtAuthMiddleware, generateToken} = require ('./../jwt')

//For user Signup router
router.post('/signup', async (req, res)=>{
    try{
      const data = req.body
      const newUser = new User(data);
      const response=await newUser.save();

      const playload = {
        id: response.id
      }

      const token = generateToken(playload)  
      //console.log("Data saved!")
      res.status(200).json({response: response, token: token})
    }
    catch(err){
      console.log(err)
      res.status(500).json("Internal server error!")
    }
  })

  //Login router
  router.post('/login', async(req, res)=>{
    try{
         //Exact username and password from the request body
    const {aadharNumber, password} = req.body

    //Find the user by aadharNumber
    const user = await User.findOne({aadharNumber: aadharNumber})

    //If the user and password does not exist then return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'})
    }
    
    //generate token
    const playload = {
      id: user.id
    }
    const token = generateToken(playload)

    //return token as response
    res.json({token})

    }
    catch(err){
       res.status(500).json({error:'Internal server error'})
    }

  })

  //Profile route
  router.get('/profile', jwtAuthMiddleware, async(req, res)=>{
    try{
      const userData = req.user
      const userId = userData.id
      const user = await User.findById(userId)
      res.status(200).json({user})
    }
    catch(err){
      res.status(500).json({error: 'Internal server error'})
    }
  })

  //Update user Profile
  router.put('/profile/password', jwtAuthMiddleware, async(req,res)=>{
    try{
      const userId = req.user
      const {currentPassword, newPassword} = req.body

      //find the user by userId
      const user = await User.findById(userId)

      //If password does not match, return error
      if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json('Invalid username or password')
      }

      //Update the user's password
      user.password = newPassword;
      await user.save()

      res.status(200).json('Password updated')
    }
    catch(err){ 
      console.log(err)
      res.status(500).json("Password update unseccessfull!") 
    }
  })

  
  module.exports = router