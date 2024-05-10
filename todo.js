const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const { title } = require("process");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect("Your Mongodb link");
const todoschema = new mongoose.Schema({
  title: String,
  description: String,
});

const Todo = mongoose.model("todo", todoschema);

app.use(bodyparser.json());
app.use(cors());

app.get("/todos", async (req, res) => {
  const tasks = await Todo.find({});
  res.json(tasks);
});

app.post("/todos", async (req, res) => {
  let content = {
    title: req.body.title,
    description: req.body.description,
  };
  
  const newtodo = await Todo(content);
  newtodo.save();
  res.status(201).json(newtodo);
});

app.delete("/todos/:id", async (req, res) => {
 
  const id = req.params.id;

  const findtodo = await Todo.findOne({ _id: id });

  if (findtodo) {
    const tododel = await Todo.findByIdAndDelete(id);

    res.status(200).send("item foud and deleted");
  } else {
    res.status(404).send("item not found");
  }
});
app.listen(port, () => {
  console.log("server started");
});
