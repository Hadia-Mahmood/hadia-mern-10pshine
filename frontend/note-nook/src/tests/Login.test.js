import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../pages/Login/Login.jsx';
import '@testing-library/jest-dom';
import axiosInstance from '../utils/axiosInstance.js'; 

jest.mock('../utils/axiosInstance.js');

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Login />
      </Router>
    );
    screen.debug(); 
    jest.clearAllMocks(); 
  });

  test('renders Login form', () => {
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect( screen.getByTestId('login-submit-button')).toBeInTheDocument();
  });

  
  test('shows error message when password is empty', async () => {
    const emailInput = screen.getByPlaceholderText(/email/i);
    const loginButton =  screen.getByTestId('login-submit-button');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/please enter the password/i)).toBeInTheDocument();
  });


  test('successful login redirects to dashboard', async () => {
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton =  screen.getByTestId('login-submit-button');
    axiosInstance.post.mockResolvedValueOnce({
      data: {
        accessToken: 'mockAccessToken',
      },
    });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
    await waitFor(() => expect(localStorage.getItem("token")).toBe("mockAccessToken"));
    expect(window.location.pathname).toBe('/dashboard');
  });


  test('shows error message on login failure', async () => {
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton =  screen.getByTestId('login-submit-button');

    // Mock login failure response
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    // Fill in the form and submit
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
