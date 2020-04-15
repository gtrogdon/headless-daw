/* Initiates and enables interaction with
 * browser text to speech */

initSpeech = () => {
	const synth = window.speechSynthesis;
	console.log(synth.getVoices());
}

initSpeech();
