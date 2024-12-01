import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Collapse,
  Divider,
  useTheme,
  Badge,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  NotificationsActive as AlertIcon,
} from '@mui/icons-material';
import { ESGData } from '../../types';

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface AlertsPanelProps {
  data?: ESGData;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ data }) => {
  const theme = useTheme();
  const [expandedAlerts, setExpandedAlerts] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Générer des alertes basées sur les données ESG
  const generateAlerts = (data?: ESGData): Alert[] => {
    if (!data) return [];

    const alerts: Alert[] = [];

    // Alertes environnementales
    if (data.environmental.co2_emissions > 1000) {
      alerts.push({
        id: 1,
        type: 'error',
        title: 'High CO2 Emissions',
        message: 'CO2 emissions have exceeded the recommended threshold. Immediate action required.',
        timestamp: new Date().toLocaleString(),
        isRead: false,
      });
    }

    if (data.environmental.renewable_energy_percent < 30) {
      alerts.push({
        id: 2,
        type: 'warning',
        title: 'Low Renewable Energy Usage',
        message: 'Renewable energy usage is below target. Consider increasing renewable energy sources.',
        timestamp: new Date().toLocaleString(),
        isRead: false,
      });
    }

    // Alertes sociales
    if (data.social.safety_incidents > 0) {
      alerts.push({
        id: 3,
        type: 'error',
        title: 'Safety Incidents Reported',
        message: `${data.social.safety_incidents} safety incidents reported. Review safety protocols.`,
        timestamp: new Date().toLocaleString(),
        isRead: true,
      });
    }

    if (data.social.diversity_ratio < 40) {
      alerts.push({
        id: 4,
        type: 'warning',
        title: 'Diversity Target Not Met',
        message: 'Workforce diversity is below target. Review hiring practices.',
        timestamp: new Date().toLocaleString(),
        isRead: false,
      });
    }

    // Alertes de gouvernance
    if (data.governance.ethics_violations > 0) {
      alerts.push({
        id: 5,
        type: 'error',
        title: 'Ethics Violations Detected',
        message: `${data.governance.ethics_violations} ethics violations reported. Immediate investigation required.`,
        timestamp: new Date().toLocaleString(),
        isRead: false,
      });
    }

    // Alerte positive
    if (data.governance.board_diversity > 40) {
      alerts.push({
        id: 6,
        type: 'success',
        title: 'Board Diversity Target Met',
        message: 'Board diversity target has been achieved. Keep up the good work!',
        timestamp: new Date().toLocaleString(),
        isRead: true,
      });
    }

    return alerts;
  };

  const alerts = generateAlerts(data);
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 4);
  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  const toggleAlert = (alertId: number) => {
    setExpandedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'success':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <AlertIcon />
        </Badge>
        <Typography variant="h6">
          Alerts & Notifications
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {displayedAlerts.map((alert, index) => (
          <React.Fragment key={alert.id}>
            {index > 0 && <Divider />}
            <ListItem
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                backgroundColor: !alert.isRead 
                  ? alpha(getAlertColor(alert.type), 0.05)
                  : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', width: '100%' }}>
                <ListItemIcon>
                  {getAlertIcon(alert.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {alert.title}
                      </Typography>
                      {!alert.isRead && (
                        <Chip
                          label="NEW"
                          size="small"
                          color="error"
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={alert.timestamp}
                />
                <IconButton
                  size="small"
                  onClick={() => toggleAlert(alert.id)}
                  sx={{
                    transform: expandedAlerts.includes(alert.id) 
                      ? 'rotate(180deg)' 
                      : 'none',
                    transition: 'transform 0.3s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Collapse in={expandedAlerts.includes(alert.id)}>
                <Box sx={{ pl: 7, pr: 2, pb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {alert.message}
                  </Typography>
                </Box>
              </Collapse>
            </ListItem>
          </React.Fragment>
        ))}
      </List>

      {alerts.length > 4 && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="button"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${alerts.length - 4} More`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AlertsPanel;
