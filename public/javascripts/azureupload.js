var api;
$('.upload-btn-images').on('click', function (){
  api = 'images';
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('.upload-btn-face').on('click', function (){
  api = 'face';
  $('#upload-input').click();
  $('.progress-bar').text('0%');
  $('.progress-bar').width('0%');
});

$('.upload-btn-text').on('click', function (){
  api = 'text';
  $('#upload-input').click();
  $('.progress-bar').text('0%');
  $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload?api='+api,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          $('#myModal').modal('show');
          if(api == 'images'){
            document.getElementById("modal-title").innerHTML = "Image Recognition";
            $('#modal-body').html('<img src="' + data + '" id="imagepreview" style="width: 75%" >');
            $('#modal-header').html('<h4>Image uploaded for "Computer Vision" image processing...</h4>');
          };
          if(api == 'face'){
            document.getElementById("modal-title").innerHTML = "Face Recognition";
            $('#modal-body').html('<img src="' + data + '" id="imagepreview" style="width: 75%" >');
            $('#modal-header').html('<h4>Image uploaded for "Computer Vision" face processing...</h4>');
          };
          if(api == 'text'){
            document.getElementById("modal-title").innerHTML = "Text Recognition";
            $('#modal-body').html('<img src="' + data + '" id="imagepreview" style="width: 75%" >');
            $('#modal-header').html('<h4>Image uploaded for "Computer Vision" text processing...</h4>');
          }
      },

      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Upload Complete');
            }

          }

        }, false);
        return xhr;
      }
    });

  }
});
