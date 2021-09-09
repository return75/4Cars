let collisionSound = document.getElementById("collisionSound")
let skipSound = document.getElementById("skipSound")
let scoreSound = document.getElementById("scoreSound")
let backgroundSound = document.getElementById("backgroundSound")

function playScoreSound() {
    scoreSound.play()
}
function pauseScoreSound() {
    scoreSound.pause()
}
function playCollisionSound() {
    collisionSound.play()
}
function playSkipSound() {
    skipSound.play()
}
function pauseCollisionSound() {
    collisionSound.pause()
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
