/* eslint-disable react-hooks/exhaustive-deps */
import Navbar from "../components/Navbar.jsx"
import React, { useEffect, useState } from "react";
import { Download, Send, Eye } from "lucide-react"; // icons
import { ref, onValue } from "firebase/database";
import { db } from "../firebase.js";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const generateWeeklyReports = (data) => {
    if (!data.length) return [];

    // Sort by timestamp
    const sorted = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const reports = [];
    let startDate = new Date(sorted[0].timestamp);
    let currentWeek = [];
    let weekNum = 1;

    for (let i = 0; i < sorted.length; i++) {
      const item = sorted[i];
      const itemDate = new Date(item.timestamp);
      if (itemDate - startDate < 7 * 24 * 60 * 60 * 1000) { // within week
        currentWeek.push(item);
      } else {
        // process currentWeek
        if (currentWeek.length > 0) {
          const weekReport = processWeek(currentWeek, startDate, weekNum);
          reports.push(weekReport);
          weekNum++;
        }
        startDate = itemDate;
        currentWeek = [item];
      }
    }
    // last week
    if (currentWeek.length > 0) {
      const weekReport = processWeek(currentWeek, startDate, weekNum);
      reports.push(weekReport);
    }
    return reports;
  };

  const processWeek = (weekData, startDate, weekNum) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const weekStr = `Week ${weekNum} (${startDate.toDateString()} - ${endDate.toDateString()})`;

    // averages
    const avgPh = weekData.reduce((sum, d) => sum + d.ph, 0) / weekData.length;
    const avgTds = weekData.reduce((sum, d) => sum + d.tds, 0) / weekData.length;
    const avgTemp = weekData.reduce((sum, d) => sum + d.temperature, 0) / weekData.length;
    const avgTurb = weekData.reduce((sum, d) => sum + d.turbidity, 0) / weekData.length;

    // alerts
    const alerts = [];
    if (avgPh < 6.5 || avgPh > 8.5) alerts.push('pH out of range');
    if (avgTds > 500) alerts.push('High TDS');
    if (avgTurb > 5) alerts.push('High turbidity');
    if (avgTemp < 0 || avgTemp > 30) alerts.push('Temperature out of range');

    const summary = `Avg pH: ${avgPh.toFixed(2)}, TDS: ${avgTds.toFixed(2)} PPM, Temp: ${avgTemp.toFixed(2)}°C, Turb: ${avgTurb.toFixed(2)} NTU. ${alerts.length ? 'Alerts: ' + alerts.join(', ') : 'No alerts'}`;

    return {
      id: uuidv4(),
      week: weekStr,
      summary,
      generatedOn: new Date().toISOString().split('T')[0],
      status: 'Generated'
    };
  };

  useEffect(() => {
    const readingsRef = ref(db, "readings");
    onValue(readingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const data = Object.values(raw);
        const weeklyReports = generateWeeklyReports(data);
        setReports(weeklyReports);
      } else {
        setReports([]);
      }
    });
  }, []);
  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar/>
      <div className="p-10">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Weekly Reports</h1>
          <p className="text-gray-400 text-m">
            View, download, and send reports to authorities
          </p>
        </div>

        <div className="grid gap-5">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow hover:shadow-lg hover:bg-zinc-800 transition"
            >

              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{report.week}</h2>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    report.status === "Approved"
                      ? "bg-green-900/40 text-green-400 border border-green-600/40"
                      : "bg-yellow-900/40 text-yellow-400 border border-yellow-600/40"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-2">{report.summary}</p>
              <p className="text-xs text-gray-400 mb-4">
                📅 Generated On: {report.generatedOn}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('View clicked for report:', report.id);
                    navigate(`/report/${report.id}`, { state: { report } });
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-sm transition"
                >
                  <Eye size={16} /> View
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded bg-blue-900/40 border border-blue-600/30 hover:bg-blue-800 text-sm transition">
                  <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-1 px-3 py-2 rounded bg-green-900/40 border border-green-600/30 hover:bg-green-800 text-sm transition">
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
