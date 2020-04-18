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
