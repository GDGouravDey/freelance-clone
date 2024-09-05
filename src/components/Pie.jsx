import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { Domain: 'Frontend', Proficiency: 80 },
  { Domain: 'Backend', Proficiency: 80 },
  { Domain: 'Database', Proficiency: 70 },
  { Domain: 'Version Control', Proficiency: 70 },
  { Domain: 'Deployment', Proficiency: 70 },
  { Domain: 'Media Management', Proficiency: 60 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57'];

// Custom label function to show proficiency inside the pie chart
const renderCustomLabel = ({ percent, Proficiency }) => {
  return `${Proficiency}%`;
};

const PieChartComponent = () => {
  return (
    <div className="text-center text-2xl">
      Pie Chart
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="Proficiency"
            nameKey="Domain"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={renderCustomLabel} // Custom label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
