"use strict";

const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { BadRequestError } = require("../core/error.response");
require("dotenv").config();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

class MailService {
  static sendMail = async ({ sendTo, title, description }) => {
    try {
      console.log("📧 Sending email to:", sendTo);
      console.log("📧 Email subject:", title);

      if (!sendTo || typeof sendTo !== "string" || !sendTo.includes("@")) {
        throw new BadRequestError("Invalid recipient email address");
      }

      // Lấy access token với xử lý lỗi chi tiết
      let accessToken;
      try {
        accessToken = await oAuth2Client.getAccessToken();
        console.log("🔑 Access Token:", accessToken);
      } catch (oauthError) {
        console.error("❌ OAuth Error:", oauthError);
        throw new BadRequestError(`OAuth Error: ${oauthError.message}`);
      }

      if (!accessToken) {
        throw new BadRequestError("Unable to get access token");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "thonghien25012003@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token || accessToken, // Xử lý cả 2 trường hợp
        },
      });

      const info = await transporter.sendMail({
        from: '"LAB" <thonghien25012003@gmail.com>',
        to: sendTo.trim(),
        subject: title,
        text: description,
        html: `<b>${description}</b>`,
      });

      console.log("✅ Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("❌ Full Error Details:", {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      throw new BadRequestError(`Email sending failed: ${error.message}`);
    }
  };
}

module.exports = MailService;
