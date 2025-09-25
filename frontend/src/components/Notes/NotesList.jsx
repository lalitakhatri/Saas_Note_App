// frontend/src/components/Notes/NotesList.jsx
import { SimpleGrid, Text } from '@chakra-ui/react';
import NoteItem from './NoteItem';

// Make sure it accepts 'onEdit' as a prop
const NotesList = ({ notes, onNoteDeleted, onEdit }) => {
    if (notes.length === 0) {
        return <Text color="gray.500" textAlign="center" py={10}>No notes found. Create your first one!</Text>;
    }
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {notes.map(note => (
                <NoteItem
                    key={note._id}
                    note={note}
                    onNoteDeleted={onNoteDeleted}
                    onEdit={onEdit} // <-- This line passes the function to the button component
                />
            ))}
        </SimpleGrid>
    );
};
export default NotesList;