const express = require('express');
const path = require('path');
const fs = require('fs');
const { readAndAppend ,readFromFile, readAndDelete} = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, './index.html')
  )
  
});

// GET Route for notes page
app.get('/notes', (req, res) =>{
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

// GET Route for retrieving all saved notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => {
  res.json(JSON.parse(data))});
});

// POST Route for receiving and saving note to db.json file
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  const { title, text} = req.body;
    
  if (req.body) {
     const newNote = {
     title,
     text,
     id: uuid(),
     }
    readAndAppend(newNote, './db/db.json');
      const response = {
        status: 'success',
        body: newNote
      };
    res.json(response);
  } 
  else {
    res.json('Error in posting notes'); 
  }
});

//DELETE Route to delete selected note
app.delete('/api/notes/:id', (req, res) => {
if (req.params.id){ 
  readAndDelete(req.params.id, './db/db.json');
const response = {
  status: 'Successfully Deleted!',
  body: req.params.id,
};
 res.json(response);
}else {
    res.json('Error in deleting notes');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);