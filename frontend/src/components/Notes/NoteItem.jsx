// frontend/src/components/Notes/NoteItem.jsx
import { Box, Heading, Text, IconButton, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import api from '../../api/axios';

const NoteItem = ({ note, onNoteDeleted }) => {
    const toast = useToast();
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${note._id}`);
                toast({ title: 'Note deleted', status: 'info' });
                onNoteDeleted(note._id);
            } catch (error) {
                toast({ title: 'Error deleting note', status: 'error' });
            }
        }
    };
    
    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white" position="relative">
            <Heading fontSize="xl">{note.title}</Heading>
            <Text mt={4}>{note.content}</Text>
            <IconButton
                aria-label="Delete note"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                position="absolute"
                top="8px"
                right="8px"
                onClick={handleDelete}
            />
        </Box>
    );
};
export default NoteItem;