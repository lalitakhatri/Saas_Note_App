// frontend/src/components/Layout/Navbar.jsx
import { Box, Button, Flex, Heading, Spacer, Text, Badge } from '@chakra-ui/react';
import useAuth from '../../hooks/useAuth';
import UpgradeButton from '../Billing/UpgradeButton';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const { tenantSlug, tenantPlan, role } = auth.user;

  return (
    <Flex as="nav" p={4} bg="white" color="gray.800" alignItems="center" boxShadow="sm">
      <Heading size="md" color="purple.600">SaaS Notes</Heading>
      <Spacer />
      <Box textAlign="right" mr={4}>
        <Text fontWeight="bold">Company: {tenantSlug.charAt(0).toUpperCase() + tenantSlug.slice(1)}</Text>
        <Badge colorScheme={tenantPlan === 'pro' ? 'green' : 'gray'}>{tenantPlan.toUpperCase()} Plan</Badge>
      </Box>
      {role === 'admin' && tenantPlan === 'free' && <UpgradeButton />}
      <Button onClick={logout} colorScheme="purple" variant="outline" ml={4}>Logout</Button>
    </Flex>
  );
};
export default Navbar;