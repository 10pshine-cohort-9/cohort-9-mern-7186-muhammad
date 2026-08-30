import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Login from '../src/pages/Login';
import * as authApi from '../src/api/auth.api';

jest.mock('../src/api/auth.api');

const renderLogin = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authApi.getMeApi.mockRejectedValue({ message: 'no session' });
  });

  it('renders the email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows a validation/error message when login fails', async () => {
    authApi.loginApi.mockRejectedValue({ message: 'Invalid email or password.' });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('calls the login API with the entered credentials on submit', async () => {
    authApi.loginApi.mockResolvedValue({
      data: { user: { id: 1, name: 'Test User', email: 'test@example.com' }, token: 'fake-jwt' },
    });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(authApi.loginApi).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
