import { motion } from 'framer-motion';
import { Card, CardProps } from '@mui/material';

interface InteractiveCardProps extends CardProps {
  children: React.ReactNode;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

export default InteractiveCard;