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
        }
    }
    return tab;
}


var canvas = document.getElementById("renderCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
canvas.style.zIndex = 1;
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var scale = 10;
var RES = [Math.round(ctx.canvas.width / scale), Math.round(ctx.canvas.height / scale)];
$("#x").val(Math.round(ctx.canvas.width / scale));
$("#y").val(Math.round((ctx.canvas.height * .7) / scale));
//var RES = [Math.round(ctx.canvas.width / scale), Math.round(ctx.canvas.height / scale)];
var diff = .7;
var fps = 15;
interval = setInterval(updateMatrix, 1000 / fps);
var MATRIX = initializeMatrix(RES[0], RES[1]);
var History = [MATRIX];
var steps = 0;

var GridOn = false;

function updateCanvas() {
    if (GridOn) ctx.fillStyle = "blue";
    else ctx.fillStyle = "black";

    ctx.fillRect(0, 0, RES[0] * scale, RES[1] * scale);
    for (let i = 0; i < RES[0]; i++) {
        for (let j = 0; j < RES[1]; j++) {
            if (MATRIX[i][j]) {
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.fillRect(i * scale, j * scale, scale - diff * 2, scale - diff * 2);

            } else {
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                ctx.fillRect(i * scale, j * scale, scale - diff * 2, scale - diff * 2);
            }

        }
    }
}

$("canvas").on("click", e => {
    MATRIX[Math.floor((e.pageX - $("canvas").offset().left) / scale)][Math.floor((e.pageY - $("canvas").offset().top) / scale)] = true;
    updateCanvas();
});

$("canvas").on("contextmenu", e => {
    e.preventDefault();
    MATRIX[Math.floor((e.pageX - $("canvas").offset().left) / scale)][Math.floor((e.pageY - $("canvas").offset().top) / scale)] = false;
    updateCanvas();
});


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
    steps += 1;
    $("#steps").html(steps);
    History.push(MATRIX);
    if (steps % 1 == 0) updateCanvas();
}

function clearMatrix() {
    for (let i = 0; i < RES[0]; i++) {
        for (let j = 0; j < RES[1]; j++) {
            MATRIX[i][j] = false;
        }
    }
    History.push(MATRIX);
    updateCanvas();
}

var interval;

document.onkeydown = e => {
    //e.preventDefault();
    if (e.keyCode === 71) GridOn = !GridOn, updateCanvas();
    if (e.keyCode === 109 && fps > 0) fps -= 1;
    if (e.keyCode === 107 && fps < 60) fps += 1;
    if (e.keyCode === 32) $("#pause").trigger("click");
    if (e.keyCode === 67) clearMatrix();
    if (e.keyCode === 37 && fps == 0) $("#previous").trigger("click");
    if (e.keyCode === 39 && fps == 0) $("#next").trigger("click");
}

$("#pause").on("click", e => {
    if (fps == 0) fps = 15, $("#pause img").attr("src", "pause.png");
    else fps = 0, $("#pause img").attr("src", "play.png");
    clearInterval(interval);
    if (fps > 0) interval = setInterval(updateMatrix, 1000 / fps);
});

$("#previous").on("click", e => {
    if (steps >= 1) {
        steps -= 1;
        $("#steps").html(steps);
        MATRIX = History[steps];
        updateCanvas();
    }
});

$("#next").on("click", e => updateMatrix());

$("#dl").click(function() {
    var now = RES[0].toString() + ";" + RES[1].toString() + ";" + MATRIX.toString();
    this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(now);
});


RAW_DATA = "";

function handleFileSelect(evt) {
    $("#loading").fadeIn(100, e => {
        var files = evt.target.files; // FileList object

        // use the 1st file from the list
        f = files[0];

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return e => {
                RAW_DATA = e.target.result;
                RES[0] = RAW_DATA.split(";")[0];
                RES[1] = RAW_DATA.split(";")[1];

                scale = Math.min(window.innerWidth / RES[0], (window.innerHeight * .7) / RES[1]);
                ctx.canvas.width = RES[0] * scale;
                //ctx.canvas.left = (window.innerWidth - ctx.canvas.width) / 2

                Line_MATRIX = RAW_DATA.split(";")[2];
                MATRIX = initializeMatrix(RES[0], RES[1]);

                for (let i = 0; i < RES[0]; i++) {
                    for (let j = 0; j < RES[1]; j++) {
                        MATRIX[i][j] = (/true/i).test(Line_MATRIX.split(",")[j % RES[1] + i * RES[1]]);
                    }
                }
                History = [MATRIX];
                steps = 0;
                $("#loading").fadeOut();
                launch();
                updateCanvas();
                if (fps != 0) $("#pause").trigger("click");
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsText(f);
    });
}

document.getElementById('upl').addEventListener('change', handleFileSelect, false);
$("#upl2, #upload p").on("click", e => { $("#upl").trigger("click") });



function launch() {
    $("#home, #setnew").fadeOut(100, e => $("#UI").fadeIn());
    ctx.canvas.height = window.innerHeight * .7;
}

function newGrid(width, height, empty = true) {
    scale = Math.min(window.innerWidth / width, (window.innerHeight * .7) / height);
    ctx.canvas.width = RES[0] * scale;
    launch();
    if (empty) {
        GridOn = true;
        $("#pause").trigger("click");
        MATRIX = [];
        for (let i = 0; i < width; i++) {
            MATRIX[i] = [];
            for (let j = 0; j < height; j++) {
                MATRIX[i][j] = false;
            }
        }
    } else MATRIX = initializeMatrix(width, height);
    History = [MATRIX];
    steps = 0;
    updateCanvas();
}

var emptyMode = true;

$("#launch").on("click", e => {
    emptyMode = false;
    $("#home").fadeOut(100, e => $("#setnew").fadeIn());
});

$("#newgrid").on("click", e => {
    emptyMode = true;
    $("#home").fadeOut(100, e => $("#setnew").fadeIn());
});

$("#go").on("click", e => {
    RES = [parseInt($("#x").val()), parseInt($("#y").val())];
    newGrid(RES[0], RES[1], emptyMode);
});