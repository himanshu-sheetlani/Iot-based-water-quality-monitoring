import express from 'express'
import nodeCron from "node-cron";
import alert from "./routes/alert.js";
import { db } from "./routes/firebaseAdmin.js";

const app=express()
const port=3000
app.use(express.json());

app.get('/', (req, res) => {
  res.send("HydroWatch backend is running")
})

app.post("/alert", alert);

nodeCron.schedule("* * * * *", async () => {
  const readingsRef = db.ref("readings");
  const snapshot = await readingsRef.once("value");

  const now = Date.now();
  const data = snapshot.val();

  if (!data) return;

  Object.entries(data).forEach(([key, value]) => {
    const timestamp = new Date(value.timestamp).getTime();
    // 1 minute = 60,000 ms
    if (now - timestamp > 60_000) {
      readingsRef.child(key).remove();
      console.log(`Deleted old record: ${key}`);
    }
  });
});

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})