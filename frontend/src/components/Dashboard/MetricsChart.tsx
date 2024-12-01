import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  Box, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme,
} from '@mui/material';
import { ESGData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricsChartProps {
  data: ESGData[];
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<string>('1M');

  const ranges = [
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '1Y', label: 'Year' },
    { value: 'ALL', label: 'All Time' },
  ];

  const chartData = data.map(d => ({
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        {payload.map((entry: any) => (
          <Box
            key={entry.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              my: 0.5,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color,
              }}
            />
            <Typography variant="body2">
              {entry.name}: {Number(entry.value).toFixed(1)}%
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">ESG Score Evolution</Typography>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={(_, value) => value && setTimeRange(value)}
            size="small"
          >
            {ranges.map((range) => (
              <ToggleButton 
                key={range.value} 
                value={range.value}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                {range.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={timeRange}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ width: '100%', height: 400 }}>
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
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                />
                <XAxis 
                  dataKey="date"
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="environmental"
                  name="Environmental"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="social"
                  name="Social"
                  stroke={theme.palette.info.main}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="governance"
                  name="Governance"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default MetricsChart;
