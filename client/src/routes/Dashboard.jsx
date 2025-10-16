// import LiveReading from "../components/liveReading"
// import HistoryGraph from "../components/HistoryGraph"
// import DataBox from "../components/DataBox";
// import Navbar from "../components/Navbar";



// function Dashboard() {
//     const sampleData = [
//       { time: 0, value: 3.2 },
//       { time: 20, value: 4.1 },
//       { time: 42, value: 5.5 },
//       { time: 60, value: 6.8 },
//       { time: 80, value: 7.2 },
//       { time: 100, value: 5.9 },
//     ];
//   return (
//     <div>
//         <Navbar/>
//         <div className="flex items-center">
//             <DataBox parameter ={'TDS'} value = {700} unit={'PPM'} max={1000} data ={sampleData}/> 
//             <DataBox parameter ={'Temperature'} value = {27} unit={'°C'} max={50} data ={sampleData}/>
//             <DataBox parameter ={'Turbidity'} value = {2} unit={'NTU'} max={15} data ={sampleData}/> 
//             <DataBox parameter ={'pH'} value = {7} max={14} data ={sampleData}/>
//         </div>
//         <LiveReading />
//         <HistoryGraph />
//     </div>
//   );
// }

// export default Dashboard;

import LiveReading from "../components/liveReading"
import HistoryGraph from "../components/HistoryGraph"
import DataBox from "../components/DataBox";
import Navbar from "../components/Navbar";
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";



function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
      const readingsRef = ref(db, "readings");
      onValue(readingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          const arr = Object.values(raw);
          setData(arr);
        }
      });
    }, []);

    const latest = data.length > 0 ? data[data.length - 1] : null;

    const tdsData = data.map((item, idx) => ({ time: idx, value: item.tds }));
    const tempData = data.map((item, idx) => ({ time: idx, value: item.temperature }));
    const turbData = data.map((item, idx) => ({ time: idx, value: item.turbidity }));
    const phData = data.map((item, idx) => ({ time: idx, value: item.ph }));

  return (
    <div>
        <Navbar/>
        <div className="flex item-center">
            <DataBox parameter={'TDS'} value={latest ? latest.tds : 0} unit={'PPM'} max={1000} data={tdsData}/>
            <DataBox parameter={'Temperature'} value={latest ? latest.temperature : 0} unit={'°C'} max={50} data={tempData}/>
            <DataBox parameter={'Turbidity'} value={latest ? latest.turbidity : 0} unit={'NTU'} max={15} data={turbData}/>
            <DataBox parameter={'pH'} value={latest ? latest.ph : 0} max={14} data={phData}/>
        </div>
        <LiveReading />
        <HistoryGraph />
    </div>
  );
}

export default Dashboard;