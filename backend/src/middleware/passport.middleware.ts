import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { db } from "../dbConnection/db"


const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your_jwt_secret"
};

passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [jwt_payload.id]);
        if (result.rowCount !== null && result.rowCount > 0) {
          return done(null, result.rows[0]);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
  
  export default passport;

