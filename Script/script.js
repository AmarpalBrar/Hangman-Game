
let selectedWord = '';
let maxWrong = 7;
let wrongGuesses = 0;
let guessedLetters = [];

const letterContainer  = document.getElementById('letter-buttons');
const img = document.getElementById('hangmanImage');
const hintDisplay = document.getElementById('hint'); 
const wordDisplay = document.getElementById('word_display'); 
const popup = document.getElementById('game-popup');
const popupMessage = document.getElementById('popup-message');
const popupImage = document.getElementById('popup-image');

/// audios 
const wrongSound = new Audio('audio/wrong-answer.mp3');
const RightSound = new Audio('audio/right-answer.mp3');
const GameOver = new Audio('audio/game-over.mp3');
const WinGame = new Audio('audio/level-win.mp3');


/* generate keyboard Buttons*/
for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const btn = document.createElement('button');
      btn.textContent = letter;
      btn.className = 'letter-btn';
      btn.addEventListener('click', () => handleLetterClick(letter, btn));
      letterContainer.appendChild(btn);
    }
    function handleLetterClick(letter, button) {
      console.log("You clicked:", letter); // You can replace this with your own logic
      button.disabled = true; // Optional: disable button after clicking
    }
/* end generate Buttons*/



/* fetch data from json file*/
fetch('json/words.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
 .then(data => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedObj = data[randomIndex]; 
    selectedWord = selectedObj.word.toUpperCase();
    hintDisplay.textContent = selectedObj.hint;

    console.log("Selected Word:", selectedWord);
    displayWord();
  })
  .catch(error => {
    console.error("Failed to fetch JSON:", error);
  });

  /* fetch data from json file*/

  
// Handle button click
function handleLetterClick(letter, button) {
  button.disabled = true;

  if (selectedWord.includes(letter)) {

    console.log("test "+ letter);
    guessedLetters.push(letter);
    displayWord();
    RightSound.play();

    if (isWordGuessed()) {
      showPopup('win');
      WinGame.play();
    }
  } else {
    wrongGuesses++;
    wrongSound.currentTime = 0;
    wrongSound.play().catch(error => {
  });

    document.getElementById('incorrectCount').textContent = wrongGuesses;

     /// play sound on wrong letter selection 
   updateHangmanImage();
   if (wrongGuesses >= maxWrong) {
      showPopup('lose'); 
      GameOver.play();
      disableAllButtons();
    }
  }
}

// Display word with correct guesses
function displayWord() {
  let display = '';
  for (let char of selectedWord) {
    display += guessedLetters.includes(char) ? char + ' ' : '_ ';
  }
  wordDisplay.textContent = display.trim();
}

// Check if all letters are guessed
function isWordGuessed() {
  return selectedWord.split('').every(letter => guessedLetters.includes(letter));
}

// applly animation on images //
function updateHangmanImage() {
  if (img) {
    img.src = `images/hangman-${wrongGuesses}.png`;
    $(img).addClass("zoom");

    setTimeout(() => {
      $(img).removeClass("zoom");
    }, 300);
  }
}



///create popup 
const gameResults = {
  win: {
    image: 'images/happy-face.png',
    message: `🎉 Congratulations! You saved the hangman and guessed the word: ${selectedWord}`
    //`🎉<strong>Congratulations!</strong> You saved the hangman and guessed the word: ${selectedWord}`
  },
  lose: {
    image: 'images/lose.png',
    message: () => `💀 Oops...the hangman met his fate! The word was: ${selectedWord}` // dynamic message using function
  }
};

function showPopup(resultType) {
  const result = gameResults[resultType];
  if (result) {
    popupImage.src = result.image;
    popupMessage.textContent = typeof result.message === 'function'
      ? result.message()
      : result.message;
    popup.style.display = 'flex';
  }
}
// end of popup code //


// reset game
function resetGame() {
  // Reset all necessary variables and UI here
  location.reload();
}
// Disable all buttons
function disableAllButtons() {
  document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
}
