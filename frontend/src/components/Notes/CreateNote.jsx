// frontend/src/components/Notes/CreateNote.jsx
import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, VStack } from '@chakra-ui/react';
import api from '../../api/axios';

const CreateNote = ({ onNoteCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/notes', { title, content });
            toast({ title: 'Note created!', status: 'success' });
            onNoteCreated(response.data);
            setTitle('');
            setContent('');
        } catch (error) {
            toast({
                title: 'Error creating note',
                description: error.response?.data?.message || 'An error occurred.',
                status: 'error',
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box p={6} borderWidth={1} borderRadius="lg" boxShadow="sm" bg="white">
            <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
                <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input value={title} onChange={e => setTitle(e.target.value)} />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea value={content} onChange={e => setContent(e.target.value)} />
                </FormControl>
                <Button type="submit" isLoading={isLoading} colorScheme="purple" alignSelf="flex-end">
                    Create Note
                </Button>
            </VStack>
        </Box>
    );
};
export default CreateNote;