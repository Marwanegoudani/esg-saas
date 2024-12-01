import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { ESGData } from '../../types';
import { useTheme } from '@mui/material/styles';

interface RiskAssessmentProps {
  companyId: number;
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ companyId }) => {
  const theme = useTheme();
  const [data, setData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        const response = await api.esgData.getByCompanyId(companyId);
        setData(response.data);
      } catch (err) {
        setError('Failed to load risk assessment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data.length) return <Alert severity="info">No risk assessment data available</Alert>;

  const latestData = data[data.length - 1];

  const riskData = [
    {
      risk: 'Environmental',
      value: calculateEnvironmentalRisk(latestData),
    },
    {
      risk: 'Social',
      value: calculateSocialRisk(latestData),
    },
    {
      risk: 'Governance',
      value: calculateGovernanceRisk(latestData),
    },
    {
      risk: 'Regulatory',
      value: calculateRegulatoryRisk(latestData),
    },
    {
      risk: 'Reputation',
      value: calculateReputationRisk(latestData),
    },
  ];

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Risk Assessment
      </Typography>
      <Box sx={{ width: '100%', height: 300, mt: 2 }}>
        <ResponsiveContainer>
          <RadarChart data={riskData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis 
              dataKey="risk"
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: 12
              }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <Radar
              name="Risk Level"
              dataKey="value"
              stroke={theme.palette.error.light}
              fill={theme.palette.error.light}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mt: 2, fontSize: '0.75rem', textAlign: 'center' }}
      >
        Risk levels are calculated based on various ESG metrics and industry benchmarks. 
        Higher values indicate higher risk exposure.
      </Typography>
    </Paper>
  );
};

// Risk calculation functions
const calculateEnvironmentalRisk = (data: ESGData): number => {
  const co2Risk = Math.min((data.environmental.co2_emissions / 200) * 100, 100);
  const energyRisk = Math.min((data.environmental.energy_consumption / 150) * 100, 100);
  const renewableRisk = Math.max(100 - data.environmental.renewable_energy_percent, 0);
  
  return (co2Risk * 0.4 + energyRisk * 0.3 + renewableRisk * 0.3);
};

const calculateSocialRisk = (data: ESGData): number => {
  const diversityRisk = Math.max(100 - data.social.diversity_ratio, 0);
  const safetyRisk = Math.min(data.social.safety_incidents * 20, 100);
  const trainingRisk = Math.max(100 - (data.social.training_hours / 40) * 100, 0);
  
  return (diversityRisk * 0.3 + safetyRisk * 0.4 + trainingRisk * 0.3);
};

const calculateGovernanceRisk = (data: ESGData): number => {
  const boardRisk = Math.max(100 - data.governance.board_diversity, 0);
  const ethicsRisk = Math.min(data.governance.ethics_violations * 25, 100);
  const dataRisk = Math.min(data.governance.data_breaches * 33, 100);
  
  return (boardRisk * 0.3 + ethicsRisk * 0.4 + dataRisk * 0.3);
};

const calculateRegulatoryRisk = (data: ESGData): number => {
  // Combine various metrics to estimate regulatory risk
  const environmentalCompliance = calculateEnvironmentalRisk(data);
  const governanceCompliance = calculateGovernanceRisk(data);
  
  return (environmentalCompliance * 0.5 + governanceCompliance * 0.5);
};

const calculateReputationRisk = (data: ESGData): number => {
  // Combine various metrics to estimate reputational risk
  const socialImpact = calculateSocialRisk(data);
  const ethicsImpact = data.governance.ethics_violations * 25;
  const environmentalImpact = calculateEnvironmentalRisk(data);
  
  return Math.min((socialImpact * 0.4 + ethicsImpact * 0.3 + environmentalImpact * 0.3), 100);
};

export default RiskAssessment;
