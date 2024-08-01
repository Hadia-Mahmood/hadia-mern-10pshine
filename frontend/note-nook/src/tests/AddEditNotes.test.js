import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddEditNotes from '../pages/Dashboard/AddEditNotes.jsx'; 
import axiosInstance from '../utils/axiosInstance.js'; 

jest.mock('../utils/axiosInstance.js'); 

describe('AddEditNotes Component', () => {
  const mockGetAllNotes = jest.fn();
  const mockShowToastMessage = jest.fn();
  const onClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks(); 
    screen.debug(); 
  });

  test('adds a new note successfully', async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        note: { title: 'New Note', content: 'This is a new note.', tags: [] },
      },
    });

    render(<AddEditNotes noteData={null} type="add" getAllNotes={mockGetAllNotes} onClose={onClose} showToastMessage={mockShowToastMessage} />);
    fireEvent.change(screen.getByPlaceholderText('Join Meeting at 9'), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'This is a new note.' } });
    fireEvent.click(screen.getByText('ADD'));

    await waitFor(() => {
      expect(mockShowToastMessage).toHaveBeenCalledWith('Note Added Successfully');
      expect(mockGetAllNotes).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('shows error message when title is missing', () => {
    render(<AddEditNotes noteData={null} type="add" getAllNotes={mockGetAllNotes} onClose={onClose} showToastMessage={mockShowToastMessage} />);
    fireEvent.click(screen.getByText('ADD'));
    expect(screen.getByText('Please enter title.')).toBeInTheDocument();
  });

  test('shows error message when content is missing', () => {
    render(<AddEditNotes noteData={null} type="add" getAllNotes={mockGetAllNotes} onClose={onClose} showToastMessage={mockShowToastMessage} />);
    fireEvent.change(screen.getByPlaceholderText('Join Meeting at 9'), { target: { value: 'New Note' } });
    fireEvent.click(screen.getByText('ADD'));
    expect(screen.getByText('Please enter the content.')).toBeInTheDocument();
  });

  test('edits an existing note successfully', async () => {
    const existingNote = {
      _id: '123',
      title: 'Existing Note',
      content: 'This is an existing note.',
      tags: ['tag1'],
    };

    axiosInstance.put.mockResolvedValueOnce({
      data: {
        note: existingNote,
      },
    });

    render(<AddEditNotes noteData={existingNote} type="edit" getAllNotes={mockGetAllNotes} onClose={onClose} showToastMessage={mockShowToastMessage} />);

    fireEvent.change(screen.getByPlaceholderText('Join Meeting at 9'), { target: { value: 'Updated Note' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'This is an updated note.' } });

    fireEvent.click(screen.getByText('UPDATE'));

    await waitFor(() => {
      expect(mockShowToastMessage).toHaveBeenCalledWith('Note Updated Successfully');
      expect(mockGetAllNotes).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('shows error message when editing fails', async () => {
    const existingNote = {
      _id: '123',
      title: 'Existing Note',
      content: 'This is an existing note.',
      tags: ['tag1'],
    };

    axiosInstance.put.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Error updating note.',
        },
      },
    });

    render(<AddEditNotes noteData={existingNote} type="edit" getAllNotes={mockGetAllNotes} onClose={onClose} showToastMessage={mockShowToastMessage} />);

    fireEvent.change(screen.getByPlaceholderText('Join Meeting at 9'), { target: { value: 'Updated Note' } });
    fireEvent.change(screen.getByPlaceholderText('Content'), { target: { value: 'This is an updated note.' } });

    fireEvent.click(screen.getByText('UPDATE'));

    await waitFor(() => {
      expect(screen.getByText('Error updating note.')).toBeInTheDocument();
    });
  });
});
