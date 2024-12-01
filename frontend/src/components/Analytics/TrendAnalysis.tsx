import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ESGData } from '../../types';

interface TrendAnalysisProps {
  data: ESGData[];
}

// Ajout d'un type personnalisé pour les données du tooltip
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '10px',
      border: '1px solid #ccc'
    }}>
      <p><strong>{label}</strong></p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data }) => {
  const trendData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(d => ({
      date: new Date(d.date).toLocaleDateString(),
      environmental: (
        (d.environmental.renewable_energy_percent || 0) * 0.4 +
        (100 - (d.environmental.co2_emissions || 0) / 20) * 0.6
      ),
      social: (
        (d.social.diversity_ratio || 0) * 0.5 +
        (100 - (d.social.safety_incidents || 0) * 10) * 0.5
      ),
      governance: (
        (d.governance.board_diversity || 0) * 0.4 +
        (100 - (d.governance.ethics_violations || 0) * 20) * 0.6
      ),
    }));

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="environmental" 
            name="Environmental"
            stroke="#4caf50" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="social" 
            name="Social"
            stroke="#2196f3" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="governance" 
            name="Governance"
            stroke="#ff9800" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendAnalysis;
