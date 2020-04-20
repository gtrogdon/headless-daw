/* Controls keyboard input interpretation
 * as well as implements and sets the keybindings
 * that control the program */

//When a key is pressed, figure out which sound should
//be played. Set the "shot" button in the bottom left 
//hand corner to the current note.
KeyIn = (e) => {
	if(!inCommandMode) {
		curNote=e.note[1]+curOct*12;
		document.getElementById("shot").innerHTML=curNote;
		if(e.note[0]) {
			if(inRecordMode) addNote(curNote);
			synth.send([0x90+curMidi,curNote,100]);
		} else {
			if(inRecordMode) endNote(curNote);
			synth.send([0x80+curMidi,curNote,0]);
		}
		if(curMidi==9){
			let w=synth.drummap[curNote-35];
			//ViewParam(w);
		}
	}
}

//Keybindings for normal mode/music mode.
const normalEvents = {
	"Shift":(e) => {
		//Sustain on Shift
		document.getElementById("sus").checked=true;
		Sustain(true);
	}, ";":(e) => {
		utter("Command Mode", voiceIndex);
		inCommandMode=true;
	}, "ArrowUp":(e) => {
		e.preventDefault();
		//Ascend octaves on up arrow in normal/music mode.
		const octs = [-2, -1, 0, 1, 2];
		curOct=octs[(octs.indexOf(curOct)+1)%octs.length];
	}, "ArrowDown":(e) => {
		e.preventDefault();
		//Descend octaves on down arrow in normal/music mode.
		const octs = [2, 1, 0, -1, -2];
		curOct=octs[(octs.indexOf(curOct)+1)%octs.length];
	}
}

//Keybindings for command mode
const commandEvents = {
	";":(e) => {
		utter("Music Mode", voiceIndex);
		inCommandMode=false;
	}, "v":(e) => {
		voiceIndex=(voiceIndex+1)%(window.speechSynthesis.getVoices().length);
		utter("Changed voice", voiceIndex);
	}, "o":(e) => {
		utter("Open Midi File", voiceIndex);
		openMidiFile();
	}, "r":(e) => {
		//Toggle instrument recording in command modr
		if(document.querySelector(".stop2").disabled) {
			utter("Begin Recording Instruments", voiceIndex);
			inRecordMode = true;
			document.querySelector(".record2").click();
			inCommandMode=false;
		} else {
			utter("Stop Instrument Recording", voiceIndex);
			inRecordMode = false;
			document.querySelector(".stop2").click();
			inCommandMode=true;
		}
	}, "j":(e) => {
		changeTrackUp();
	}, "k":(e) => {
		changeTrackDown();
	}, "c":(e) => {
		createTrack();
	}, "x":(e) => {
		utter("Exporting Song", voiceIndex);
		exportSong();
	}
}

//Bind the handlers to event types.
BindKeys = () => {
	//Keydown events
	document.addEventListener("keydown", (e) => {
		if(!inCommandMode) {
			if(e.key in normalEvents) normalEvents[e.key](e);
		} else {
			if(e.key in commandEvents) commandEvents[e.key](e);
		}
	});
	document.addEventListener("keyup", (e) => {
		if(e.keyCode==16){
			document.getElementById("sus").checked=false;
			Sustain(false);
		}
	});
}
