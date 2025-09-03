/**
 * UserManagement Page
 * 
 * Main page for user management and role-based access control.
 */

import React from 'react';
import { Container } from '@mui/material';
import UserManagementSystem from '../components/UserManagement/UserManagementSystem';

const UserManagement: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <UserManagementSystem />
    </Container>
  );
};

export default UserManagement;
