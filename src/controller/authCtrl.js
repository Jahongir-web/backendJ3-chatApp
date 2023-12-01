const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const Users = require("../model/userModel")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authCtrl = {
  signUp: async (req, res) => {
    const {email} = req.body
    try {
      const existingUser = await Users.findOne({email});
      if(existingUser) {
        return res.status(400).json({message: "This is email already exists!"})
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;

      if(req.body.role) {
        req.body.role = Number(req.body.role);
      }

      const user = new Users(req.body);
      await user.save()

      const {password, ...otherDetails} = user._doc

      const token = JWT.sign(otherDetails, JWT_SECRET_KEY, {expiresIn: "1h"})

      res.status(201).json({message: "signup success", user: otherDetails, token})

    } catch (error) {
      console.log(error);
      res.status(503).json({message: error.message})
    }
  },

  signIn: async (req, res) => {
    const {email} = req.body;
    try {
      const existingUser = await Users.findOne({email});
      if(!existingUser) {
        return res.status(404).json({message: "User not found!"})
      } 

      const isPasswordCorrect = await bcrypt.compare(req.body.password, existingUser.password);
      if(!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid credentials!"})
      }
      const {password, ...otherDetails} = existingUser._doc;

      const token = JWT.sign(otherDetails, JWT_SECRET_KEY, {expiresIn: "1h"})

      res.status(200).json({message: "login success", user: otherDetails, token})

    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

}

module.exports = authCtrl