import { db } from "./firebaseAdmin.js";
import dayjs from "dayjs";
import schedule from "node-schedule";

console.log("Daily snapshot module loaded.");


async function createDailySnapshot() {
  try {
    const readingsRef = db.ref("tank/readings");

    // Query to get the single most recent reading
    const query = readingsRef.orderByChild("timestamp").limitToLast(1);
    const snapshot = await query.once("value");

    if (!snapshot.exists()) {
      console.log("No realtime data found.");
      return;
    }

    // snapshot may contain a single child; extract its value
    let latestData = null;
    snapshot.forEach((childSnap) => {
      latestData = childSnap.val();
      // stop iterating after first child
      return true;
    });

    if (!latestData) {
      console.log("No latest reading available to snapshot.");
      return;
    }

    const currentDate = dayjs().format("YYYY-MM-DD");

    await db.ref(`tank/daily/${currentDate}`).set({
      ...latestData,
      timestamp: new Date().toISOString(),
    });

    console.log(`✅ Daily snapshot saved for ${currentDate}`);
  } catch (error) {
    console.error("❌ Error creating daily snapshot:", error);
  }
}

// Schedule the job (runs daily at the configured cron time)
schedule.scheduleJob("59 23 * * *", createDailySnapshot);
