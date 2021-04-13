var fs = require('fs');
var monent = require('moment');
const readline = require('readline');

fs.readFile('./setVersionTemplate','utf8', (err,template)=>{

  if(  process.argv.length < 3) {
    throw 'No env info';


  }

  const env = process.argv[2];

  template = template.replace(/{env}/,env);
  template = template.replace(/{datetime}/, monent((new Date())).format('YYYYMMDD_HHmmss'));

  fs.writeFile('./src/app/version.service.ts',template, (err =>{
      if(err){
        throw err;
      }
      console.log('modify version info done');
  }) );


});
