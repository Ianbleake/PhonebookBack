const express = require('express');
const app = express();
var morgan = require('morgan');
const cors = require('cors')

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let Persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())
app.use(express.json());

const generateId = () => {
  let newId;
  do {
    newId = Math.floor(Math.random() * 100) + 1;
  } while (Persons.some(person => person.id === newId));
  return newId;
}

const findName = (name) => {
  const find = Persons.find(person => person.name === name);
  return !!find;
}

//*Consultas

app.get('/', (request, response) => {
  response.send('<h1>Hello persons!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(Persons);
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
