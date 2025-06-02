import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/index';

// Mock semua dependencies
jest.mock('next/head', () => ({
    __esModule: true,
    default: ({ children }) => <>{children}</>,
}));

jest.mock('../lib/utils/storage', () => ({
    getBaseURL: jest.fn(() => 'http://localhost:3000/')
}));

jest.mock('../lib/utils/fetcher', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../components/Common/HeadBar', () => () => <div>HeadBar Mock</div>);
jest.mock('../components/Common/AnnounceBar', () => () => <div>AnnounceBar Mock</div>);
jest.mock('../components/Notes', () => ({ notes, empty }) => (
    <div>
        {empty ? 'No notes available' : notes.map(note => (
            <div key={note.id}>{note.title}</div>
        ))}
    </div>
));
jest.mock('../components/Common/FloatingButton', () => ({ onClickHandler, text }) => (
    <button onClick={onClickHandler}>{text}</button>
));

jest.mock('../Home.module.scss', () => ({
    error: 'error-class'
}));

describe('Home Component', () => {
    const mockFetcher = require('../lib/utils/fetcher').default;
    const { getBaseURL } = require('../lib/utils/storage');

    beforeEach(() => {
        jest.clearAllMocks();
        getBaseURL.mockImplementation(() => 'http://localhost:3000/');
        mockFetcher.mockResolvedValue({ data: { notes: [] } });
    });

    test('renders basic structure', async () => {
        render(<Home />);
        await waitFor(() => { // <-- tambahkan ini
            expect(screen.getByText('HeadBar Mock')).toBeInTheDocument();
            expect(screen.getByText('Add Note')).toBeInTheDocument();
        });
    });

    test('successfully fetches notes', async () => {
        const mockNotes = [{ id: 1, title: 'Test Note' }];
        mockFetcher.mockResolvedValue({ data: { notes: mockNotes } });

        render(<Home />);

        expect(await screen.findByText('Test Note')).toBeInTheDocument(); // <-- findByText otomatis menunggu

        // Verifikasi fetch dipanggil dengan URL benar
        expect(mockFetcher).toHaveBeenCalledWith('http://localhost:3000/notes');
    });

    test('handles empty state', async () => {
        mockFetcher.mockResolvedValue({ data: { notes: [] } });

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('No notes available')).toBeInTheDocument();
        });
    });

    test('handles fetch errors', async () => {
        mockFetcher.mockRejectedValue(new Error('API Error'));

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText(/Error displaying notes!/i)).toBeInTheDocument();
        });
    });
});