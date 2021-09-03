let canvas = document.getElementById('canvas')
let context = canvas.getContext("2d")
let backgroundCanvas = document.querySelector('canvas#background')
let backgroundContext = canvas.getContext("2d")
let width = canvas.width = backgroundCanvas.width = window.innerWidth
let height = canvas.height= backgroundCanvas.height = window.innerHeight


let animationFrame,
    carNumbers = 4,
    gameSpeed = 1,
    roadWidth = 200,
    carToBottomDistance = 100,
    carWidth = 60,
    carHeight = 100,
    roads = [],
    colors = ['#ef0101', '#0150ef', '#0ab333', '#d2c804'],
    targetBallRadius = 25,
    targetSquareWidth = 50,
    keys = ['F', 'G', 'H', 'J', 'K']

let startAnimationFrames = function () {
    clearCanvas()
    drawBackground()
    drawRoads()
    drawCars()
    drawTargets()
    moveTargets()
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
        roundRect(context, item.getCar().getPosition().getX(), item.getCar().getPosition().getY(),
            carWidth / 2 + 10, carHeight / 2 + 10, 5 )
        roundRect(context, item.getCar().getPosition().getX(), item.getCar().getPosition().getY(),
            carWidth / 2, carHeight / 2, 5, item.getCar().color )
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
    roads.forEach(item => {
        item.targets.forEach(target => {
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
    roundRect(context, position.getX(), position.getY(), targetSquareWidth, targetSquareWidth, 5, color)
    roundRect(context, position.getX(), position.getY(), targetSquareWidth - 15, targetSquareWidth - 15, 5, 'white')
    roundRect(context, position.getX(), position.getY(), targetSquareWidth - 30, targetSquareWidth - 30, 5, color)
}

function drawTargets () {
    roads.forEach(item => {
        item.targets.forEach(target => {
            target.type === 'ball' && drawBall(target.getPosition(), target.getColor())
            target.type === 'square' && drawSquare(target.getPosition(), target.getColor())
        })
    })
}


keyboardHandling()
createTarget()

createRoads()
startAnimationFrames()
playBackgroundSound();

