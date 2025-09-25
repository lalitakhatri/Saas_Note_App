import { useEffect, useState } from 'react';
import { Box, Container, Heading, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, VStack, Center, useDisclosure } from '@chakra-ui/react';
import api from '../api/axios';
import Navbar from '../components/Layout/Navbar';
import NotesList from '../components/Notes/NotesList';
import CreateNote from '../components/Notes/CreateNote';
import EditNoteModal from '../components/Notes/EditNoteModal'; // <-- IMPORT THE MODAL
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingNote, setEditingNote] = useState(null); // <-- State to hold the note being edited
    const { auth } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure(); // <-- Controls for the modal

    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/notes');
            setNotes(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch notes. Please try again later.');
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

    // --- NEW FUNCTIONS FOR EDITING ---
    const handleEditClick = (note) => {
        setEditingNote(note);
        onOpen();
    };

    const handleNoteUpdated = (updatedNote) => {
        setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
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
                              You've reached the {noteLimit}-note limit for the Free Plan.
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
                        // Pass the onEdit function down to the list
                        <NotesList notes={notes} onNoteDeleted={handleNoteDeleted} onEdit={handleEditClick} />
                    )}
                </VStack>
            </Container>

            {/* Render the modal and pass it the necessary props */}
            {editingNote && (
                <EditNoteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    note={editingNote}
                    onNoteUpdated={handleNoteUpdated}
                />
            )}
        </Box>
    );
};

export default Dashboard;