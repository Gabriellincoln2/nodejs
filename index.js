const express = require('express');
const server = express();
server.use(express.json());


const projects = [];
//Middlewares para verificar o método e o tempo de resposta este é considerado 
//um Middleware Global.
server.use((req,res, next)=>{
  console.time('Resposta');
  console.log(`Metodo:${req.method}; URL:${req.url}`);
  console.count("Numero de Requisições")
   next();
  
  console.timeEnd('Resposta');
  });

//Middlewares que verifica a existencia do ID 

function checkIdExists(req, res,next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({error:"Project not Exist"})
  }
  return next();
}


  //Retorna os projects

server.get('/projects', (req, res)=>{
  return res.json(projects)
});

  //Cria os projects, sem criar as tasks

server.post('/projects', (req, res)=>{

  const{ id } = req.body;
  const{ title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project); 
  return res.json(projects);
});

  //Edita os projects

server.put('/projects/:id', checkIdExists, (req, res)=>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkIdExists, (req, res)=>{
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  projects.splice(project, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res)=>{
  const{ id } = req.params;
  const{tasks} = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(tasks);
  
  return res.json(projects);
});


server.listen(3000);

