import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";
import "dotenv/config"

// Your Firebase config (from project settings → Web app)
const firebaseConfig = {
  apiKey: process.env.apikey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function sendRandomData() {
  const data = {
    ph: (Math.random() * (8 - 7) + 6).toFixed(2),
    tds: Math.floor(Math.random() * (445 - 450) + 100),
    turbidity: Math.floor(Math.random() * (45 - 43) + 1),
    temperature: Math.floor(Math.random() * (35 - 32) + 20),
    timestamp: new Date().toISOString()
  };

  const readingsRef = ref(db, "tank/readings");
  const newRef = push(readingsRef);
  set(newRef, data);

  console.log("Sent data:", data);

}


setInterval(sendRandomData, 10000); 
