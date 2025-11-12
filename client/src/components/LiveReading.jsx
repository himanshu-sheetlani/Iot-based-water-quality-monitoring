import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default function LiveReading() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const readingsRef = ref(db, "tank/readings");
    onValue(readingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        // convert object to array
        const arr = Object.values(raw);
        setData(arr);
      }
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {data.length === 0 ? (
        <p>No Data</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>pH</th>
              <th>TDS</th>
              <th>Turbidity</th>
              <th>Temperature</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(-10).map((item, idx) => (
              <tr key={idx}>
                <td>{item.timestamp}</td>
                <td>{item.ph}</td>
                <td>{item.tds}</td>
                <td>{item.turbidity}</td>
                <td>{item.temperature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
