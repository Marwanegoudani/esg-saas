import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { ESGData } from '../../types';

interface SocialChartProps {
  companyId: number;
}

const SocialChart: React.FC<SocialChartProps> = ({ companyId }) => {
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
        setError('Failed to load social data');
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
    <Alert severity="info" sx={{ backgroundColor: theme.palette.info.light, color: theme.palette.info.dark }}>
      No social data available
    </Alert>
  );

  // Get the most recent data point
  const latestData = data[data.length - 1].social;

  // Normalize the data to make it more comparable
  const chartData = [
    { name: 'Diversity Ratio', value: latestData.diversity_ratio },
    { name: 'Safety Incidents', value: 100 - (latestData.safety_incidents * 10) }, // Invert and scale
    { name: 'Training Hours', value: Math.min(100, (latestData.training_hours / 40) * 100) }, // Scale to percentage (assuming 40 hours is 100%)
    { name: 'Community Investment', value: Math.min(100, (latestData.community_investment / 50000) * 100) }, // Scale to percentage (assuming 50000 is 100%)
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Social Metrics
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={[0, 100]}
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
            />
            <Bar 
              dataKey="value" 
              fill={theme.palette.info.main}
              name="Score"
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default SocialChart;
