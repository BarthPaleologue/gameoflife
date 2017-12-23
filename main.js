function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomBool(nb = 2) {
    return getRandomInt(1, nb) == 1
}

function initializeMatrix(width, height) {
    let tab = [];
    for (let i = 0; i < width; i++) {
        tab[i] = []
        for (let j = 0; j < height; j++) {
            tab[i][j] = randomBool(4);
            /*tab[i][j] = false;
            if (i == 2 && j == 2) tab[i][j] = true;
            if (i == 3 && j == 1) tab[i][j] = true;
            if (i == 3 && j == 2) tab[i][j] = true;
            if (i == 4 && j == 1) tab[i][j] = true;
            if (i == 4 && j == 2) tab[i][j] = true;
            if (i == 5 && j == 1) tab[i][j] = true;*/

        }
    }
    return tab;
}


var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const RES = [Math.round(window.innerWidth / 10), Math.round(window.innerHeight / 10)];
const scale = 10;
var diff = .7;
var fps = 30;

var MATRIX = initializeMatrix(RES[0], RES[1]);

function updateCanvas() {
    for (let i = 0; i < RES[0]; i++) {
        for (let j = 0; j < RES[1]; j++) {
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.fillRect(i * scale, j * scale, scale, scale);
        }
    }
    for (let i = 0; i < RES[0]; i++) {
        for (let j = 0; j < RES[1]; j++) {
            if (MATRIX[i][j]) {
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.fillRect(i * scale, j * scale, scale - diff, scale - diff);

            } else {
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                ctx.fillRect(i * scale, j * scale, scale, scale);
            }

        }
    }
    updateMatrix();
}

function updateMatrix() {
    var buffer = [];
    for (let i in MATRIX) {
        buffer[i] = [];
        for (let j in MATRIX[i]) {
            buffer[i][j] = MATRIX[i][j];
        }
    }
    for (let i = 0; i < RES[0]; i++) {
        for (let j = 0; j < RES[1]; j++) {
            if (i > 0 && j > 0 && i < RES[0] - 1 && j < RES[1] - 1) {
                let c = 0;
                //if (i == 4 && j == 2) console.log(MATRIX[i - 1])
                if (MATRIX[i][j - 1]) c += 1;
                if (MATRIX[i][j + 1]) c += 1;

                if (MATRIX[i - 1][j]) c += 1;
                if (MATRIX[i + 1][j]) c += 1;

                if (MATRIX[i - 1][j - 1]) c += 1;
                if (MATRIX[i + 1][j + 1]) c += 1;

                if (MATRIX[i - 1][j + 1]) c += 1;
                if (MATRIX[i + 1][j - 1]) c += 1;


                if (c == 3 && !MATRIX[i][j]) buffer[i][j] = true;
                else if (c != 3 && c != 2 && MATRIX[i][j]) buffer[i][j] = false;
            } else buffer[i][j] = false;
        }
    }
    MATRIX = buffer;
}

updateCanvas();
var interval = setInterval(updateCanvas, 1000 / fps);

document.onkeydown = e => {
    if (e.keyCode === 109 && fps > 0) fps -= 1;
    if (e.keyCode === 107 && fps < 60) fps += 1;
    if (e.keyCode === 32 && fps == 0) fps = 30;
    else if (e.keyCode === 32 && fps > 0) fps = 0;
    if (e.keyCode === 13 && fps == 0) updateCanvas();
    clearInterval(interval);
    if (fps > 0) interval = setInterval(updateCanvas, 1000 / fps);
}

document.onkeyup = e => {

}

/*var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");

var width = 1000;
var height = 600;
var scale = 5;
var diff = .1;

var grid = [];

function setup() {
    for (let i = 0; i < width; i++) {
        grid[i] = [];
        for (let j = 0; j < height; j++) {
            if (getRandomInt(0, 10) < 7) grid[i][j] = 1;
        }
    }
}
setup();

function draw() {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (grid[i][j] == 1) {
                ctx.fillStyle = "rgb(0, 0, 0)";
            } else {
                ctx.fillStyle = "rgb(255, 255, 255)";
            }
            ctx.fillRect(i * scale, j * scale, scale - diff, scale - diff);
        }
    }
    update();
}

setInterval(draw, 3000);

function update() {
    var buffer = [];
    for (let i = 0; i < width; i++) {
        buffer[i] = [];
        for (let j = 0; j < height; j++) {
            var c = 0;
            c += getPos(i, j + 1);
            c += getPos(i, j - 1);
            c += getPos(i + 1, j + 1);
            c += getPos(i + 1, j);
            c += getPos(i + 1, j - 1);
            c += getPos(i - 1, j + 1);
            c += getPos(i - 1, j);
            c += getPos(i - 1, j - 1);
            buffer[i][j] = grid[i][j];
            if (buffer[i][j] == 0 && c == 3) buffer[i][j] = 1;
            else if (buffer[i][j] != 0 && (c < 2 || c > 3)) buffer[i][j] = 0;
        }
    }
    grid = buffer;
}

function getPos(x, y) {
    if (x > 0 && x < width && y > 0 && y < height) {
        if (grid[x][y] != 0) return 1;
    }
    return 0;
}*/