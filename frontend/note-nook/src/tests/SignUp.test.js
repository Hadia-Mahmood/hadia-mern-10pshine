import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../pages/SignUp/SignUp.jsx'; 
import axiosInstance from '../utils/axiosInstance.js'; 
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../utils/axiosInstance.js');

describe('SignUp Component', () => {
  beforeEach(() => {
    render(
        <Router>
          <SignUp />
        </Router>
      );
      screen.debug(); 
    jest.clearAllMocks(); 
  });

  test('renders SignUp form', () => {
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });


  test('displays error message when name is empty', async () => {
    fireEvent.click(screen.getByTestId('submit-button')); 
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument(); 
  });

  
  test('displays error message when password is empty', async () => {
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByTestId('submit-button')); 
    expect(await screen.findByText(/please enter the password/i)).toBeInTheDocument(); 
  });

  test('submits the form successfully', async () => {
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        accessToken: 'mockedAccessToken',
      },
    });
    fireEvent.click(screen.getByTestId('submit-button')); 
    await waitFor(() => expect(localStorage.getItem("token")).toBe("mockedAccessToken"));
    expect(window.location.pathname).toBe('/dashboard'); 
  });


});
