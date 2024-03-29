let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let backgroundCanvas = document.querySelector('canvas#background')
let backgroundContext = canvas.getContext("2d")
let width = canvas.width = backgroundCanvas.width = window.innerWidth
let height = canvas.height= backgroundCanvas.height = window.innerHeight


let animationFrame,
    carsNumber = 4,
    initialGameSpeed = 4,
    gameSpeed = initialGameSpeed,
    score = 0,
    roadWidth = 200,
    carToBottomDistance = 100,
    carWidth = 45,
    carHeight = 75,
    roads = [],
    colors = ['#00aac2', '#d50b39', "#03ce69", '#e8bc01',
        "#0653ea", '#ea6a01', "#ea0176"],
    targetBallRadius = 20,
    targetSquareWidth = 40,
    keys = ['D','F', 'G', 'H', 'J', 'K', 'L'],
    gameEnded = false,
    createTargetIntervals = []

let startAnimationFrames = function () {
    if (gameEnded) {
        return
    }
    clearCanvas()
    drawBackground()
    drawRoads()
    drawTargets()
    moveTargets()
    drawCars()
    checkCarTargetCollision()
    checkIfCarSkipBall()
    removeExitedTargetsFromScreen()
    showScore()
    animationFrame = requestAnimationFrame(startAnimationFrames)
}

function clearCanvas () {
    context.clearRect(0, 0, width, height)
}
function handleKeyboard () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame(startAnimationFrames)
            } else {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
            }
        } else if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame(startAnimationFrames)
            } else {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
            }
        } else if (event.code === 'KeyR') {
            resetGame()
        }
        let keyIndex = keys.indexOf(event.code.slice(-1))
        if (keyIndex !== -1) {
            changeRoadCarDirection(keyIndex)
        }
    }, false)
}

function changeRoadCarDirection (roadIndex) {
    let carPosition = roads[roadIndex].getCar().getPosition()
    if (roads[roadIndex].getCar().getDirection() === 'left') {
        carPosition.setX(carPosition.getX() + roadWidth / 2)
        roads[roadIndex].getCar().setDirection('right')
    } else {
        carPosition.setX(carPosition.getX() - roadWidth / 2)
        roads[roadIndex].getCar().setDirection('left')
    }
}

function drawBackground () {
    backgroundContext.fillStyle = '#064d7d'
    backgroundContext.fillRect(0, 0, window.innerWidth, window.innerHeight)
}
function drawRoads () {
    roads.forEach(item => {
        backgroundContext.beginPath();
        backgroundContext.moveTo(item.leftLine, 0);
        backgroundContext.lineTo(item.leftLine, height);
        backgroundContext.moveTo(item.rightLine, 0);
        backgroundContext.lineTo(item.rightLine, height);
        backgroundContext.strokeStyle = 'white'
        backgroundContext.stroke();
    })
}
function drawRoundedRectangle(context, x, y, width, height, radius = 5, color = 'white', fill = true, stroke = true) {
    context.beginPath();
    context.moveTo(x - width / 2 + radius, y - height / 2);
    context.lineTo(x + width / 2 - radius, y - height / 2);
    context.quadraticCurveTo(x + width / 2 , y - height / 2, x + width / 2, y - height / 2 + radius);
    context.lineTo(x + width / 2, y + height / 2 - radius);
    context.quadraticCurveTo(x + width / 2, y + height / 2, x + width / 2 - radius, y + height / 2);
    context.lineTo(x - width / 2 + radius, y + height / 2);
    context.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height / 2 - radius);
    context.lineTo(x - width / 2, y - height / 2 + radius);
    context.quadraticCurveTo(x - width / 2 , y - height / 2, x - width / 2 + radius, y - height / 2);
    context.closePath();
    if (fill) {
        context.fillStyle = color
        context.fill();
    }
}
function createRoads () {
    let startWidth = width / 2 - carsNumber / 2 * roadWidth
    for (let i = 0; i < carsNumber; i++) {
        let newCar = car.create(vector.create(startWidth + roadWidth * i + roadWidth / 4, height - carToBottomDistance), colors[i])
        let leftLine = startWidth + roadWidth * i
        let rightLine =  startWidth + roadWidth * (i + 1)
        let newRoad = road.create(newCar, leftLine, rightLine, [])
        roads.push(newRoad)
    }
}
function drawCars () {
    roads.forEach(item => {
        let x = item.getCar().getPosition().getX()
        let y = item.getCar().getPosition().getY()
        let color = item.getCar().getColor()

        drawRoundedRectangle(context, x, y,
            carWidth, carHeight, carWidth * .3, color)
        drawRoundedRectangle(context, x, y,
            carWidth * .6, carHeight * .8, carWidth * .2 )
        drawRoundedRectangle(context, x, y,
            carWidth / 4, carWidth / 4 , 0, color)

        // draw car top glass
        context.beginPath()
        context.moveTo(x - carWidth / 8, y - carWidth / 8 )
        context.lineTo(x - carWidth / 8 - 5, y - carWidth / 8 - carWidth * .25);
        context.quadraticCurveTo(x, y - (carWidth / 8 + 5) - 12, x + carWidth / 8 + 5 , y - carWidth / 8 - carWidth * .25)
        context.lineTo(x + carWidth / 8, y - carWidth / 8 );
        context.lineTo(x - carWidth / 8, y - carWidth / 8);
        context.closePath();
        context.fillStyle = '#023d5f'
        context.fill()

        // draw car bottom glass
        context.beginPath()
        context.moveTo(x - carWidth / 8, y + carWidth / 8 )
        context.lineTo(x - carWidth / 8 - 5, y + carWidth / 8 + carWidth * .25);
        context.quadraticCurveTo(x, y + (carWidth / 8 + 5) + 12, x + carWidth / 8 + 5 , y + carWidth / 8 + carWidth * .25)
        context.lineTo(x + carWidth / 8, y + carWidth / 8 );
        context.lineTo(x - carWidth / 8, y + carWidth / 8);
        context.closePath();
        context.fillStyle = '#023d5f'
        context.fill()
    })
}
function createTarget () {
    for (let i = 0; i < carsNumber; i++) {
        setTimeout(() => {
            let interval = setInterval (() => {
                let roadLeftLine = roads[i].leftLine
                let targetType = Math.random() < 0.5 ? 'ball' : 'square'
                let targetPosition = Math.random() < 0.5 ? vector.create(roadLeftLine + roadWidth / 4, -100) : vector.create(roadLeftLine + roadWidth * 3 / 4, -100)
                let newTarget = target.create(targetType, targetPosition, colors[i])
                roads[i].targets.push(newTarget)
            }, 1500)
            createTargetIntervals.push(interval)
        }, i * 1000)
    }
}

