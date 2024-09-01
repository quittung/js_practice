let audioContext;
let analyser;
let frequencyData;
let source;
let bufferAnalyser;
let emptyArray;
let audioPlaying = false;

async function handleButtonClick() {
  // Setup audio
  // await initAudio("audio/yougotmail.mp3");
  await initAudio("audio/sin_4.wav");

  // Print some audio info to the bottom of the page
  printInfo();

  // Start audio and draw the spectrum
  playAudio();
  drawSpectrum();
}

function printInfo() {
  const infoDiv = document.getElementById("audioInfo");

  const sampleRate = audioContext.sampleRate;
  const fftSize = analyser.fftSize;
  const binSize = sampleRate / analyser.fftSize;

  infoDiv.innerHTML = "";
  infoDiv.innerHTML += "Audio sample rate: " + sampleRate + " Hz <br/>";
  infoDiv.innerHTML += "FFT samples: " + fftSize + "<br/>";
  infoDiv.innerHTML += "Max FFT frequency: " + sampleRate / 2 + " Hz <br/>";
  infoDiv.innerHTML +=
    "Number of frequency bins: " + analyser.frequencyBinCount + "<br/>";
  infoDiv.innerHTML +=
    "Frequency bin width: " + sampleRate / fftSize + " Hz <br/>";
}

async function initAudio(url) {
  // Get audio data
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Decode audio
  audioContext = new window.AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  bufferAnalyser = arrayBuffer;

  // Create AnalyserNode
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048 * 8;
  analyser.smoothingTimeConstant = 0.8;

  // Initialize the frequency data array
  frequencyData = new Uint8Array(analyser.frequencyBinCount);
  emptyArray = new Uint8Array(analyser.frequencyBinCount);

  // Pipe audio through analyser to output
  source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(analyser);

  source.addEventListener("ended", () => {
    audioPlaying = false;
  });

  analyser.connect(audioContext.destination);
}

function playAudio() {
  source.start();
  audioPlaying = true;
}

function drawSpectrum() {
  // Canvas init
  const canvas = document.getElementById("fftCanvas");
  const canvasContext = canvas.getContext("2d");
  // Request that the browser calls the drawSpectrum function again when it redraws the screen
  if (audioPlaying) {
    requestAnimationFrame(drawSpectrum);
  } else {
    // clear the canvas
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  let freqArray = Array.from(frequencyData);
  let maxIndex = freqArray.indexOf(Math.max(...frequencyData));
  let maxFreq = (audioContext.sampleRate / analyser.fftSize) * (maxIndex + 0.5);

  let frequencyDiv = document.getElementById("frequencyInfo");
  frequencyDiv.innerHTML = "";
  frequencyDiv.innerHTML += "Max value: " + Math.max(...freqArray) + "<br/>";
  frequencyDiv.innerHTML += "Max index: " + maxIndex + "<br/>";
  frequencyDiv.innerHTML +=
    "Value at max index: " + freqArray[maxIndex] + "<br/>";
  frequencyDiv.innerHTML += "Frequency played: " + maxFreq + "<br/>";

  // Make sure the analyser and frequency data are initialized
  if (!analyser || !frequencyData) {
    console.log("Analyser and frequency data are not initialized");

    return;
  }

  // Get the frequency data from the analyser
  analyser.getByteFrequencyData(frequencyData);

  // Prepare the canvas for drawing

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the width of each bar
  const barWidth = canvas.width / analyser.frequencyBinCount;

  // Draw the spectrum
  let barHeight;
  let x = 0;
  // Go through each frequency bin
  for (let i = 0; i < analyser.frequencyBinCount; i++) {
    barHeight = frequencyData[i];

    // Draw a bar with a height corresponding to 'loudness' of the frequency
    canvasContext.fillStyle = "rgb(255,50,50)";
    canvasContext.fillRect(
      x, // start x
      canvas.height - barHeight, // start y
      1, // move x
      barHeight // move y
    );

    // Move the drawing position to the right
    x += barWidth;
  }
}

// Attach the initialization function to a button click
document.getElementById("startButton").addEventListener("click", () => {
  handleButtonClick(); // Start audio processing when the button is clicked
});
