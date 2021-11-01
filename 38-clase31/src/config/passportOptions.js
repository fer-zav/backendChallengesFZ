import session from "express-session";
import MongoStore from "connect-mongo";
import {Config} from "./config.js";

export const localAuthOptions = session({
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 10,
    },
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/ecommerce",//`mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    }),
    secret: Config.SESSION_SECRET,
    rolling: true,
    resave: false,
    saveUninitialized: false,
});

export const fbAuthOptions = session({
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 10,
    },
    secret: Config.SESSION_SECRET,
    rolling: true,
    resave: true,
    saveUninitialized: true,
});
