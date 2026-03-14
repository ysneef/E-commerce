import jwt from "jsonwebtoken"
import MyConstants from "./MyConstants.js"
import userModel from "../models/userModel.js"

const JwtUtil = {
  genToken(key) {
    const token = jwt.sign({ ...key }, MyConstants.JWT_SECRET, {
      expiresIn: MyConstants.JWT_EXPIRES,
    })
    return token
  },

  checkToken(req, res, next) {
    let token = req?.cookies?.token || req.headers["authorization"]

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length)
    }

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Auth token is not supplied",
      })
    }

    jwt.verify(token, MyConstants.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid",
        })
      }
      // console.log("decoded.id:",decoded.id)

      try {
        const user = await userModel.findById(decoded.id).select("-password")
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" })
        }
        // console.log("user:",user)
        req.userModel = user
        next()
      } catch (error) {
        console.log("error:", error)
        return res.status(500).json({ success: false, message: "Server error" })
      }
    })
  },
}

export default JwtUtil
