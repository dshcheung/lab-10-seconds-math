// Answer Box Elem
const $answerBox = $('#answer-box')
const $secondsLeft = $('#secondsLeft')
const $num1 = $('#num1')
const $num2 = $('#num2')
const $operatorSymbol = $('#operator-symbol')
const $solution = $('#solution-input')
const $settings = $('#settings')
const $maxNumber = $('#max-number')
const $numberSetting = $('#number-setting')
const $addSetting = $('#add-setting')
const $subSetting = $('#sub-setting')
const $multSetting = $('#mult-setting')
const $powerSetting = $('#power-setting')

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
const OPERATOR_SYMBOL = {
  add: '+',
  sub: '-',
  mult: '*'
}
const REWARD_POINTS = {
  add: 1,
  sub: 2,
  mult: 5
}

// Time
let clockInterval, prevTime, timeLeft

// Points & Question & Answer
let points, answer, num1, num2, operator

// Settings
let settings = {
  maxNum: 10,
  operators: {
    add: true,
    sub: false,
    mult: false
  }
}

const gameOver = () => {
  clearInterval(clockInterval)

  $answerBox.hide()

  $score.text(points)
  $gameOverBox.show()
}

const restart = () => {
  clockInterval = null
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

const generateRandomOperator = () => {
  const availableOperators = Object.keys(settings.operators)
  const enabledOperators = availableOperators.filter(key => settings.operators[key])

  return enabledOperators[generateRandomInt(enabledOperators.length - 0.01)]
}

const generateEquation = () => {
  num1 = generateRandomInt(settings.maxNum)
  num2 = generateRandomInt(settings.maxNum)
  operator = generateRandomOperator()

  const symbol = OPERATOR_SYMBOL[operator]
  switch (symbol) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      answer = num1 - num2
      break
    case '*':
      answer = num1 * num2
      break
  }

  $num1.text(num1)
  $num2.text(num2)
  $operatorSymbol.text(symbol)
}

const handleSettingsChange = () => {
  settings = {
    maxNum: Number($numberSetting.val()),
    operators: {
      add: $addSetting.is(':checked'),
      sub: $subSetting.is(':checked'),
      mult: $multSetting.is(':checked'),
      power: $powerSetting.is(':checked')
    }
  }

  $maxNumber.text(settings.maxNum)
  generateEquation()
}

const handleInput = () => {
  if (!clockInterval) startClock()

  if (Number($solution.val()) === answer) {
    points += REWARD_POINTS[operator]
    timeLeft += REWARD_MS
    $solution.val('').removeClass('error')
    generateEquation()
  } else {
    $solution.addClass('error')
  }
}

const init = () => {
  $settings.on('input', handleSettingsChange)
  $solution.on('input', handleInput)
  $restartButton.on('click', restart)

  restart()
}

init()
