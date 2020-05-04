/* Controls MIDI initialization and
 * key interpretation functions.
 * */

InitMidi = () => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(
      (access) => {
        setTimeout(() => {
		  //List of midi inputs
	      const it=access.inputs;
		  //Append midi input options to dropdown menu.
          it.forEach((input) => {
              let e=document.createElement("option");
              e.innerHTML=input.name;
              document.getElementById("midiport").appendChild(e);
			  //Append input to midiPort array
              midiPort.push(input);
          })

		  //If there are any available midi inputs, select that. Default to first one.
          if(midiPort.length>0)
            SelectMidi(0);
        }, 10);
      },
      () => {
          alert("MIDI is not available.");
      }
  );}
};

//Selects device through Midi Port array
function SelectMidi(n){
//  console.log("Select Port:"+n+":"+(n>=0?midiPort[n].name:"none"));
  document.getElementById("midiport").selectedIndex=n+1;
  if(currentPort>=0)
    midiPort[currentPort].removeEventListener("midimessage",MidiIn);
  	currentPort=n;
  if(currentPort>=0){
	//Run MidiIn function whenever a key is pressed on Midi Keyboard.
    midiPort[currentPort].addEventListener("midimessage", MidiIn);
  }
}

//Parse MIDI keyboard inputs and 
//play appropriate note based on keyboard
//key pressed.
function MidiIn(e){
  if(synth){
    switch(e.data[0]&0xf0){
    case 0x90:
      kb.setNote(e.data[2]?1:0,e.data[1]);
      break;
    case 0x80:
      kb.setNote(0,e.data[1]);
    }
    e.data[1]=e.data[1]+curOct*12;
    synth.send(e.data,0);
  }
}

//Create dialog box for midi files
openMidiFile = () => {
	let input = document.createElement('input');
	input.type = "file";

	input.onchange = e => {
		const file = e.target.files[0];
		if(file["type"] == "audio/midi") {
			utter("Select a MIDI file.");
			loadMidi([file]);
		} else {
			utter("Incorrect file type. Please select a MIDI file.");
		}
	}

	input.click();
}

//Load midi files from the browser.
function loadMidi(files){
  let reader = new FileReader();
  reader.onload=function(e){
    synth.loadMIDI(reader.result);
  }
  reader.readAsArrayBuffer(files[0]);
}

//Add note to the record.
addNote = (note) => {
	noteRecord.push(MidiEvent.noteOn(note));
	activeNotes[note] = Date.now();
}

//End note and calculate duration, adding that to the record.
endNote = (note) => {
	noteRecord.push(MidiEvent.noteOff(note, convertToTicks(activeNotes[note])))
}

//Convert start time of note to number of MIDI ticks the note was sustained.
convertToTicks = (startTime) => {
	return Math.floor((((Date.now()-startTime)/1000)/0.67)*128);
}

//Pull current contents of the record and create track.
createTrack = () => {
	tracks.push(new MidiTrack({ events:noteRecord }));
	utter(`Track created. ${tracks.length} tracks total.`, voiceIndex);
	noteRecord=[];
	if (tracks.length-1) curTrackIndex+=1;
}

delTrack = (trackIndex) => {
	utter(`Track ${curTrackIndex} deleted.`, voiceIndex)
	if(trackIndex) {
		curTrackIndex -= 1;
		return tracks.filter((track) => {
			return track != tracks[trackIndex];
		});
	} else {
		tracks.pop();
	}
}

clearNoteQueue = () => {
	noteRecord = [];
}

changeTracks = (index) => {
	curTrackIndex = index;
}

changeTrackUp = () => {
	if(curTrackIndex < (tracks.length-1)) {
		utter("Next Track");
		curTrackIndex += 1;
	} else {
		utter("Last Track Already Reached.", voiceIndex);
	}
}

changeTrackDown = () => {
	if(curTrackIndex) {
		utter("Previous Track");
		curTrackIndex -= 1;
	} else {
		utter("First Track Already Reached.", voiceIndex)
	}
}

exportSong = () => {
	MidiWriter({ tracks: tracks }).save();
}

reloadRecorder = () => {
	if (navigator.mediaDevices.getUserMedia) {
	  console.log('getUserMedia supported.');

	  const constraints = { audio: true };
	  let chunks = [];

	  let onSuccess = function(stream) {
		//setting up recorder to record streams from both microphone and instruments
		const audioMixer = new MultiStreamsMixer([stream, dest.stream]);
		let mixedstream = audioMixer.getMixedStream();
		visualize(mixedstream);

		const mediaRecorder = useMic ? new MediaRecorder(mixedstream) : new MediaRecorder(dest.stream);

		record.onclick = function() {
		  mediaRecorder.start();
		  console.log(mediaRecorder.state);
		  console.log("recorder started");
		  record.style.background = "red";

		  stop.disabled = false;
		  record.disabled = true;
		}

		stop.onclick = function() {
		  mediaRecorder.stop();
		  console.log(mediaRecorder.state);
		  console.log("recorder stopped");
		  record.style.background = "";
		  record.style.color = "";
		  // mediaRecorder.requestData();

		  stop.disabled = true;
		  record.disabled = false;
		}

		mediaRecorder.onstop = function() {
		  console.log("data available after MediaRecorder.stop() called.");

		  const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

		  const clipContainer = document.createElement('tr');
		  const clipLabel = document.createElement('p');
		  const audio = document.createElement('audio');
		  const deleteButton = document.createElement('button');

		  clipContainer.classList.add('clip');
		  audio.setAttribute('controls', '');
		  deleteButton.textContent = 'Delete';
		  deleteButton.className = 'delete';

		  if(clipName === null) {
			clipLabel.textContent = 'My unnamed clip';
		  } else {
			clipLabel.textContent = clipName;
		  }

		  clipContainer.appendChild(document.createElement('td')).appendChild(audio);
		  clipContainer.appendChild(document.createElement('td')).appendChild(clipLabel);
		  clipContainer.appendChild(document.createElement('td')).appendChild(deleteButton);
		  soundClips.appendChild(clipContainer);

		  audio.controls = true;
		  const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
		  chunks = [];
		  const audioURL = window.URL.createObjectURL(blob);
		  audio.src = audioURL;
		  console.log("recorder stopped");

		  deleteButton.onclick = function(e) {
			let evtTgt = e.target;
			let trackIndex = curTrackIndex;
			for (let i=0; i < evtTgt.parentNode.parentNode.parentNode.children.length; i++) {
				if(evtTgt.parentNode.parentNode.parentNode.children[i] == evtTgt.parentNode.parentNode) {
					let trackIndex = i;
					break;
				}
			}
			delTrack(trackIndex);
			evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
		  }

		  clipLabel.onclick = function() {
			const existingName = clipLabel.textContent;
			const newClipName = prompt('Enter a new name for your sound clip?');
			if(newClipName === null) {
			  clipLabel.textContent = existingName;
			} else {
			  clipLabel.textContent = newClipName;
			}
		  }
		}

		mediaRecorder.ondataavailable = function(e) {
		  chunks.push(e.data);
		}
	  }

	  let onError = function(err) {
		console.log('The following error occured: ' + err);
	  }

	  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

	} else {
	   console.log('getUserMedia not supported on your browser!');
	}
}
