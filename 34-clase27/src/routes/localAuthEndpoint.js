import cookieParser from "cookie-parser";
import {Router} from "express";
import session from "express-session";
import passport from "../middlewares/userLocalAuth.js";

const authEndpoints = Router();
authEndpoints.use(cookieParser());
const loginType = "fb"; // "local"

authEndpoints.get("/", (req, res) => {
    res.json({
        msg: "G'day!",
        session: req.session,
    });
});

authEndpoints.get("/facebook", passport.authenticate("facebook", {scope: ['email']}));
authEndpoints.get("/facebook/callback", passport.authenticate("facebook", {successRedirect: "/auth/userData", failureRedirect: "/auth/fail"}));

authEndpoints.get(["/login", "/ingresar"], (req, res) => {
    res.render('localAuthForm', {
        cant: 0,
        auth: loginType,
        logged_: req.user,
        payload: req.session?.passport?.user,
        layout: "index",
    });
});
authEndpoints.get(["/signup", "/registro"], (req, res) => {
    res.render('localSignUpForm', {
        cant: 0,
        logged_: req.user,
        layout: "index",
    });
});
authEndpoints.get("/userData", (req, res) => {
    res.render("fbLoginButton", {
        auth: loginType,
        logged_: req.user,
        payload: req.session.passport.user,
        layout: "index",
    });
});

authEndpoints.post(["/login", "/ingresar"], passport.authenticate("login", {failureRedirect: "/fail"}), (req, res) => {
    res.json({msg: "Welcome!", user: req.user});
});
authEndpoints.post(["/signup", "/registro"], (req, res, next) => {
    passport.authenticate("signup", {failureRedirect: "/fail"}, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({data: info});
        res.json({msg: "signup OK"});
    })(req, res, next);
});

authEndpoints.get('/logout', (req, res) => {
    const destroyedUser = req.session.user;
    req.logout();
    res.render("authLogoutForm", {
        user: destroyedUser,
        layout: "index"
    });
});

authEndpoints.get("/fail", (req, res) => {
    res.status(404).res({msg: "ERROR: invalid request, retry"});
});

export default authEndpoints;
