#!/bin/bash

# Create new React app
npx create-react-app doge-dashboard-new
cd doge-dashboard-new

# Install necessary dependencies
npm install recharts react-icons tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.14

# Remove default files we don't need
rm src/App.js src/App.css src/App.test.js src/logo.svg

# Create necessary directories
mkdir -p src/components/ui

# Create index.css
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Create index.js
cat > src/index.js << 'EOL'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
EOL

# Create Dashboard.js
cat > src/Dashboard.js << 'EOL'
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaSyncAlt } from "react-icons/fa";

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
      const response = await fetch(`${BASE_API_ENDPOINT}?fiscal_year=${selectedYear}&funding_agency_id=315&limit=10&page=1`);
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

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">
        DOGE Obligation Finder
      </h1>
      
      <div className="flex flex-col items-center mb-8">
        <label className="text-xl font-bold mb-2">Select Year:</label>
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 rounded border"
        >
          {Array.from({ length: 7 }, (_, i) => 2019 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-8">
        <button 
          onClick={() => fetchData(year)}
          className="px-6 py-3 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} /> 
          Refresh Data
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Federal Obligations</h2>
        <div className="h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
              <YAxis tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="value" stroke="#ff0000" strokeWidth={2} />
              <Line type="monotone" dataKey="alternative" stroke="#0000ff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
EOL

# Create tailwind.config.js
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
EOL

# Create postcss.config.js
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
EOL

# Run the development server
npm start
