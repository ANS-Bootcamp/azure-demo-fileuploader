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

        blobService.createBlockBlobFromStream('images', name, part, size, options, function(error, result, response) {
            if (error) {
                console.log("Blob Error");
                console.log(error);
                res.send(error);
            }else{
                console.log(result)
            }
        });
    };
  });


  form.on('close', function() {
    storageAccount = process.env.AZURE_STORAGE_ACCOUNT;
    uri = "https://"+storageAccount+".blob.core.windows.net/images/"+name;
    function sendUri(){
        res.send(uri);
    };
    setTimeout(sendUri, 500);
  }); 

  
  form.parse(req);
});

module.exports = app;
