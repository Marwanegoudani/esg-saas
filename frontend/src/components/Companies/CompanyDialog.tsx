import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { api } from '../../services/api';

interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.companies.create(formData);
      await onSave();
      onClose();
      setFormData({ name: '', industry: '', size: '', country: '' });
    } catch (err) {
      setError('Failed to create company');
      console.error('Error creating company:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Company</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Industry"
              select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            >
              <MenuItem value="Technology">Technology</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Healthcare">Healthcare</MenuItem>
              <MenuItem value="Energy">Energy</MenuItem>
              <MenuItem value="Manufacturing">Manufacturing</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Size"
              select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            >
              <MenuItem value="Small">Small</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Company
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDialog;
