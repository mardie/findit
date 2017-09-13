//TinyMusic: https://raw.githubusercontent.com/kevincennis/TinyMusic/master/dist/TinyMusic.min.js
TinyMusic = {};
(function (a) { function b(a) { var c = a.split(h); this.frequency = b.getFrequency(c[0]) || 0, this.duration = b.getDuration(c[1]) || 0 } function c(a, b, c) { this.ac = a || new AudioContext, this.createFxNodes(), this.tempo = b || 120, this.loop = !0, this.smoothing = 0, this.staccato = 0, this.notes = [], this.push.apply(this, c || []) } var d = "B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb", e = 440 * Math.pow(Math.pow(2, 1 / 12), -9), f = /^[0-9.]+$/, g = 4, h = /\s+/, i = /(\d+)/, j = {}; d.split("|").forEach(function (a, b) { a.split("-").forEach(function (a) { j[a] = b }) }), b.getFrequency = function (a) { var b = a.split(i), c = j[b[0]], d = (b[1] || g) - g, f = e * Math.pow(Math.pow(2, 1 / 12), c); return f * Math.pow(2, d) }, b.getDuration = function (a) { return f.test(a) ? parseFloat(a) : a.toLowerCase().split("").reduce(function (a, b) { return a + ("w" === b ? 4 : "h" === b ? 2 : "q" === b ? 1 : "e" === b ? .5 : "s" === b ? .25 : 0) }, 0) }, c.prototype.createFxNodes = function () { var a = [["bass", 100], ["mid", 1e3], ["treble", 2500]], b = this.gain = this.ac.createGain(); return a.forEach(function (a, c) { c = this[a[0]] = this.ac.createBiquadFilter(), c.type = "peaking", c.frequency.value = a[1], b.connect(b = c) }.bind(this)), b.connect(this.ac.destination), this }, c.prototype.push = function () { return Array.prototype.forEach.call(arguments, function (a) { this.notes.push(a instanceof b ? a : new b(a)) }.bind(this)), this }, c.prototype.createCustomWave = function (a, b) { b || (b = a), this.waveType = "custom", this.customWave = [new Float32Array(a), new Float32Array(b)] }, c.prototype.createOscillator = function () { return this.stop(), this.osc = this.ac.createOscillator(), this.customWave ? this.osc.setPeriodicWave(this.ac.createPeriodicWave.apply(this.ac, this.customWave)) : this.osc.type = this.waveType || "square", this.osc.connect(this.gain), this }, c.prototype.scheduleNote = function (a, b) { var c = 60 / this.tempo * this.notes[a].duration, d = c * (1 - (this.staccato || 0)); return this.setFrequency(this.notes[a].frequency, b), this.smoothing && this.notes[a].frequency && this.slide(a, b, d), this.setFrequency(0, b + d), b + c }, c.prototype.getNextNote = function (a) { return this.notes[a < this.notes.length - 1 ? a + 1 : 0] }, c.prototype.getSlideStartDelay = function (a) { return a - Math.min(a, 60 / this.tempo * this.smoothing) }, c.prototype.slide = function (a, b, c) { var d = this.getNextNote(a), e = this.getSlideStartDelay(c); return this.setFrequency(this.notes[a].frequency, b + e), this.rampFrequency(d.frequency, b + c), this }, c.prototype.setFrequency = function (a, b) { return this.osc.frequency.setValueAtTime(a, b), this }, c.prototype.rampFrequency = function (a, b) { return this.osc.frequency.linearRampToValueAtTime(a, b), this }, c.prototype.play = function (a) { return a = "number" == typeof a ? a : this.ac.currentTime, this.createOscillator(), this.osc.start(a), this.notes.forEach(function (b, c) { a = this.scheduleNote(c, a) }.bind(this)), this.osc.stop(a), this.osc.onended = this.loop ? this.play.bind(this, a) : null, this }, c.prototype.stop = function () { return this.osc && (this.osc.onended = null, this.osc.disconnect(), this.osc = null), this }, a.Note = b, a.Sequence = c })(TinyMusic);

var ac = new AudioContext();
var tempo = 140;
var playingSequece = true;
var l1 = [
    'C4 h',
    'D4 q',
    'E4 qe',
    'D4 e',
    'E4 q',
    'F4 h',
    'G4 q',
    'E4 qe',
    'D4 e',
    'C4 q'];

var l2 = [
    'G4 qe',
    'F4 e',
    'G4 q',
    'E4 qe',
    'D4 e',
    'C4 q',
    'D4 qe',
    'E4 e',
    'F4 q',
    'G4 hq'
];

