// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Text } from '@chakra-ui/react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
    } catch (error) {
      toast({
        title: 'Login Failed.',
        description: error.response?.data?.message || 'An unexpected error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" bg="gray.50">
      <Box p={8} w="full" maxW="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <VStack as="form" onSubmit={handleSubmit} spacing={6}>
          <Heading size="lg" color="purple.600">SaaS Notes Login</Heading>
          <FormControl isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@acme.test" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </FormControl>
          <Button type="submit" isLoading={isLoading} colorScheme="purple" width="full" size="lg">
            Log In
          </Button>
          <Text fontSize="sm" color="gray.500">Use one of the provided test accounts.</Text>
        </VStack>
      </Box>
    </Box>
  );
};
export default LoginPage;