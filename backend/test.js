const express = require('express');
const { exec } = require('child_process');
const app = express();
const bodyparser = require('body-parser');

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) =>{
  res.render('editor');
});

app.post('/runcpp', (req, res) => {
  const { code, input } = req.body;
  const fs = require('fs');
  fs.writeFileSync('temp.cpp', code);
  fs.writeFileSync('input.txt', input);

  exec('g++ temp.cpp -o temp && temp < input.txt', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.json({ error: error.message });
      return;
    }

    if (stderr) {
      console.error(`Compiler Error: ${stderr}`);
      res.json({ error: stderr });
      return;
    }

    console.log(`Output: ${stdout}`);
    res.status(200).json({ output: stdout });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
