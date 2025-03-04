import admin from "../config/firebase.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // ✅ Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // ✅ Check if user already exists in DB
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // ✅ Create new user if not found
      user = new User({
        firebaseUID: uid,
        email,
        name: name || "Anonymous",  // ✅ Fallback for missing name
        avatar: picture || "",       // ✅ Avoid `undefined`
      });
      await user.save();
    }

    // ✅ Generate JWT Token for further API authentication
    if (!process.env.JWT_SECRET) {
      console.error("⚠️ JWT_SECRET is not set in environment variables!");
      return res.status(500).json({ error: "Server error: Missing JWT secret" });
    }

    const authToken = jwt.sign(
      { uid: user.firebaseUID },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "User authenticated successfully",
      token: authToken,
      user
    });

  } catch (error) {
    console.error("❌ Auth Error:", error);
    
    if (error.code === "auth/argument-error") {
      return res.status(401).json({ error: "Invalid Firebase token" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};
