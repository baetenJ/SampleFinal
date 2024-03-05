const express = require('express');
const app = express();

app.use(express.json());
app.use("/api/courses"), require("./api/courses");
app.use("/api/users"), require("./api/users");

app.listen(3000);