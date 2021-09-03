let target = {
    type: null,
    color: null,
    position: null,
    create: function (type, position, color) {
        let object = Object.create(this)
        object.setColor(color)
        object.setType(type)
        object.setPosition(position)
        return object
    },
    setPosition: function (position) {
        this.position = position
    },
    getPosition: function (position) {
        return this.position
    },
    setColor: function (color) {
        this.color = color
    },
    setType: function (type) {
        this.type = type
    },
    getType () {
        return this.type
    },
    getColor () {
        return this.color
    }
}
