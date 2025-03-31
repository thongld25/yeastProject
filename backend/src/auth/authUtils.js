"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};

/**
 * Tạo cặp Access Token và Refresh Token
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, { expiresIn: "2d" });
    const refreshToken = JWT.sign(payload, privateKey, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair:", error);
    throw new Error("Token generation failed");
  }
};

/**
 * Xác thực Access Token
 */
const verifyAccessToken = (token, publicKey) => {
  try {
    return JWT.verify(token, publicKey);
  } catch (error) {
    throw new AuthFailureError("Invalid or expired Access Token!");
  }
};

/**
 * Xác thực Refresh Token
 */
const verifyRefreshToken = (token, privateKey) => {
  try {
    return JWT.verify(token, privateKey);
  } catch (error) {
    throw new AuthFailureError("Invalid or expired Refresh Token!");
  }
};

/**
 * Middleware xác thực người dùng bằng Access Token hoặc Refresh Token
 */
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Missing User ID in headers!");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("KeyStore not found for user!");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (accessToken) {
    try {
      const decodedUser = verifyAccessToken(accessToken, keyStore.publicKey);
      if (userId !== decodedUser.userId)
        throw new AuthFailureError("User ID mismatch!");

      req.keyStore = keyStore;
      req.user = decodedUser;
      return next();
    } catch (error) {
      console.log("Access Token expired or invalid, checking Refresh Token...");
    }
  }

  // Nếu Access Token không hợp lệ hoặc không có => Kiểm tra Refresh Token
  const refreshToken = req.headers[HEADER.REFRESHTOKEN];
  if (!refreshToken) throw new AuthFailureError("Missing Refresh Token!");

  try {
    const decodedUser = verifyRefreshToken(refreshToken, keyStore.privateKey);
    if (userId !== decodedUser.userId)
      throw new AuthFailureError("User ID mismatch!");

    // Tạo Access Token mới
    const { accessToken: newAccessToken } = await createTokenPair(
      { userId: decodedUser.userId },
      keyStore.publicKey,
      keyStore.privateKey
    );

    req.keyStore = keyStore;
    req.user = decodedUser;
    req.refreshToken = refreshToken;
    req.newAccessToken = newAccessToken; // Gửi token mới về client
    return next();
  } catch (error) {
    throw new AuthFailureError("Invalid Refresh Token!");
  }
});

module.exports = {
  createTokenPair,
  authentication,
  verifyAccessToken,
  verifyRefreshToken,
};
