
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
var projectiles = [];
var right = 0;
var left = 1;
var up = 2;
var down = 3;

// Images
var eggImage = new Image();
eggImage.src = "images/egg.png";
var snakeImages = [];
var shotImage = [];
for(image = 0; image < 4; image++) {
    shotImage[image] = new Image();
    shotImage[image].src = "images/shot" + image + ".png";
}
for(image = 0; image < 12; image++) {
    snakeImages[image] = new Image();
    snakeImages[image].src = "images/" + image + ".png";
}

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
    // img, x, y, width, height
    // Drawing projectiles
    for(index = 0; index < projectiles.length; index++) {
        context.drawImage(shotImage[projectiles[index][2]], 
                projectiles[index][0] * tileWidth,
                projectiles[index][1] * tileWidth, 
                tileWidth, tileWidth);
    }
    // If snake needs more than head and tail
    if(snake.length > 2) {
        // Drawing body pieces
        for(index = 1; index < snake.length - 1; index++) {
            context.drawImage(snakeImages[8 + snake[index].direction], 
                    snake[index][0] * tileWidth, snake[index][1] * tileWidth, 
                    tileWidth, tileWidth);
        }
    }
    // If snake needs a tail
    if(snake.length > 1) {
        // Drawing tail
        context.drawImage(snakeImages[4 + snake[0].direction], 
                    snake[0][0] * tileWidth, snake[0][1] * tileWidth, 
                    tileWidth, tileWidth);
    }
    // Drawing head
    context.drawImage(snakeImages[snake[snake.length - 1].direction], 
                snake[snake.length - 1][0] * tileWidth, 
                snake[snake.length - 1][1] * tileWidth, tileWidth, tileWidth);
    // Drawing powerups
    for(index = 0; index < powerups.length; index++) {
        context.drawImage(eggImage, powerups[index][0] * tileWidth, 
                powerups[index][1] * tileWidth, tileWidth, tileWidth);
    }
};

// Keyboard press
function keyDown(event) {
    // "W" or Up arrow
    if(event.keyCode === 87 || event.keyCode === 38) {
        snake[snake.length - 1].direction = up;
    // "D" or Right arrow
    } else if(event.keyCode === 68 || event.keyCode === 39) {
        snake[snake.length - 1].direction = right;
    // "S" or Down arrow
    } else if(event.keyCode === 83 || event.keyCode === 40) {
        snake[snake.length - 1].direction = down;
    // "A" or Left arrow
    } else if(event.keyCode === 65 || event.keyCode === 37) {
        snake[snake.length - 1].direction = left;
    // "Space" bar
    } else if(event.keyCode === 32) {
        createProjectile();
    } else {
        console.log("Unused key: " + event.keyCode);
    }
    requestAnimationFrame(update);
};

// New projectile
function createProjectile() {
    var projectile = [];
    projectile[0] = snake[snake.length - 1][0];
    projectile[1] = snake[snake.length - 1][1];
    projectile[2] = snake[snake.length - 1].direction;
    projectiles.push(projectile);
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
    if(snake[snake.length - 1].direction === up) {
        snakeLink.push(snake[snake.length - 1][0]);
        snakeLink.push(snake[snake.length - 1][1] - 1);
        snakeLink.direction = up;
    } else if(snake[snake.length - 1].direction === down) {
        snakeLink.push(snake[snake.length - 1][0]);
        snakeLink.push(snake[snake.length - 1][1] + 1);
        snakeLink.direction = down;
    } else if(snake[snake.length - 1].direction === left) {
        snakeLink.push(snake[snake.length - 1][0] - 1);
        snakeLink.push(snake[snake.length - 1][1]);
        snakeLink.direction = left;
    // Direction is right
    } else {
        snakeLink.push(snake[snake.length - 1][0] + 1);
        snakeLink.push(snake[snake.length - 1][1]);
        snakeLink.direction = right;
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

// Moves all projectiles
function projectileMove() {
    if(projectiles.length !== 0) {
        for(index = 0; index < projectiles.length; index++) {
            // Moving right
            if(projectiles[index][2] === 0) {
                projectiles[index][0] += 1;
            // Moving left
            } else if(projectiles[index][2] === 1) {
                projectiles[index][0] -= 1;
            // Moving up
            } else if(projectiles[index][2] === 2) {
                projectiles[index][1] -= 1;
            // Moving down
            } else { 
                projectiles[index][1] += 1;
            }
        }
    }
};

// Resetting game
function restart() {
    console.log("Restarting"); // DEBUG
    snake = [[5, 5]];
    snake[0].direction = right;
    powerups = [[30, 30], [20, 10], [25, 5]];
}

// At load time
window.onload = function() {
    restart();
    lastFrameTimer();
    orient();
    window.addEventListener("keydown", keyDown);
    
    background = new rectangle(0, 0, canvas.width, canvas.height, "black");
    mapObjects.push(background);
    
    window.setInterval(snakeMove, 1000/10);
    window.setInterval(projectileMove, 1000/20);
};