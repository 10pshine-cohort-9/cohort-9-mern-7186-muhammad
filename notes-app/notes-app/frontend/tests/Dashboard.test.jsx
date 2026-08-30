import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Dashboard from '../src/pages/Dashboard';
import * as authApi from '../src/api/auth.api';
import * as notesApi from '../src/api/notes.api';

jest.mock('../src/api/auth.api');
jest.mock('../src/api/notes.api');

const renderDashboard = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );

describe('Dashboard page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('notes_app_token', 'fake-jwt');
    localStorage.setItem(
      'notes_app_user',
      JSON.stringify({ id: 1, name: 'Ali Khan', email: 'ali@example.com' })
    );
    authApi.getMeApi.mockResolvedValue({
      data: { user: { id: 1, name: 'Ali Khan', email: 'ali@example.com' } },
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows a greeting with the user\'s first name and their notes', async () => {
    notesApi.getNotesApi.mockResolvedValue({
      data: {
        notes: [
          {
            id: 1,
            title: 'Grocery list',
            content: '<p>Milk, eggs, bread</p>',
            isPinned: false,
            updatedAt: new Date().toISOString(),
          },
        ],
        count: 1,
      },
    });

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/hi ali, here are your notes/i)).toBeInTheDocument();
    });
    expect(await screen.findByText('Grocery list')).toBeInTheDocument();
  });

  it('shows an empty state when the user has no notes', async () => {
    notesApi.getNotesApi.mockResolvedValue({ data: { notes: [], count: 0 } });

    renderDashboard();

    expect(await screen.findByText(/your notebook is empty/i)).toBeInTheDocument();
  });

  it('shows the "new note" card to let users create a note', async () => {
    notesApi.getNotesApi.mockResolvedValue({ data: { notes: [], count: 0 } });

    renderDashboard();

    expect(await screen.findByText(/new note/i)).toBeInTheDocument();
  });
});
