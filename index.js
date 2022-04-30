require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(express.static('build'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(logger)
app.use(errorHandler)

// Get the phonebook
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((result) => {
      response.json(result)
    })
    .catch((error) => {
      console.log(error.message)
      next(error)
    })
})

// Get phonebook info
app.get('/info', (request, response) => {
  Person.find({})
    .then((result) => {
      const phonebookInfo = `Phonebook has info for ${result.length - 1} people`
      const time = new Date().toLocaleString()
      console.log(time)
      response.send(`<p>${phonebookInfo}</p><p>${time}</p>`)
    })
    .catch((err) => {
      console.log(err)
    })
})

// Get a single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).send({ message: 'Person not found' })
      }
    })
    .catch((error) => {
      console.log(error.message)
      next(error)
    })
})

// Delete a single person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).send({ message: 'Person deleted' })
      } else {
        response.status(404).send({ message: 'Person not found' })
      }
    })
    .catch((error) => {
      console.log(error.message)
      next(error)
    })
})

// Create a new person in the phonebook
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  } else if (!number) {
    return response.status(400).json({ error: 'number missing' })
  } else {
    const person = new Person({
      name,
      number,
    })
    person.save((error) => {
      if (error) {
        console.log(error.message)
        response.json({ error })
        next(error)
      } else {
        response.json(person)
      }
    })
  }
})

// Change/Update a person's number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  } else if (!number) {
    return response.status(400).json({ error: 'number missing' })
  } else {
    Person.findByIdAndUpdate(request.params.id, { name, number })
      .then((updatedPerson) => {
        if (updatedPerson) {
          response.json(updatedPerson)
        } else {
          response.status(404).send({ message: 'Person not found' })
        }
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
