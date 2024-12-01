import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme, CircularProgress, Alert } from '@mui/material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { ESGData } from '../../types';

interface GovernanceChartProps {
  companyId: number;
}

const GovernanceChart: React.FC<GovernanceChartProps> = ({ companyId }) => {
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
        setError('Failed to load governance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data.length) return (
    <Alert severity="info" sx={{ backgroundColor: theme.palette.warning.light, color: theme.palette.warning.dark }}>
      No governance data available
    </Alert>
  );

  // Get the most recent data point
  const latestData = data[data.length - 1].governance;

  const chartData = [
    { subject: 'Board Independence', value: latestData.board_independence },
    { subject: 'Board Diversity', value: latestData.board_diversity },
    { subject: 'Ethics Violations', value: 100 - latestData.ethics_violations * 10 }, // Invert for better visualization
    { subject: 'Data Breaches', value: 100 - latestData.data_breaches * 10 }, // Invert for better visualization
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Governance Metrics
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Governance"
              dataKey="value"
              stroke={theme.palette.warning.main}
              fill={theme.palette.warning.main}
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default GovernanceChart;
