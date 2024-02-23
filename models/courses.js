const db = require("../db");

const Course = db.model("Course", {
    course_name: {type: String, required: true},
    course_desc: {type: String, required: true},
    subject_area: {type: String, required: true},
    cred_number: {type: Number, min:1, max:4, required: true},
    // students: [ Object ]
});

module.exports = Course