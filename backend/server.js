const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const controller = require('./server/runners.js')

app.use(bodyParser.text());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://localhost:3000',
  ]
}));

app.get('/', (req, res) => {
  res.render('editor');
});

//const cpprunner = require('./server/runners.js')

app.post('/run/cpp', async (req, res)=>{
  const response = await controller.cpprunner(req, res);
  if(response.output)
  res.json(response);
  else if(response.error)
  res.json(response);
  else
  res.json({error: "Server Error"});
});
app.post('/run/c', controller.crunner);
app.post('/run/python', controller.pythonrunner);
app.post('/run/java', controller.javarunner);


app.post("/submit", async (req, res) => {
  try {
    const response = await controller.cpprunner(req, res);
    if(response.output){
      const output = response.output;
      let accepted = false
      const expectedOutput = 12;
      if (Number(output) === expectedOutput){
        accepted = true
      };
      console.log(accepted)
      res.json({output, executionTime: response.executionTime, accepted});
    }
    else if(response.error)
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Request failed' });
  }
});





const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
