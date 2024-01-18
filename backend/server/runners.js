const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


exports.cpprunner = (req, res)=>{
    return new Promise((resolve, reject) => {
        try {
            const { code, input, language, filename } = req.body;
            const ID = uuidv4();
        
            fs.writeFileSync(`./code/${ID}.cpp`, code);
            fs.writeFileSync(`./code/${ID}.txt`, input);
            
            exec(`docker run -d -it --mount type=bind,source=${process.cwd()}/code/${ID}.cpp,target=/app/code/temp.cpp --mount type=bind,source=${process.cwd()}/code/${ID}.txt,target=/app/code/input.txt --name ${ID} cpprunner`, (error) => {
              if (error) {
                console.error(`Error: ${error.message}`);
                resolve ({ error: 'Internal Server Error! Please try again later!' });
              }
              let startTime = performance.now();
              exec(`docker exec -i ${ID} sh -c "cd code && g++ -o temp temp.cpp && ./temp < input.txt ;" `, (err, output, stderr) => {
                let executionTime = performance.now() - startTime;
                executionTime = Number(executionTime.toFixed(2))
                if(err){
                  let string =  handleError(err, ID, language)
                  resolve ({error: string});
                }
        
                if (stderr) {
                  console.error(`Compiler Error running: ${stderr}`);
                  resolve ({ error: stderr });
                }
        
                console.log(`Output: ${output}`);
                removeContainer(ID, language);
                resolve ({ output: output, executionTime });
              });
            });
        } catch (err) {
            console.error(`Server error: ${err.message}`);
            resolve ({ error: 'Server error' });
        }
    })
}

exports.crunner = (req, res) =>{
    try {
        const { code, input, language, filename } = req.body;
        const ID = uuidv4();
    
        fs.writeFileSync(`./code/${ID}.c`, code);
        fs.writeFileSync(`./code/${ID}.txt`, input);
    
        exec(`docker run -d -it --mount type=bind,source=${process.cwd()}/code/${ID}.c,target=/app/code/temp.c --mount type=bind,source=${process.cwd()}/code/${ID}.txt,target=/app/code/input.txt --name ${ID} cpprunner`, (error) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error! Please try again later!' });
            return;
          }
    
          exec(`docker exec -i ${ID} sh -c "cd code && gcc -o temp temp.c && ./temp < input.txt ;" `, (err, output, stderr) => {
            if(err){
              let string =  handleError(err, ID, language)
              res.json({error: string})
              return;
            }
    
            if (stderr) {
              console.error(`Compiler Error running: ${stderr}`);
              res.json({ error: stderr });
              return;
            }
    
            console.log(`Output: ${output}`);
            res.status(200).json({ output: output });
            removeContainer(ID, language)
          });
        });
      } catch (err) {
        console.error(`Server error: ${err.message}`);
        res.status(500).json({ error: 'Server error' });
      }
}

exports.pythonrunner = (req, res) => {
    try {
      const { code, input, language, filename } = req.body;
      const ID = uuidv4();
  
      fs.writeFileSync(`./code/${ID}.py`, code);
      fs.writeFileSync(`./code/${ID}.txt`, input);
  
      exec(`docker run -d -it --mount type=bind,source=${process.cwd()}/code/${ID}.py,target=/app/code/temp.py --mount type=bind,source=${process.cwd()}/code/${ID}.txt,target=/app/code/input.txt --name ${ID} pythonrunner`, (error) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).json({ error: 'Internal Server Error! Please try again later!' });
          return;
        }
  
        exec(`docker exec -i ${ID} sh -c "cd code && python temp.py < input.txt ;" `, (err, output, stderr) => {
          if(err){
            let string =  handleError(err, ID, 'py')
            res.json({error: string})
            return;
          }
  
          if (stderr) {
            console.error(`Compiler Error running: ${stderr}`);
            res.json({ error: stderr });
            return;
          }
  
          console.log(`Output: ${output}`);
          res.status(200).json({ output: output });
          removeContainer(ID, 'py')
        });
      });
    } catch (err) {
      console.error(`Server error: ${err.message}`);
      res.status(500).json({ error: 'Server error' });
    }
  };

exports.javarunner = (req, res) => {
    try {
      const { code, input, language, filename } = req.body;
      const ID = uuidv4();
  
      fs.writeFileSync(`./code/${ID}.java`, code);
      fs.writeFileSync(`./code/${ID}.txt`, input);
  
      exec(`docker run -d -it --mount type=bind,source=${process.cwd()}/code/${ID}.java,target=/app/code/Main.java --mount type=bind,source=${process.cwd()}/code/${ID}.txt,target=/app/code/input.txt --name ${ID} javarunner`, (error) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).json({ error: 'Internal Server Error! Please try again later!' });
          return;
        }
  
        exec(`docker exec -i ${ID} sh -c "cd app/code && javac Main.java && java Main < input.txt ;" `, (err, output, stderr) => {
          if(err){
            let string =  handleError(err, ID, language)
            res.json({error: string})
            return;
          }
  
          if (stderr) {
            console.error(`Compiler Error running: ${stderr}`);
            res.json({ error: stderr });
            return;
          }
  
          console.log(`Output: ${output}`);
          res.status(200).json({ output: output });
          removeContainer(ID, language)
        });
      });
    } catch (err) {
      console.error(`Server error: ${err.message}`);
      res.status(500).json({ error: 'Server error' });
    }
  };

function removeContainer(ID, lang){
    exec(`docker stop ${ID}`, () => {
      exec(`docker rm ${ID}`, () => {
        console.log(`Removed Container ${ID}`);
  
        fs.promises.unlink(`./code/${ID}.${lang}`)
          .then(() => console.log(`Deleted ${ID}.${lang}`))
          .catch((deleteErr) => console.error(`Error deleting ${ID}.${lang}: ${deleteErr.message}`));
  
        fs.promises.unlink(`./code/${ID}.txt`)
          .then(() => console.log(`Deleted ${ID}.txt`))
          .catch((deleteErr) => console.error(`Error deleting ${ID}.txt: ${deleteErr.message}`));
      });
    });
  }
  
  function handleError(err, ID, lang){
    let message = err.message.split('\n');
    let s = "";
    for (let i = 1; i < message.length; i++) {
      s += message[i] + "\n";
    }
    console.error(`Error: ${err.message}`);
    removeContainer(ID, lang);
    return s;
  }