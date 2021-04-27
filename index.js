var courses = [
    { name: 'english', code: "eee111", id:1 , description: 'french course'},
    { name: 'french',       code: "eee222", id:2 , description: 'english course'},
    { name: 'maths', code: "eee333", id:3 , description: 'maths course'}
];
var students = [
    { name: 'karim', code: "1111111", id:1 },
    { name: 'hany', code: "2222222", id:2},
    { name: 'thomas', code: "3333333", id:3 }
];

const express = require('express');
const app = express();
const Joi = require('joi');
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/web/courses/create', (req, res) => {
    ret = res.sendFile('html/course.html', { root: __dirname });});
app.get('/web/students/create', (req, res) => {
ret = res.sendFile('html/student.html', { root: __dirname });});
app.use(express.static('./html')) 

app.get('/api/courses',(req, res)=>{
    res.send(courses);
});

app.get('/api/students',(req, res)=>{
    res.send(students);
});



app.post('/web/courses/create',(req,res)=> {
    const {error} = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const course = {
        name: req.body.name,
        code: req.body.code,
        id: courses.length + 1,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id',(req, res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("invalid course ID");
    res.send(course);
});

app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send("course not found");
    }

    const { error } = validateCourse(req.body);
    if (error){
        return  res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id',(req,res)=> {
    const course = courses.find(c=> c.id === parseInt(req.params.id));
    if(!course) {
        return res.status(404).send("course not found");
    }
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);

});


app.post('/web/students/create',(req,res)=> {
    const {error} = validateStudent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const student = {
        name: req.body.name,
        code: req.body.code,
        id: students.length + 1,
    };
    students.push(student);
    res.send(student);
});

app.get('/api/students/:id',(req, res)=>{
    const student = students.find(c=> c.id === parseInt(req.params.id));
    if(!student) res.status(404).send("invalid student ID");
    res.send(student);
});

app.put('/api/student/:id', (req,res)=>{
    const student = students.find(c=> c.id === parseInt(req.params.id));
    if(!student) {
        return res.status(404).send("student not found");
    }

    const { error } = validateStudent(req.body);
    if (error){
        return  res.status(400).send(error.details[0].message);
    }
    student.name = req.body.name;
    res.send(student);
});

app.delete('/api/students/:id',(req,res)=> {
    const student = students.find(c=> c.id === parseInt(req.params.id));
    if(!student) {
        return res.status(404).send("student not found");
    }

    const index = students.indexOf(student);
    students.splice(index,1);
    res.send(student);

});


app.get('/',(req, res)=>{
    res.send('welcome !');
});


function  validateCourse(course) {
    const schema  = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[a-zA-Z]{3}\d{3}/).required(),
        description: Joi.string().max(200)
    });
    return  schema.validate(course);
}

function  validateStudent(student) {
    const schema  = Joi.object({
        name: Joi.string().required(),         
        code: Joi.string().length(7).required() 
    });
    return  schema.validate(student);
}

const port= process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}`));