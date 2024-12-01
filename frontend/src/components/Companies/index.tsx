import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { api } from '../../services/api';
import { Company, ESGData } from '../../types';
import CompanyDialog from './CompanyDialog';

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [esgData, setEsgData] = useState<{ [key: string]: ESGData[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [companiesRes, esgDataRes] = await Promise.all([
        api.companies.getAll(),
        api.esgData.getAll()
      ]);
      
      setCompanies(companiesRes.data);
      
      // Group ESG data by company
      const groupedEsgData = esgDataRes.data.reduce((acc, data) => {
        if (!acc[data.company_id]) {
          acc[data.company_id] = [];
        }
        acc[data.company_id].push(data);
        return acc;
      }, {} as { [key: string]: ESGData[] });
      
      setEsgData(groupedEsgData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateESGScore = (companyId: number) => {
    const companyEsgData = esgData[companyId]?.[0]; // Get latest ESG data
    if (!companyEsgData) return 'N/A';

    const environmental = (
      (companyEsgData.environmental.renewable_energy_percent || 0) * 0.4 +
      (100 - (companyEsgData.environmental.co2_emissions || 0) / 20) * 0.6
    );
    
    const social = (
      (companyEsgData.social.diversity_ratio || 0) * 0.5 +
      (100 - (companyEsgData.social.safety_incidents || 0) * 10) * 0.5
    );
    
    const governance = (
      (companyEsgData.governance.board_diversity || 0) * 0.4 +
      (100 - (companyEsgData.governance.ethics_violations || 0) * 20) * 0.6
    );

    return Math.round((environmental + social + governance) / 3);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Company Name', flex: 1 },
    { field: 'industry', headerName: 'Industry', flex: 1 },
    { field: 'size', headerName: 'Size', flex: 0.5 },
    { field: 'country', headerName: 'Country', flex: 0.7 },
    {
      field: 'esgScore',
      headerName: 'ESG Score',
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            minWidth: '60px',
            textAlign: 'center',
          }}
        >
          {calculateESGScore(params.row.id)}
        </Box>
      ),
    },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Companies</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add Company
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <DataGrid
              rows={filteredCompanies}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              autoHeight
              loading={loading}
              disableRowSelectionOnClick
            />
          </Card>
        </Grid>
      </Grid>

      <CompanyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={fetchData}
      />
    </Box>
  );
};

export default Companies;
