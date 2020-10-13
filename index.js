const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');
const { validate, ValidationError, Joi } = require('express-validation')
const Notes = require('./notes');

const newNoteValidation = {
    body: Joi.object({
      noteText: Joi.string().min(1).required()
    })
}

const uuidOnlyValidation = {
    params: Joi.object({
        uuid: Joi.string().guid({version:"uuidv4"}).required()
    })
}

const editNoteValidation = {
    body: Joi.object({
        noteText: Joi.string().min(1).required(),
        uuid: Joi.string().guid({version:"uuidv4"}).required()
    })
}

notes = new Notes();

const app = express();

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/css', express.static(path.join(__dirname, 'css')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send(pug.renderFile("index.pug", {notes: Object.fromEntries(notes.notes), isEmpty: notes.notes.size > 0}));
});

app.post('/', validate(newNoteValidation, {}, {}), (req, res, next) => {
    const {noteText} = req.body;
    notes.add(noteText);
    res.redirect('/');
});

app.get('/edit/:uuid', validate(uuidOnlyValidation, {}, {}), (req, res, next) => {
    const noteText = notes.get(req.params.uuid);
    if (noteText) {
        res.send(pug.renderFile("edit.pug", {uuid: req.params.uuid, noteText: noteText}));
        next();
    } else {
        next("Invalid uuid.");
    }
});

app.post('/edit', validate(editNoteValidation, {}, {}), (req, res) => {
    notes.edit(req.body.uuid, req.body.noteText);
    res.redirect('/');
});

app.get('/delete/:uuid', validate(uuidOnlyValidation, {}, {}), (req, res, next) => {
    if (!notes.delete(req.params.uuid)) {
        next("Invalid uuid.");
    }
    res.redirect('/');
});

app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err)
    }
    
    return res.status(500).json(err)
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Service is running on port: ${PORT}`));