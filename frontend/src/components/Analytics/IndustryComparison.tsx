import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ESGData, Company } from '../../types';

interface IndustryComparisonProps {
  data: ESGData[];
  companies: Company[];
}

// Interface pour le tooltip personnalisé
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

const IndustryComparison: React.FC<IndustryComparisonProps> = ({ data, companies }) => {
  const industryAverages = useMemo(() => {
    const industries: { [key: string]: any } = {};

    data.forEach(esgData => {
      const company = companies.find(c => c.id === esgData.company_id);
      if (!company) return;

      if (!industries[company.industry]) {
        industries[company.industry] = {
          environmental: [],
          social: [],
          governance: [],
          count: 0
        };
      }

      industries[company.industry].environmental.push(
        esgData.environmental.renewable_energy_percent || 0
      );
      industries[company.industry].social.push(
        esgData.social.diversity_ratio || 0
      );
      industries[company.industry].governance.push(
        esgData.governance.board_diversity || 0
      );
      industries[company.industry].count++;
    });

    return Object.entries(industries).map(([industry, scores]) => ({
      industry,
      environmental: scores.environmental.reduce((a: number, b: number) => a + b, 0) / scores.count,
      social: scores.social.reduce((a: number, b: number) => a + b, 0) / scores.count,
      governance: scores.governance.reduce((a: number, b: number) => a + b, 0) / scores.count,
    }));
  }, [data, companies]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={industryAverages}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="industry" 
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="environmental" name="Environmental" fill="#4caf50" />
          <Bar dataKey="social" name="Social" fill="#2196f3" />
          <Bar dataKey="governance" name="Governance" fill="#ff9800" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IndustryComparison;
