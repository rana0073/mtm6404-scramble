/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

const WORDS = ["banana", "react", "puzzle", "window", "coding", "button", "player", "object", "string", "jumble"];
const MAX_STRIKES = 3;
const MAX_PASSES = 3;

function App() {
  const [wordsLeft, setWordsLeft] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [guess, setGuess] = useState('');
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(MAX_PASSES);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("scrambleGame");
    if (saved) {
      const data = JSON.parse(saved);
      setWordsLeft(data.wordsLeft);
      setCurrentWord(data.currentWord);
      setScrambledWord(data.scrambledWord);
      setPoints(data.points);
      setStrikes(data.strikes);
      setPasses(data.passes);
      setGameOver(data.gameOver);
    } else {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    const data = {
      wordsLeft,
      currentWord,
      scrambledWord,
      guess,
      points,
      strikes,
      passes,
      gameOver
    };
    localStorage.setItem("scrambleGame", JSON.stringify(data));
  }, [wordsLeft, currentWord, scrambledWord, points, strikes, passes, gameOver]);

  function startNewGame() {
    const shuffled = shuffle(WORDS);
    const nextWord = shuffled[0];
    setWordsLeft(shuffled.slice(1));
    setCurrentWord(nextWord);
    setScrambledWord(shuffle(nextWord));
    setPoints(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setFeedback('');
    setGuess('');
    setGameOver(false);
  }

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(prev => prev + 1);
      setFeedback("😃 Correct!");
      goToNextWord();
    } else {
      setStrikes(prev => {
        const newStrikes = prev + 1;
        if (newStrikes >= MAX_STRIKES) {
          setGameOver(true);
        }
        return newStrikes;
      });
      setFeedback("😱 Incorrect!");
    }
    setGuess('');
  }

  function goToNextWord() {
    if (wordsLeft.length === 0) {
      setGameOver(true);
      return;
    }
    const next = wordsLeft[0];
    setCurrentWord(next);
    setScrambledWord(shuffle(next));
    setWordsLeft(wordsLeft.slice(1));
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(p => p - 1);
      goToNextWord();
    }
  }

  function handlePlayAgain() {
    localStorage.removeItem("scrambleGame");
    startNewGame();
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Welcome to Scramble Game</h1>

      {!gameOver ? (
        <>
          <h2>🔀Scrambled Word: <span style={{ color: "#007bff" }}>{scrambledWord}</span></h2>
          <form onSubmit={handleGuessSubmit}>
            <input
              type="text"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="Type your guess"
              autoFocus
              required
            />
            <button type="submit">Guess</button>
          </form>
          <button onClick={handlePass} disabled={passes === 0}>
           😶‍🌫️ Pass ({passes} left)
          </button>
          <p>{feedback}</p>
          <p>Points: {points} | Strikes: {strikes}/{MAX_STRIKES}</p>
        </>
      ) : (
        <>
          <h2>🎮 Game Over</h2>
          <p>🎯Your Score: {points}</p>
          <button onClick={handlePlayAgain}>Play Again</button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.body).render(<App />);