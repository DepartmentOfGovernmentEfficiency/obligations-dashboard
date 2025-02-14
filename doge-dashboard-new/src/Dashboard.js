import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { FaSyncAlt, FaDollarSign, FaChartLine } from "react-icons/fa";

const BASE_API_ENDPOINT = "https://api.usaspending.gov/api/v2/federal_obligations/";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("2019");

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const fetchData = async (selectedYear) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_ENDPOINT}?fiscal_year=${selectedYear}&funding_agency_id=315&limit=100&page=1`);
      const result = await response.json();
      console.log("API Response:", result);
      if (result && result.results) {
        setData(result.results.map(item => ({
          name: item.account_title,
          value: parseFloat(item.obligated_amount),
          alternative: parseFloat(item.obligated_amount) * 1.1
        })));
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Header Section */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-blue-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://imagedelivery.net/Eq3GW7G6_BQgeWvh9nuCig/194f0beb-51d5-4623-64c3-462cbf5a5800/public" 
              alt="Dogecoin Logo" 
              className="w-20 h-20 animate-bounce"
            />
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
              DOGE Obligation Finder
            </h1>
          </div>
          <p className="text-blue-200 text-center text-xl mt-2">
            Tracking Federal Financial Data
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
      {/* Floating Control Panel */}
      <div className="fixed bottom-8 left-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-blue-900 p-4 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center gap-2">
              <label className="text-blue-200 text-sm font-medium">Fiscal Year</label>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none bg-transparent text-2xl font-bold text-yellow-400 border-none focus:ring-0 cursor-pointer text-center hover:text-yellow-300 transition-colors"
              >
                {Array.from({ length: 7 }, (_, i) => 2019 + i).map(y => (
                  <option key={y} value={y} className="bg-blue-900 text-yellow-400">{y}</option>
                ))}
              </select>
              <div className="text-blue-400 text-xs">
                {data.length} Records Found
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 shadow-xl border border-blue-700">
            <div className="flex items-center gap-4 mb-4">
              <FaDollarSign className="text-3xl text-blue-400" />
              <h3 className="text-xl text-blue-200">Total Obligations</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 shadow-xl border border-blue-700">
            <div className="flex items-center gap-4 mb-4">
              <FaChartLine className="text-3xl text-blue-400" />
              <h3 className="text-xl text-blue-200">Number of Records</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {data.length}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-blue-700">
          <h2 className="text-3xl font-bold text-blue-100 mb-8 text-center">
            Federal Obligations Analysis
          </h2>
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data} 
                margin={{ top: 20, right: 100, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  interval="preserveStartEnd" 
                  tick={{ fill: '#93c5fd', fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(tick) => `$${tick.toLocaleString()}`} 
                  tick={{ fill: '#93c5fd', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  wrapperStyle={{
                    paddingLeft: "20px",
                    color: "#93c5fd"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Actual Value"
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#3b82f6' }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="alternative" 
                  name="Projected Value"
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#f59e0b' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Floating Refresh Button */}
      <div className="fixed bottom-8 right-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <button 
            onClick={() => fetchData(year)}
            disabled={loading}
            className="relative px-8 py-8 bg-blue-900 hover:bg-blue-800 text-white rounded-full flex items-center gap-2 font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-2xl"
          >
            <FaSyncAlt className={`text-2xl ${loading ? "animate-spin" : "animate-pulse"}`} />
            <span className="absolute -top-12 right-0 bg-blue-900 px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Refresh Data
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-800 mt-12 py-6 bg-black bg-opacity-30">
        <div className="container mx-auto px-4">
          <p className="text-center text-blue-300">
            Created by Michael Mendy © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;