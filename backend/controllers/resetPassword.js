const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { sendGrid } = require("../../middlewares/sendGrid");
const User = require("../models/userModel");
const SALT = 10;

router.put("/:id/:token", async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;

    const isValid = await User.findOne({
      _id: id,
    });
    const new_secret = isValid._id + process.env.JWT_SECRET;

    try {
      jwt.verify(token, new_secret);

      if (!password || password == undefined) {
        return res.status(202).json({
          responseCode: 202,
          responseMsg: "Password is required",
        });
      }

      if (password !== confirm_password) {
        return res.status(203).json({
          responseCode: 202,
          responseMsg: "Password and confirm password not match",
        });
      }

      const encryptedPassword = await bcrypt.hash(password, SALT);

      await User.updateOne(
        { _id: id },
        { $set: { password: encryptedPassword } }
      );

      return res.status(200).json({
        responseCode: 200,
        responseMsg: "Everything worked as successfull",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(205).json({
        responseCode: 205,
        responseMsg: "Password link is expired",
      });
    }
  } catch (err) {
    return res.status(500).json({
      responseCode: 500,
      responseMsg: "Something went wrong",
    });
  }
});

module.exports = router;
