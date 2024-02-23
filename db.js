const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://group1:IvyTech123@coursesdb.xpvlqyf.mongodb.net/?retryWrites=true&w=majority&appName=CoursesDB', { useNewUrlParser: true});

module.exports = mongoose