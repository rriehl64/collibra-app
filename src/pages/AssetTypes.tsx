import React from 'react';
import { Box, Paper } from '@mui/material';
import AssetTypeMenu from '../components/AssetTypes/AssetTypeMenu';

const AssetTypes: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ maxWidth: 360 }}>
        <AssetTypeMenu />
      </Paper>
    </Box>
  );
};

export default AssetTypes;
