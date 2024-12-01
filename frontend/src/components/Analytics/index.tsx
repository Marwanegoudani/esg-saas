import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  MenuItem,
  TextField,
} from '@mui/material';
import IndustryComparison from './IndustryComparison';
import TrendAnalysis from './TrendAnalysis';
import ESGBreakdown from './ESGBreakdown';
import { api } from '../../services/api';
import { Company, ESGData } from '../../types';

const Analytics = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [esgData, setEsgData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesResponse, esgDataResponse] = await Promise.all([
        api.companies.getAll(),
        api.esgData.getAll(),
      ]);

      setCompanies(companiesResponse.data);
      setEsgData(esgDataResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const industries = ['all', ...Array.from(new Set(companies.map(c => c.industry)))];

  const filteredData = selectedIndustry === 'all'
    ? esgData
    : esgData.filter(d => {
        const company = companies.find(c => c.id === d.company_id);
        return company?.industry === selectedIndustry;
      });

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">ESG Analytics</Typography>
            <TextField
              select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              sx={{ minWidth: 200 }}
              label="Industry Filter"
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>

        {/* ESG Score Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ESG Score Distribution
              </Typography>
              <ESGBreakdown data={filteredData} companies={companies} />
            </CardContent>
          </Card>
        </Grid>

        {/* Industry Comparison */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Industry Comparison
              </Typography>
              <IndustryComparison data={esgData} companies={companies} />
            </CardContent>
          </Card>
        </Grid>

        {/* Trend Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trend Analysis
              </Typography>
              <TrendAnalysis data={filteredData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
