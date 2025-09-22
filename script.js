const textInput = document.getElementById("text-input");
const speakButton = document.getElementById("speak-button");
const languageSelect = document.getElementById("language-select");
const policeSiren = document.getElementById("police-siren");

// Initialize the Web Speech API
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

utterance.onend = () => {
  policeSiren.pause();
  policeSiren.currentTime = 0;
};

// Register the Service Worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered! Scope:", registration.scope);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}

speakButton.addEventListener("click", () => {
  const textToSpeak = textInput.value;
  if (textToSpeak.trim() !== "") {
    const selectedLanguage = languageSelect.value;

    utterance.text = textToSpeak;
    utterance.lang = selectedLanguage;

    // Play the siren first
    policeSiren.currentTime = 0;
    policeSiren.loop = true;
    policeSiren.play();

    // Then speak the text
    synth.speak(utterance);
  }
});
