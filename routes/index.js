var express = require('express');
var router = express.Router();
const Habit = require('../modelo/habit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if(!token)
     return res.status(401).json({ message: 'Access denied'});
  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  }catch(error){
    console.error(error); 
    res.status(401),json({ message: 'Invalid token'});
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/habit', authenticateToken, async (req, res) => {
  try {
   let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({message : "Error retrieving habits"});
    console.log(req.user.userId);
    const habits = await Habit.find({'userId': new mongoose.Types.ObjectId(userId)});
    res.json(habits); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
});

router.post('/habit', authenticateToken,async function(req, res) {
  try{
    console.log(req.body);
    let {title, description} =  req.body;
    let userId = req.user && req.user.userId ? req.user.userId: res.status(500).json({ message: "Error adding habits"});
    userId = new mongoose.Types.ObjectId(userId);
    const habit = new Habit({title, description, userId});
    await habit.save();
  res.json(habit);
  }catch(err){
    console.error(err);
    res.status(400).json({message: 'Error creating habit'});
  }
});

router.delete('/habit/:id', authenticateToken,async (req, res)=>{
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'habit deleted'})
  }catch(err){
    res.status(500).json({message: 'Habit not found'});
  }
});

router.put('/habit/:id', authenticateToken,async (req, res, next)=>{
  try{
    const{title, description} = req.body;
    const updateHabit = await Habit.findByIdAndUpdate(req.params.id,
      {title, description},
      {new: true, runValidators: true}
    );
    if (!updateHabit){
      return res.status(600).json({ message: 'Habit not found'});
    }
    res.json(updateHabit);
  }catch(err){
    res.status(700).json({message: 'Error updating habit'});
  }
});

router.patch('/habit/markasdone/:id', authenticateToken,async (req,res)=> {
  try{
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();
    if (timeDifferenceInHours(habit.lastDone, habit.lastUpdated) < 24){
      habit.lastUpdated = new Date();
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.save();
      res.status(200).json({message: 'Habit marked as done'});
    }else{
      habit.days = 1;
      habit.lastUpdated = new Date();
      habit.startedAt = new Date();
      habit.save();
      res.status(200).json({message: 'Habit restarted'});

    }
  }catch(err){
    res.status(500).json({message: 'Error updating Habit'});
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const diffnceMS = Math.abs(date1 - date2);
  return diffnceMS / (1000 * 60 * 60); 
}

const timeDifferenceInDays = (date1, date2) => {
  const diffnceMS = Math.abs(date1 - date2);
  return Math.floor(diffnceMS / (1000 * 60 * 60 * 24));
}

module.exports = router;
