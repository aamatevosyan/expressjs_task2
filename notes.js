const { v4 : uuidv4 } = require('uuid'); 

class Note {
    constructor(noteText) {
        this.uuid = uuidv4();
        this.text = noteText;
    }
}

class Notes {
    constructor() {
        this.notes = [];
    }

    add(noteText) {
        this.notes.push(new Note(noteText));
    }

    delete(noteId) {
        for (const note of this.notes)
            if (note.uuid === noteId) {
                this.notes.splice(this.notes.indexOf(note), 1);
                return true;
            }
        return false;
    }

    editByID(noteId, noteText) {
        return this.editByNote(this.get(noteId), noteText);
    }

    editByNote(note, noteText) {
        if (note) {
            note.text = noteText;
            return true;
        }
        return false;
    }

    get(noteId) {
        for (const note of this.notes)
            if (note.uuid === noteId) {
                return note;
            }
        return undefined;
    }
}

exports.Note = Note;
exports.Notes = Notes;