
// Canvas
var canvas = document.querySelector("canvas");
document.body.appendChild(canvas);
var context = canvas.getContext("2d");

// Initializations
var landscape;
var direction;
var tileWidth;
var snake;
var powerups;

// Declarations
var timeSinceLastFrame = 0;
var mapObjects = [];

// Updates timeSinceLastFrame every 1000/60 ms
var lastFrameTimer = function() {
    setInterval(function() {
        timeSinceLastFrame += 1;
    },
    1000/60);
};

// Constructor for an image that can be drawn with the draw function
var sprite = function(newX, newY, newWidth, newHeight, newSource) {
    // x, y, width, height, source
    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
    this.image = new Image();
    this.image.src = newSource;
    this.frame = 0;
    this.animation = 0;
};

// Constructor for an object that can be drawn with the draw function
var rectangle = function(newX, newY, newWidth, newHeight, newColor) {
    // x, y, width, height, color
    this.x = newX;
    this.y = newY;
    this.width = newWidth;
    this.height = newHeight;
    this.color = newColor;
 };

// Sets the landscape variable based on avaible 16:9 space
var orient = function(){
    if((window.innerWidth / 16) * 9 <= window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = (canvas.width / 16) * 9;
        landscape = false;
        console.log("Set to portrait"); // DEBUG
        tileWidth = canvas.width / 64;
    } else {
        canvas.width = (window.innerHeight / 9) * 16;
        canvas.height = window.innerHeight;
        landscape = true;
        console.log("Set to landscape"); // DEBUG
        tileWidth = canvas.width / 32;
    }
};

// Called to redraw every object in mapObjects
var update = function() {
    // x, y, width, height
    if(timeSinceLastFrame > 0) {
        timeSinceLastFrame = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(index = 0; index < mapObjects.length; index++) {
            if(mapObjects[index] instanceof sprite) {
                // image, frameX, frameY, frameWidth, frameHeight,
                //      x, y, width, height
                context.drawImage(mapObjects[index].image,
                        mapObjects[index].frame * mapObjects[index].width,
                        mapObjects[index].animation * mapObjects[index].height,
                        mapObjects[index].width, mapObjects[index].height,
                        mapObjects[index].x, mapObjects[index].y,
                        mapObjects[index].width, mapObjects[index].height);
            } else {
                context.fillStyle = mapObjects[index].color;
                // x, y, width, height
                context.fillRect(mapObjects[index].x, mapObjects[index].y,
                        mapObjects[index].width, mapObjects[index].height);
            }
        }
        drawSnake();
    }
};

// Draws the current snake
function drawSnake() {
    for(index = 0; index < snake.length; index++) {
        context.fillStyle = "white";
        context.fillRect(snake[index][0] * tileWidth, 
                snake[index][1] * tileWidth, tileWidth, tileWidth);
    }
    for(index = 0; index < powerups.length; index++) {
        context.fillStyle = "yellow";
        context.fillRect(powerups[index][0] * tileWidth, 
                powerups[index][1] * tileWidth, tileWidth, tileWidth);
    }
};

// Keyboard press
function keyDown(event) {
    // "W" Pressed
    if(event.charCode === 119) {
        direction = "up";
    // "D" Pressed
    } else if(event.charCode === 100) {
        direction = "right";
    // "S" Pressed
    } else if(event.charCode === 115) {
        direction = "down";
    // "A" Pressed
    } else if(event.charCode === 97) {
        direction = "left";
    } else {
        console.log("Unused key: " + event.charCode);
    }
    requestAnimationFrame(update);
};

// New powerup
function createPowerup() {
    var powerup = [];
    powerup[0] = Math.floor((Math.random() * 64));
    powerup[1] = Math.floor((Math.random() * 36));
    powerups.push(powerup);
    requestAnimationFrame(update);
};

// Moves the snake along
function snakeMove() {
    var snakeLink = [];
    if(direction === "up") {
        snakeLink.push(snake[snake.length - 1][0]);
        snakeLink.push(snake[snake.length - 1][1] - 1);
    } else if(direction === "down") {
        snakeLink.push(snake[snake.length - 1][0]);
        snakeLink.push(snake[snake.length - 1][1] + 1);
    } else if(direction === "left") {
        snakeLink.push(snake[snake.length - 1][0] - 1);
        snakeLink.push(snake[snake.length - 1][1]);
    // Direction is right
    } else {
        snakeLink.push(snake[snake.length - 1][0] + 1);
        snakeLink.push(snake[snake.length - 1][1]);
    }
    // Moving snake forward
    snake.push(snakeLink);
    // Checking if moved outside of map
    if(snake[snake.length - 1][0] < 0
            || snake[snake.length - 1][0] > 63
            || snake[snake.length - 1][1] < 0
            || snake[snake.length - 1][1] > 35) {
        restart();
    // Checking if snake has eaten itself
    } else {
        var restartRequired = false;
        if(snake.length > 3) {
            for(index = 0; index < snake.length - 1; index++) {
                if(snake[index][0] === snake[snake.length - 1][0]
                        && snake[index][1] === snake[snake.length - 1][1]) {
                    restartRequired = true;
                }
            }
        }
        if(restartRequired) {
            restart();
        // Checking if powerup has been eaten
        } else {
            var powerupEaten = false;
            for(index = 0; index < powerups.length; index++) {
                if(powerups[index][0] === snake[snake.length - 1][0]
                        && powerups[index][1] === snake[snake.length - 1][1]) {
                    powerups.splice(index, 1);
                    powerupEaten = true;
                }
            }
            if(powerupEaten) {
                createPowerup();
            } else {
                snake.splice(0, 1);
            }
        }
    }
    requestAnimationFrame(update);
};

// Resetting game
function restart() {
    direction = "right";
    snake = [[5, 5]];
    powerups = [[30, 30]];
}

// At load time
window.onload = function() {
    restart();
    lastFrameTimer();
    orient();
    window.addEventListener("keypress", keyDown);
    
    background = new rectangle(0, 0, canvas.width, canvas.height, "black");
    mapObjects.push(background);
    
    window.setInterval(snakeMove, 1000/15);
};