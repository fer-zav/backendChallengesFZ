import passport from "passport"
import {Strategy as FBStrategy} from "passport-facebook";
import {Config} from "../config/config.js";

export const isLoggedIn = (req, res, done) => {
    if (!req.user) return res.status(401).json({msg: "Unathorized"});
    done();
};

const fbAuthOptions = {
    clientID: Config.FACEBOOK_APP_ID,
    clientSecret: Config.FACEBOOK_APP_SECRET,
    callbackURL: `http://localhost:${process.env.PORT || 8080}/auth/facebook/callback`,
    profileFields: ["id", "displayName", "photos", "emails"],
}
const fbLoginFunc = (accessToken, refreshToken, profile, done) => {
    console.log();
    console.log(JSON.stringify(accessToken, null, "\t"));
    console.log(JSON.stringify(refreshToken, null, "\t"));
    console.log(JSON.stringify(profile, null, "\t"));
    return done(null, profile);
}

passport.use(new FBStrategy(fbAuthOptions, fbLoginFunc));

passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

export default passport;
