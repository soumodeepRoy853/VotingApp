const express = require('express')
const router = express.Router()
const User = require('../models/user')
const {jwtAuthMiddleware, generateToken} = require ('../jwt')
const Candidate = require('../models/candidate')

const checkAdminRole = async (userId)=>{
    try{
       const user = await User.findById(userId)
       if(user.role === 'admin')
        return true;
    }
    catch(err){ 
       return false;
    }
}

//Create Candidate profile
router.post('/',jwtAuthMiddleware, async (req, res)=>{
    try{
      if(!(await checkAdminRole(req.user.id)))
        return res.status(403).json('User does not have Admin role') 

      const data = req.body
      const newCandidate = new Candidate(data);
      const response = await newCandidate.save();

      //console.log("Data saved!")
      res.status(200).json({response: response})
    }
    catch(err){
      console.log(err)
      res.status(500).json("Internal server error!")
    }
  })

  //Update Candidate Profile
  router.put('/:candidateId',jwtAuthMiddleware, async(req,res)=>{
    try{
        if(! (await checkAdminRole(req.user.id)))
            return res.status(403).json('User has not Admin role') 
    
        const candidateId = req.params.candidateId
        const updatedCandidateData = req.body
        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData,{
          new: true,
          runValidators: true,
        }) 
        if(!response){
          res.status(404).json("User not found!")
        }
        console.log("Data updated!")
        res.status(200).json(response)  
    }
    catch(err){ 
      console.log(err)
      res.status(500).json("Password update unseccessfull!") 
    }
  })

  //Delete Candidate profile
  router.delete('/:candidateId',jwtAuthMiddleware, async(req,res)=>{
    try{
        if(! (await checkAdminRole(req.user.id)))
            return res.status(403).json('User has not Admin') 
    
        const candidateId = req.params.candidateId
        const response = await Candidate.findByIdAndDelete(candidateId) 
        if(!response){
          res.status(404).json("Candidate not found!")
        }
        console.log("Candidate deleted!")
        res.status(200).json(response)  
    }
    catch(err){ 
      console.log(err)
      res.status(500).json("Candidate delete unseccessfull!") 
    }
  })

  //Voting Start
  router.post('/vote/:candidateId', jwtAuthMiddleware, async(req, res)=>{
     candidateId = req.params.candidateId
     userId = req.user.id

     try{

      //Find candidate with candidateId
     const candidate = await Candidate.findById(candidateId)
     if(!candidate){
      return res.status(404).json({message: 'Candidate not found'})
    }
     
     //Find user with UserId
     const user = await User.findById(userId)
     if(!user)
      return res.status(404).json("User not found!")

     //Find user has gave vote or not
     if(user.isVoted)
      return res.status(400).json("You have already voted")

     //Admin can't giva vote
     if(user.role == 'admin')
      return res.status(403).json("Admin can not give vote")

     //Update candidate record to record vote
     candidate.votes.push({user: userId})
     candidate.voteCount++;
     await candidate.save()

     //Update the user document
     user.isVoted = true;
     await user.save();
     res.status(200).json("Vote recorded Successfull")
     }
     catch(err){
      console.log(err)
      res.status(500).json("Internal server error") 
     }
  })

  //Vote count
  router.get('/vote/count', async (req, res)=>{
    try{
      //Find all candidates and sort them in desc order
      const candidate = await Candidate.find().sort({voteCount: 'desc'})

      //Map candidates to only return name and voteCount
      const voteRecord = candidate.map((data)=>{
        return{
          party: data.party,
          count: data.voteCount
        }
      })
      res.status(200).json(voteRecord)
    }
    catch(err){
      console.log(err)
      res.status(500).json("Internal server error") 
    }
  })

  //Fetch Candidate list
  router.get('/candidates', async(req, res)=>{
    try{
      const candidates = await Candidate.find()
      res.status(200).json(candidates)
    }
    catch(err){
      console.log(err)
      res.status(500).json("Internal server error") 
    }
  })

  
  module.exports = router