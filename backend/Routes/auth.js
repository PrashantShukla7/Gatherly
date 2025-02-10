const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require("../Model/user.js");
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 8);
      const existingUser = await User.findOne({ email: email}) 
      if (existingUser) {
        return res.status(400).json({message: "Email already exists", 'ok': false});
      }
      const user = new User({ email, password: hashedPassword, name });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      const userDetails = {
        email: user.email,
        name: user.name,
        _id: user._id,
      };
      res.status(201).json({ userDetails, token, 'ok': true });
    } catch (error) {
      res.status(500).json({message: "Something went wrong", 'ok': false});
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({message: "Email doesn't exist", 'ok': false});
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({message: "Wrong password", 'ok': false});
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.send({ user, token, "ok": true });
    } catch (error) {
      res.status(400).json({ message: "something went wrong", 'ok': false });
    }
  });
  module.exports = router;