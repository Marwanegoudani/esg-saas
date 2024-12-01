import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ESGData, Company } from '../../types';

interface ESGBreakdownProps {
  data: ESGData[];
  companies: Company[];
}

const ESGBreakdown: React.FC<ESGBreakdownProps> = ({ data, companies }) => {
  const calculateESGScore = (esgData: ESGData) => {
    const environmental = (
      (esgData.environmental.renewable_energy_percent || 0) * 0.4 +
      (100 - (esgData.environmental.co2_emissions || 0) / 20) * 0.6
    );
    
    const social = (
      (esgData.social.diversity_ratio || 0) * 0.5 +
      (100 - (esgData.social.safety_incidents || 0) * 10) * 0.5
    );
    
    const governance = (
      (esgData.governance.board_diversity || 0) * 0.4 +
      (100 - (esgData.governance.ethics_violations || 0) * 20) * 0.6
    );

    return {
      environmental,
      social,
      governance,
      total: (environmental + social + governance) / 3
    };
  };

  const scatterData = data.map(d => {
    const company = companies.find(c => c.id === d.company_id);
    const scores = calculateESGScore(d);
    return {
      name: company?.name,
      environmental: scores.environmental,
      social: scores.social,
      total: scores.total,
    };
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid />
          <XAxis 
            type="number" 
            dataKey="environmental" 
            name="Environmental Score" 
            unit="%" 
          />
          <YAxis 
            type="number" 
            dataKey="social" 
            name="Social Score" 
            unit="%" 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '10px',
                  border: '1px solid #ccc'
                }}>
                  <p><strong>{data.name}</strong></p>
                  <p>Environmental: {data.environmental.toFixed(1)}%</p>
                  <p>Social: {data.social.toFixed(1)}%</p>
                  <p>Total ESG: {data.total.toFixed(1)}%</p>
                </div>
              );
            }}
          />
          <Scatter 
            name="Companies" 
            data={scatterData} 
            fill="#8884d8"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ESGBreakdown;