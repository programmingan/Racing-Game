const ws = new WebSocket("wss://192.168.86.204:9898");

ws.onopen = function(){
    console.log("connected to server");
    ws.send("hi this is a client");
}

ws.onmessage = function(e){
    console.log("recieved: " + e.data);
    let data = e.data.split(" ");
    if(data[0] == "pos"){
        redPos = parseInt(data[1]);
        bluePos = parseInt(data[2]);
    }
    else if(data[0] == "restartgame") {
        if(data[1] == "blue"){
              console.log("blue won");
              detectWin();
        }
        if(data[1] == "red"){
          console.log("red won");
          detectWin();
        }
    }
    else if(data[0] == "startgame"){
        start();
    }
};

function runGame(){
    ws.send("startgame");
}



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const redCar = document.getElementById("redCar");
const blueCar = document.getElementById("blueCar");
const btn = document.getElementById("btn");
const results = document.getElementById("results");

let redA = true;
let blueJ = true;
const speed = 10;

let redPos = 10;
let bluePos = 10;

let started = false;

const finishLine = canvas.width - 30;

document.addEventListener("keydown", vroom);
btn.addEventListener("click", runGame);

let blueImg = new Image();
blueImg.src = "img/BlueCarAnimation.png";

let redImg = new Image();
redImg.src = "img/RedCarAnimation.png";

let numColumns = 9;
let numRows = 1;

let frameWidth = 32;
let frameHeight = blueImg.height / numRows;
let maxFrame = numColumns * numRows - 1;

let currentFrame = 0;

setInterval(draw, 33);

function detectWin(){
  if(redPos + 20 >= finishLine){
      ws.send("gameover red");
    results.innerHTML = "Red car wins!";
    started = false;
  }
    if (bluePos + 20 >= finishLine){
      ws.send("gameover blue");
      results.innerHTML = "Blue car wins!";
      started = false;
    }
}

function start() {
    started = false;
  redPos = 10;
  bluePos = 10;
  countdown(3);
}

function countdown(timeLeft) {
  if (timeLeft == 0) {
    results.innerHTML = "GO!";
    started = true;
    return;
  }
  results.innerHTML = timeLeft;
  setTimeout(countdown, 1000, timeLeft - 1);
}

function drawTrack() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "yellow";
  ctx.fillRect(finishLine, 0, 10, canvas.height);
}

function draw() {
  drawTrack();

  currentFrame++;
  if(currentFrame > maxFrame){
    currentFrame = 0;
  }

  let column = currentFrame % numColumns;
  let row = Math.floor(currentFrame / numColumns);

  ctx.drawImage(redImg, column * frameWidth, row * frameHeight, frameWidth, frameHeight, redPos, 46, frameWidth, frameHeight);
  ctx.drawImage(blueImg, column * frameWidth, row * frameHeight, frameWidth, frameHeight, bluePos, 7, frameWidth, frameHeight);
}

function vroom(event) {
  if (!started) {
    return;
  }
  if (event.key == "a") {
    if (redA) {
        ws.send("red car moves");
      // redPos += speed;
      redA = false;
    }
  } else if (event.key == "s") {
    if (!redA) {
        ws.send("red car moves");
      // redPos += speed;
      redA = true;
    }
  } else if (event.key == "j") {
    if (blueJ) {
        ws.send("blue car moves");
      // bluePos += speed;
      blueJ = false;
    }
  } else if (event.key == "k") {
    if (!blueJ) {
        ws.send("blue car moves");
      // bluePos += speed;
      blueJ = true;
    }
  }

    detectWin();
}
