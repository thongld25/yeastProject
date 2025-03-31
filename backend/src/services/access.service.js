"use strict";

const userModel = require("../models/user.model");
const factoryModel = require("../models/factory.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const UserService = require("./user.service");

class AccessService {
  /*
  check this token used
  */
  static handlerRefeshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something wrong happend!! Please login again!");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("User not registered!");

    const foundUser = await UserService.findByEmail({ email });

    if (!foundUser) throw new AuthFailureError("User not registered!");

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(`Deleted KeyStore::`, delKey);
    return delKey;
  };

  /*
    1. Check email in dbs
    2. match password
    3. create AT vs RT and save
    4. generate tokens
    5. get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundUser = await UserService.findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("Error: User not found");
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundUser;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    return {
      user: getInfoData({
        fileds: ["_id", "name", "email", "role"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password, factoryName, location }) => {
    // try {
    const factory = await factoryModel.findOne({ name: factoryName }).lean();
    if (factory) {
      throw new ConflictRequestError("Error: Factory already exists");
    }
    const newFactory = await factoryModel.create({
      name: factoryName,
      location,
    });
    const user = await userModel.findOne({ email }).lean();
    if (user) {
      throw new BadRequestError("Error: Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      role: "manager",
      factoryId: newFactory._id,
    });

    if (newUser) {
      newFactory.employees.push(newUser._id);
      await newFactory.save();
      // create privateKey and publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save colection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: KeyStore not created");
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fileds: ["_id", "name", "email", "role"],
            object: newUser,
          }),
          factory: getInfoData({
            fileds: ["_id", "name", "location"],
            object: newFactory,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (err) {
    //   return {
    //     code: "xxxx",
    //     message: err.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
