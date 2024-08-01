import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'; 
import '@testing-library/jest-dom';


jest.mock('../components/SearchBar/SearchBar', () => jest.fn(({ value, onChange, handleSearch, onClearSearch }) => (
  <div>
    <input data-testid="search-input" value={value} onChange={onChange} />
    <button data-testid="search-button" onClick={handleSearch}>Search</button>
    <button data-testid="clear-button" onClick={onClearSearch}>Clear</button>
  </div>
)));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockNavigate = jest.fn();
  const mockOnSearchNote = jest.fn();
  const mockHandleClearSearch = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('renders the Navbar correctly', () => {
    render(
      <MemoryRouter>
        <Navbar onSearchNote={mockOnSearchNote} handleClearSearch={mockHandleClearSearch} />
      </MemoryRouter>
    );

    expect(screen.getByText('Notes Nook')).toBeInTheDocument();
    expect(screen.getByAltText('Product Icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  test('handles search input change and search button click', () => {
    render(
      <MemoryRouter>
        <Navbar onSearchNote={mockOnSearchNote} handleClearSearch={mockHandleClearSearch} />
      </MemoryRouter>
    );

    const searchInput = screen.getByTestId('search-input');
    const searchButton = screen.getByTestId('search-button');

    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');

    fireEvent.click(searchButton);
    expect(mockOnSearchNote).toHaveBeenCalledWith('test query');
  });

  test('handles clear search button click', () => {
    render(
      <MemoryRouter>
        <Navbar onSearchNote={mockOnSearchNote} handleClearSearch={mockHandleClearSearch} />
      </MemoryRouter>
    );

    const clearButton = screen.getByTestId('clear-button');

    fireEvent.click(clearButton);
    expect(mockHandleClearSearch).toHaveBeenCalled();
  });

  test('handles logout button click', () => {
    const clearMock = jest.spyOn(Storage.prototype, 'clear');
    render(
      <MemoryRouter>
        <Navbar onSearchNote={mockOnSearchNote} handleClearSearch={mockHandleClearSearch} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: 'Logout' });

    fireEvent.click(logoutButton);
    expect(clearMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    clearMock.mockRestore();
  });
});
