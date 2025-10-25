import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const ReportDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="h-screen w-screen bg-zinc-950 text-gray-100">
        <Navbar />
        <div className="p-10">
          <h1 className="text-xl font-bold">Report Not Found</h1>
          <p className="text-gray-400">The requested report could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-zinc-950 text-gray-100">
      <Navbar />
      <div className="p-10">
        <div className="mb-6">
          <h1 className="text-xl mb-2 font-bold">Report Details</h1>
          <p className="text-gray-400 text-m">Detailed view of the selected report</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow">
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
          <p className="text-xs text-gray-400">
            Report ID: {id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