var l3 = [
    'A4 h',
    'G4 0.001',
    'A4 q',
    'G4 h',
    'F4 0.001',
    'G4 q',
    'F4 qe',
    'G4 e',
    'F4 q',
    'E4 qe',
    'D4 e',
    'C4 q'
];

var l4 = [
    'G4 qe',
    'F4 e',
    'G4 q',
    'E4 qe',
    'D4 e',
    'C4 q',
    'D4 qe',
    'C4 e',
    'D4 q',
    'C4 hq',
];

// ARRASTRAT 
var sequence = new TinyMusic.Sequence(ac, tempo, l1.concat(l2, l3, l4, l3, l4));

sequence.loop = true;
sequence.smoothing = 0.1;
sequence.gain.gain.value = 0.05;
sequence.play();

var sequenceFailure = new TinyMusic.Sequence(ac, 200, [
    'E1 q',
    'F1 e',
    'C1 h',
]);
sequenceFailure.loop = false;
sequenceFailure.gain.gain.value = 0.5;

var sequenceSuccess = new TinyMusic.Sequence(ac, 200, [
    'C6 q',
    'F6 e',
    'E6 h',
]);
sequenceSuccess.loop = false;
sequenceSuccess.gain.gain.value = 0.5;


function failureSound() {
    sequenceFailure.play();
}

function successSound() {
    sequenceSuccess.play();
}

var main = document.getElementById("main");
main.width = window.innerWidth;
main.height = window.innerHeight;
var zoom = document.getElementById("zoom");
var zoomWrapper = document.getElementById("zoomwrapper");
var message = document.getElementById("msg");

var ctx = main.getContext("2d")
var zoomCtx = zoom.getContext("2d");

var objs = [];
var buildings = [];

var nextBar = document.querySelector('#next');
var targets = [];
var start = Date.now();
var clock = document.querySelector('#clock');
var close = document.querySelector('#close');
var sound = document.querySelector('#sound');
var dict = {};
var gameFinished = false;
var gameRunning = false;
var currentLevel = 0;
var timeLeft = '';
var score = 0;
var faults = 0;
var scores = [];
var timeAvailable = 0;

try {
    var _scores = localStorage.getItem('score');
    if (_scores) {
        scores = JSON.parse(_scores);
    }
} catch (e) { }

var tile1 = document.getElementById("t1");
var patTile1 = ctx.createPattern(tile1, "repeat");
var tile2 = document.getElementById("t2");
var patTile2 = ctx.createPattern(tile2, "repeat");
function msg(str) {
    str = str || "";
    message.innerText = str;
}

function win() {
    gameRunning = false;
    paintClock();
    msg("LEVEL FINISHED");
    buildings = [];
    objs = [];
    setTimeout(function () {
        msg("NEXT LEVEL: " + (currentLevel + 1));
        setTimeout(function () {
            msg();
            nextLevel();
        }, 2000);
    }, 2000);

}
function gameover() {
    msg("Your score is " + score);
    setTimeout(function () {
        showLeader(true);
    }, 2000);
}
function nextLevel() {
    currentLevel++;
    buildings = [];
    objs = [];
    targets = [];
    nextBar.innerHTML = "";
    dict = {};
    faults = 0;
    var buildingsInLevel = parseInt(currentLevel / 5);
    var citizensInLevel = 1 * currentLevel;
    var totalPopullationLevel = 3 * (currentLevel - 1);
    if (currentLevel === 1) {
        buildingsInLevel = 0;
        citizensInLevel = 1;
        totalPopullationLevel = 1;
        timeAvailable = 300;
    } else if (currentLevel === 2) {
        timeAvailable = 60;
    } else {
        timeAvailable = 60 + timeLeft;
    }
    while (buildings.length < buildingsInLevel) {
        buildings.push(createBuilding());
    }
    while (objs.length < citizensInLevel) {
        objs.push(createObj(true));
    }
    while (objs.length < totalPopullationLevel) {
        objs.push(createObj());
    }
    gameRunning = true;
    start = Date.now();
    paintClock();
}

var FACTOR = 4;

