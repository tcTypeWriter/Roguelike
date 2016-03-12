function Ball(beginCoords, endCoords) {
    var self = this;
    this.coords = beginCoords;
    this.endCoords = endCoords;
    this.collider = new Collider(this.coords, 9, 9);
    this.isExist = true;

    this.canMove = function (dungeon) {
        var cellCoordinate = {
            x: Math.round(self.coords.x / 53),
            y: Math.round(self.coords.y / 53)
        }
        var cell = dungeon.field[cellCoordinate.x][cellCoordinate.y];
        return (cell.passability);
    }
}
