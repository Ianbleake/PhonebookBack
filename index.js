require('dotenv').config()
const express = require('express');
const app = express();
var morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

const findName = (name) => {
  const find = Persons.find(person => person.name === name);
  return !!find;
}

//*Consultas

app.get('/', (request, response) => {
  response.send('<h1>I had put my front app here...</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = Persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const dataCount = Persons.length;
  const serverDate = new Date();
  response.send(`<h1>Phonebook has info for ${dataCount} people <br/> ${serverDate} </h1>`);
});

//*Eliminación
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  Persons = Persons.filter(person => person.id !== id);
  response.status(204).end();
});

//*Creación
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' });
  } else if (!body.number) {
    return response.status(400).json({ error: 'Number missing' });
  } else if (findName(body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  Persons = Persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
