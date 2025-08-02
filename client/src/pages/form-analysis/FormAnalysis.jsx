import React, { useEffect, useState } from 'react';
import './FormAnalysis.css';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FormAnalysis = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { formId } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${backendUrl}/api/forms/${formId}/view-stats`);
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, [formId]);

  return (
    <div className="form-analysis-container">
      {stats === null ? (
      <div className="spinner"></div>
    ) : (
      <>
      <div className="analysis-cards">
        <div className="analysis-card">
          <p className="analysis-label">Views</p>
          <h2 className="analysis-count">{stats.totalViews.toLocaleString()}</h2>
          <p className="analysis-change">+110.1% <span className="up-arrow">↗</span></p>
        </div>
        <div className="analysis-card">
          <p className="analysis-label">Views</p>
          <h2 className="analysis-count">{stats.totalViews.toLocaleString()}</h2>
          <p className="analysis-change">+110.1% <span className="up-arrow">↗</span></p>
        </div>
      </div>

      <div className="analysis-chart-box">
        <div className="analysis-chart-header">
          <span className="chart-title">Average Response Chart</span>
          <span className="chart-tabs">Total Page</span>
          <span className="chart-tabs">Operating Status</span>
          <div className="chart-legend">
            <span className="this-year-dot"></span> This year
            <span className="last-year-dot"></span> Last year
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.viewTimeline}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#000000" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#A5A5A5"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </>
    )}
    </div>
  );
};

export default FormAnalysis;
