import {CLICK_LETTER, GET_NEXT_GAME, ERASE_WORD, PASS_GAME, START_TIMER, COUNT_DOWN, STOP_TIMER, START_GAME, END_GAME, UPDATE_TIME_OUT, UPDATE_POINTS} from '../actions/';
import {fourLetterWords} from '../utils';

// INITIALIZATION
const listGames = ['fourLetters'];
const newWordGame = generateWordGame();
const timer = initializeTimer(10, 0.25);
export const initialState = Object.assign({}, {
    currentGame: 'intro',
    timerBetweenGames: 1000,
    timeOut: false,
    over: false,
    points: 0
}, newWordGame, timer);

// ACTIONS
export const appReducer = (state=initialState, action) => {

    if(action.type === UPDATE_POINTS) {
        const points = state.points + action.amount;
        return Object.assign({}, state, {points: points});
    }

    if(action.type === UPDATE_TIME_OUT) {
        return Object.assign({}, state, {timeOut: action.bool});
    }

    if(action.type === END_GAME) {
        return Object.assign({}, state, {currentGame: 'outro'});
    }

    if(action.type === START_GAME) {
        const game = getRandomGame();
        const newWordGame = generateWordGame();
        return Object.assign({}, state, initialState, newWordGame, {currentGame: game});
    }

    if(action.type === COUNT_DOWN) {
        return Object.assign({}, state,
            {timer: {
                timerLength: state.timer.timerLength,
                currentTimer: state.timer.currentTimer - state.timer.timerResolution,
                timerResolution: state.timer.timerResolution,
                timerIsActive: state.timer.timerIsActive
            }});
    }

    if(action.type === START_TIMER) {
        return Object.assign({}, state,
            {timer: {
                timerLength: state.timer.timerLength,
                currentTimer: state.timer.timerLength,
                timerResolution: state.timer.timerResolution,
                timerIsActive: true
            }});
    }

    if(action.type === STOP_TIMER) {
        return Object.assign({}, state,
            {timer: {
                timerLength: state.timer.timerLength,
                currentTimer: 0,
                timerResolution: state.timer.timerResolution,
                timerIsActive: false
            }});
    }

    if(action.type === GET_NEXT_GAME && state.timer.currentTimer > 0) {
        let newGame;
        if (action.gameToReset === 'fourLetters') {
            newGame = generateWordGame();
        }
        const game = getRandomGame();
        return Object.assign({}, state, {currentGame: game, timeOut: false, over: false}, newGame);
    }

    if(action.type === CLICK_LETTER && !state.fourLetters.selectedLetters[action.i]) { // check if letter has been clicked before
        let modifiedSelectedLetters = state.fourLetters.selectedLetters;
        modifiedSelectedLetters[action.i] = 1;
        let isWon = false, isOver = false;
        if (state.fourLetters.proposition.length === state.fourLetters.wordToFind.length - 1) { // game is over
            isOver = true;
            if (fourLetterWords.indexOf(state.fourLetters.proposition + action.letter) > -1) { // is it won?
                isWon = true;
            }
        }
        return Object.assign({}, state, {
            over: isOver,
            fourLetters: {
                wordToFind: state.fourLetters.wordToFind,
                shuffledWord: state.fourLetters.shuffledWord,
                proposition: state.fourLetters.proposition + action.letter,
                selectedLetters: modifiedSelectedLetters,
                won: isWon
            }});
    }

    if(action.type === ERASE_WORD && !state.over && state.fourLetters.proposition.length > 0) {
        return Object.assign({}, state, {
            fourLetters: {
                wordToFind: state.fourLetters.wordToFind,
                shuffledWord: state.fourLetters.shuffledWord,
                proposition: '',
                selectedLetters: [],
                won: state.fourLetters.won
            }});
    }

    if(action.type === PASS_GAME && !state.over) {
        let newGame;
        if (action.gameToReset === 'fourLetters') {
            newGame = generateWordGame();
        }
        const game = getRandomGame();
        return Object.assign({}, state, {currentGame: game}, newGame)
    }

    return state;
};

function initializeTimer(length, resolution) {
    return {
        timer: {
            timerLength: length,
            currentTimer: length,
            timerResolution: resolution,
            timerIsActive: false
        }}
}

function getRandomGame() {
    return listGames[Math.floor(Math.random()*listGames.length)];
}

function generateWordGame() {
    const wordToFind = fourLetterWords[Math.floor(Math.random()*fourLetterWords.length)];
    let selectedLetters = [];
    for (let i=0; i<wordToFind.length; i++) {
        selectedLetters.push(0);
    }
    return {
        fourLetters: {
        wordToFind: wordToFind,
        shuffledWord: breakDownLetters(wordToFind),
        proposition: '',
        selectedLetters: selectedLetters,
        won: false
    }}
}

function breakDownLetters(word) {
    const arrayLetters = [];
    for (let i = 0; i < word.length; i++) {
        arrayLetters.push(word[i]);
    }
    shuffle(arrayLetters);
    return arrayLetters
}

function shuffle(array) {
    let counter = array.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}
