const {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
} = require('../src/handler');

const notes = require('../src/notes');

// Mock hapi response toolkit
const mockH = () => {
  const response = jest.fn().mockReturnValue({
    code: jest.fn().mockReturnThis(),
  });
  return { response };
};

// Clear notes before each test
beforeEach(() => {
  notes.length = 0;
});

describe('Handler Tests', () => {
  it('should add a note', () => {
    const h = mockH();
    const request = {
      payload: {
        title: 'Test Note',
        tags: ['test'],
        body: 'This is a test note.',
      }
    };

    const res = addNoteHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('success');
    expect(responseObj.data.noteId).toBeDefined();
    expect(notes.length).toBe(1);
  });

  it('should return all notes', () => {
    notes.push({ id: '123', title: 'Note 1', tags: [], body: '', createdAt: '', updatedAt: '' });
    const res = getAllNotesHandler();
    expect(res.status).toBe('success');
    expect(res.data.notes.length).toBe(1);
  });

  it('should return note by id', () => {
    const note = { id: 'abc123', title: 'Find Me', tags: [], body: '', createdAt: '', updatedAt: '' };
    notes.push(note);
    const h = mockH();
    const request = { params: { id: 'abc123' } };
    const res = getNoteByIdHandler(request, h);
    expect(res.status).toBe('success');
    expect(res.data.note.id).toBe('abc123');
  });

  it('should fail to return note by unknown id', () => {
    const h = mockH();
    const request = { params: { id: 'notfound' } };
    const res = getNoteByIdHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('fail');
  });

  it('should edit note by id', () => {
    notes.push({ id: 'edit123', title: 'Old', tags: [], body: '', createdAt: '', updatedAt: '' });
    const h = mockH();
    const request = {
      params: { id: 'edit123' },
      payload: { title: 'New', tags: [], body: 'Updated body' }
    };
    const res = editNoteByIdHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('success');
    expect(notes[0].title).toBe('New');
  });

  it('should fail to edit note with wrong id', () => {
    const h = mockH();
    const request = {
      params: { id: 'wrong' },
      payload: { title: 'Fail', tags: [], body: '' }
    };
    const res = editNoteByIdHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('fail');
  });

  it('should delete note by id', () => {
    notes.push({ id: 'del123', title: 'To delete', tags: [], body: '', createdAt: '', updatedAt: '' });
    const h = mockH();
    const request = { params: { id: 'del123' } };
    const res = deleteNoteByIdHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('success');
    expect(notes.length).toBe(0);
  });

  it('should fail to delete unknown note id', () => {
    const h = mockH();
    const request = { params: { id: 'none' } };
    const res = deleteNoteByIdHandler(request, h);
    expect(h.response).toHaveBeenCalled();
    const responseObj = h.response.mock.calls[0][0];
    expect(responseObj.status).toBe('fail');
  });
});
