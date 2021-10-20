import passport from "passport"
import {Strategy} from "passport-local";
import {UserModel} from "../db/models/models.js";

export const isLoggedIn = (req, res, done) => {
    if (!req.user) return res.status(401).json({msg: "Unathorized"});
    done();
};

const LocalStrategy = Strategy;
const strategyOptions = {usernameField: "username", passwordField: "password", passReqToCallback: true};

const loginFunc = async (req, username, password, done) => {
    const user = (await UserModel.findOne({username}));
    if (!user) return done(null, false, {message: "User does not exist"});
    if (!user.isValidPassword(password)) return done(null, false, {message: "Password is not valid."});
    console.log(`${username} logged succesfully`);
    return done(null, user);
};
const signUpFunc = async (req, username, password, done) => {
    try {
        const {username, password, email, firstName, lastName} = req.body;
        if (!username || !password || !email || !firstName || !lastName) return done(null, false);
        const query = {$or: [{username: username}, {email: email}]};
        const user = (await UserModel.findOne(query));
        if (user) return done(null, false, `Username "${username}" already exists`);
        else{
            const userData = {username, password, email, firstName, lastName};
            const newUser = new UserModel(userData);
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        done(error);
    }
};

passport.use("login", new LocalStrategy(strategyOptions, loginFunc));
passport.use("signup", new LocalStrategy(strategyOptions, signUpFunc));

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((userId, done) => {
    UserModel.findById(userId, (err, user) => done(err, user));
});

export default passport;
