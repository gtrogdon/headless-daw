const record2 = document.querySelector('.record2');
const stop2 = document.querySelector('.stop2');
const soundClips2 = document.querySelector('.sound-clips2');
const mainSection2 = document.querySelector('.main-controls2');


// tinysynth element is selected, and the audio outputted from it is fed to a gain node
// that then feeds sound to both a media recorder receiving input from 
//the mediastream destination node and to the speakers
let synth = document.querySelector('.tinysynth');
let context = synth.getAudioContext();
let speaker = context.destination;
let gain = context.createGain();
synth.setAudioContext(context, gain);
let dest = context.createMediaStreamDestination();
let mediaRecorder2 = new MediaRecorder(dest.stream);
gain.connect(dest);
gain.connect(speaker);


// disable stop button while not recording

stop2.disabled = true;


//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks2 = [];

  let onSuccess = function(stream) {

    record2.onclick = function() {
      mediaRecorder2.start();
      console.log(mediaRecorder2.state);
      console.log("recorder started");
      record2.style.background = "red";

      stop2.disabled = false;
      record2.disabled = true;
    }

    stop2.onclick = function() {
      mediaRecorder2.stop();
      console.log(mediaRecorder2.state);
      console.log("recorder stopped");
      record2.style.background = "";
      record2.style.color = "";
      // mediaRecorder.requestData();

      stop2.disabled = true;
      record2.disabled = false;
    }

    mediaRecorder2.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName2 = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer2 = document.createElement('article');
      const clipLabel2 = document.createElement('p');
      const audio2 = document.createElement('audio');
      const deleteButton2 = document.createElement('button');

      clipContainer2.classList.add('clip');
      audio2.setAttribute('controls', '');
      deleteButton2.textContent = 'Delete';
      deleteButton2.className = 'delete';

      if(clipName2 === null) {
        clipLabel2.textContent = 'My unnamed clip';
      } else {
        clipLabel2.textContent = clipName2;
      }

      clipContainer2.appendChild(audio2);
      clipContainer2.appendChild(clipLabel2);
      clipContainer2.appendChild(deleteButton2);
      soundClips2.appendChild(clipContainer2);

      audio2.controls = true;
      const blob2 = new Blob(chunks2, { 'type' : 'audio/ogg; codecs=opus' });
      chunks2 = [];
      const audioURL2 = window.URL.createObjectURL(blob2);
      audio2.src = audioURL2;
      console.log("recorder stopped");

      deleteButton2.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel2.onclick = function() {
        const existingName2 = clipLabel2.textContent;
        const newClipName2 = prompt('Enter a new name for your sound clip?');
        if(newClipName2 === null) {
          clipLabel2.textContent = existingName2;
        } else {
          clipLabel2.textContent = newClipName2;
        }
      }
    }

    mediaRecorder2.ondataavailable = function(e) {
      chunks2.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}


window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();