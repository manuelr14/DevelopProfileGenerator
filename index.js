const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs")
const pdf = require('html-pdf')  // npm install -g html-pdf
const htmlGenerator = require("./generateHTML")

options = {
 
  "directory": "/tmp",       // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'
 
  // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
   "height": "8.7in",        // allowed units: mm, cm, in, px
   "width": "9in",      // allowed units: mm, cm, in, px
  "format": "letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
  "orientation": "portrait", // portrait or landscape
  // "zoomFactor": "2.3", // default is 1
  };
 


const data = { };

init();

function init() {
    return inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "What is your Github username"
      },
      {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ["green", "blue", "pink", "red"]
      },

    ]).then(function(Promptresponse){
        data.username = Promptresponse.username;                 
        data.color =Promptresponse.color;                    
        
        const queryURL= `https://api.github.com/users/${data.username}`;
        return axios.get(queryURL);  

    }).then(function(APIresponse){
        
        data.profileimage = APIresponse.data.avatar_url;      
        data.location = APIresponse.data.location;     
        data.url = APIresponse.data.html_url;          
        data.blog = APIresponse.data.blog;         
        data.bio = APIresponse.data.bio;          
        data.name = APIresponse.data.name; 
        data.publicrepos = APIresponse.data.public_repos; 
        data.followers = APIresponse.data.followers;    
        data.stars = APIresponse.data.public_gists; 
        data.following = APIresponse.data.following;
        data.company = APIresponse.data.company;   

        console.log(data);
        
        const htmlinfo = htmlGenerator.generateHTML(data);
        
        fs.writeFile('index.html', htmlinfo , function(err){
            
            if (err) {
               throw err
            } else {
                console.log("Successfully wrote to index.html");

                pdf.create(htmlinfo,options).toFile('./Github-profile.pdf', function(err, res){
                  if(err) throw err;
                  console.log(res)
                })
            }

        })
    });

    
    
};


