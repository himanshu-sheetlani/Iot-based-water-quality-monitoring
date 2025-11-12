import admin from "firebase-admin";
import { readFileSync } from "fs";
import "dotenv/config"; 

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

export const db = admin.database();
