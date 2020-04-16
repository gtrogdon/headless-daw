/* Initiates and enables interaction with
 * browser text to speech */

//Asynchronously wait for the voices to be ready.
setSpeech = () => {
	return new Promise((resolve, reject) => {
		let id;
		id = setInterval(() => {
			if(window.speechSynthesis.getVoices().length !== 0) {
				resolve(window.speechSynthesis.getVoices());
				clearInterval(id);
			}
		});
	}, 10);
}

//Initialize Speech and return voices.
initSpeech = async () => {
	let s = setSpeech();
	let voices = await s.then();
}

utter = (outputText, voiceIndex) => {
	utterance = new SpeechSynthesisUtterance(outputText);
	utterance.voice = window.speechSynthesis.getVoices()[voiceIndex];
	window.speechSynthesis.speak(utterance);
}

