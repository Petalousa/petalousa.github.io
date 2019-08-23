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
    this.draw = function(ctx){
            ctx.fillStyle = "black";
            ctx.font = font;
            ctx.fillText(this.text, this.x, this.y);   
    }
    this.update = function(deltaTime, text){
            this.text = text;
    }
    
}

function torpedoObject(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = 30;
    this.height = 3;
    this.active = true;
    
    this.update = function(deltaTime){
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
        
        if(this.x < 0 || this.x > width * scale){
            this.active = false;
        }
        if(this.y < 0 || this.y > height * scale){
            this.active = false;
        }
    }
    
    this.draw = function(ctx){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.ellipse(this.x/scale, this.y/scale, this.width/2, this.height/2, 2*Math.PI, 0, 2*Math.PI);
        ctx.stroke();
    }
}

function depthbombObject(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.width = 10;
    this.height = 10;
    this.active = true;
    
    this.update = function(deltaTime){
        this.x += this.dx * deltaTime;
        this.y += this.dy * deltaTime;
        
        if(this.x < 0 || this.x > width * scale){
            this.active = false;
        }
        if(this.y < 0 || this.y > height * scale){
            this.active = false;
        }
    }
    
    this.draw = function(ctx){
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.ellipse(this.x/scale, this.y/scale, this.width/2, this.height/2, 2*Math.PI, 0, 2*Math.PI);
        ctx.stroke();
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
    
    this.dxMax = 2.5;
    this.dyMax = 2;
    
    this.drag = 0.1;
    
    this.activeX = false;
    this.activeY = false;
    
    this.torpedoMax = 100;//4
    this.torpedoActive = 0;
    this.torpedoFiring = false;
    this.torpedoFireTime = 0;
    this.torpedoFireDelay = 1;//150;
    this.torpedoList = [];
    
    this.depthbombMax = 100;//2
    this.depthbombActive = 0;
    this.depthbombFiring = false;
    this.depthbombFireTime = 0;
    this.depthbombFireDelay = 1;// 600;
    this.depthbombList = [];
    
    this.draw = function(ctx){
            ctx.strokeStyle = "grey";
            ctx.beginPath();
            ctx.ellipse(this.x/scale, this.y/scale, this.width/2, this.height/2, 2*Math.PI, 0, 2*Math.PI);
            ctx.stroke();
            
            for (torpedo of this.torpedoList){
                torpedo.draw(ctx);
            }
            for (depthbomb of this.depthbombList){
                depthbomb.draw(ctx);
            }
        }
       
    this.fireTorpedo = function(){
        this.torpedoFiring = true;
    }
    
    this.fireDepthbomb = function(){
        this.depthbombFiring = true;
    }
       
    this.update = function(deltaTime){
        if (this.torpedoFireTime > 0){
            this.torpedoFireTime -= deltaTime;
        }else{
            if(this.torpedoFiring){
                if(this.torpedoActive < this.torpedoMax){
                    this.torpedoList.push(new torpedoObject(this.x, this.y, 4 + this.dx *.01, this.dy * 0.1))
                    this.torpedoFireTime = this.torpedoFireDelay
                    this.torpedoActive++;
                }
            }
        }
        this.torpedoFiring = false;
        
        if (this.depthbombFireTime > 0){
            this.depthbombFireTime -= deltaTime;
        }else{
            if(this.depthbombFiring){
                if(this.depthbombActive < this.depthbombMax){
                    //DO depthbomb THINGS
                    this.depthbombList.push(new depthbombObject(this.x, this.y, this.dx *.1, 2.5));
                    this.depthbombFireTime = this.depthbombFireDelay;
                    this.depthbombActive++;
                }
            }
        }
        this.depthbombFiring = false;
        
        //UPDATE ACTIVE TORPEDOS, REMOVE INACTIVE TORPEDOS
        for(let i = 0; i < this.torpedoActive; i++){
            if (!this.torpedoList[i].active){
                this.torpedoList.splice(i, 1);
                this.torpedoActive--;
                i--;
                continue;
            }else{
                this.torpedoList[i].update(deltaTime);
            }
        }
     
        for(let i = 0; i < this.depthbombActive; i++){
            if (!this.depthbombList[i].active){
                this.depthbombList.splice(i, 1);
                this.depthbombActive--;
                i--;
                continue;
            }else{
                this.depthbombList[i].update(deltaTime);
            }
        }
        
        if (this.dx > this.dxMax){ this.dx = this.dxMax };
        if (this.dx < -1 * this.dxMax){ this.dx = -1 * this.dxMax };
        if (this.dy > this.dyMax){ this.dy = this.dyMax };
        if (this.dy < -1 * this.dyMax){ this.dy = -1 * this.dyMax };
        
        this.x += (this.dx * deltaTime);
        this.y += (this.dy * deltaTime);
        
        //let dragX = 0.98;
        let dragX = 0.8;
        //let dragY = 0.992;
        let dragY = 0.8;
        
        if(!this.activeX){
            this.dx = (this.dx * Math.pow(dragX, deltaTime));
        }
        if(!this.activeY){
            this.dy = (this.dy *  Math.pow(dragY, deltaTime));
        }
        
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
//updateObjects.push(deltaTimeText);

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
    time_slow = .02;
    if(keyStates["up"] || keyStates["w"]){
        playerSub.dy = -1 * playerSub.dyMax
        playerSub.activeY = true;
    }else if(keyStates["down"] || keyStates["s"]){
        playerSub.dy = playerSub.dyMax;
        playerSub.activeY = true;
    }
    if(keyStates["left"] || keyStates["a"]){
        playerSub.dx = -1 * playerSub.dxMax;
        playerSub.activeX = true;
    } else if(keyStates["right"] || keyStates["d"]){
        playerSub.dx = playerSub.dxMax;
        playerSub.activeX = true;
    }
    
    if(!keyStates["up"] && !keyStates["w"] && !keyStates["down"] && !keyStates["s"]){
        playerSub.activeY = false;
    }
    if(!keyStates["left"] && !keyStates["a"] && !keyStates["right"] && !keyStates["d"]){
        playerSub.activeX = false;
    }
    
    if(keyStates["z"]){
        playerSub.fireTorpedo();
    }
    if(keyStates["x"]){
        playerSub.fireDepthbomb();
    }
    
    for (updateableItem of updateObjects){
        updateableItem.update(deltaTime);
    }
    
    deltaTimeText.text = playerSub.torpedoActive
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
