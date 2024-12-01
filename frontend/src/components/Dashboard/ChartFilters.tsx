import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  Popover,
  Button,
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';

interface ChartFiltersProps {
  timeRange: string;
  chartType: string;
  metrics: string[];
  comparison: string;
  onTimeRangeChange: (value: string) => void;
  onChartTypeChange: (value: string) => void;
  onMetricsChange: (value: string[]) => void;
  onComparisonChange: (value: string) => void;
}

const ChartFilters: React.FC<ChartFiltersProps> = ({
  timeRange,
  chartType,
  metrics,
  comparison,
  onTimeRangeChange,
  onChartTypeChange,
  onMetricsChange,
  onComparisonChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <Button
        variant="outlined"
        startIcon={<FilterIcon />}
        onClick={handleClick}
        size="small"
      >
        Filters
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 3, width: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Chart Settings
          </Typography>

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <MenuItem value="3m">3 Months</MenuItem>
              <MenuItem value="6m">6 Months</MenuItem>
              <MenuItem value="12m">1 Year</MenuItem>
              <MenuItem value="24m">2 Years</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => onChartTypeChange(e.target.value)}
            >
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="area">Area Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="radar">Radar Chart</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Metrics</InputLabel>
            <Select
              multiple
              value={metrics}
              label="Metrics"
              onChange={(e) => onMetricsChange(e.target.value as string[])}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value.charAt(0).toUpperCase() + value.slice(1)}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="environmental">
                <Checkbox checked={metrics.includes('environmental')} />
                <ListItemText primary="Environmental" />
              </MenuItem>
              <MenuItem value="social">
                <Checkbox checked={metrics.includes('social')} />
                <ListItemText primary="Social" />
              </MenuItem>
              <MenuItem value="governance">
                <Checkbox checked={metrics.includes('governance')} />
                <ListItemText primary="Governance" />
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Comparison</InputLabel>
            <Select
              value={comparison}
              label="Comparison"
              onChange={(e) => onComparisonChange(e.target.value)}
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="yoy">Year over Year</MenuItem>
              <MenuItem value="qoq">Quarter over Quarter</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      </Popover>
    </Box>
  );
};

export default ChartFilters;
