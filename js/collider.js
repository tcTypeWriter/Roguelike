function Collider(coordinates, width, height) {
    this.coordinates = coordinates;
    this.width = width;
    this.height = height;
    var self = this;
    this.isIntersect = function (otherCollider) {
        var ay = self.coordinates.y;
        var ax = self.coordinates.x;
        var by = otherCollider.coordinates.y;
        var bx = otherCollider.coordinates.x;
        var ay1 = ay + self.height;
        var ax1 = ax + self.width;
        var by1 = by + otherCollider.height;
        var bx1 = bx + otherCollider.width;
        if (ay > by1 || ay1 < by) {
            return false;
        }
        if (ax1 < bx || ax > bx1) {
            return false;
        }
        return true;
    }

    this.distance = function (otherCollider) {
        var ay = self.coordinates.y;
        var ax = self.coordinates.x;
        var by = otherCollider.coordinates.y;
        var bx = otherCollider.coordinates.x;
        var ay1 = ay + self.height;
        var ax1 = ax + self.width;
        var by1 = by + otherCollider.height;
        var bx1 = bx + otherCollider.width;

        var aleft = ax1 < bx;
        var aright = bx1 < ax1;
        var atop = ay1 < by;
        var abottom = ay > by1;
        var vector = {
            x: 0,
            y: 0
        };

        if (self.isIntersect(otherCollider))
            return 0;
        if (aleft && atop) {
            vector = {
                x: ax1 - bx,
                y: ay1 - by
            }
            return lengthOfVector(vector);
        }
        if (aleft && abottom) {
            vector = {
                x: ax1 - bx,
                y: ay - by1
            }
            return lengthOfVector(vector);
        }
        if (aright && atop) {
            vector = {
                x: ax1 - bx1,
                y: ay - by
            }
            return lengthOfVector(vector);
        }
        if (aright && abottom) {
            vector = {
                x: ax - bx1,
                y: ay - by1
            }
            return lengthOfVector(vector);
        }
        if (atop) {
            return Math.abs(ay1 - by);
        }
        if (abottom) {
            return Math.abs(ay - by1);
        }
        if (aright) {
            return Math.abs(ax1 - bx1);
        }
        if (aleft) {
            return Math.abs(ax - bx);
        }

    }
}
