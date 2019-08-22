/*



window is 800x600
gameworld is 10x the size



*/
var scale = 10;

//##OBJECT CONSTRUCTORS##
function drawable(x, y){
    this.x = x;
    this.y = y;
    
}

function drawableText(x, y, text, font){
    drawable.call(this, x, y);
    this.text = text;
    this.font = font;
    this.draw = 
        function(ctx){
            ctx.fillStyle = "black";
            ctx.font = font;
            ctx.fillText(this.text, this.x, this.y);   
        }
    this.update =
        function(deltaTime){
            this.text = deltaTime;
        }
    
}

function subObject(x, y){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.dx = 0;
    this.dy = 0;
    this.health = 100;
    
    this.width = 50;
    this.height = 20;
    
    this.dxMax = 3;
    this.dyMax = 1.7;
    
    this.drag = 0.1;
    
    this.draw = 
        function(ctx){
            ctx.strokeStyle = "grey";
            ctx.beginPath();
            ctx.ellipse(this.x/scale, this.y/scale, this.width/2, this.height/2, 2*Math.PI, 0, 2*Math.PI);
            ctx.stroke();
        }
        
    this.update =
        function(deltaTime){
            this.x += (this.dx * deltaTime);
            this.y += (this.dy * deltaTime);
            
            let dragX = 0.98;
            let dragY = 0.992;
            
            this.dx = (this.dx * Math.pow(dragX, deltaTime));
            this.dy = (this.dy *  Math.pow(dragY, deltaTime));
            
            //cap position to screen limits
            if(this.x < 0) { this.x = 0; }
            if(this.y < 0) { this.y = 0; }
            if(this.x > parseInt(width)*scale) { this.x = parseFloat(width)*scale; }
            if(this.y > parseInt(height)*scale) { this.y = parseFloat(height)*scale; }
        }
}

//DECLARATIONS
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let width = canvas.getAttribute("width")
let height = canvas.getAttribute("height")

let globalState = "waiting_on_click"
let canvasActive = false;

let drawObjects = []
let updateObjects = []

let deltaTimeText = new drawableText(20, 30, "placeholder", "15px arial");
drawObjects.push(deltaTimeText);
updateObjects.push(deltaTimeText);

let playerSub = new subObject(width*scale*.5, height*scale*.5);
drawObjects.push(playerSub);
updateObjects.push(playerSub);

let keyStates = {
   "w":false,
   "a":false,
   "s":false,
   "d":false,
   "left":false,
   "right":false,
   "up":false,
   "down":false,
   "z":false,
   "x":false,
   "control":false
}
let keyMap = {
    87:"w",
    65:"a",
    83:"s",
    68:"d",
    37:"left",
    39:"right",
    38:"up",
    40:"down",
    90:"z",
    88:"x"
}

//MOUSE AND KEY LISTENERS
canvas.addEventListener("click", mouseClick);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

function mouseClick(){
    canvasActive = true;
}

function keyDown(e){
    let key = keyMap[e.keyCode];
    keyStates[key] = true;
}

function keyUp(e){
    let key = keyMap[e.keyCode];
    keyStates[key] = false;
}

//FUNCTIONS
function mainLoop(currentTime){
    var deltaTime = currentTime - oldTime;
    
    //run game only when canvas active
    if(canvasActive){
        update(deltaTime);
    }
    
    draw(ctx);
    
    oldTime = currentTime;
    window.requestAnimationFrame(mainLoop);
}


//PERFORMS ALL DRAW OPERATIONS
function update(deltaTime){  
    if(keyStates["up"] || keyStates["w"]){
        playerSub.dy = -1 * playerSub.dyMax;
    }
    if(keyStates["down"] || keyStates["s"]){
        playerSub.dy = playerSub.dyMax;
    }
    if(keyStates["left"] || keyStates["a"]){
        playerSub.dx = -1 * playerSub.dxMax;
    }
    if(keyStates["right"] || keyStates["d"]){
        playerSub.dx = playerSub.dxMax;
    }
    
    if(!keyStates["up"] && !keyStates["w"] && !keyStates["down"] && !keyStates["s"]){
    //    playerSub.dy = 0;
    }
    if(!keyStates["left"] && !keyStates["a"] && !keyStates["right"] && !keyStates["d"]){
    //    playerSub.dx = 0;
    }
    
    
    
    for (updateableItem of updateObjects){
        updateableItem.update(deltaTime);
    }
}


//PERFORMS ALL DRAW OPERATIONS
function draw(ctx){
    //wipe canvas
    refreshColor = "white";
    ctx.fillStyle = refreshColor;
    ctx.fillRect(0,0,width, height);
    
    for (drawableItem of drawObjects){
        drawableItem.draw(ctx);
    }
    
    if(!canvasActive){
        drawInactiveState(ctx);
    }
    
}

function drawInactiveState(ctx){
    //draw transparent white over screen
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillStyle = "#FFFFFFCC";
    ctx.fillRect(0, 0, width, height);
    
    //draw pause text
    let pauseText = "click to continue";
    ctx.font = "25px arial";
    ctx.fillStyle = "black";
    ctx.fillText(pauseText, width/2 - 100, height/2, 200)  
}

//start loop
var oldTime = 0;
window.requestAnimationFrame(mainLoop);
