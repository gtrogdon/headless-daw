/* Controls keyboard input interpretation
 * as well as implements and sets the keybindings
 * that control the program */

//When a key is pressed, figure out which sound should
//be played. Set the "shot" button in the bottom left 
//hand corner to the current note.
KeyIn = (e) => {
	curNote=e.note[1]+curOct*12;
	document.getElementById("shot").innerHTML=curNote;
	if(e.note[0])
		synth.send([0x90+curMidi,curNote,100]);
	else
		synth.send([0x80+curMidi,curNote,0]);
	if(curMidi==9){
		let w=synth.drummap[curNote-35];
		//ViewParam(w);
	}
}

//Define controls in an object for quicker access.
const events = {
	"Shift":() => {
		//Sustain on Shift
		document.getElementById("sus").checked=true;
		Sustain(true);
	}, "!":() => {
		//Cycle through octaves on Shift+1
		const octs = [-2, -1, 0, 1, 2];
		curOct=octs[(octs.indexOf(curOct)+1)%octs.length];
	}, "@":() => {
		utter("Hello World", voiceIndex);
	}
}

//Bind the handlers to event types.
BindKeys = () => {
	//Keydown events
	document.addEventListener("keydown", (e) => {
		if(e.key in events) events[e.key]();
	});
	document.addEventListener("keyup", (e) => {
		if(e.keyCode==16){
			document.getElementById("sus").checked=false;
			Sustain(false);
		}
	});
}
