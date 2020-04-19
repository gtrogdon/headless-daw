Project by Shayan Dolikhani, Austin McGee, and Graham Trogdon

Demo located at http://silianbraille.github.io/headless-daw

<h1>GUIDE</h1>
<h2>Introduction</h2>
Within computing, an application that is said to be "headless" is one that does not possess a graphical user interface. Our "headless DAW," or headless digital audio workstation, is actually a misnomer, as it contains such an interface for the sake of providing feedback to our more visual users, but this feature is not necessary for our application to work as intended.
The goal of the DAW, and the reason for its name, is the for it to be entirely audio and keyboard driven, requiring no need to see the screen in order to navigate around the program. Because a digital audio workstation has many options while working within it, it is the case that there was a need to be creative when designing keyboard shortcuts, especially since the web browser already has many predefined shortcuts already that it would be irresponsible to attempt to overwrite.
With this in mind, we are using a "modal" editing system, where we can utilize the same keys for multiple tasks by having the user edit in different "modes." The DAW starts out in "Music Mode," which is where the majority of keyboard input is used to produce sound in the application, whereas "Command Mode" is used to issue commands to the application such is importing a MIDI file, toggling Record/Stop for an instrument track, and so on.
These modes are toggled in between through `semicolon` or `;`, as it is on the home row on the keyboard, meaning it does not require much strain to access in order to switch modes.
While it is more than possible to control the application through the mouse, even being able to click on the piano keys with the cursor, we encourage you to adopt this keyboard-centric means of navigating the application.

<h2>Keyboard Shortcuts</h2>
<h3>Music Mode</h3>

<h3>Command Mode</h3>
| Key | Usage |
| ------------ | ------------ |
| `;` | Switch to *Music Mode* |
