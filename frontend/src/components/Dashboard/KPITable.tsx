import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ESGData } from '../../types';

interface KPITableProps {
  data?: ESGData;
}

interface KPIMetric {
  category: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  status: 'success' | 'warning' | 'error';
  info: string;
}

const KPITable: React.FC<KPITableProps> = ({ data }) => {
  const theme = useTheme();

  if (!data) return null;

  const metrics: KPIMetric[] = [
    {
      category: 'Environmental',
      name: 'Renewable Energy Usage',
      value: data.environmental.renewable_energy_percent || 0,
      unit: '%',
      trend: 5.2,
      status: 'success',
      info: 'Percentage of total energy consumption from renewable sources',
    },
    {
      category: 'Environmental',
      name: 'CO2 Emissions',
      value: data.environmental.co2_emissions || 0,
      unit: 'tons',
      trend: -2.8,
      status: 'warning',
      info: 'Total CO2 emissions in metric tons',
    },
    {
      category: 'Social',
      name: 'Workforce Diversity',
      value: data.social.diversity_ratio || 0,
      unit: '%',
      trend: 3.5,
      status: 'success',
      info: 'Percentage of diverse employees in the workforce',
    },
    {
      category: 'Social',
      name: 'Safety Incidents',
      value: data.social.safety_incidents || 0,
      unit: 'incidents',
      trend: -1.5,
      status: 'error',
      info: 'Number of workplace safety incidents',
    },
    {
      category: 'Governance',
      name: 'Board Diversity',
      value: data.governance.board_diversity || 0,
      unit: '%',
      trend: 2.1,
      status: 'success',
      info: 'Percentage of board members from diverse backgrounds',
    },
    {
      category: 'Governance',
      name: 'Ethics Violations',
      value: data.governance.ethics_violations || 0,
      unit: 'cases',
      trend: -4.2,
      status: 'error',
      info: 'Number of reported ethics violations',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Key Performance Indicators
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Trend</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow
                key={metric.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body1">
                      {metric.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      {metric.category}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="500">
                    {metric.value} {metric.unit}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      color: metric.trend >= 0 
                        ? theme.palette.success.main 
                        : theme.palette.error.main,
                    }}
                  >
                    {metric.trend >= 0 
                      ? <TrendingUpIcon fontSize="small" />
                      : <TrendingDownIcon fontSize="small" />
                    }
                    <Typography variant="body2">
                      {metric.trend >= 0 ? '+' : ''}{metric.trend}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={metric.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${getStatusColor(metric.status)}20`,
                      color: getStatusColor(metric.status),
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={metric.info} arrow>
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KPITable;
