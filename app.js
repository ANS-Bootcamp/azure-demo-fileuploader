var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var azure = require('azure-storage');
var multiparty = require('multiparty');
var uuidv1 = require('uuid/v1');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});


app.post('/upload', function (req, res) {
    
    var api;
    if(req.query.api){
        api = req.query.api;
        console.log("api: "+api);
    }
    
    var uri;
    var name;
    var blobService = azure.createBlobService();
    var form = new multiparty.Form();
    form.on('part', function(part) {
  
      part.on('error', function(error) {
          console.log(error);
          console.log("Part Error");
          res.send(error);
      });
      
      if (part.filename) {
          var size = part.byteCount; // - part.byteOffset;
          var extension = part.filename.split(".")[1].toLowerCase();
          if(extension == "jpg"){ extension = "jpeg" };
          var contentType = "image/"+extension;
          var options = {contentSettings:{contentType:contentType}}
  
          name = uuidv1() + "." + extension;

          //Creates container if not exists
          blobService.createContainerIfNotExists(api, {publicAccessLevel : 'blob'}, function(error) {
            if(!error) {
                blobService.createBlockBlobFromStream(api, name, part, size, options, function(error, result, response) {
                    if (error) {
                        console.log("Blob Error");
                        console.log(error);
                        res.send(error);
                    };
                });
            }
          }); 
      };
    });
  
    form.on('close', function() {
      //Generate image URL
      storageAccount = process.env.AZURE_STORAGE_ACCOUNT;
      uri = "https://"+storageAccount+".blob.core.windows.net/"+api+"/"+name;
      console.log(uri);
      //Function to send URL
      function sendUri(){
          res.send(uri);
      };
      //Delay sending URL for 0.5 seconds to handle blob upload delay.
      setTimeout(sendUri, 750);
    }); 
      
    form.parse(req);
});

module.exports = app;
