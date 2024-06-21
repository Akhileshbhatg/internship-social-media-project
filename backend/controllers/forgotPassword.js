const express = require("express");
const router = express.Router();
// const { initAccountModel } = require("../../models/accounts");
// const constants = require("../../consfgs/constants");
// const { RESPONSE } = require("../../consfgs/global");
const jwt = require("jsonwebtoken");
// const { sendGrid } = require("../../middlewares/sendGrid");
const User = require("../models/userModel");
const  sendMyMail = require("../middlewares/nodeMailer");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    // const accountModel = await initAccountModel();

    const emailPattern = String(email).match(
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    );
    if (!emailPattern || emailPattern.length <= 0 || email.indexOf(" ") >= 0) {
      return res
        .status(201)
        .json({ responseCode: 201, responseMsg: "Email is in invalid format" });
    }

    const isEmail = await User.findOne({ email: email });
    if (!isEmail) {
      return res.status(201).json({
        responseCode: 201,
        responseMsg: "Enter email not find in the DB",
      });
    }

    const secret = isEmail._id + process.env.JWT_SECRET;
    const token = jwt.sign({ id: isEmail._id, email: isEmail.email }, secret, {
      expiresIn: "1h",
    });
    // const link = `${process.env.BASE_URL}/api/accounts/reset_password/${isEmail.account_id}/${token}`;
    const link = `${process.env.RESET_PASSWORD}/${isEmail._id}/${token}`;
    const subject = "Requested to change password!";
    const text = `<div><p>Dear ${isEmail.name.toUpperCase()},</p>
    <p>We received a request to reset the password for your account. 
    If you made this request, please click the following button:</p>
    <a href=${link}>
      <button style="padding:15px 30px; background-color: #D32032; border: none; outline: none;
       cursor: pointer; color: #fff; text-transform: uppercase; font-weight: bold">
      reset password
      </button></a>
      <p>The password reset link is valid till 1hour.
      <br>If you didn't raise this request, please ignore this email.<p>
      <br>
      <p>Regards,<br>Circle Connect</p>
    </div>`;

    console.log(link);

    // await sendGrid(isEmail.email, process.env.FROM_EMAIL, subject, html);
    // mail
    await sendMyMail(isEmail.email, subject, text);
    return res.status(200).json({
      responseCode: 200,
      responseMsg: "Everything worked as successfull",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      responseCode: 500,
      responseMsg: "Something went wrong",
    });
  }
});

module.exports = router;
