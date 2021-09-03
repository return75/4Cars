let collisionSound = document.getElementById("collision")
let skipSound = document.getElementById("skip")
let scoreSound = document.getElementById("score")
let backgroundSound = document.getElementById("backgroundSound")

function playScoreSound() {
    scoreSound.play()
}
function pauseScoreSound() {
    scoreSound.pause()
}
function resetScoreSound() {
    scoreSound.currentTime = 0
}
function playBackgroundSound () {
    backgroundSound.volume = 1
    backgroundSound.play()
    backgroundSound.addEventListener('ended', () => {
        backgroundSound.currentTime = 0
        backgroundSound.play()
    })
}
function pauseBackgroundSound() {
    backgroundSound.pause()
}
function resetBackgroundSound() {
    backgroundSound.currentTime = 0
}
