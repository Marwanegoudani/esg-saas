import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Schedule } from '@mui/icons-material';

const AutomatedReports = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      name: 'Monthly ESG Report',
      frequency: 'monthly',
      format: 'pdf',
      recipients: ['team@company.com'],
      active: true,
    },
    {
      id: 2,
      name: 'Quarterly Disclosure',
      frequency: 'quarterly',
      format: 'excel',
      recipients: ['compliance@company.com'],
      active: true,
    },
  ]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Automated Report Schedules
        </Typography>
      </Grid>

      {schedules.map((schedule) => (
        <Grid item xs={12} key={schedule.id}>
          <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1">{schedule.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2">
                  Format: {schedule.format.toUpperCase()}
                </Typography>
                <Typography variant="body2">
                  Recipients: {schedule.recipients.join(', ')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={schedule.active}
                      onChange={(e) => {
                        const newSchedules = schedules.map(s =>
                          s.id === schedule.id
                            ? { ...s, active: e.target.checked }
                            : s
                        );
                        setSchedules(newSchedules);
                      }}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button
          variant="contained"
          startIcon={<Schedule />}
          sx={{ mt: 2 }}
        >
          Add New Schedule
        </Button>
      </Grid>
    </Grid>
  );
};

export default AutomatedReports; 