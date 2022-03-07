var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
/**@type {HTMLTextAreaElement} */
var inputTxt = document.querySelector('.txt');
/**@type {HTMLSelectElement} */
var voiceSelect = document.querySelector('select');
/**@type {HTMLInputElement} */
var pitch = document.querySelector('#pitch');
/**@type {HTMLDivElement} */
var pitchValue = document.querySelector('.pitch-value');
/**@type {HTMLInputElement} */
var rate = document.querySelector('#rate');
/**@type {HTMLDivElement} */
var rateValue = document.querySelector('.rate-value');

var voices = []; 

function populateVoiceList() {
    voices = synth.getVoices();
    for (let i = 0; i < voices.length; i++) {
        if(!voices[i].voiceURI.includes("English")){
            continue;
            //console.log(voices[i])
        }
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if (voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
    }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

inputForm.onsubmit = function (event) {
    event.preventDefault();
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
        }
    }
    utterThis.pitch = Number(pitch.value);
    utterThis.rate = Number(rate.value);
    synth.speak(utterThis);
    utterThis.onpause = function (event) {
        var char = event.utterance.text.charAt(event.charIndex);
        console.log('Speech paused at character ' + event.charIndex + ' of "' +
            event.utterance.text + '", which is "' + char + '".');
    }
    inputTxt.blur();
}

pitch.onchange = function () {pitchValue.textContent = pitch.value;}
rate.onchange = function () {rateValue.textContent = rate.value;}
window.onclose = function() {synth.cancel();}
document.onreset = function() {synth.cancel();}

inputTxt.onkeyup = function() {
    var textLines = inputTxt.value.split("\n").length
    if(textLines > inputTxt.rows){
        inputTxt.rows = Math.min(textLines,100);
    } else if(textLines < 25) {
        inputTxt.rows = 25;
    }
}