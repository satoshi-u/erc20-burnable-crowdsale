const express = require("express"); // Returns express function
const Joi = require("@hapi/joi");

const app = express(); // Returns app Object - express app
app.use(express.json()); // Middleware in Js ???

// DB
let courses = [
  { id: 1, name: "Java" },
  { id: 2, name: "Js" },
  { id: 3, name: "C++" },
  { id: 4, name: "Go" },
  { id: 5, name: "Solidity" },
];

//----------------------------------------------------------------------------------------------------------------------------

// GET COURSE
function getCourseFromId(id) {
  return courses.find((c) => c.id === parseInt(id));
}

// VALIDATE COURSE
function validateCourse(course) {
  // Joi Schema for input validation
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
  });
  return schema.validate(course);
}

// LIST ERRORS
function listErrors(error) {
  let errors_all = "";
  error.details.forEach((element) => (errors_all += element.message));
  return errors_all;
}

//----------------------------------------------------------------------------------------------------------------------------

// First arg -> url; Second arg -> Route Handler
// HOME
app.get("/", (req, res) => {
  res.send("Welcome to EXPRESS!!");
});

// GET ALL COURSES
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// GET COURSE WITH ID
app.get("/api/courses/:id", (req, res) => {
  const course = getCourseFromId(req.params.id);
  if (!course) return res.status(404).send("Course Not Found with given Id"); // Not Found 404
  res.send(course);
});

// ADD NEW COURSE
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(listErrors(error)); // Bad Request 400

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

// UPDATE COURSE WITH ID
app.put("/api/courses/:id", (req, res) => {
  const course = getCourseFromId(req.params.id);
  if (!course) return res.status(404).send("Course Not Found with given Id"); // Not Found 404

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(listErrors(error)); // Bad Request 400

  course.name = req.body.name;
  res.send(course);
});

// DELETE COURSE WITH ID
app.delete("/api/courses/:id", (req, res) => {
  const course = getCourseFromId(req.params.id);
  if (!course) return res.status(404).send("Course Not Found with given Id");

  const index = courses.indexOf(course);
  const deleted = courses.splice(index, 1);
  res.send(deleted);
});

//----------------------------------------------------------------------------------------------------------------------------

// In prod, you should listen to some env var like PORT, set it using {export PORT=5000}, unset using {unset PORT}
const port = process.env.PORT || 3000;
// Second arg in listen() is -> callback function, which is called once server starts listening(init)
app.listen(port, () => console.log(`Listening on port ${port}...`));

//----------------------------------------------------------------------------------------------------------------------------

//FOOT NOTES:
// Route parameters map accessed via {req.params}       -> Essential/Required params in url-> {/:id/:year}
// Query String parameters map accessed via {req.query} -> Additional data in url for backend services-> {?sortBy=name}
