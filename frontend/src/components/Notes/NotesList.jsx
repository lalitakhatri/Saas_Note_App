// frontend/src/components/Notes/NotesList.jsx
import { SimpleGrid, Text } from '@chakra-ui/react';
import NoteItem from './NoteItem';

const NotesList = ({ notes, onNoteDeleted }) => {
    if (notes.length === 0) {
        return <Text color="gray.500">No notes found. Create your first one!</Text>;
    }
    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {notes.map(note => (
                <NoteItem key={note._id} note={note} onNoteDeleted={onNoteDeleted} />
            ))}
        </SimpleGrid>
    );
};
export default NotesList;