import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Park as EnvironmentIcon,
  People as SocialIcon,
  AccountBalance as GovernanceIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { ESGData } from '../../types';

interface ESGScoreCardProps {
  companyId: number;
}

const ESGScoreCard: React.FC<ESGScoreCardProps> = ({ companyId }) => {
  const theme = useTheme();
  const [data, setData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      
      try {
        const response = await api.esgData.getByCompanyId(companyId);
        setData(response.data);
      } catch (err) {
        setError('Failed to load ESG scores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  const calculateESGScore = (esgData: ESGData) => {
    const environmental = Math.round(
      (esgData.environmental.renewable_energy_percent || 0) * 0.4 +
      (100 - (esgData.environmental.co2_emissions || 0) / 20) * 0.6
    );
    
    const social = Math.round(
      (esgData.social.diversity_ratio || 0) * 0.5 +
      (100 - (esgData.social.safety_incidents || 0) * 10) * 0.5
    );
    
    const governance = Math.round(
      (esgData.governance.board_diversity || 0) * 0.4 +
      (100 - (esgData.governance.ethics_violations || 0) * 20) * 0.6
    );

    return { environmental, social, governance };
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data.length) return <Alert severity="info">No ESG data available</Alert>;

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  const currentScores = calculateESGScore(latestData);
  const previousScores = previousData ? calculateESGScore(previousData) : null;

  const scoreCards = [
    {
      title: 'Environmental',
      score: currentScores.environmental,
      previousScore: previousScores?.environmental,
      icon: <EnvironmentIcon />,
      color: theme.palette.success.main,
      description: 'Environmental score based on emissions, energy usage, and sustainability practices',
    },
    {
      title: 'Social',
      score: currentScores.social,
      previousScore: previousScores?.social,
      icon: <SocialIcon />,
      color: theme.palette.info.main,
      description: 'Social score based on diversity, safety, and community investment',
    },
    {
      title: 'Governance',
      score: currentScores.governance,
      previousScore: previousScores?.governance,
      icon: <GovernanceIcon />,
      color: theme.palette.warning.main,
      description: 'Governance score based on board diversity, ethics, and transparency',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        ESG Scores
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {scoreCards.map((card) => {
          const trend = card.previousScore
            ? ((card.score - card.previousScore) / card.previousScore) * 100
            : 0;

          return (
            <motion.div
              key={card.title}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    backgroundColor: card.color,
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {card.icon}
                      <Typography variant="h6">{card.title}</Typography>
                    </Box>
                    <Tooltip title={card.description} arrow>
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h3" component="div" sx={{ color: card.color }}>
                      {card.score}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={card.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: `${card.color}20`,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: card.color,
                        borderRadius: 4,
                      },
                      mb: 2,
                    }}
                  />

                  {card.previousScore && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: trend >= 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {trend >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      <Typography variant="body2">
                        {Math.abs(trend).toFixed(1)}% from last period
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default ESGScoreCard;
