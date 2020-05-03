<h1>Headless DAW</h1>

Project by Shayan Dolikhani, Austin McGee, and Graham Trogdon<br/>
COMP 580 - Spring 2020

<h2>Description</h2>
The Headless DAW is a browser-based digital audio workstation that can be completely navigable with audio cues and keyboard inputs. However, our workstation does also possess a graphical user interface for visual users to take advantage of. Because a DAW has many available controls and active moving parts, we are using a "modal" editing system to ensure the user can control the application completely with the keyboard while also preventing web browser keyboard shortcuts from being overwritten. With this system, we can utilize the same keys for multiple tasks by having the user edit in different "modes." The DAW starts out in "Music Mode," which is where the majority of keyboard input is used to produce sound in the application, whereas "Command Mode" is used to issue commands to the application such is importing a MIDI file, toggling Record/Stop for an instrument track, and so on. These modes are toggled in between through `semicolon` or `;`, as it is on the home row on the keyboard, meaning it does not require much strain to access in order to switch modes. While it is more than possible to control the application through the mouse, even being able to click on the piano keys with the cursor, we encourage you to adopt this keyboard-centric means of navigating the application.<br/>
<br/>
Within the DAW, users can connect their own MIDI keyboards and choose from over 100 different keyboard variations to manipulate. Music mode can be used to cycle through different octave levels and is also equipped with a "sustain note" toggle to establish a consistent sound in a track. Command mode can be used in order to navigate through created tracks or jump straight back into recording. The recording function will record any audio produced in the DAW, but it also can capture the user's microphone audio so you can get creative in implementing your own voice into a track.

<h2>Intended Audience</h2>
The Headless DAW is intended for young, visually-impaired users who don't have access to a simple, free music creation application that can be completely controlled through keyboard and audio interaction. However, this workstation can used by people of all ages and includes a simple GUI if the user wishes to control the DAW with mouse.

<h2>Technologies/Libraries Used</h2>
-WebMIDI API: allowed us to access and manipulate MIDI devices within the application.<br/>
-MediaStream Recording API: used to record separate audio streams from both the user's microphone and instruments in the DAW<br/>
-MultiStreamsMixer.js library: can pass multiple streams (the mic and DAW audio in our case) into a single stream.<br/>
      https://github.com/muaz-khan/MultiStreamsMixer<br/>
-WebAudio-Tinysynth: synthesizer that uses WebMIDI API to create playable MIDI keyboard along with music editing functions.<br/>
      https://github.com/g200kg/webaudio-tinysynth<br/>
-Web Audio API: processes and synthesizes audio in web applications.<br/>
-Web Speech API: (specifically the speechSynthesis interface) used to implement speech services into the application.<br/>



<h2>How to Build/Deploy</h2>
-This digital audio workstation is completely browser-based.<br/>
-Firefox is required for users to take full advantage of the application.<br/>
-The DAW can be accessed at http://silianbraille.github.io/headless-daw<br/>
-Please be sure to allow Firefox access to the microphone. A pop-up should appear when the page first loads.<br/>

<h2>Problems Encountered/Future Work</h2>
