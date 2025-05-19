const { nanoid } = require('nanoid');
const notes = require('./notes');

// Handler untuk menambahkan catatan
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16); //16 = ukuran string id
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };
 
    notes.push(newNote);

    // Mengecek apakah notes berhasil ditambahkan ke array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }
 
  const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Handler untuk mendapatkan semua catatan
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

// Mendapatkan catatan dari ID
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
  
};

// Mengupdate catatan by ID
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
    };

    const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response; 
};

// Menghapus catatan by ID
const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
    response.code(200);
    return response;
  }

  const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
  response.code(404);
  return response;
 
};

module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler, 
    deleteNoteByIdHandler 
};