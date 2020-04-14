var context = new window.webkitAudioContext();
var source = null;
var audioBuffer = null;

function stopSound() {
  if (source) {
    source.noteOff(0);
  }
}

function playSound() {
  // source is global so we can call .noteOff() later.
  source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = false;
  source.connect(context.destination);
  source.noteOn(0); // Play immediately.
}

function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    // audioBuffer is global to reuse the decoded audio later.
    audioBuffer = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;
  }, function(e) {
    console.log('Error decoding file', e);
  }); 
}

// User selects file, read it as an ArrayBuffer and pass to the API.
var fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);

// Load file from a URL as an ArrayBuffer.
// Example: loading via xhr2: loadSoundFile('sounds/test.mp3');
function loadSoundFile(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    initSound(this.response); // this.response is an ArrayBuffer.
  };
  xhr.send();
}