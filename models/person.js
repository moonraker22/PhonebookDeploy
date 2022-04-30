const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
    message: (props) => `${props.value} is not a valid name`,
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    trim: true,
    minlength: 8,
    maxlength: 25,
    validate: (value) => {
      const regex = /\d{2,3}-\d+/
      return regex.test(value)
    },
    message: (props) => `${props.value} is not a valid phone number`,
  },
})

// Format the output of the personSchema
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
