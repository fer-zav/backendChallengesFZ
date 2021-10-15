import dotenv from "dotenv";
dotenv.config();

export const Config = {
    PORT:                 process.env.PORT                 || 8080,
    MONGO_ATLAS_USER:     process.env.MONGO_ATLAS_USER     || "user",
    MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || "pasw",
    MONGO_ATLAS_CLUSTER:  process.env.MONGO_ATLAS_CLUSTER  || "clusterUrl",
    MONGO_ATLAS_DBNAME:   process.env.MONGO_ATLAS_DBNAME   || "dbName",
    MONGO_LOCAL_DBNAME:   process.env.MONGO_LOCAL_DBNAME   || "dbNameLocal",
    SESSION_SECRET:       process.env.SESSION_SECRET       || "someSrting",
    FACEBOOK_APP_ID:      process.env.FACEBOOK_APP_ID      || "fbCoderAppId",
    FACEBOOK_APP_SECRET:  process.env.FACEBOOK_APP_SECRET  || "fbCoderAppKey",
};
