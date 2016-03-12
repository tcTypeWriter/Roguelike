function Character() {
    var self = this;

    this.lvl = 0;
    this.expirience = 0;
    this.expForNext = 100;

    this.maxHp = 10;
    this.hp = 10;
    this.damage = 2;
    this.speed = 4;

    this.gold = 0;

    this.heroImg = new Image();
    this.heroImg.src = 'img/heroright.png';
    this.dungeon;
    this.coordinates = {
        x: 50,
        y: 50
    };
    this.getExp = function(exp) {
        self.expirience += exp;
        if (self.expirience >= self.expForNext) {
            self.expirience -= self.expForNext;
            self.lvl++;
        }
    }

    this.direction = {
        up: false,
        down: false,
        right: false,
        left: false
    };
    this.collider = new Collider(this.coordinates, 50, 50);

    this.visitDungeon = function(dungeon) {
        self.dungeon = dungeon;
    }
    this.getLoot = function(loot) {
        if (loot instanceof Coin) {
            self.gold += loot.value;
            return;
        }
        if (loot instanceof HpPotion) {
            self.hp += loot.value;
            return;
        }
    }
    this.canMove = function() {
        var newCoordinates = moveSomething(self.coordinates, self.direction, self.speed);
        var cellCoordinate = {
            x: Math.round((newCoordinates.x) / 50),
            y: Math.round((newCoordinates.y) / 50)
        }

        var cell = self.dungeon.field[cellCoordinate.x][cellCoordinate.y];
        return (cell.passability);
    }
    this.move = function() {
        self.coordinates = moveSomething(self.coordinates, self.direction, self.speed);
        self.collider.coordinates = self.coordinates;
    }
    this.changeDirecion = function() {
        if (self.direction.left) {
            self.direction.left = false;
            if (self.canMove()) {
                return;
            }
            else {
                self.direction.left = true;
            }
        }
        if (self.direction.right) {
            self.direction.right = false;
            if (self.canMove()) {
                return;
            }
            else {
                self.direction.right = true;
            }
        }
        if (self.direction.up) {
            self.direction.up = false;
            if (self.canMove()) {
                return;
            }
            else {
                self.direction.up = true;
            }
        }
        if (self.direction.down) {
            self.direction.down = false;
            if (self.canMove()) {
                return;
            }
            else {
                self.direction.down = true;
            }
        }
    }
}
