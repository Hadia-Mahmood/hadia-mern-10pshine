import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.jsx'; 
import '@testing-library/jest-dom';
import axiosInstance from '../utils/axiosInstance.js'; 

jest.mock('../utils/axiosInstance.js'); 
describe('Dashboard Component', () => {
  const mockNotes = [
    {
      _id: '1',
      title: 'Note 1',
      createdOn: '2024-01-01',
      content: 'Content of Note 1',
      tags: ['tag1'],
      isPinned: false,
    },
    {
      _id: '2',
      title: 'Note 2',
      createdOn: '2024-01-02',
      content: 'Content of Note 2',
      tags: ['tag2'],
      isPinned: true,
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === 'user/get-user') {
        return Promise.resolve({ data: { user: { id: '1', name: 'Test User' } } });
      }
      if (url === 'notes/get-all-notes') {
        return Promise.resolve({ data: { notes: mockNotes } });
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );
    screen.debug(); 
  });

  test('renders all notes', async () => {
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  });

  test('shows empty card when no notes are present', async () => {
    axiosInstance.get.mockImplementationOnce((url) => {
      if (url === 'notes/get-all-notes') {
        return Promise.resolve({ data: { notes: [] } });
      }
      return Promise.reject(new Error('Not Found'));
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/start creating your first note/i)).toBeInTheDocument();
    });
  });

  test('searches for a note', async () => {
    const query = 'Note 1';

    axiosInstance.get.mockImplementation((url) => {
      if (url === 'notes/search-notes/') {
        return Promise.resolve({ data: { notes: [mockNotes[0]] } });
      }
      return Promise.reject(new Error('Not Found'));
    });

    const searchBar = screen.getByPlaceholderText(/Search Notes/i); 
    fireEvent.change(searchBar, { target: { value: query } });
    fireEvent.submit(searchBar); 
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.queryByText('Note 2')).toBeInTheDocument();
    });
  });

  test('shows toast message when note is deleted', async () => {
    // Mock the delete note response
    axiosInstance.delete.mockResolvedValueOnce({ data: { message: 'Note Deleted Successfully' } });

    // Assume there is a delete button for the first note 
    const deleteButtons = await screen.findAllByTestId('note-delete-button');
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.getByText('Note Deleted Successfully')).toBeInTheDocument();
    });
  });

  test('pins a note', async () => {
    const noteToPin = mockNotes[0];
    axiosInstance.put.mockResolvedValueOnce({ data: { note: { ...noteToPin, isPinned: true } } });
    const pinButtons = await screen.findAllByTestId('note-pin-button');
    fireEvent.click(pinButtons[1]);
    await waitFor(() => {
      expect(screen.getByText('Note Updated Successfully')).toBeInTheDocument();
    });
  });

  

  afterEach(() => {
    jest.clearAllMocks();
  });
});