var magnifierX = main.width / 2;
var magnifierY = main.height / 2;
function drawMagnifier() {
    zoomCtx.fillStyle = "#c9dbdc";
    zoomCtx.fillRect(0, 0, zoom.width, zoom.height);
    zoomCtx.drawImage(main, magnifierX - (zoom.width / (2 * FACTOR)) + 0, magnifierY - (zoom.height / (2 * FACTOR)) + 0, (zoom.width / FACTOR), (zoom.height / FACTOR), 0, 0, zoom.width, zoom.height);
    zoomWrapper.style.top = magnifierY + (0 - zoom.height / 2) + "px"
    zoomWrapper.style.left = magnifierX + (0 - zoom.width / 2) + "px"
    zoomWrapper.style.display = "block";
    zoom.style.display = "block"
}

window.addEventListener("resize", function () {
    main.width = window.innerWidth;
    main.height = window.innerHeight;
});

window.addEventListener("mousemove", function (e) {
    if (e.clientX > (zoom.width / (2 * FACTOR))) {
        magnifierX = e.clientX;
    }
    if (e.clientY > (zoom.width / (2 * FACTOR))) {
        magnifierY = e.clientY;
    }
});
window.addEventListener("touchmove", function (e) {
    if (e.changedTouches[0].clientX > (zoom.width / (2 * FACTOR))) {
        magnifierX = e.changedTouches[0].clientX;
    }
    if (e.changedTouches[0].clientY > (zoom.width / (2 * FACTOR))) {
        magnifierY = e.changedTouches[0].clientY;
    }
});

function select(x, y) {
    if (gameFinished || !gameRunning) {
        return;
    }
    var success = false;

    objs.map(function (item) {
        var d = Math.sqrt(Math.pow((item.x - x), 2) + Math.pow((item.y - y), 2));
        if (d < 20 && !item.used && targets.indexOf(item.content) >= 0) {
            success = true;
            score++;
            item.used = true;
            removeItem(item.content);
            if (targets.length == 0) {
                draw();
                win();
            }
        }
    });
    if (!success) {
        faults++;
        failureSound();
    } else {
        successSound();
    }
}
window.addEventListener("click", function (e) {
    select(magnifierX, magnifierY);
})

close.addEventListener("click", function (e) {
    e.stopPropagation();
    newGame();
})
sound.addEventListener("click", function (e) {
    e.stopPropagation();
    playingSequece ? sequence.stop() : sequence.play();
    playingSequece = !playingSequece;
})

function newGame() {
    msg();
    gameFinished = false;
    gameRunning = true;
    currentLevel = 0;
    score = 0;
    nextLevel();
    showLeader(false);
    start = Date.now();
    updateLogic();
}

