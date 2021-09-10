let road = {
    car: null,
    leftLine: null,
    rightLine: null,
    targets: [],
    create: function (car, leftLine, rightLine, targets) {
        let object = Object.create(this)
        object.setCar(car)
        object.setLeftLine(leftLine)
        object.setRightLine(rightLine)
        object.setTargets(targets)
        return object
    },
    setCar: function (car) {
        this.car = car
    },
    getCar: function () {
        return this.car
    },
    setLeftLine: function (leftLine) {
        this.leftLine = leftLine
    },
    setRightLine: function (rightLine) {
        this.rightLine = rightLine
    },
    getTargets () {
        return this.targets
    },
    setTargets (targets) {
        this.targets = targets
    }
}
