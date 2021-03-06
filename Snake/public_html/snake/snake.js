
// Initializations
var canvas;
var context;
var landscape;
var direction;
var tileWidth;
var snake;
var powerups;
var canvasDisplay;

// Declarations
var timeSinceLastFrame = 0;
var projectiles = [];
var right = 0;
var left = 1;
var up = 2;
var down = 3;
var longestSnake = 1;
var mirrorSnake = false;
var increaseSnake = 0;
var paused = false;

// Images
var eggImage = new Image();
eggImage.src = "images/egg.png";
var ringImage = new Image();
ringImage.src = "images/ring.png";
var rings = [];
var shotImage = [];
for(image = 0; image < 4; image++) {
    shotImage[image] = new Image();
    shotImage[image].src = "images/shot" + image + ".png";
}
var snakeImages = [];
for(image = 0; image < 12; image++) {
    snakeImages[image] = new Image();
    snakeImages[image].src = "images/" + image + ".png";
}
var invertedImages = [];
for(image = 0; image < 12; image++) {
    invertedImages[image] = new Image();
    invertedImages[image].src = "inverted/" + image + ".png";
}

// Creating canvas and context
canvas = document.createElement("canvas");
context = canvas.getContext("2d");
document.body.appendChild(canvas);

/*
// Play button
var toggleSnakeCanvas = function() {
    // Enabling canvas
    if(canvas.style.display === "none") {
        canvas.style.display = canvasDisplay;
        document.getElementById("snakeButton").value="Close";
        paused = false;
    // Disabling canvas
    } else {
        canvasDisplay = canvas.style.display;
        canvas.style.display = "none";
        document.getElementById("snakeButton").value="Play";
        paused = true;
    }
};
*/

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
        tileWidth = canvas.width / 64;
    } else {
        canvas.width = (window.innerHeight / 9) * 16;
        canvas.height = window.innerHeight;
        landscape = true;
        tileWidth = canvas.width / 64;
    }
};

// Called to redraw every object
var update = function() {
    // x, y, width, height
    if(!paused && timeSinceLastFrame > 0) {
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        timeSinceLastFrame = 0;
    }
};

// Draws the current snake
function drawSnake() {
    // img, x, y, width, height
    // Drawing mirror snake
    if(mirrorSnake) {
        drawThisSnake(mirrorSnake);
    }
    drawThisSnake(snake);
    // Drawing projectiles
    for(index = 0; index < projectiles.length; index++) {
        context.drawImage(shotImage[projectiles[index][2]], 
                projectiles[index][0] * tileWidth,
                projectiles[index][1] * tileWidth, 
                tileWidth, tileWidth);
    }
    // Drawing powerups
    for(index = 0; index < powerups.length; index++) {
        context.drawImage(eggImage, powerups[index][0] * tileWidth, 
                powerups[index][1] * tileWidth, tileWidth, tileWidth);
    }
    // Drawing rings
    for(index = 0; index < rings.length; index++) {
        context.drawImage(ringImage, rings[index][0] * tileWidth,
                rings[index][1] * tileWidth, tileWidth, tileWidth);
    }
    // Drawing text
    context.fillStyle = "white";
    context.font = canvas.width / 50 + "px Arial";
    context.fillText("Longest: " + longestSnake, canvas.width/100,
            canvas.height/1.02);
    context.fillText("Current: " + snake.length, canvas.width/7,
            canvas.height/1.02);
};

// Draws the given snake
function drawThisSnake(inputSnake) {
    // If snake needs more than head and tail
    var currentImages = snakeImages;
    if(inputSnake === mirrorSnake) {
        currentImages = invertedImages;
    }
    if(inputSnake.length > 2) {
        // Drawing body pieces
        for(index = 1; index < inputSnake.length - 1; index++) {
            context.drawImage(currentImages[8 + inputSnake[index].direction], 
                    inputSnake[index][0] * tileWidth,
                    inputSnake[index][1] * tileWidth, 
                    tileWidth, tileWidth);
        }
    }
    // If snake needs a tail
    if(inputSnake.length > 1) {
        // Drawing tail
        context.drawImage(currentImages[4 + inputSnake[0].direction], 
                    inputSnake[0][0] * tileWidth, 
                    inputSnake[0][1] * tileWidth, 
                    tileWidth, tileWidth);
    }
    // Drawing head
    context.drawImage(currentImages[inputSnake[inputSnake.length - 1].direction], 
                inputSnake[inputSnake.length - 1][0] * tileWidth, 
                inputSnake[inputSnake.length - 1][1] * tileWidth, 
                tileWidth, tileWidth);
    }

