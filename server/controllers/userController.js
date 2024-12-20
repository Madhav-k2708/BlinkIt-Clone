import sendEmail from "../config/sendEmail.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be 8 characters or long",
      });
    }

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all the fields" });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        error: true,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(payload);

    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from blinkit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      success: true,
      message: "User register successfully",
      data: save,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify email
const verifyEmailId = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await userModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Code" });
    }

    const updateUser = await userModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.json({ success: true, message: "Email verified",data : updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not found" });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Your profile is inactived. please contact to our admin.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password doesn't match" });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await userModel.findByIdAndUpdate(user?._id, {
      last_login_date : new Date()
    })

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// logout user
const logout = async (req, res) => {
  try {
    const userid = req.userId; // middleware

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    const removeRefreshToken = await userModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({ success: true, message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UploadAvatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const image = req.file; // from multer middleware

    const upload = await uploadImageCloudinary(image);

    const updateUser = await userModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "Profile uploaded",
      success:true,
      data: { _id: userId, avatar: upload.url },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { name, email, password, mobile } = req.body;

    let hashedPassword = " ";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await userModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashedPassword }),
      }
    );

    return res.json({
      success: true,
      message: "Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forget password when user not login
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hr

    const update = await userModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forget password from blinkit",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({ success: true, message: "Opt sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// verify forgot password otp
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Provide required field email, otp ",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({ success: false, message: " Otp expired" });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({ success: false, message: "Invalid Otp" });
    }

    // if otp is not expired
    // otp === user.forgot_password_otp

 const updateUserOtp = await userModel.findByIdAndUpdate(user?._id, {
  forgot_password_otp : "",
  forgot_password_expiry : ""
 })
    return res.json({ success: true, message: "Otp verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// reset the password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Provide required fields" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(401)
        .json({
          success: false,
          message: "newPassword and confirmPassword must be same.",
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const update = await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// refreshToken
const refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split("")[1];

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_KEY
    );

    if (!verifyToken) {
      return res
        .status(401)
        .json({ success: false, message: "Token is expired" });
    }
    console.log("verifyToken", verifyToken);

    const userId = verifyToken._id;

    const newAccessToken = await generateAccessToken(userId);

    const cookieOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", newAccessToken, cookieOption);
    return res.json({
      success: true,
      message: "New access token generated",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const userDetails = async (req, res) => {
  try {
    const userId = req.userId
    const user = await userModel.findById(userId).select("-password -refresh_token")
    return res.json({success:true, message:"Getting User Details ", data:user})
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  verifyEmailId,
  loginUser,
  logout,
  uploadAvatar,
  updateUserDetails,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  refreshToken,
  userDetails,
};
