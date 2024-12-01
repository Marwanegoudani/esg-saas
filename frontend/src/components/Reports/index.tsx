import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Tab,
  Tabs,
  SelectChangeEvent,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  Schedule,
  Download,
} from '@mui/icons-material';
import ReportTemplate from './ReportTemplate';
import AutomatedReports from './AutomatedReports';
import ESGDisclosure from './ESGDisclosure';
import { generateReport } from '../../services/reportGenerator';
import axios from 'axios';
import { api } from '../../services/api';
import { Company } from '../../types';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    environmental: true,
    social: true,
    governance: true,
    risks: true,
    benchmarks: false,
  });
  const [selectedCompany, setSelectedCompany] = useState<number | ''>('');
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // Fetch companies when component mounts
    const fetchCompanies = async () => {
      try {
        const response = await api.companies.getAll();
        setCompanies(response.data);
        // Set first company as default if exists
        if (response.data.length > 0) {
          setSelectedCompany(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    
    fetchCompanies();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedCompany) {
      alert('Please select a company first');
      return;
    }

    try {
      const config = {
        format: reportFormat,
        company_id: selectedCompany,
        sections: {
          overview: selectedSections.overview,
          environmental: selectedSections.environmental,
          social: selectedSections.social,
          governance: selectedSections.governance,
          risks: selectedSections.risks,
          benchmarks: selectedSections.benchmarks,
        },
      };
      
      await generateReport(config);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Reports & Export</Typography>
      
      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Generate Report" value="generate" />
        <Tab label="Automated Reports" value="automated" />
        <Tab label="ESG Disclosure" value="disclosure" />
        <Tab label="Templates" value="templates" />
      </Tabs>

      {activeTab === 'generate' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Company
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedCompany}
                onChange={(e: SelectChangeEvent<number>) => 
                  setSelectedCompany(e.target.value as number)}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Report Format
            </Typography>
            
            <FormControl fullWidth>
              <Select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF Report</MenuItem>
                <MenuItem value="xlsx">Excel Report</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              Include Sections
            </Typography>
            
            <FormGroup>
              {Object.entries(selectedSections).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => setSelectedSections({
                        ...selectedSections,
                        [key]: e.target.checked,
                      })}
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </FormGroup>

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleGenerateReport}
              sx={{ mt: 2 }}
              disabled={!selectedCompany}
            >
              Generate Report
            </Button>


          </Grid>
        </Grid>
      )}

      {activeTab === 'automated' && <AutomatedReports />}
      {activeTab === 'disclosure' && <ESGDisclosure />}
      {activeTab === 'templates' && <ReportTemplate />}
    </Paper>
  );
};

export default Reports;