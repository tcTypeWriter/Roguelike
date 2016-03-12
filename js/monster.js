function Monster(hp, exp, range, coordinates, dungeon, speed, size, imageSrc) {
    var self = this;
    this.image = new Image();
    this.image.src = imageSrc;

    this.exp = exp;

    this.died = false;
    this.maxHp = hp;
    this.hp = hp;
    this.dungeon = dungeon;
    this.coordinates = {
        x: coordinates.x,
        y: coordinates.y
    };
    this.size = size;
    this.direction = { x: 0, y: 0 }
    this.collider = new Collider(this.coordinates, size, size);


    var groundWidth = self.size / 2;
    var groundCoordinates = {
        x: self.coordinates.x + groundWidth / 2,
        y: self.coordinates.y + (self.size / 10 * 8)
    }

    this.groundCollider = new Collider(groundCoordinates, groundWidth, self.size / 10 * 2);

    this.range = range;
    this.attackSpeed = 1000;
    this.canAttack = true;
    this.balls = [];
    this.canShoot = true;
    this.cdTime = 1000;
    this.speed = speed;

    this.dropLoot = function() {
        var randomNum = random(0, 100);
        if (randomNum >= 0 && randomNum <= 50)
            return new Coin(1, self.coordinates);
        if (randomNum > 50 && randomNum <= 100)
            return new HpPotion(1, self.coordinates);
    }

    this.moveTo = function(coordinates) {
        var vector = {
            x: -(self.coordinates.x - coordinates.x),
            y: -(self.coordinates.y - coordinates.y)
        };
        self.direction = normalise(vector);
        self.coordinates.x += self.direction.x * self.speed;
        self.coordinates.y += self.direction.y * self.speed;

        self.groundCollider.coordinates.x += self.direction.x * self.speed;
        self.groundCollider.coordinates.y += self.direction.y * self.speed;
        if (self.canMove(self.coordinates)) {
            return;
        }
        else {
            self.coordinates.x -= self.direction.x * self.speed;
            self.coordinates.y -= self.direction.y * self.speed;
            self.groundCollider.coordinates.x -= self.direction.x * self.speed;
            self.groundCollider.coordinates.y -= self.direction.y * self.speed;

            self.changeDirecion();
        }
    }
    this.shoot = function(coordinates) {
        if (self.canShoot) {
            var charcoordcanv = (self.coordinates);
            var beginX = charcoordcanv.x + self.size / 2;
            var beginY = charcoordcanv.y + self.size / 2;
            var coordinatesss = { x: beginX, y: beginY };
            var ball = new Ball(coordinatesss, {
                x: coordinates.x,
                y: coordinates.y
            });
            self.balls.push(ball);
            var fps = 1;
            var speed = 3;
            var vector = {
                x: -(beginX - coordinates.x),
                y: -(beginY - coordinates.y)
            };
            var normVector = normalise(vector);
            var timer = setInterval(function() {
                if (!ball.isExist) {
                    clearInterval(timer);
                    return;
                }
                beginX += normVector.x * speed;
                beginY += normVector.y * speed;
                ball.coords = {
                    x: beginX,
                    y: beginY
                };
                ball.collider.coordinates = ball.coords;
                if (!ball.canMove(game.currentDungeon)) {
                    ball.isExist = false;
                }
            }, fps);
            self.canShoot = false;
            setTimeout(function() {
                self.canShoot = true;
            }, self.cdTime);
            return ball;
        }
        return null;
    }

    this.hit = function() {
        self.canAttack = false;
        setTimeout(function() {
            self.canAttack = true;
        }, self.attackSpeed);
    }

    this.getDamage = function(damage) {
        this.hp -= damage;
    }


    this.changeDirecion = function() {
        var x = self.direction.x;
        var y = self.direction.y;

        if (self.direction.x != 0) {
            if (self.direction.y > 0)
                self.direction.y = 1;
            else if (self.direction.y < 0)
                self.direction.y = -1;
            self.direction.x = 0;

            self.coordinates.y += self.direction.y * self.speed;
            self.groundCollider.coordinates.y += self.direction.y * self.speed;

            if (self.canMove(self.coordinates)) {
                return;
            }
            else {
                self.coordinates.y -= self.direction.y * self.speed;
                self.groundCollider.coordinates.y -= self.direction.y * self.speed;
                self.direction.x = x;
                self.direction.y = y;
            }
        }
        if (self.direction.y != 0) {
            self.direction.y = 0;
            if (self.direction.x > 0)
                self.direction.x = 1;
            else if (self.direction.x < 0)
                self.direction.x = -1;

            self.coordinates.x += self.direction.x * self.speed;
            self.groundCollider.coordinates.x += self.direction.x * self.speed;
            if (self.canMove(self.coordinates)) {
                return;
            }
            else {
                self.coordinates.x -= self.direction.x * self.speed;
                self.groundCollider.coordinates.x -= self.direction.x * self.speed;
                self.direction.y = y;
                self.direction.x = x;
            }
        }
    }
    this.canMove = function(coordinates) {
        var cellCoordinate = {
            x: Math.round(coordinates.x / 50),
            y: Math.round(coordinates.y / 50)
        }
        var cell = self.dungeon.field[cellCoordinate.x][cellCoordinate.y];
        for (var i = 0; i < self.dungeon.monsters.length; i++) {
            if (self.dungeon.monsters[i] != self) {
                if (self.groundCollider.isIntersect(self.dungeon.monsters[i].groundCollider)) {
                    return false;
                }
            }
        }
        return !(cell.collider.isIntersect(self.collider) && !cell.passability);
    }
}