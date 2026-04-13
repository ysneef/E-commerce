import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JwtUtil from "../utils/JwtUtil.js";
import BaseController from "./BaseController.js";
import ForgotPassword from "../utils/ForgotPassword.js";
import { sendWelcomeEmail } from "../utils/SendWelcomeEmail.js";

const hashPassword = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const userExists = await userModel.findOneByCondition({ email });
    console.log("🚀 ~ registerUser ~ userExists:", userExists);

    if (userExists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = hashPassword(`${password}_pass`);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    console.log("🚀 ~ registerUser ~ user:", user);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.userName).catch(console.error);

    res.json({ success: true, message: "Registration successful", user });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = `Field ${key} is required`;
        return acc;
      }, {});

      return res.json({ success: false, errors });
    }

    res.json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("🚀 ~ loginUser ~ req.body:", req.body);

    const userName = req.body.userName;
    const password = req.body.password;

    if (userName && password) {
      const user = await selectByUsernameAndPassword(
        userName,
        hashPassword(`${password}_pass`)
      );

      if (user) {
        const token = JwtUtil.genToken({
          id: user._id,
          userName: user.userName,
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        res.json({
          success: true,
          message: "Authentication successful",
          token: token,
          user: user,
        });
      } else {
        res.json({
          success: false,
          message: "Incorrect username or password",
        });
      }
    } else {
      res.json({
        success: false,
        message: "Please input username and password",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userModel._id;

    const userWithOrders = await userModel.findById(userId);

    const orders = await orderModel.findAll({
      _id: { $in: userWithOrders.order },
    });

    const totalCart = userWithOrders.cart.length;

    res.json({
      ...userWithOrders.toObject(),
      totalCart,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      userName,
      avatar,
      email,
      currentPassword,
      newPassword,
      address,
      phone,
      role,
    } = req.body;

    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "User not found" });
    }

    if (
      currentPassword &&
      currentPassword.trim() !== "" &&
      newPassword &&
      newPassword.trim() !== ""
    ) {
      const hashedCurrent = hashPassword(`${currentPassword}_pass`);

      if (hashedCurrent !== user.password) {
        return res.status(200).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      user.password = hashPassword(`${newPassword}_pass`);
    }

    user.userName = userName || user.userName;
    user.avatar = avatar || user.avatar;
    user.email = email || user.email;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Update successful",
      user: updatedUser,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel.deleteById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const selectByUsernameAndPassword = async (userName, password) => {
  const query = { userName: userName, password: password };
  const admin = await userModel.findOneByCondition(query);
  return admin;
};

export const getUserByPayload = BaseController.getDataByPayload(userModel, {
  searchFields: ["userName", "email"],
  extraProcessing: async (results) => {
    const userIds = results.map((user) => user._id);
    const userDetails = await userModel.findAll({ _id: { $in: userIds } });
    return { userDetails };
  },
});

export const addToCart = async (req, res) => {
  try {
    const userId = req.userModel._id;

    const {
      productId,
      name,
      quantity,
      image,
      price,
      size,
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({
        productId,
        name,
        quantity,
        image,
        price,
        discountPercent,
        discountPrice,
        size,
      });
    }

    const updatedUser = await user.save();
    const totalCart = updatedUser.cart.length;

    res.json({
      success: true,
      message: "Added to cart successfully",
      cart: updatedUser.cart,
      totalCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

export const manageCartItem = async (req, res) => {
  try {
    const userId = req.userModel._id;

    const {
      productId,
      name,
      quantity,
      image,
      price,
      discountPercent,
      discountPrice,
      size,
      action,
    } = req.body;

    const user = await userModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });

    let updatedCart = [...user.cart];

    if (action === "add") {
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.productId === productId && item.size === size
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({
          productId,
          name,
          quantity,
          image,
          price,
          discountPercent,
          discountPrice,
          size,
        });
      }
    } else if (action === "update") {
      const itemIndex = updatedCart.findIndex(
        (item) => item.productId === productId && item.size === size
      );

      if (itemIndex === -1)
        return res.status(404).json({
          success: false,
          message: "Product not found in cart",
        });

      updatedCart[itemIndex].quantity = quantity;
    } else if (action === "delete") {
      updatedCart = updatedCart.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    user.cart = updatedCart;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: `Cart ${action === "add"
          ? "added"
          : action === "update"
            ? "updated"
            : "deleted"
        } successfully`,
      cart: updatedUser.cart,
      totalCart: updatedUser.cart.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error handling cart",
      error: error.message,
    });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOneByCondition({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save();

    await ForgotPassword(user.email, token, otp);

    res.json({
      success: true,
      message: "OTP has been sent to your email",
      token: token
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, token } = req.body;

    // Check if token and otp are valid
    const user = await userModel.findOneByCondition({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash the new password using the same format as registerUser
    user.password = hashPassword(`${newPassword}_pass`);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: "Password has been successfully reset" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.json({ success: false, message: "Server error", error: error.message });
  }
};
