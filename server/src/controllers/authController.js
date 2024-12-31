const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");
const sendEmail = require("../emailService");

const generateOTP = require("../generateotp");

const formatUserData = async (user) => {
  const isNotAdmin = user.role !== "admin";
  let orgSetupCompleted = false;
  if (isNotAdmin) {
    const org = await Organization.findById(user.organization);
    if (org) {
      orgSetupCompleted = org.setupCompleted;
    }
  }

  return {
    ...user.toObject(),
    ...(isNotAdmin && { orgSetupCompleted }),
    ...(isNotAdmin && { organization: user.organization }),
  };
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  const userData = await formatUserData(user);

  res.json({
    ...userData,
    token,
  });
};

const updatePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    req.user.password = newPassword;
    req.user.isPasswordChanged = true;

    await req.user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = await formatUserData(user);

    res.json(userData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user data", error: error.message });
  }
};

const forgetpassword = async (req, res) => {
  const { email } = req.body;

  // vrify email exist
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "user does no exist" });
  }

  // generate 5 diit otp
  const otp = generateOTP();

  // save this otp
  user.otp = otp;

  await user.save();

  // send mail with otp
  const subject = "Forger password | MICT";
  const text = `Dear ${user.name},\n\nYou're one time password is ${otp} .\n\nPlease use the following password to verify \n\nThank you!`;
  sendEmail(email, subject, text);

  res.json(otp);
};

const verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  // vrify email exist
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "user does no exist" });
  }

  if (user.otp === otp) {
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res.json({ success: false, message: "Incorrect OTP" });
  }
};

//reset password
const resetpassword = async (req, res) => {
  const { email, otp, password, rePassword } = req.body;

  //verify password and re enter password
  if (password !== rePassword) {
    return res.json({ success: false, message: "Password does not match" });
  }

  // vrify email exist
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "user does no exist" });
  }

  if (user.otp === otp) {
    //password change
    user.password = password;

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } else {
    res.json({ success: false, message: "Incorrect OTP" });
  }
};

module.exports = {
  login,
  updatePassword,
  getUserData,
  forgetpassword,
  verifyotp,
  resetpassword
};
