import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import {
  EnvironmentalChart,
  SocialChart,
  GovernanceChart,
  ESGScoreCard,
  CompanyOverview,
  RiskAssessment
} from '../Charts';
import { api } from '../../services/api';
import { Company } from '../../types';

const Dashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.companies.getAll();
        setCompanies(response.data);
        if (response.data.length > 0) {
          setSelectedCompany(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          ESG Dashboard
        </Typography>
        <TextField
          select
          size="small"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(Number(e.target.value))}
          sx={{ minWidth: 200 }}
        >
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {/* ESG Score Cards */}
        <Grid item xs={12}>
          <ESGScoreCard companyId={selectedCompany} />
        </Grid>

        {/* Company Overview and Risk Assessment */}
        <Grid item xs={12} md={8}>
          <CompanyOverview companyId={selectedCompany} />
        </Grid>

        <Grid item xs={12} md={4}>
          <RiskAssessment companyId={selectedCompany} />
        </Grid>

        
      </Grid>
    </Box>
  );
};

export default Dashboard;
