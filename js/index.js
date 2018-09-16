var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

var engine = Engine.create();
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;

var render;

createCanvas(2,"x");

function createCanvas (num,axis){
  
  var widthScreen = screen.width;
  var heightScreen = screen.height;

  render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: widthScreen,
    height: widthScreen,
    wireframes: false
  }});

  // First wall
  var topWall = Bodies.rectangle(widthScreen/2, 50, widthScreen*0.9, 20, { isStatic: true });
  var leftWall = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 10, 100, 20, 120, { isStatic: true });
  var rightWall = Bodies.rectangle(widthScreen/2 + (widthScreen*0.9)/2 - 10, 100, 20, 120, { isStatic: true });
  var bottomWall = Bodies.rectangle(widthScreen/2, 150, widthScreen*0.9, 20, { isStatic: true });

  // Second wall
  var topWall_2 = Bodies.rectangle(widthScreen/2, 200, widthScreen*0.9, 20, { isStatic: true });
  var leftWall_2 = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 10, 250, 20, 120, { isStatic: true });
  var rightWall_2 = Bodies.rectangle(widthScreen/2 + (widthScreen*0.9)/2 - 10, 250, 20, 120, { isStatic: true });
  var bottomWall_2 = Bodies.rectangle(widthScreen/2, 300, widthScreen*0.9, 20, { isStatic: true });

  // insert boxes
  var box = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 70, 120, 40, 40,{frictionAir: 0,friction: 0,frictionStatic: 0});
  var box_2 = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 70, 270, 40, 40,{frictionAir: 0,friction: 0,frictionStatic: 0});

  World.add(engine.world, [leftWall, rightWall, topWall, bottomWall, box]);
  World.add(engine.world, [leftWall_2, rightWall_2, topWall_2, bottomWall_2, box_2]);


  Engine.run(engine);

  Render.run(render);

}


var interval = 100;
setInterval(runx,interval);
setInterval(runy,interval);

//--------------------------------------------------

var numberOfBox = 1;

var isRunningx = false;
var isRunningy = false;
var scale = 0.2;
var v = 20;
var vScale = v*scale;
var deltaT = interval/1000;
var a = 10;
var deltaS = 0;
var s = 0;
var t = 0;

var objs = [];

for (i = 0; i < numberOfBox; i++){
  objs[i] = {id: i, "time":[], "distance":[], "velocity":[], "accretion":[]};
}

$('.playx').on('click', function () {
    isRunningx = !isRunningx;
    runx();
});

$('.playy').on('click', function () {
    isRunningy = !isRunningy;
    v = -v;
    runy();
});


function runx(){
  if(isRunningx){
    
    console.log("t = " + t);
    console.log("s = " + s);
    console.log("v = " + v);
    console.log("a = " + a);
    // console.log("deltaS = " + deltaS);

    objs[0].time.push(t);
    objs[0].distance.push(s);
    objs[0].velocity.push(v);
    objs[0].accretion.push(a);

    console.log(objs[0].time);
    console.log(objs[0].distance);
    console.log(objs[0].velocity);
    console.log(objs[0].accretion);
    console.log("-------------");

    Body.setVelocity( box, {x: vScale, y: 0});

    deltaS = v*deltaT + 0.5*a*Math.pow(deltaT,2);
    v = v + a*deltaT;
    s = s + deltaS;
    t = t + deltaT;
    vScale = v*scale;


  }
}

function runy(){
  if(isRunningy){

    console.log("t = " + t);
    console.log("s = " + s);
    console.log("v = " + v);
    console.log("a = " + a);  

    objs[0].time.push(t);
    objs[0].distance.push(s);
    objs[0].velocity.push(v);
    objs[0].accretion.push(a);

    console.log(objs[0].time);
    console.log(objs[0].distance);
    console.log(objs[0].velocity);
    console.log(objs[0].accretion);
    console.log("-------------"); 
     
    Body.setVelocity( box, {x: 0, y: vScale});

    deltaS = v*deltaT + 0.5*a*Math.pow(deltaT,2);
    v = v + a*deltaT;
    s = s + deltaS;
    t = t + deltaT;
    vScale = v*scale;
  }
}