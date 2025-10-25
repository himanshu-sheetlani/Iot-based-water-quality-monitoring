import Dashboard from "./routes/Dashboard.jsx";
import Report from "./routes/Report.jsx";
import ReportDetail from "./routes/ReportDetail.jsx";
import {BrowserRouter, Routes, Route} from "react-router";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/:id" element={<ReportDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;