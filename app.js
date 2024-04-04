const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Todo items
mongoose.connect("mongodb+srv://admin-suvam:suvamatlas@cluster0.xmphedy.mongodb.net/todolistDB");


const taksSchema = new mongoose.Schema({
    name: String
})

const Task = mongoose.model("Task", taksSchema)

const task1 = new Task({
    name: "Yogga"
})
const task2 = new Task({
    name: "Cook food"
})

const defaultTasks = [task1, task2];

// Read and Insert task
app.get("/", (req, res)=> {
    Task.find({})
        .then(function(result) {
            if(result.length == 0) {
                Task.insertMany(defaultTasks)
                        .then(function() {
                            console.log("Task added");
                        })
                        .catch(function(err) {
                            console.log(err);
                        })
            }
            res.render("index", {list: result, listTitle: "Todo List"});
        })
        .catch(function(err) {
            console.log(err);
        })
})

// Adding new task 
app.post("/", (req,res)=> {
    let task = req.body.input;
    let list = req.body.button;

    if(list == "Todo List") {
        const newTask = new Task({
            name: task
        })
        newTask.save();
        res.redirect("/");
    }
    else {
        const customListTask = new Customlist({     // New route task
            name: task
        })
        customListTask.save();
        res.redirect("/" + list);
    }
})

// Delete task
app.post("/delete", (req, res)=> {
    const taskId = req.body.deletedtask;
    const listname = req.body.listname;
    if(listname == "Todo List") {
        Task.deleteOne({_id: taskId})
            .then(function() {
                console.log("deleted");
            })
            .catch(function(err) {
                console.log(err);
            })
        res.redirect("/");
    }
    else {
        Customlist.deleteOne({_id: taskId})
            .then(function() {
                console.log("deleted");
            })
            .catch(function(err) {
                console.log(err);
            })
        res.redirect("/" + listname);
    }
    
})


//-------------   Custom list route   --------------

defaultCustomList = [];
const customListSchema = new mongoose.Schema({
    name: String
})
const Customlist = mongoose.model("Customlist", customListSchema);

app.get("/:customlist", (req, res)=> {
    const customListName = _.capitalize(req.params.customlist); //Lodash package has been installed to capitalize custom list name (ex: work -> Work)
    Customlist.find({})
                .then(function(resultList) {
                    res.render("index", {list: resultList, listTitle: customListName});
                })
                .catch(function(err) {
                    res.render(err);
                })
})

app.get("/about", (req,res)=> {
    res.render("about");
})

app.listen("3000", ()=> {
    console.log("Server is running on port 3000")
})