const { v4 : uuidv4 } = require('uuid'); 

class Notes {
    constructor() {
        this.notes = new Map();
    }

    add(noteText) {
        this.notes.set(uuidv4(), noteText);
    }

    delete(noteId) {
        return this.notes.delete(noteId);
    }

    edit(noteId, noteText) {
        if (this.notes.has(noteId)) {
            this.notes.set(noteId, noteText);
            return true;
        }
        return false;
    }

    get(noteId) {
        return this.notes.get(noteId);
    }
}

module.exports = Notes;