import admin from "firebase-admin";
import { readFileSync } from "fs";
import "dotenv/config"; 

const serviceAccount = JSON.parse(
  readFileSync("./routes/serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});

export const db = admin.database();
