import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ReportTemplate as IReportTemplate } from '../../types/reports';

const ReportTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<IReportTemplate[]>([
    {
      id: 1,
      name: 'Standard ESG Report',
      description: 'Default template for ESG reporting',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Executive Summary',
      description: 'Condensed report for executive review',
      isDefault: false,
    },
  ]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Report Templates</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            New Template
          </Button>
        </Box>
      </Grid>

      {templates.map((template) => (
        <Grid item xs={12} key={template.id}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">
                  {template.name}
                  {template.isDefault && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ ml: 1, bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: 1 }}
                    >
                      Default
                    </Typography>
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {template.description}
                </Typography>
              </Box>
              <Box>
                <IconButton size="small">
                  <EditIcon />
                </IconButton>
                <IconButton size="small" disabled={template.isDefault}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportTemplate; 