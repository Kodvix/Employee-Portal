import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { date: 'Apr 24', hours: 8 },
  { date: 'Apr 25', hours: 6 },
  { date: 'Apr 26', hours: 7 },
  { date: 'Apr 27', hours: 4 },
  { date: 'Apr 28', hours: 8 },
  { date: 'Apr 29', hours: 5 },
  { date: 'Apr 30', hours: 6 },
];

const PerformanceChart = () => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="hours" fill="#2A3165" />
    </BarChart>
  </ResponsiveContainer>
);

export default PerformanceChart;
