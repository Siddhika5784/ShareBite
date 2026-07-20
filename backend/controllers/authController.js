import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  console.log("Register API Hit");
    console.log(req.body);
  try {
    const { name, email, password, phone, role, address } = req.body;

    // Validation
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });

    if (!phone)
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });

    if (!role)
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });

    if (!address)
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validation
        if (!email) {
    return res.status(400).json({
        success: false,
        message: "Email is required",
    });
}

if (!password) {
    return res.status(400).json({
        success: false,
        message: "Password is required",
    });
}

        // Find User
const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT
        const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

        // Return Response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};