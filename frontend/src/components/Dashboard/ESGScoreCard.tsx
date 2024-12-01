import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ESGScoreCardProps {
  title: string;
  score: number;
  trend: number;
  color: string;
  icon?: React.ReactNode;
  description?: string;
}

const ESGScoreCard: React.FC<ESGScoreCardProps> = ({
  title,
  score,
  trend,
  color,
  icon,
  description = 'Score based on multiple ESG metrics and industry benchmarks',
}) => {
  const theme = useTheme();
  const isPositiveTrend = trend >= 0;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'visible',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: color,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon}
              <Typography variant="h6" component="div" fontWeight="500">
                {title}
              </Typography>
            </Box>
            <Tooltip title={description} arrow placement="top">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
            <Typography variant="h3" component="div" fontWeight="600" sx={{ mr: 2 }}>
              {score}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              /100
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              color: isPositiveTrend ? 'success.main' : 'error.main',
            }}
          >
            {isPositiveTrend ? <TrendingUpIcon /> : <TrendingDownIcon />}
            <Typography 
              variant="body2" 
              component="div"
              fontWeight="500"
            >
              {isPositiveTrend ? '+' : ''}{trend}% from last period
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ESGScoreCard;
