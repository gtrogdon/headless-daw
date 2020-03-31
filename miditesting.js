//On successful access of MIDI device(s)
onMIDISuccess = (midiAccess) => {
    //Assign callbacks to midi device handlers
    midiAccess.inputs.forEach((input) => {
        console.log("Registered", input["manufacturer"], input["name"]);
        input.onmidimessage = getMIDImessage;
    })
}

//On failure to access MIDI devices.
onMIDIFailure = () => {
    console.log("Could not access your MIDI device.");
}

/*Parse midi message data.
Command value of 144 signifies "note on"
command value of 128 signifies "note off"
Note values range from 0-127--lowest to highest. i.e. middle C is 60
Velocity (volume) ranges from 0-127. Softest "note on" is 1.
Finally, command value of 144 with a 0 velocity could be used to signify
a note off rather than a 128 command.*/
getMIDImessage = (midiMessage) => {
    const command = midiMessage.data[0];
    const note = midiMessage.data[1];
    const velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0; 

    (command==144) ? 
        (velocity) ? noteOn(note, velocity) : 
        noteOff(note, velocity) :
        noteOff(note, velocity);
}

noteOn = (note, velocity) => {
    console.log(note, velocity, "on");
    return 0;
}

noteOff = (note, velocity) => {
    console.log(note, velocity, "off");
    return 0;
}
//Check if MIDI is supported in the browser
//NOTE: Web MIDI is only available natively in ***Chrome, Opera, 
//Android WebView***. I installed it for Firefox separately.
if (navigator.requestMIDIAccess) {
    console.log("Web MIDI supported!");
//If supported by browser, then asynchronously request access.
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("Web Midi is not supported...");
}