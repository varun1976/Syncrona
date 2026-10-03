import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from "google-auth-library";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (typeof fullName !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: trimmedEmail });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    const userId = req.user._id;

    if (!profilePic && fullName === undefined) {
      return res.status(400).json({ message: "At least profilePic or fullName is required" });
    }

    const updateFields = {};

    if (fullName !== undefined) {
      if (typeof fullName !== "string") {
        return res.status(400).json({ message: "Full name must be a string" });
      }
      const trimmedName = fullName.trim();
      if (!trimmedName) {
        return res.status(400).json({ message: "Full name cannot be empty" });
      }
      if (trimmedName.length < 2 || trimmedName.length > 50) {
        return res.status(400).json({ message: "Full name must be between 2 and 50 characters" });
      }
      updateFields.fullName = trimmedName;
    }

    if (profilePic) {
      if (typeof profilePic !== "string") {
        return res.status(400).json({ message: "Profile picture payload must be a string" });
      }

      const isValidBase64 = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(profilePic);
      const isValidUrl = /^https:\/\//.test(profilePic);
      if (!isValidBase64 && !isValidUrl) {
        return res.status(400).json({
          success: false,
          code: "INVALID_IMAGE_FORMAT",
          message: "Please upload a valid image file (PNG, JPG, WEBP, or GIF).",
        });
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
          folder: "syncrona_avatars",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        });
        updateFields.profilePic = uploadResponse.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary avatar upload error:", cloudinaryErr.message);
        return res.status(400).json({
          success: false,
          code: "AVATAR_UPLOAD_FAILED",
          message: "Unable to update your profile picture. Please try another image or try again later.",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("error in update profile:", error.message);
    res.status(500).json({
      success: false,
      code: "PROFILE_UPDATE_FAILED",
      message: "We couldn't save your profile changes. Please try again.",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  try {
    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured on server" });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    const { sub: googleId, email, name: fullName, picture: profilePic } = payload;

    let user = await User.findOne({ email });

    if (user) {
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (!user.profilePic && profilePic) {
        user.profilePic = profilePic;
        isUpdated = true;
      }
      if (isUpdated) {
        await user.save();
      }
    } else {
      user = new User({
        fullName: fullName || email.split("@")[0],
        email,
        profilePic: profilePic || "",
        googleId,
        authProvider: "google",
      });
      await user.save();
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in googleAuth controller:", error.message);
    res.status(401).json({ message: "Google authentication failed: " + error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clean up Cloudinary profile image if custom image exists
    if (user.profilePic && user.profilePic.includes("cloudinary.com") && user.profilePic.includes("syncrona_avatars")) {
      try {
        const parts = user.profilePic.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`syncrona_avatars/${publicId}`);
        }
      } catch (cloudinaryErr) {
        console.log("Error cleaning up Cloudinary image:", cloudinaryErr.message);
      }
    }

    // Delete all messages sent or received by this user
    await Message.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    // Delete user record from database
    await User.findByIdAndDelete(userId);

    // Clear authentication cookie
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({ message: "Invalid payload format" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({ message: "Google OAuth accounts do not use a password" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error in changePassword controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
