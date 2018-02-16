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
  var blobService = azure.createBlobService();
  var form = new multiparty.Form();
  form.on('part', function(part) {
      if (part.filename) {

          var size = part.byteCount - part.byteOffset;
          var name = uuidv1();

          blobService.createBlockBlobFromStream('images', name, part, size, function(error, result, response) {
              if (error) {
                  console.log(error);
                  res.send(error);
              }else{
                    // Create a SAS token that expires in 24 hours
                    // Set start time to five minutes ago to avoid clock skew.
                    var startDate = new Date();
                    startDate.setMinutes(startDate.getMinutes() - 5);
                    var expiryDate = new Date(startDate);
                    expiryDate.setMinutes(startDate.getMinutes() + 1440); //24 Hours from now

                    var permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.READ;

                    var sharedAccessPolicy = {
                        AccessPolicy: {
                            Permissions: permissions,
                            Start: startDate,
                            Expiry: expiryDate
                        }
                    };
                    
                    var sasToken = blobService.generateSharedAccessSignature(result.container, result.name, sharedAccessPolicy);
                    var uri = blobService.getUrl(result.container, result.name, sasToken, true);

                    res.send(uri);
              };
          });
      } else {
          form.handlePart(part);
      }
  });
  form.parse(req);
});

//var server = app.listen(80, function(){
//  console.log('Server listening on port 80');
//});

module.exports = app;
