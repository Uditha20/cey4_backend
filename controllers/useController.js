import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    city,
    state,
    country,
    occupation,
    phoneNumber,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      city,
      state,
      country,
      occupation,
      phoneNumber,
      transactions: [],
      role: "admin",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "successfull create",
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    // Send response
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        state: user.state,
        country: user.country,
        occupation: user.occupation,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


// Logout User
export const logoutUser = async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  
  res.status(200).json({ message: "Logged out successfully" });
};