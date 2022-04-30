const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://moonraker22:${password}@fullstackopen2022.get1e.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.connection.on('error', (err) => {
  console.log(err)
})

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then((result) => {
      console.log('Phonebook:')
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log(err)
    })
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person
    .save()
    .then(() => {
      console.log('Person saved')
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log(err)
    })
}

if (process.argv.length > 5) {
  console.log(
    'Too many arguments provided if argument has spaces surround with quotation marks'
  )
  process.exit(1)
}
