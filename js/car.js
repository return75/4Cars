let car = {
    position: null,
    direction: 'left',
    color: null,
    create: function (position, color) {
        let object = Object.create (this)
        object.setColor(color)
        object.setPosition(position)
        return object
    },
    setColor: function (color) {
        this.color = color
    },
    getColor: function (color) {
        return this.color
    },
    setPosition: function (position) {
        this.position = position
    },
    getPosition: function () {
        return this.position
    },
    setDirection: function (direction) {
        this.direction = direction
    },
    getDirection: function () {
        return this.direction
    }

}
