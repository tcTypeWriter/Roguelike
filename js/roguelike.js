var field = document.getElementById("field");
var ctx = field.getContext('2d');
field.style.cursor = "crosshair";

var coin = new Image();
coin.src = "img/coin.png";

var xpBar = new Image();
xpBar.src = "img/xpBar.png";

var xp = new Image();
xp.src = "img/xp.png";

var hpBar = new Image();
hpBar.src = "img/hpBar.png";

var hp = new Image();
hp.src = "img/hp.png";

var light = new Image();
light.src = "img/light.png";

var wall = new Image();
wall.src = "img/wall.png";

var door = new Image();
door.src = "img/closedDoor.png";

var block = new Image();
block.src = "img/brick.png";

var block1 = new Image();
block1.src = "img/brick1.png";

var strela = new Image();
strela.src = "img/fireball.png";

var cdTime = 300;
var canShoot = true;

var actions = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

function compareMonstersByY(a, b) {
    if (a.coordinates.y + a.size > b.coordinates.y + b.size) return 1;
    if (a.coordinates.y + a.size < b.coordinates.y + b.size) return -1;
}

function convertKeyCodeToAction(keycode) {
    switch (keycode) {
        case 87:
            return actions.UP;
        case 65:
            return actions.LEFT;
        case 83:
            return actions.DOWN;
        case 68:
            return actions.RIGHT;
    }
}

function moveSomething(currentCoords, direction, speed) {
    var newX = currentCoords.x;
    var newY = currentCoords.y;
    if (direction.up)
        newY -= speed;
    if (direction.down)
        newY += speed;
    if (direction.left)
        newX -= speed;
    if (direction.right)
        newX += speed;
    return {
        x: newX,
        y: newY
    };
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var mouseX;
var mouseY;
field.onmousemove = function(e) {
    mouseX = e.pageX - field.offsetLeft;
    mouseY = e.pageY - field.offsetTop;
}

var action;
document.onkeydown = function(event) {
    if (event.repeat) return false;
    action = convertKeyCodeToAction(event.keyCode);
    switch (action) {
        case actions.UP:
            character.direction.up = true;
            break;
        case actions.DOWN:
            character.direction.down = true;
            break;
        case actions.LEFT:
            character.direction.left = true;
            break;
        case actions.RIGHT:
            character.direction.right = true;
            break;
    }
}
document.onkeyup = function(e) {
    var action = convertKeyCodeToAction(e.keyCode);
    switch (action) {
        case actions.UP:
            character.direction.up = false;
            break;
        case actions.DOWN:
            character.direction.down = false;
            break;
        case actions.LEFT:
            character.direction.left = false;
            break;
        case actions.RIGHT:
            character.direction.right = false;
            break;
    }
}

function lengthOfVector(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

function normalise(vector) {
    var inversion = 1 / lengthOfVector(vector);
    return {
        x: vector.x * inversion,
        y: vector.y * inversion
    };
}

var character = new Character();
var game = new Game(character);
var dungeon = new Dungeon();
game.currentDungeon = dungeon;
character.visitDungeon(dungeon);

field.onmousedown = function(event) {
    mouseX = event.pageX - field.offsetLeft;
    mouseY = event.pageY - field.offsetTop;

    var shooting = setInterval(function() {
        if (canShoot) {
            var charcoordcanv = (character.coordinates);
            var beginX = charcoordcanv.x + 20;
            var beginY = charcoordcanv.y + 20;
            var ball = new Ball({
                x: beginX,
                y: beginY
            }, {
                    x: mouseX,
                    y: mouseY
                });
            game.currentDungeon.heroBalls.push(ball);
            var fps = 1;
            var speed = 3;
            var vector = {
                x: -(beginX - mouseX),
                y: -(beginY - mouseY)
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
            canShoot = false;
            setTimeout(function() {
                canShoot = true;
            }, cdTime);
        }
    }, 0);
    field.onmouseup = function() {
        clearInterval(shooting);
        field.onmouseup = null;
    }
    field.onmouseout = field.onmouseup;
}



var fpsShow = 0;
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback, element) {
            window.setTimeout(function() {
                callback(+new Date);
            }, 1000 / 60);
        };
})();
var lastRun;
(function(window, document) {
    var canvas = document.getElementById("field"),
        context = canvas.getContext("2d"),
        game_running = true,
        show_fps = true;
    function showFPS() {
        context.fillStyle = "White";
        context.fillRect(0, 0, 80, 48);
        context.fillStyle = "Black";
        context.font = "normal 16pt Arial";
        context.fillText(Math.round(fpsShow) + " fps", 10, 30);
    }
    function gameLoop() {
        if (!lastRun) {
            lastRun = new Date().getTime();
            window.requestAnimFrame(gameLoop);
            return;
        }
        var delta = (new Date().getTime() - lastRun) / 1000;
        lastRun = new Date().getTime();
        fpsShow = 1 / delta;

        game.drawField();

        if (show_fps) showFPS();
        if (game_running) window.requestAnimFrame(gameLoop);
    }
    gameLoop();
} (this, this.document))

//function pause() {
//    clearInterval(mainTimer);
//}
//var mainTimer = setInterval(frameDraw, fps);
//window.onblur = pause;
//window.onfocus = function () {
//    mainTimer = setInterval(frameDraw, fps);
//}