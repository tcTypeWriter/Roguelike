function Dungeon() {
    var self = this;
    this.field = [];
    this.monsters = [];
    this.heroBalls = [];
    this.enemyBalls = [];
    this.loot = [];

    this.spawnMonster = function() {
        var x = random(100, 800);
        var y = random(100, 400);
        
        var monster = new Monster(10, 30, 10, {
            x: x,
            y: y
        }, self, 1, 50, "img/monsters/bat.png");
        self.monsters.push(monster);
    }

    var monster = new Monster(100, 110, 10, {
        x: 300,
        y: 250
    }, self, 0, 100, "img/monsters/bat.png");
    var monster1 = new Monster(10, 30, 10, {
        x: 500,
        y: 250
    }, self, 1, 50, "img/monsters/bat.png");
    var monster2 = new Monster(10, 30, 10, {
        x: 400,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    var monster3 = new Monster(10, 30, 10, {
        x: 450,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    var monster4 = new Monster(10, 30, 10, {
        x: 500,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    var monster5 = new Monster(10, 30, 10, {
        x: 550,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    var monster6 = new Monster(10, 30, 10, {
        x: 600,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    var monster7 = new Monster(10, 30, 10, {
        x: 650,
        y: 150
    }, self, 1, 50, "img/monsters/bat.png");
    self.monsters.push(monster);
    self.monsters.push(monster1);
    self.monsters.push(monster2);
    self.monsters.push(monster3);
    self.monsters.push(monster4);
    self.monsters.push(monster5);
    self.monsters.push(monster6);
    self.monsters.push(monster7);

    for (var i = 0; i < field.width / 50; i++) {
        this.field[i] = [];
        for (var j = 0; j < field.height / 50; j++) {
            if (i == 0 || j == 0 || i + 2 > field.width / 50 || j + 2 > field.height / 50) {
                this.field[i][j] = new Cell({
                    x: i * 50,
                    y: j * 50
                }, "wall", false);
            } else {
                var num = random(0, 10);
                switch (num) {
                    //case 0:
                    //    this.field[i][j] = new Cell({
                    //        x: i * 50,
                    //        y: j * 50
                    //    }, "block", true);
                    //    break;
                    //case 1:
                    //this.field[i][j] = new Cell({
                    //    x: i * 50,
                    //    y: j * 50
                    //}, "wall", false);
                    //break;
                    default:
                        this.field[i][j] = new Cell({
                            x: i * 50,
                            y: j * 50
                        }, "block1", true);
                        break;
                }
            }
        }
    }
    this.field[0][5] = new Cell({
        x: 0,
        y: 5 * 50
    }, "door", false);
}