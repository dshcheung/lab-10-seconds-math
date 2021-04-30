// Answer Box Elem
const $answerBox = $('#answer-box')
const $secondsLeft = $('#secondsLeft')
const $num1 = $('#num1')
const $num2 = $('#num2')
const $solution = $('#solution-input')

// Gameover Box Elem
const $gameOverBox = $('#game-over-box')
const $score = $('#score')
const $restartButton = $('#restart-btn')

// Default
const INIT_SECONDS = 10
const INIT_MS = INIT_SECONDS * 1000
const REWARD_SECONDS = 10
const REWARD_MS = REWARD_SECONDS * 1000
const CLOCK_INVOKE_INTERVAL = 100

// Others Global
let clockInterval, prevTime, timeLeft
let points, answer, num1, num2

const gameOver = () => {
  clearInterval(clockInterval)

  $answerBox.hide()

  $score.text(points)
  $gameOverBox.show()
}

const restart = () => {
  points = 0
  $score.text('')
  $gameOverBox.hide()

  generateEquation()
  $secondsLeft.text(10)
  $solution.val('')
  $answerBox.show()
}

const updateSecondsLeft = () => {
  const currTime = new Date()
  const timeDiff = currTime.getTime() - prevTime.getTime()
  timeLeft = (timeLeft - timeDiff)

  if (timeLeft <= 0) gameOver()

  $secondsLeft.text((timeLeft / 1000).toFixed(1))
  prevTime = currTime
}

const startClock = () => {
  prevTime = new Date()
  timeLeft = INIT_MS
  clockInterval = setInterval(updateSecondsLeft, CLOCK_INVOKE_INTERVAL)
}

const generateRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const generateEquation = () => {
  num1 = generateRandomInt(10)
  num2 = generateRandomInt(10)
  answer = num1 + num2

  $num1.text(num1)
  $num2.text(num2)
}

const handleInput = () => {
  if (!clockInterval) startClock()

  if (Number($solution.val()) === answer) {
    points += 5
    timeLeft += REWARD_MS
    $solution.val('').removeClass('error')
    generateEquation()
  } else {
    $solution.addClass('error')
  }
}

const init = () => {
  $solution.on('input', handleInput)
  $restartButton.on('click', restart)

  restart()
}

init()
