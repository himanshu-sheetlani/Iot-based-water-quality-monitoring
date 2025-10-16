import Dashboard from "./routes/Dashboard";
import History from "./routes/History"
import {BrowserRouter, Routes, Route} from "react-router"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;