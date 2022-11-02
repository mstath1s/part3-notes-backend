
const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
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
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use( morgan('tiny'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const randomId = () => {
  const rndid = Math.random() * 100000000
  console.log(rndid)
  return Math.floor(rndid)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing '
    })
  }

  const personExists = persons.find(person => person.name === body.name)
  if (personExists) {
    return response.status(400).json({
      error: 'name already exists '
    })
  }

  const person = {
    id: randomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/api/persons/info', (req, res) => {
  const infoNote = {
    content: 'Phonebook',
    phoneBook: persons.length,
    date: new Date()
  }
  const infoString = infoNote.content + " has info for " + infoNote.phoneBook + " people <p></p> the date is: " + infoNote.date
  console.log(infoString)
  res.send(infoString)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use( unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})