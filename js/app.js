let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let backgroundCanvas = document.querySelector('canvas#background')
let backgroundContext = canvas.getContext("2d")
let width = canvas.width = backgroundCanvas.width = window.innerWidth
let height = canvas.height= backgroundCanvas.height = window.innerHeight


let animationFrame,
    carNumbers = 4,
    gameSpeed = 1,
    score = 0,
    heart = 3,
    roadWidth = 200,
    carToBottomDistance = 100,
    carWidth = 45,
    carHeight = 75,
    roads = [],
    colors = ['#ef0101', '#0150ef', '#0ab333', '#d2c804'],
    targetBallRadius = 20,
    targetSquareWidth = 40,
    keys = ['F', 'G', 'H', 'J', 'K']

let startAnimationFrames = function () {
    clearCanvas()
    drawBackground()
    drawRoads()
    drawTargets()
    moveTargets()
    drawCars()
    checkCarTargetCollision()
    removeExitedTargetsFromScreen()
    showScore()
    showHearts()
    if (heart === 0) {
        cancelAnimationFrame(animationFrame)
        return
    }
    animationFrame = requestAnimationFrame(startAnimationFrames)
}

function clearCanvas () {
    context.clearRect(0, 0, width, height)
}
function keyboardHandling () {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            if (!animationFrame) {
                requestAnimationFrame(startAnimationFrames)
            } else {
                cancelAnimationFrame(animationFrame)
                animationFrame = null
            }
        }
        let keyIndex = keys.indexOf(event.code.slice(-1))
        if (keyIndex !== -1) {
            let position = roads[keyIndex].getCar().getPosition()
            if (roads[keyIndex].getCar().getDirection() === 'left') {
                position.setX(position.getX() + roadWidth / 2)
                roads[keyIndex].getCar().setDirection('right')
            } else {
                position.setX(position.getX() - roadWidth / 2)
                roads[keyIndex].getCar().setDirection('left')
            }
        }
    }, false)
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

function roundRect(context, x, y, width, height, radius = 5, color = 'white', fill = true, stroke = true) {

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
    let startWidth = width / 2 - carNumbers / 2 * roadWidth
    for (let i = 0; i < carNumbers; i++) {
        let newCar = car.create(vector.create(startWidth + roadWidth * i + roadWidth / 4, height - carToBottomDistance), colors[i])
        let leftLine = startWidth + roadWidth * i
        let rightLine =  startWidth + roadWidth * (i + 1)
        let newRoad = road.create(newCar, leftLine, rightLine)
        roads.push(newRoad)
    }
}
function drawCars () {
    roads.forEach(item => {
        let x = item.getCar().getPosition().getX()
        let y = item.getCar().getPosition().getY()
        let color = item.getCar().color

        roundRect(context, x, y,
            carWidth, carHeight, 15, color)
        roundRect(context, x, y,
            carWidth - 15, carHeight - 15, 10 )
        roundRect(context, x, y,
            carWidth / 4, carWidth / 4 , 0, color)

        // draw car top glass
        context.beginPath()
        context.moveTo(x - carWidth / 8, y - carWidth / 8 )
        context.lineTo(x - carWidth / 8 - 5, y - carWidth / 8 - 10);
        context.quadraticCurveTo(x, y - (carWidth / 8 + 5) - 12, x + carWidth / 8 + 5 , y - (carWidth / 8 + 5) - 5)
        context.lineTo(x + carWidth / 8, y - carWidth / 8 );
        context.lineTo(x - carWidth / 8, y - carWidth / 8);
        context.closePath();
        context.fillStyle = '#023d5f'
        context.fill()

        // draw car bottom glass
        context.beginPath()
        context.moveTo(x - carWidth / 8, y + carWidth / 8 )
        context.lineTo(x - carWidth / 8 - 5, y + carWidth / 8 + 10);
        context.quadraticCurveTo(x, y + (carWidth / 8 + 5) + 12, x + carWidth / 8 + 5 , y + (carWidth / 8 + 5) + 5)
        context.lineTo(x + carWidth / 8, y + carWidth / 8 );
        context.lineTo(x - carWidth / 8, y + carWidth / 8);
        context.closePath();
        context.fillStyle = '#023d5f'
        context.fill()
    })
}
function createTarget () {
    setInterval (() => {
        let roadLeftLine = roads[0].leftLine
        let targetType = Math.random() < 0.5 ? 'ball' : 'square'
        let targetPosition = Math.random() < 0.5 ? vector.create(roadLeftLine + roadWidth / 4, -100) : vector.create(roadLeftLine + roadWidth * 3 / 4, -100)
        let newTarget = target.create(targetType, targetPosition, colors[0])
        roads[0].targets.push(newTarget)
    }, 2000)

    setInterval (() => {
        let roadLeftLine = roads[1].leftLine
        let targetType = Math.random() < 0.5 ? 'ball' : 'square'
        let targetPosition = Math.random() < 0.5 ? vector.create(roadLeftLine + roadWidth / 4, -100) : vector.create(roadLeftLine + roadWidth * 3 / 4, -100)
        let newTarget = target.create(targetType, targetPosition, colors[1])
        roads[1].targets.push(newTarget)
    }, 2000)

    setInterval (() => {
        let roadLeftLine = roads[2].leftLine
        let targetType = Math.random() < 0.5 ? 'ball' : 'square'
        let targetPosition = Math.random() < 0.5 ? vector.create(roadLeftLine + roadWidth / 4, -100) : vector.create(roadLeftLine + roadWidth * 3 / 4, -100)
        let newTarget = target.create(targetType, targetPosition, colors[2])
        roads[2].targets.push(newTarget)
    }, 2000)

    setInterval (() => {
        let roadLeftLine = roads[3].leftLine
        let targetType = Math.random() < 0.5 ? 'ball' : 'square'
        let targetPosition = Math.random() < 0.5 ? vector.create(roadLeftLine + roadWidth / 4, -100) : vector.create(roadLeftLine + roadWidth * 3 / 4, -100)
        let newTarget = target.create(targetType, targetPosition, colors[3])
        roads[3].targets.push(newTarget)
    }, 2000)
}

function moveTargets () {
    roads.forEach(road => {
        road.targets.forEach(target => {
            let speedVector = vector.create(0, gameSpeed)
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
    context.arc(position.getX(), position.getY(), targetBallRadius - 7.5, 0, 2 * Math.PI);
    context.fillStyle = 'white'
    context.fill();

    context.beginPath()
    context.arc(position.getX(), position.getY(), targetBallRadius - 15, 0, 2 * Math.PI);
    context.fillStyle = color
    context.fill();
}

function drawSquare (position, color) {
    roundRect(context, position.getX(), position.getY(), targetSquareWidth, targetSquareWidth, 8, color)
    roundRect(context, position.getX(), position.getY(), targetSquareWidth - 15, targetSquareWidth - 15, 8, 'white')
    roundRect(context, position.getX(), position.getY(), targetSquareWidth - 30, targetSquareWidth - 30, 3, color)
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
                    road.targets.splice(index, 1)
                } else if (target.getType() === 'square') {
                    heart--
                    playCollisionSound()
                    road.targets.splice(index, 1)
                }
            }
        })
    })
}
function showScore () {
    document.querySelector('#score').innerHTML = score
}
function showHearts () {
    let hearts = '&hearts; &nbsp;'.repeat(heart)
    document.querySelector('#heart').innerHTML = hearts
}
keyboardHandling()
createTarget()

createRoads()
startAnimationFrames()
playBackgroundSound();
