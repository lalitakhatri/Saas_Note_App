// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Box, Container, Heading, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, VStack, Center } from '@chakra-ui/react';
import api from '../api/axios';
import Navbar from '../components/Layout/Navbar';
import NotesList from '../components/Notes/NotesList';
import CreateNote from '../components/Notes/CreateNote';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useAuth();

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/notes');
            setNotes(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch notes. Please try again later.');
            console.error("Failed to fetch notes:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchNotes();
    }, []);

    const handleNoteCreated = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    const handleNoteDeleted = (deletedNoteId) => {
        setNotes(notes.filter(note => note._id !== deletedNoteId));
    };
    
    const isFreePlan = auth.user.tenantPlan === 'free';
    const noteLimit = 3;
    const isLimitReached = isFreePlan && notes.length >= noteLimit;

    return (
        <Box bg="gray.50" minH="100vh">
            <Navbar />
            <Container maxW="container.lg" py={8}>
                <VStack spacing={8} align="stretch">
                    <Heading>Your Notes</Heading>
                    
                    {isLimitReached && (
                        <Alert status='warning' borderRadius="md">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Upgrade to Pro!</AlertTitle>
                            <AlertDescription>
                              You've reached the {noteLimit}-note limit for the Free Plan. Please upgrade to add more notes.
                            </AlertDescription>
                          </Box>
                        </Alert>
                    )}

                    {!isLimitReached && <CreateNote onNoteCreated={handleNoteCreated} />}

                    {isLoading ? (
                        <Center h="200px"><Spinner size="xl" color="purple.500" /></Center>
                    ) : error ? (
                        <Alert status="error"><AlertIcon />{error}</Alert>
                    ) : (
                        <NotesList notes={notes} onNoteDeleted={handleNoteDeleted} />
                    )}
                </VStack>
            </Container>
        </Box>
    );
};
export default Dashboard;