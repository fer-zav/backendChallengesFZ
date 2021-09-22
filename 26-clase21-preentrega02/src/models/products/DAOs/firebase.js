import admin from "firebase-admin";
import firebase from "../../../config/firebase_creds.js";

admin.initializeApp({
    credential: admin.credential.cert(firebase),
});

const db = admin.firestore();

export class ProductosFirebase{
    //placeholder;
}
