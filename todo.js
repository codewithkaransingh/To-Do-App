const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const { title } = require("process");
const cors = require("cors");
const mongoose = require('mongoose')


const todoschema = new Schema({
  id:Number,
  title:String,
  description:String
});

const Todo = mongoose.model("todo",todoschema);

app.use(bodyparser.json());
app.use(cors());
var todo = [];
var id = 0;
var index = -1;
app.get("/todos", (req, res) => {
  fs.readFile("database.js", "utf-8", (err, data) => {
    todo = JSON.parse(data);

    res.status(200).json(todo);
  });
});

app.get("/todos/:id", (req, res) => {
  fs.readFile("database.js", "utf-8", (err, data) => {
    todo = JSON.parse(data);
    for (let i = 0; i < todo.length; i++) {
      if (req.params.id == todo[i].id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      res.status(200).json(todo[index]);
    } else {
      res.status(404);
    }
  });
});

app.post("/todos", (req, res) => {
  let content = {
    id: Math.floor(Math.random() * 1000000000 + 1),
    title: req.body.title,
    description: req.body.description,
  };
  todo.push(content);
  fs.writeFile("database.js", JSON.stringify(todo), (err) => {
    res.status(201).json(content);
  });
});
app.put("/todos/:id", (req, res) => {
  fs.readFile("database.js", "utf-8", (err, data) => {
    todo = JSON.parse(data);
    for (let i = 0; i < todo.length; i++) {
      if (req.params.id == todo[i].id) {
        index = i;
        break;
      }
    }

    todo[index].title = req.body.title;
    todo[index].description = req.body.description;

    fs.writeFile("database.js", JSON.stringify(todo), (err) => {
      res.status(200).json(todo[index]);
    });
  });
});

app.delete("/todos/:id", (req, res) => {
  fs.readFile("database.js", "utf-8", (err, data) => {
    todo = JSON.parse(data);
    for (let i = 0; i < todo.length; i++) {
      if (req.params.id == todo[i].id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      todo.splice(index, 1);
      var write = JSON.stringify(todo);
      fs.writeFile("database.js", write, (err) => {
        res.status(200).send("Item found and deleted");
      });
    } else {
      res.status(404).send("item not found");
    }
  });
});
app.listen(port, () => {
  console.log("server started");
});
