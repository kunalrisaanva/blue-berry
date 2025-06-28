import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { db } from "../dbConnection/db";
import jwt from "jsonwebtoken";
dotenv.config();

export const setupGoogleStrategy = () => {
  console.log("working");
  console.log("clientID:", process.env.GOOGLE_CLIENT_ID as string);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `http://localhost:1111/api/v1/auth/google/callback`,
        // callbackURL: `${process.env.BACKEND_URL}api/v1/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google profile:", profile);

          // 1. First check if user exists with the Google ID
          const result = await db.query(
            "SELECT * FROM users WHERE google_id = $1",
            [profile.id]
          );

          let user;

          if (result.rows.length > 0) {
            user = result.rows[0];
          } else {
            // 2. Check if user with the same email already exists (linked via other method)
            const emailCheck = await db.query(
              "SELECT * FROM users WHERE email = $1",
              [
                profile.emails && profile.emails.length > 0
                  ? profile.emails[0].value
                  : null,
              ]
            );

            if (emailCheck.rows.length > 0) {
              return done(
                new Error(
                  "A user already exists with this email. Try logging in with a different method."
                ),
                false
              );
            }

            // 3. Otherwise, insert new user
            console.log("working code here 1");
            console.log(profile.id, profile);
            const insertResult = await db.query(
              "INSERT INTO users (google_id, username, email) VALUES ($1, $2, $3) RETURNING *",
              [
                profile.id,
                profile.displayName,
                profile.emails && profile.emails.length > 0
                  ? profile.emails[0].value
                  : null,
                // profile.photos?.[0]?.value,
              ]
            );
            user = insertResult.rows[0];
          }

          const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            {
              expiresIn: "1h",
            }
          );

          return done(null, { ...user, token });
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done) => {
    done(null, obj);
  });
};
