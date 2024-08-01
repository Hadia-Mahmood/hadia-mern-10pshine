import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NoteCard from '../components/Cards/NoteCard'; 
import moment from "moment";

describe('NoteCard Component', () => {
  const mockNote = {
    title: 'Test Note',
    date: new Date().toISOString(),
    content: 'This is a test note.',
    tags: ['tag1', 'tag2'],
    isPinned: false,
  };

  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onPinNote = jest.fn();

  beforeEach(() => {
    render(
      <NoteCard
        title={mockNote.title}
        date={mockNote.date}
        content={mockNote.content}
        tags={mockNote.tags}
        isPinned={mockNote.isPinned}
        onEdit={onEdit}
        onDelete={onDelete}
        onPinNote={onPinNote}
      />
    );
    screen.debug(); 
  });

  it('renders NoteCard with correct content', () => {
    expect(screen.getByText(mockNote.title)).toBeInTheDocument();
    expect(screen.getByText(moment(mockNote.date).format('Do MMM YYYY'))).toBeInTheDocument();
    expect(screen.getByText(mockNote.content.slice(0, 60))).toBeInTheDocument();
    mockNote.tags.forEach(tag => {
      expect(screen.getByTestId('tag')).toBeInTheDocument();
    });
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const editButton = screen.getByTestId('note-edit-button');
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    const deleteButton = screen.getByTestId('note-delete-button');
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('calls onPinNote when pin button is clicked', () => {
    const pinButton = screen.getByTestId('note-pin-button');
    fireEvent.click(pinButton);
    expect(onPinNote).toHaveBeenCalled();
  });
});
