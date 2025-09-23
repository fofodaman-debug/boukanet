const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-button');
const languageSelect = document.getElementById('language-select');
const policeSiren = document.getElementById('police-siren');

// Initialize the Web Speech API
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

utterance.onend = () => {
    policeSiren.pause();
    policeSiren.currentTime = 0;
};

// PWA install button logic
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.hidden = false;
});

installButton.addEventListener('click', () => {
    installButton.hidden = true;
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/boukanet/sw.js')
      .then(registration => {
        console.log('Service Worker registered! Scope:', registration.scope);
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              installingWorker.skipWaiting();
            }
          };
        };
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}

speakButton.addEventListener('click', () => {
    const textToSpeak = textInput.value;
    if (textToSpeak.trim() !== '') {
        const selectedLanguage = languageSelect.value;
        
        utterance.text = textToSpeak;
        utterance.lang = selectedLanguage;

        policeSiren.currentTime = 0;
        policeSiren.loop = true;
        policeSiren.play();

        synth.speak(utterance);
    }
});
