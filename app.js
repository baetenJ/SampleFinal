// correct url for thunder: http://www.localhost:3000/api/courses/ I think the issue is with my url when I run the front end

const express = require('express');
var cors = require('cors');
const bodyparser = require('body-parser');
const Course = require('./models/courses');
const jwt = require('jwt-simple');
const User = require('./models/users')

const app = express();
app.use(cors());

app.use(express.json());
const router = express.Router();
const secret = "supersecret"

// creates a user

router.post("/user", async(res, req) => {
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }
    const newUser = await newUser({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })
    try {
        await newUser.save()
        res.sendStatus(201)
    }
    catch (err){
        res.status(400).send(err)
    }
})

// grab all courses in databse

router.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find({})
        res.send(courses)
        console.log(courses)
    }
    catch (err){
        console.log(err)
    }
})

router.get("/courses/:id", async(req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.json(course)
    }
    catch (err) {
        res.status(400).send(err)
    }
})


// adding song to database
router.post("/courses", async (req, res) => {
    try {
        const course = new Course(req.body)
        await course.save()
        res.status(201).json(course)
        console.log(course)
    }
    catch (err){
        res.status(400).send(err);
    }
})

// update a course
router.put("/courses/:id", async(req, res) => {
    // find and update song from frontend
    try {
        const course = req.body
        await Course.updateOne({_id : req.params.id},course)
        console.log(course)
        res.sendStatus(204) // successfully updated code
    }
    catch (err){
        res.status(400).send(err)
    }
})

router.delete("/courses/:id", async(req, res) => {
    try{
        const course = await Course.findById(req.params.id)
        await Course.deleteOne({ _id: course._id})
        res.sendStatus(204)
    }
    catch (err){
        res.status(400).send(err)
    }
})

router.get("/courses/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) { // If course is not found
            return res.status(404).send("Course not found");
        }
        res.json(course);
    } catch (err) {
        // Handle other errors
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.use("/api", router);
app.listen(3000);