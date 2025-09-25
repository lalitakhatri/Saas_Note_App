import { Box, Heading, Text, IconButton, useToast, HStack } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import api from '../../api/axios';

const NoteItem = ({ note, onNoteDeleted, onEdit }) => {
    const toast = useToast();
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${note._id}`);
                toast({ title: 'Note deleted', status: 'info', duration: 3000, isClosable: true });
                onNoteDeleted(note._id);
            } catch (error) {
                toast({ title: 'Error deleting note', status: 'error' });
            }
        }
    };
    
    return (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg="white" position="relative">
            {/* This HStack now contains BOTH the Edit and Delete buttons */}
            <HStack position="absolute" top="8px" right="8px">
                <IconButton
                    aria-label="Edit note"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="gray"
                    onClick={() => onEdit(note)}
                />
                <IconButton
                    aria-label="Delete note"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={handleDelete}
                />
            </HStack>
            <Heading fontSize="xl" pr="80px">{note.title}</Heading>
            <Text mt={4}>{note.content}</Text>
        </Box>
    );
};

export default NoteItem;