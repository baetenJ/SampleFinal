// correct url for thunder: http://www.localhost:3000/api/courses/ I think the issue is with my url when I run the front end

const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const Course = require('./models/courses');
const User = require('./models/users')
const jwt = require('jwt-simple');

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();
const secret = "supersecret"


router.post("/user", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password" });
    }
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    });
    try {
        await newUser.save();
        res.sendStatus(201);
        console.log(newUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// login
router.post("/auth", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ error: "Bad Username" });
        }

        // Compare hashed password
        /*
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Bad Password" });
        }*/

        // Generate JWT token
        const token = jwt.encode({ username: user.username }, secret);

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.get("/status", async (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth" });
    }
    const token = req.headers["x-auth"];
    try {
        const decoded = jwt.decode(token, secret);
        const users = await User.find({}, "username status");
        res.json(users);
    } catch (ex) {
        res.status(401).json({ error: "Invalid jwt" });
    }
});


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