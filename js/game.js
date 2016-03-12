function Game(character) {
    var self = this;
    this.currentDungeon;
    this.character = character;
    this.drawWalls = function() {
        for (var i = 0; i < self.currentDungeon.field.length; i++) {
            for (var j = 0; j < self.currentDungeon.field[i].length; j++) {
                canvasCoords = {
                    x: i * 50,
                    y: j * 50
                };
                if (self.currentDungeon.field[i][j].what == "wall") {
                    ctx.drawImage(wall, canvasCoords.x + 1, canvasCoords.y + 1, 50, 50);
                }
                if (self.currentDungeon.field[i][j].what == "door") {
                    ctx.drawImage(door, canvasCoords.x + 1, canvasCoords.y + 1, 50, 50);
                }
            }
        }
    }
    this.drawFloor = function() {
        for (var i = 0; i < self.currentDungeon.field.length; i++) {
            for (var j = 0; j < self.currentDungeon.field[i].length; j++) {
                var canvasCoords = {
                    x: i * 50,
                    y: j * 50
                };
                switch (self.currentDungeon.field[i][j].what) {
                    case "block":
                        ctx.drawImage(block, canvasCoords.x + 1, canvasCoords.y + 1, 50, 50);
                        break;
                    case "block1":
                        ctx.drawImage(block1, canvasCoords.x + 1, canvasCoords.y + 1, 50, 50);
                        break;
                }
            }
        }
    }
    this.drawHero = function() {
        ctx.drawImage(self.character.heroImg, self.character.coordinates.x, self.character.coordinates.y, 50, 50);
        if (self.character.hp >= 0) {
            //ctx.drawImage(hpBar, character.coordinates.x, character.coordinates.y - 10, 50, 7);
            //var percentHP = self.character.hp / self.character.maxHp;
            //var xz = 48 * percentHP;
            //ctx.drawImage(hp, self.character.coordinates.x + 1, self.character.coordinates.y - 8, xz, 3);
        }
        if (mouseX < self.character.coordinates.x) {
            self.character.heroImg.src = 'img/heroleft.png';
        }
        else {
            self.character.heroImg.src = 'img/heroright.png';
        }
    }
    this.drawMonsters = function() {
        var monsters = self.currentDungeon.monsters;
        monsters.sort(compareMonstersByY);
        for (var x = 0; x < monsters.length; x++) {
            var coordsOnCanvas = (monsters[x].coordinates);
            if (monsters[x].hp >= 0) {
                var percentHP = monsters[x].hp / monsters[x].maxHp;
                var xz = (monsters[x].size - 2) * percentHP;
                ctx.drawImage(hp, monsters[x].coordinates.x + 1, monsters[x].coordinates.y - 8, xz, 3);
            }
            ctx.drawImage(light, coordsOnCanvas.x - 10, coordsOnCanvas.y - 10, monsters[x].size + 20, monsters[x].size + 20);
            ctx.drawImage(monsters[x].image, coordsOnCanvas.x, coordsOnCanvas.y, monsters[x].size, monsters[x].size);
            ctx.fillStyle = "black";
            //ctx.strokeRect(monsters[x].collider.coordinates.x, monsters[x].collider.coordinates.y, monsters[x].collider.width, monsters[x].collider.height);

            //ctx.strokeRect(monsters[x].groundCollider.coordinates.x, monsters[x].groundCollider.coordinates.y, monsters[x].groundCollider.width, monsters[x].groundCollider.height);
        }
    }
    this.drawBalls = function() {
        var heroBalls = self.currentDungeon.heroBalls;
        var enemyBalls = self.currentDungeon.enemyBalls;
        var monsters = self.currentDungeon.monsters;

        for (var i = 0; i < heroBalls.length; i++) {
            if (!heroBalls[i].canMove(dungeon)) {
                heroBalls[i].isExist = false;
                heroBalls.splice(i, 1);
            }
            else
                ctx.drawImage(strela, heroBalls[i].coords.x, heroBalls[i].coords.y, 9, 9);
        }
        for (var i = 0; i < enemyBalls.length; i++) {
            if (!enemyBalls[i].canMove(dungeon)) {
                enemyBalls.splice(i, 1);
            }
            else
                ctx.drawImage(strela, enemyBalls[i].coords.x, enemyBalls[i].coords.y, 9, 9);
        }
    }
    this.monstersMove = function() {
        var monsters = self.currentDungeon.monsters;
        for (var j = 0; j < monsters.length; j++) {
            monsters[j].moveTo(self.character.coordinates);
        }
    }
    this.heroMove = function() {
        if (self.character.canMove()) {
            self.character.move();
        }
        else {
            self.character.changeDirecion();
        }
    }
    this.monstersShoot = function() {
        var monsters = self.currentDungeon.monsters;
        var enemyBalls = self.currentDungeon.enemyBalls;
        for (var i = 0; i < monsters.length; i++) {
            var monster = monsters[i];
            var distance = monster.collider.distance(self.character.collider);
            var ball = monster.shoot({
                x: self.character.coordinates.x + 20,
                y: self.character.coordinates.y + 20,
            });
            if (ball)
                enemyBalls.push(ball);

            if (distance <= monster.range)
                if (monster.canAttack) {
                    monster.hit();
                    self.character.hp--;
                }
        }
    }
    this.checkDamageOnHero = function() {
        var enemyBalls = self.currentDungeon.enemyBalls;
        for (var i = 0; i < enemyBalls.length; i++) {
            if (enemyBalls[i].collider.isIntersect(self.character.collider)) {
                enemyBalls.splice(i, 1);
                self.character.hp--;
            }
        }
    }
    this.checkDamageOnMonsters = function() {
        var heroBalls = self.currentDungeon.heroBalls;
        var enemyBalls = self.currentDungeon.enemyBalls;
        var monsters = self.currentDungeon.monsters;

        for (var i = 0; i < heroBalls.length; i++) {
            for (var j = 0; j < monsters.length; j++) {
                if (heroBalls[i])
                    if (monsters[j].collider.isIntersect(heroBalls[i].collider)) {
                        heroBalls.splice(i, 1);
                        monsters[j].getDamage(self.character.damage);
                        if (monsters[j].hp <= 0) {
                            monsters[j].died = true;
                        }
                        if (monsters[j].died) {
                            self.character.getExp(monsters[j].exp);
                            var loot = monsters[j].dropLoot();
                            self.currentDungeon.loot.push(loot);
                            monsters.splice(j, 1);
                        }
                    }
            }
        }
    }
    this.drawLoot = function() {
        var loot = self.currentDungeon.loot;
        for (var i = 0; i < loot.length; i++) {
            ctx.drawImage(loot[i].image, loot[i].coordinates.x, loot[i].coordinates.y, loot[i].size, loot[i].size);
        }
    }
    this.checkLoot = function() {
        var loot = self.currentDungeon.loot;
        for (var i = 0; i < loot.length; i++) {
            if (self.character.collider.isIntersect(loot[i].collider)) {
                self.character.getLoot(loot[i]);
                loot.splice(i, 1);
            }
        }
    }

    this.drawGui = function() {
        var coords = {
            x: 60,
            y: 70
        }
        var length = 150;
        var height = 15;

        ctx.font = "15pt Gill Sans MT";
        var image = new Image();
        image.src = "img/coin.png";
        ctx.drawImage(image, coords.x, coords.y + 50, 20, 20);
        ctx.fillStyle = "white";
        ctx.fillText(self.character.gold, coords.x + 21, coords.y + 67);

        if (self.character.hp >= 0) {
            var percentHP = self.character.hp / self.character.maxHp;
            var xz = (length - 6) * percentHP;
            ctx.drawImage(hp, coords.x + 3, coords.y + 22, xz, 11);
        }
        ctx.drawImage(hpBar, coords.x, coords.y + 20, length, height);
        ctx.fillText("HP " + self.character.hp + " / " + self.character.maxHp, coords.x + length + 5, coords.y + 34);

        var percentXP = self.character.expirience / 100;
        var xz = (length - 6) * percentXP;

        ctx.drawImage(xp, coords.x + 3, coords.y - 9, xz, 11);
        ctx.drawImage(xpBar, coords.x, coords.y - 9, length, height);
        ctx.fillText("Level " + self.character.lvl, coords.x + length + 5, coords.y + 6);

        //ctx.fillStyle = "green";
        //ctx.fillText("Exp: " + self.character.expirience, coords.x, coords.y + 30);
    }

    this.drawField = function() {
        ctx.clearRect(0, 0, field.width, field.height);
        var heroBalls = self.currentDungeon.heroBalls;
        var enemyBalls = self.currentDungeon.enemyBalls;
        var monsters = self.currentDungeon.monsters;
        self.drawFloor();
        self.drawLoot();
        self.drawHero();
        self.drawMonsters();
        self.drawBalls();
        self.drawWalls();
        self.heroMove();
        self.monstersMove();
        self.monstersShoot();
        self.checkDamageOnHero();
        self.checkDamageOnMonsters();
        self.checkLoot();
        self.drawGui();
        if (monsters.length <= 0) {
            self.currentDungeon.spawnMonster();
        }
        //if (self.character.hp <= 0) {
        //    ctx.fillStyle = "white";
        //    ctx.font = "30pt MS Sans Serif";
        //    ctx.fillText("Game Over", 300, 300);
        //}
    }
}