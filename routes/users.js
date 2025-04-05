var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../modelo/User');
const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async (req, res, next) => {
  try{
    const {username, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({username, password: hashedPassword});
    await newUser.save();

    res.status(201).json({ message: 'User successfully registered'});
  }catch(err){
    res.status(500).json({ err : 'Error creating user', "description": err.toString()});
  }
});

router.post('/login', async function (req, res, next) {
  try{
    const {username, password} =req.body;

    const user = await User.findOne({username});
    if (!user) return res.status(400).json ({ error: "User not found"});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password"});

    const token = jwt.sign ({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
    res.cookie('habitToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * (24) * 60 * 60 * 1000
    });
      res.json({ message: 'Successful login', token});
  }catch(error){
      res.status(500).json({ error: 'Login error', 'description' : error.toString() });
  }
});

module.exports = router;
