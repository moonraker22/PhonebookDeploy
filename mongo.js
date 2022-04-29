const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

// const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const url = `mongodb+srv://moonraker22:${password}@fullstackopen2022.get1e.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

mongoose.connection.on("error", (err) => {
  console.log(err);
});

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

// personSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then((result) => {
      console.log("Phonebook:");
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person
    .save()
    .then(() => {
      console.log("Person saved");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
}

if (process.argv.length > 5) {
  console.log(
    "Too many arguments provided if argument has spaces surround with quotation marks"
  );
  process.exit(1);
}

// const person = new Person({
//   name: "Arto Hellas",
//   number: "040-123456",
// });

// person.save().then((result) => {
//   console.log("Person saved!", result);
//   mongoose.connection.close();
// });
