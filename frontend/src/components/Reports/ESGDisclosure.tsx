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
} from '@mui/material';
import { Description } from '@mui/icons-material';

const ESGDisclosure = () => {
  const [standard, setStandard] = useState('gri');
  const [year, setYear] = useState('2024');

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          ESG Disclosure Generator
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reporting Standard</InputLabel>
          <Select
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          >
            <MenuItem value="gri">GRI Standards</MenuItem>
            <MenuItem value="sasb">SASB Standards</MenuItem>
            <MenuItem value="tcfd">TCFD Framework</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reporting Year</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<Description />}
          sx={{ mt: 2 }}
        >
          Generate Disclosure Report
        </Button>
      </Grid>
    </Grid>
  );
};

export default ESGDisclosure; 