function drawBuilding(obj) {

    ctx.rect(obj.x, obj.y, obj.width, obj.height);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(obj.x, obj.y + obj.height / 2);
    ctx.lineTo(obj.x + obj.width, obj.y + obj.height / 2);
    ctx.stroke();
}
function drawCitizen(obj) {
    ctx.font = "20px Arial";
    if (obj.used) {
        ctx.fillStyle = "rgba(66, 33, 5, 0.5)";
    } else {
        ctx.fillStyle = "rgba(66, 33, 5, 1)";
    }
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(obj.content, obj.x, obj.y);
    /*return;
    ctx.strokeStyle = "rgba(" + obj.r + ", " + obj.g + ", " + obj.b + ", 1.0)";
    ctx.beginPath();
    ctx.arc(obj.x + 2, obj.y + 2, 5, 0, 2 * Math.PI);
    ctx.stroke();
    return;
    ctx.strokeStyle = "rgba(" + obj.r + ", " + obj.g + ", " + obj.b + ", 0.3)";
    ctx.beginPath();
    ctx.arc(obj.target.x + 2, obj.target.y + 2, 5, 0, 2 * Math.PI);
    ctx.stroke();*/
}
function createBuilding() {
    return {
        x: Math.floor(Math.random() * main.width - 50),
        y: Math.floor(Math.random() * main.height - 50),
        width: 100,
        height: 100,
    }
}
function createObj(isTarget) {
    var icons = ['😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😌', '😍', '😏', '😒', '😓', '😓', '😖', '😘', '😚', '😜', '😝', '😞', '😠', '😡',
        '😢', '😣', '😤', '😥', '😨', '😩', '😪', '😫', '😭', '😰', '😱', '😱', '😳', '😵', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀'];
    var content = icons[Math.floor(Math.random() * icons.length)];
    if (isTarget) {
        addItem(content);
    }
    return {
        x: Math.floor(Math.random() * main.width),
        y: Math.floor(Math.random() * main.height),
        content: content,
        speed: 0.002 * currentLevel * Math.random() + 0.003 * currentLevel,
        target: {
            x: Math.floor(Math.random() * main.width),
            y: Math.floor(Math.random() * main.height)
        },
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    }
}

function runAI(obj, millis) {

    if (!gameRunning && gameFinished) {
        return;
    }
    if (obj.x != obj.target.x) {
        if (obj.x > obj.target.x) {
            obj.x -= obj.speed * millis;
        } else {
            obj.x += obj.speed * millis;
        }
    }
    if (obj.y != obj.target.y) {
        if (obj.y > obj.target.y) {
            obj.y -= obj.speed * millis;
        } else {
            scores
            obj.y += obj.speed * millis;
        }
    }

    if (Math.abs(obj.y - obj.target.y) < 1 && Math.abs(obj.x - obj.target.x) < 1) {
        var rayCount = 10;
        var results = [];
        for (var i = 0; i < rayCount; i++) {

        }
        obj.target.y = Math.floor(Math.random() * main.height);
        obj.target.x = Math.floor(Math.random() * main.width);
    }
}

var lastDrawTS = null;
function draw(ts) {
    if (gameRunning) {
        objs.map(function (obj) {
            runAI(obj, lastDrawTS === null ? 1 : ts - lastDrawTS);
        })

        var patTile1 = ctx.createPattern(tile1, "repeat");
        ctx.fillStyle = patTile1;
        ctx.strokeStyle = "rgba(255, 255, 255, 1.0)";
        ctx.fillRect(0, 0, main.width, main.height);
        ctx.stroke();
        ctx.fill();

        objs.map(function (obj) {
            drawCitizen(obj);
        });
        var patTile2 = ctx.createPattern(tile2, "repeat");

        ctx.fillStyle = patTile2;
        ctx.strokeStyle = "rgba(0, 0, 0, 1.0)";
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;

        buildings.map(function (building) {
            drawBuilding(building);
        });
        ctx.shadowBlur = 0;
    }
    drawMagnifier();
    lastDrawTS = ts;
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw)

function addItem(key) {
    var wrappingElement = document.createElement("DIV");
    wrappingElement.className = "item onenter";
    wrappingElement.innerText = key;
    if (!dict[key]) {
        dict[key] = [];
    }
    dict[key].push(wrappingElement)
    targets.push(key);
    nextBar.appendChild(wrappingElement);
    setTimeout(function () {
        wrappingElement.className = wrappingElement.className.replace('onenter', '');
    }, 100)
}
function removeItem(key) {
    var el = dict[key].shift();
    if (el) {
        el.className = "item deleted";
        var i = targets.indexOf(key);
        if (i >= 0) {
            targets.splice(i, 1);
        }
        setTimeout(function () {
            el.parentNode.removeChild(el);
        }, 1000)
    }
}
function updateItemVal(key, val) {
    var el = dict[key] && dict[key][0];
    if (el) {
        el.className += "found"
    }
}

function paintClock() {
    console.log(!gameFinished, gameRunning)
    if (!gameFinished && gameRunning) {
        clock.innerText = timeLeft;
    } else {
        clock.innerText = "";
    }
}

function updateLogic() {
    if (!gameFinished && gameRunning) {
        timeLeft = timeAvailable - Math.floor((Date.now() - start) / 1000) - faults * 5
        if (timeLeft <= 0) {
            gameFinished = true;
            gameRunning = false;
            gameover();
        }
        paintClock();
    }
    setTimeout(function () {
        if (!gameFinished) {
            updateLogic();
        }
    }, 250);
}


function showLeader(show) {
    var leaderWrapper = document.getElementById('leaderWrapper');
    if (!show) {
        leaderWrapper.className = "";
        return;
    }
    leaderWrapper.className = "show";
    var leader = document.getElementById('leader');
    var name = prompt("Enter your name:", "") || "Unknown";
    scores.push({ name: name, score: score, level: currentLevel });


    scores.sort(function (a, b) { return a.score >= b.score ? -1 : 1 })
    console.log(scores);
    var content = '<table><tr class="score"><th class="rank">Rank</th><th>Name</th><th>Score</th><th>Level</th></tr>';

    scores.map(function (score, rank) {
        content += '<tr class="score"><td class="rank">' + (rank + 1) + '</td><td class="name">' + score.name + '</td><td>' + score.score + '</td><td>' + score.level + '</td></tr>';
    })
    content += "</table>";

    leader.innerHTML = content;

    try {
        localStorage.setItem('score', JSON.stringify(scores));
    } catch (e) { }
}

msg('FIND IT! 😉');
setTimeout(function () {
    newGame();
}, 5000);

