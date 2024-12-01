import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Grid, CircularProgress, Divider, Alert } from '@mui/material';
import { api } from '../../services/api';
import { Company, ESGData } from '../../types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EnvironmentalChart from './EnvironmentalChart';
import SocialChart from './SocialChart';
import GovernanceChart from './GovernanceChart';

interface CompanyOverviewProps {
  companyId: number;
}

const CompanyOverview = ({ companyId }: CompanyOverviewProps) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [esgData, setEsgData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        const [companyRes, esgRes] = await Promise.all([
          api.companies.getById(companyId),
          api.esgData.getByCompanyId(companyId)
        ]);
        console.log('Company data received:', companyRes.data);
        setCompany(companyRes.data);
        setEsgData(esgRes.data);
      } catch (err) {
        setError('Failed to load company data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!company) return <Typography>Company not found</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          {company.name}
        </Typography>
        <Typography variant="body1" paragraph>
          {company.description || 'No company description available.'}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          ESG Highlights
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Environmental
              </Typography>
              <Typography variant="body2">
                {company.environmental_highlight || 'No environmental highlights available.'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Social
              </Typography>
              <Typography variant="body2">
                {company.social_highlight || 'No social highlights available.'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Governance
              </Typography>
              <Typography variant="body2">
                {company.governance_highlight || 'No governance highlights available.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          ESG Performance Data
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Environmental Metrics
              </Typography>
              <EnvironmentalChart companyId={companyId} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Social Metrics
              </Typography>
              <SocialChart companyId={companyId} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Governance Metrics
              </Typography>
              <GovernanceChart companyId={companyId} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyOverview;
