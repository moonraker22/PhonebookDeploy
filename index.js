require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("build"));

const logger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    "\n",
    `Body: ${JSON.stringify(req.body)}`,
  ].join(" ");
});
app.use(logger);

// Get the phonebook
app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get phonebook info
app.get("/info", (request, response) => {
  Person.find({})
    .then((result) => {
      const phonebookInfo = `Phonebook has info for ${
        result.length - 1
      } people`;
      const time = new Date().toLocaleString();
      console.log(time);
      response.send(`<p>${phonebookInfo}</p><p>${time}</p>`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get a single person
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).send({ message: "Person not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete a single person
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).send({ message: "Person deleted" });
      } else {
        response.status(404).send({ message: "Person not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Create a new person in the phonebook
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    return response.status(400).json({ error: "name missing" });
  } else if (!number) {
    return response.status(400).json({ error: "number missing" });
  } else {
    const person = new Person({
      name,
      number,
    });
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
