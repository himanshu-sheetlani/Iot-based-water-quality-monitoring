import { db } from "./firebaseAdmin.js";

// Check if a given date (string or Date) is in the current week
function isCurrentWeek(dateString) {
  // Deprecated: use getWeekBounds() and explicit range checks in callers.
  const date = new Date(dateString);
  const now = new Date();
  const bounds = getWeekBounds(now);
  return date >= bounds.startOfWeek && date <= bounds.endOfWeek;
}

// Return week bounds (startOfWeek = Sunday 00:00:00, endOfWeek = next Sunday 23:59:59.999)
function getWeekBounds(now = new Date()) {
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // Next Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  // weekId: use ISO date for startOfWeek (YYYY-MM-DD)
  const weekId = startOfWeek.toISOString().slice(0, 10);
  return { startOfWeek, endOfWeek, weekId };
}

export async function generateWeeklyReport() {
  const dailyRef = db.ref("tank/daily");
  const snapshot = await dailyRef.once("value");
  console.log(snapshot.val());

  if (!snapshot.exists()) return;

  const dailyData = snapshot.val();
  const { startOfWeek, endOfWeek, weekId } = getWeekBounds();

  const weekData = Object.entries(dailyData)
    .filter(([date]) => {
      const d = new Date(date);
      return d >= startOfWeek && d <= endOfWeek;
    }) // Only this week’s data
    .map(([_, values]) => values);

  if (weekData.length === 0) return;

  const average = (key) =>
    weekData.reduce((sum, day) => sum + parseFloat(day[key] || 0), 0) /
    weekData.length;

  const weeklyReport = {
    weekStart: startOfWeek.toISOString(),
    weekEnd: endOfWeek.toISOString(),
    ph_avg: average("ph").toFixed(2),
    tds_avg: average("tds").toFixed(2),
    turbidity_avg: average("turbidity").toFixed(2),
    temp_avg: average("temperature").toFixed(2),
    score: calculateScore(
      parseFloat(average("ph")),
      parseFloat(average("tds")),
      parseFloat(average("turbidity"))
    ),
    timestamp: new Date().toISOString(),
  };

  await db.ref(`tank/weekly/${weekId}`).set(weeklyReport);
  return weeklyReport;
}

// Basic scoring function — adjust weights/normalization rules as needed.
function calculateScore(ph, tds, turbidity) {
  ph = isNaN(ph) ? 7 : ph;
  tds = isNaN(tds) ? 0 : tds;
  turbidity = isNaN(turbidity) ? 0 : turbidity;

  // Simple normalizations:
  // - ph: ideal 7.0, deviation penalized (max penalty 100)
  // - tds: lower is generally better; assume 0-1000 range
  // - turbidity: lower is better; assume 0-100 range
  const phScore = Math.max(0, 100 - Math.abs(ph - 7) * 15);
  const tdsScore = Math.max(0, 100 - (tds / 1000) * 100);
  const turbidityScore = Math.max(0, 100 - (turbidity / 100) * 100);

  // Weighted average
  const score = (phScore * 0.4 + tdsScore * 0.3 + turbidityScore * 0.3).toFixed(
    0
  );
  return Number(score);
}
