// frontend/src/components/Notes/EditNoteModal.jsx
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, Textarea, useToast, VStack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const EditNoteModal = ({ isOpen, onClose, note, onNoteUpdated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    if (!note) return;
    setIsLoading(true);
    try {
      const response = await api.put(`/notes/${note._id}`, { title, content });
      onNoteUpdated(response.data);
      toast({ title: 'Note updated successfully!', status: 'success' });
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating note',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="purple" isLoading={isLoading} onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditNoteModal;