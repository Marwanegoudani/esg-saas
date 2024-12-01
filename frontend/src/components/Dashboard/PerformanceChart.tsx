import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  ButtonGroup,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  FileDownload as DownloadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, subMonths } from 'date-fns';
import ChartFilters from './ChartFilters';

interface ChartData {
  month: string;
  environmental: number;
  social: number;
  governance: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState('6m');
  const [metrics, setMetrics] = useState(['environmental', 'social', 'governance']);
  const [chartType, setChartType] = useState('line');
  const [comparison, setComparison] = useState('none');

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = ['Month', 'Environmental', 'Social', 'Governance'];
      const csvContent = [
        headers.join(','),
        ...filteredData.map(row => 
          [row.month, row.environmental, row.social, row.governance].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `esg_performance_${new Date().toISOString()}.csv`;
      link.click();
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('ESG Performance Report', 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 25);

      const tableData = filteredData.map(row => [
        row.month,
        row.environmental.toString(),
        row.social.toString(),
        row.governance.toString()
      ]);

      (doc as any).autoTable({
        head: [['Month', 'Environmental', 'Social', 'Governance']],
        body: tableData,
        startY: 35,
      });

      doc.save(`esg_performance_${new Date().toISOString()}.pdf`);
    }
  };

  const getFilteredData = useCallback(() => {
    const months = parseInt(timeRange);
    let filtered = [...data].slice(-months);

    if (comparison === 'yoy') {
      const previousYearData = data
        .slice(-months - 12, -12)
        .map(item => ({
          ...item,
          month: `${item.month} (Prev Year)`,
          environmental: item.environmental,
          social: item.social,
          governance: item.governance,
        }));
      filtered = [...previousYearData, ...filtered];
    }

    return filtered;
  }, [data, timeRange, comparison]);

  const filteredData = getFilteredData();

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 10 },
    };

    const renderMetricLine = (metric: string, color: string) => {
      if (!metrics.includes(metric)) return null;
      
      switch (chartType) {
        case 'area':
          return (
            <Area
              type="monotone"
              dataKey={metric}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              stroke={color}
              fill={color}
              fillOpacity={0.1}
            />
          );
        case 'bar':
          return (
            <Bar
              dataKey={metric}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              fill={color}
            />
          );
        default:
          return (
            <Line
              type="monotone"
              dataKey={metric}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          );
      }
    };

    if (chartType === 'radar') {
      return (
        <RadarChart {...commonProps} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="month" />
          <PolarRadiusAxis />
          {metrics.includes('environmental') && (
            <Radar name="Environmental" dataKey="environmental" stroke="#2E7D32" fill="#2E7D32" fillOpacity={0.1} />
          )}
          {metrics.includes('social') && (
            <Radar name="Social" dataKey="social" stroke="#1976D2" fill="#1976D2" fillOpacity={0.1} />
          )}
          {metrics.includes('governance') && (
            <Radar name="Governance" dataKey="governance" stroke="#ED6C02" fill="#ED6C02" fillOpacity={0.1} />
          )}
          <Legend />
        </RadarChart>
      );
    }

    const ChartComponent = chartType === 'area' ? AreaChart : chartType === 'bar' ? BarChart : LineChart;

    return (
      <ChartComponent {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="month" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} domain={[60, 90]} />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        />
        <Legend />
        {renderMetricLine('environmental', '#2E7D32')}
        {renderMetricLine('social', '#1976D2')}
        {renderMetricLine('governance', '#ED6C02')}
      </ChartComponent>
    );
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ p: 3, height: '500px' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">ESG Performance Trend</Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ChartFilters
            timeRange={timeRange}
            chartType={chartType}
            metrics={metrics}
            comparison={comparison}
            onTimeRangeChange={setTimeRange}
            onChartTypeChange={setChartType}
            onMetricsChange={setMetrics}
            onComparisonChange={setComparison}
          />

          <ButtonGroup size="small">
            <Tooltip title="Export CSV">
              <IconButton onClick={() => handleExport('csv')}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export PDF">
              <IconButton onClick={() => handleExport('pdf')}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Box>
      </Box>

      <Box sx={{ height: 'calc(100% - 60px)' }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PerformanceChart;