// Keyboard press
function keyDown(event) {
    // "W" or Up arrow
    if(event.keyCode === 87 || event.keyCode === 38) {
        if(snake[snake.length - 1].direction !== down) {
            snake[snake.length - 1].direction = up;
            if(mirrorSnake) {
                mirrorSnake[mirrorSnake.length - 1].direction = down;
            }
        }
    // "D" or Right arrow
    } else if(event.keyCode === 68 || event.keyCode === 39) {
        if(snake[snake.length - 1].direction !== left) {
            snake[snake.length - 1].direction = right;
            if(mirrorSnake) {
                mirrorSnake[mirrorSnake.length - 1].direction = left;
            }
        }
    // "S" or Down arrow
    } else if(event.keyCode === 83 || event.keyCode === 40) {
        if(snake[snake.length - 1].direction !== up) {
            snake[snake.length - 1].direction = down;
            if(mirrorSnake) {
                mirrorSnake[mirrorSnake.length - 1].direction = up;
            }
        }
    // "A" or Left arrow
    } else if(event.keyCode === 65 || event.keyCode === 37) {
        if(snake[snake.length - 1].direction !== right) {
            snake[snake.length - 1].direction = left;
            if(mirrorSnake) {
                mirrorSnake[mirrorSnake.length - 1].direction = right;
            }
        }
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
function createPowerup(type) {
    if(type.length < 5) {
        var powerup = [];
        powerup[0] = Math.floor((Math.random() * 64));
        powerup[1] = Math.floor((Math.random() * 36));
        type.push(powerup);
        requestAnimationFrame(update);
    }
};

// Checking if a snake has collided with itself
function overlap(inputSnake) {
    // Ensuring the snake is capable of overlapping
    if(inputSnake.length > 3) {
        // Iterating over every link
        for(index = 0; index < inputSnake.length - 1; index++) {
            // Checking for overlap
            if(inputSnake[index][0] === inputSnake[inputSnake.length - 1][0]
                    && inputSnake[index][1]
                    === inputSnake[inputSnake.length - 1][1]) {
                return true;
            }
        }
    }
    return false;
};

// Moving the given snake
function moveSnake(inputSnake) {
    var snakeLink = [];
    if(inputSnake[inputSnake.length - 1].direction === up) {
        snakeLink.push(inputSnake[inputSnake.length - 1][0]);
        snakeLink.push(inputSnake[inputSnake.length - 1][1] - 1);
        snakeLink.direction = up;
    } else if(inputSnake[inputSnake.length - 1].direction === down) {
        snakeLink.push(inputSnake[inputSnake.length - 1][0]);
        snakeLink.push(inputSnake[inputSnake.length - 1][1] + 1);
        snakeLink.direction = down;
    } else if(inputSnake[inputSnake.length - 1].direction === left) {
        snakeLink.push(inputSnake[inputSnake.length - 1][0] - 1);
        snakeLink.push(inputSnake[inputSnake.length - 1][1]);
        snakeLink.direction = left;
    // Direction is right
    } else {
        snakeLink.push(inputSnake[inputSnake.length - 1][0] + 1);
        snakeLink.push(inputSnake[inputSnake.length - 1][1]);
        snakeLink.direction = right;
    }
    // Moving snake forward
    inputSnake.push(snakeLink);
    // Checking if moved outside of map
    if(inputSnake[inputSnake.length - 1][0] < 0
            || inputSnake[inputSnake.length - 1][0] > 63
            || inputSnake[inputSnake.length - 1][1] < 0
            || inputSnake[inputSnake.length - 1][1] > 35) {
        return false;
    // Checking if snake has eaten itself
    } else {
        if(overlap(inputSnake)) {
            return false;
        // Checking if powerup has been eaten
        } else {
            var powerupEaten = false;
            for(index = 0; index < powerups.length; index++) {
                if(powerups[index][0] === inputSnake[inputSnake.length - 1][0]
                        && powerups[index][1] 
                        === inputSnake[inputSnake.length - 1][1]) {
                    powerups.splice(index, 1);
                    powerupEaten = true;
                }
            }
            if(powerupEaten) {
                if(longestSnake < snake.length) {
                    longestSnake = snake.length;
                }
                if(powerups.length < 4) {
                    createPowerup(powerups);
                }
                if(inputSnake === mirrorSnake) {
                    increaseSnake += 1;
                    inputSnake.splice(0, 1);
                }
            } else {
                if(increaseSnake > 0) {
                    increaseSnake -= 1;
                } else {
                    inputSnake.splice(0, 1);
                }
            }
        }
        // Checking if ring has been eaten
        for(index = 0; index < rings.length; index++) {
            if(rings[index][0] === inputSnake[inputSnake.length - 1][0]
                    && rings[index][1] === inputSnake[inputSnake.length - 1][1]) {
                mirrorSnake = [inputSnake.length];
                for(index2 = 0; index2 < inputSnake.length; index2++) {
                    mirrorSnake[index2] = inputSnake[index2].slice();
                    mirrorSnake[index2] = inputSnake[index2].slice();
                    mirrorSnake[index2].direction = snake[index2].direction;
                }
                rings.splice(index, 1);
            }
        }
    }
    return true;
};

// Moves the snake along
function snakeMove() {
    if(!paused) {
        // Checking if snake is still alive
        if(moveSnake(snake)) {
            // Requesting frame for snakes new position
            requestAnimationFrame(update);
        // Snake has died
        } else {
            // Restarting game
            restart();
        }
        // Checking if mirror snake was spawned
        if(mirrorSnake) {
            // Checking if mirror snake is still alive
            if(moveSnake(mirrorSnake)) {
                // Requesting frame for mirror snakes new position
                requestAnimationFrame(update);
            // Mirror snake died
            } else {
                // Despawning dead snake
                mirrorSnake = false;
            }
        }
    }
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
    snake = [[5, 5]];
    snake[0].direction = right;
    powerups = [[30, 30], [20, 10], [25, 5]];
    rings = [[20, 20]];
}

// At load time
window.onload = function() {
    // toggleSnakeCanvas();
    restart();
    lastFrameTimer();
    orient();
    window.addEventListener("keydown", keyDown);
    window.setInterval(snakeMove, 1000/10);
    window.setInterval(projectileMove, 1000/20);
    window.setInterval(function() {
        if(rings.length < 1) {
            createPowerup(rings);
            if(powerups.length < 5) {
                createPowerup(powerups);
            }
        }
    }, 10000);
};