const jwt = require("jsonwebtoken");
// const services = require('../services/tokenDecode');
module.exports = adminRole = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({ msg: "Không có token xác thực" });
    }

    // Extract token from "Bearer <token>" format
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    } else {
      token = authHeader; // Fallback for tokens without Bearer prefix
    }

    // Check if token exists after extraction
    if (!token) {
      return res.status(401).json({ msg: "Token không hợp lệ" });
    }

    // Decode token to get user info
    const token_decode = jwt.decode(token);
    if (!token_decode) {
      return res.status(401).json({ msg: "Token không thể giải mã" });
    }

    // Verify token
    await jwt.verify(token, process.env.JWT_SECRET, function (err) {
      if (err) {
        return res
          .status(401)
          .json({ msg: "Token đã hết hạn hoặc không hợp lệ" });
      } else {
        // Check if user is admin
        if (token_decode.role !== "admin") {
          return res
            .status(403)
            .json({ msg: "Bạn không có quyền truy cập (chỉ dành cho Admin)" });
        } else {
          next();
        }
      }
    });
  } catch (error) {
    console.error("AdminAuth middleware error:", error);
    return res.status(500).json({ msg: "Lỗi xác thực" });
  }
};
