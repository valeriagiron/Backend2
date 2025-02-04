import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/users.model.js';
import { JWT_SECRET } from "../utils/index.js"
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        console.log("passportuser======",user)
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;