function moveTargets () {
    let speedVector = vector.create(0, gameSpeed)
    roads.forEach(road => {
        road.getTargets().forEach(target => {
            target.setPosition(target.getPosition().addTo(speedVector))
        })
    })
}

function drawBall (position, color) {
    context.beginPath()
    context.arc(position.getX(), position.getY(), targetBallRadius, 0, 2 * Math.PI);
    context.fillStyle = color
    context.fill();

    context.beginPath()
    context.arc(position.getX(), position.getY(), targetBallRadius * .625, 0, 2 * Math.PI);
    context.fillStyle = 'white'
    context.fill();

    context.beginPath()
    context.arc(position.getX(), position.getY(), targetBallRadius * .25, 0, 2 * Math.PI);
    context.fillStyle = color
    context.fill();
}

function drawSquare (position, color) {
    drawRoundedRectangle(context, position.getX(), position.getY(), targetSquareWidth, targetSquareWidth, 8, color)
    drawRoundedRectangle(context, position.getX(), position.getY(), targetSquareWidth * .625, targetSquareWidth * .625, 4, 'white')
    drawRoundedRectangle(context, position.getX(), position.getY(), targetSquareWidth * .25, targetSquareWidth * .25, 1, color)
}

function drawTargets () {
    roads.forEach(item => {
        item.targets.forEach(target => {
            target.type === 'ball' && drawBall(target.getPosition(), target.getColor())
            target.type === 'square' && drawSquare(target.getPosition(), target.getColor())
        })
    })
}
function removeExitedTargetsFromScreen () {
    roads.forEach(road => {
        for (let i = road.targets.length - 1; i >= 0; i--) {
            if (road.targets[i].getPosition().getY() > height) {
                road.targets.splice(i, 1)
            }
        }
    })
}
function checkCarTargetCollision () {
    roads.forEach(road => {
        let car = road.getCar()
        road.targets.forEach((target, index) => {
            if (car.getPosition().getX() === target.getPosition().getX() &&
                Math.abs(car.getPosition().getY() - target.getPosition().getY()) < carHeight / 2 + targetBallRadius) {
                if (target.getType() === 'ball') {
                    score++
                    playScoreSound()
                    setGameSpeedBasedOnScore()
                    road.targets.splice(index, 1)
                } else if (target.getType() === 'square') {
                    finishTheGame()
                    playCollisionSound()
                    road.targets.splice(index, 1)
                }
            }
        })
    })
}
function checkIfCarSkipBall () {
    roads.forEach(road => {
        let balls = road.targets.filter(item => item.getType() === 'ball')
        balls.forEach(item => {
            if (item.getPosition().getY() > height - carToBottomDistance + carHeight / 2) {
                finishTheGame()
                playSkipSound()
            }
        })

    })
}

function showScore () {
    document.querySelector('#score').innerHTML = score
}
function setVariablesBasedOnScreen () {
    if (width < carsNumber * roadWidth) {
        roadWidth = (width / carsNumber).toFixed()
        if (carsNumber < 4) {
            carWidth = roadWidth / 3
        } else {
            carWidth = roadWidth / 2.5
        }
        carHeight = 1.6 * carWidth
        targetSquareWidth = carWidth
        targetBallRadius = carWidth / 2
    }
}
function setGameSpeedBasedOnScore () {
     gameSpeed = 5 - 10 / (score + 8)
}
function handleTouch (e) {
    let roadIndex = roads.findIndex(item => item.leftLine < e.touches[0].clientX && item.rightLine > e.touches[0].clientX)
    changeRoadCarDirection(roadIndex)
}
function clearTargetIntervals () {
    createTargetIntervals.map(item => {
        clearInterval(item)
    })
}
function resetGame () {
    score = 0
    roads = []
    gameEnded = false
    gameSpeed = initialGameSpeed
    clearTargetIntervals()
    createRoads()
    createTarget()
    document.querySelector('#end-game').style.display = 'none'
    startAnimationFrames()
}

function finishTheGame () {
    storeScoreInLocalStorage()
    gameEnded = true
    document.querySelector('#final-score').innerHTML = score
    let scores = localStorage.getItem('scores')
    let bestScore = JSON.parse(scores)[carsNumber]
    document.querySelector('#best-score').innerHTML = bestScore
    setTimeout(() => {
        showEndGamePanel()
    }, 2000)
}
function showEndGamePanel () {
    document.querySelector('#end-game').style.display = 'flex'
}
function storeScoreInLocalStorage () {
    let scores = localStorage.getItem('scores') || JSON.stringify({
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
    })
    scores = JSON.parse(scores)
    if (score > scores[carsNumber]) {
        scores[carsNumber] = score
    }
    localStorage.setItem('scores', JSON.stringify(scores))
}
handleKeyboard()

