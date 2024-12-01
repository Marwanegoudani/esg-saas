import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';
import { ESGData } from '../../types';
import { useTheme } from '@mui/material/styles';

interface EnvironmentalChartProps {
  companyId: number;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ companyId }) => {
  const theme = useTheme();
  const [data, setData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        const response = await api.esgData.getByCompanyId(companyId);
        // Sort data by date
        const sortedData = response.data.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setData(sortedData);
      } catch (err) {
        setError('Failed to load environmental data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data.length) return (
    <Alert severity="info" sx={{ backgroundColor: theme.palette.success.light, color: theme.palette.success.dark }}>
      No environmental data available
    </Alert>
  );

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    'CO2 Emissions': item.environmental.co2_emissions,
    'Energy Consumption': item.environmental.energy_consumption,
    'Renewable Energy %': item.environmental.renewable_energy_percent
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Environmental Metrics
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="CO2 Emissions"
              stroke={theme.palette.error.main}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Energy Consumption"
              stroke={theme.palette.warning.main}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Renewable Energy %"
              stroke={theme.palette.success.main}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default EnvironmentalChart;
