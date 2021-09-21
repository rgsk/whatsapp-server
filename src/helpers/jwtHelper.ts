import JWT from "jsonwebtoken";
import redisClient from "./initRedis";
import { MyContext } from "../MyContext";

export const signAccessToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    // these fields should be set in either
    // options or payload
    const payload = {
      // aud: userId,
      // exp: Date.now() / 1000 + 60 * 60,
      // iss: 'skartner.com',
    };
    const secret = process.env.ACCESS_TOKEN_SECRET!;
    const options = {
      expiresIn: "1h", // 15s
      issuer: "skartner.com",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err: any, token: any) => {
      if (err) {
        return reject(new Error("InternalServerError"));
      }
      resolve(token);
    });
  });
};
export const verifyAccessToken = (context: MyContext) => {
  return new Promise((resolve, reject) => {
    const authHeader = context.req.headers["authorization"];
    if (!authHeader) {
      return reject(new Error("Authorization header not set"));
    }

    const bearerToken = authHeader.split(" ");
    // bearerToken[0] = Bearer
    // console.log(bearerToken);
    const token = bearerToken[1];
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (err) {
          // Error validating the token
          // console.log(err);
          console.log(err.name);
          if (err.name === "TokenExpiredError") {
            return reject(err);
          } else {
            // err.name === 'JsonWebTokenError'
            return reject(new Error("Invalid token"));
            // here you should not send err.message
            // it will be like invalid signature
            // the client may use another signature
            // simply send Unauthorized
          }
        }
        context.payload = payload;
        // attach payload to req
        resolve(payload);
      }
    );
  });
};
export const signRefreshToken = (userId: string) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET!;
    const options = {
      expiresIn: "1y", // 30s
      issuer: "skartner.com",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(new Error("InternalServerError"));
      }
      // whenever we generate new refresh token
      // we want to invalidate older refresh tokens
      // so we store this newly generated refresh token
      // in redis
      redisClient.set(
        userId,
        token!,
        "EX",
        365 * 24 * 60 * 60,
        // 30,
        (err, reply) => {
          if (err) {
            console.log(err.message);
            return reject(new Error("InternalServerError"));
          }
          resolve(token);
        }
      );
    });
  });
};
export const verifyRefreshToken = (refreshToken: string) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err, payload: any) => {
        if (err) {
          return reject(
            new Error("Invalid refreshToken exited after jwt validation")
          );
        }
        const userId: string = payload.aud;
        // after we validated the refresh token
        // through jwt we also need to check
        // that this refresh token is the one
        // set last time, so we retrieve
        // the last saved refresh token from redis db
        // if the refreshToken matches with token from redis
        // we validate the token
        redisClient.get(userId, (err, result) => {
          if (err) {
            console.log(err.message);
            return reject(
              new Error(
                `Error while getting refreshToken against ${userId} from database`
              )
            );
          }
          if (refreshToken === result) {
            return resolve(userId);
          }
          return reject(
            new Error(
              "Provided refresh token does't match with refreshToken in Redis, although validated by jwt, new refresh token must be generated"
            )
          );
        });
      }
    );
  });
};
