var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

var engine = Engine.create();
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;

var render;
var boxes = [];

createCanvas(3,"x");

function createCanvas (num,axis){
  
  var canvas = document.getElementById('canvas');
  var widthScreen = canvas.offsetWidth;
  var heightScreen = canvas.offsetHeight;

  render = Render.create({
  element: document.getElementById('canvas'),
  engine: engine,
  options: {
    width: widthScreen,
    height: heightScreen,
    wireframes: false
  }});

  console.log(render)

  var thickBorder = widthScreen*0.02;
  var widthCenter = widthScreen/2;
  var heightCenter = heightScreen/2;
  var widthHorizentalborder = widthScreen*0.9;
  var widthVerticalborder = heightScreen*0.12;
  var halfAllHeightBox = (widthVerticalborder + thickBorder)/2;
  var spaceBetweenBox = (widthVerticalborder+thickBorder)*0.5;

  console.log(num-1,(num-2)/2);

  var h = 0;
  if (num % 2 == 0){
    h -= spaceBetweenBox/2 + halfAllHeightBox*(num-1) + spaceBetweenBox*((num-2)/2);
  }else{
    if (num == 1){
      h -= halfAllHeightBox;
    }else{
      h -= halfAllHeightBox*(num-1) + spaceBetweenBox*Math.floor(num/2);
    } 
  }

  for (var i = 0, h; i < num; i++, h += (widthVerticalborder + spaceBetweenBox)) {
    // console.log(i,h);
    var topWall = Bodies.rectangle(widthCenter,
                                   heightCenter + widthVerticalborder/2 + h, 
                                   widthScreen*0.9, 
                                   thickBorder, 
                                   { isStatic: true });
    var bottomWall = Bodies.rectangle(widthCenter,
                                   heightCenter - widthVerticalborder/2 + h, 
                                   widthScreen*0.9, 
                                   thickBorder, 
                                   { isStatic: true });
    var leftWall = Bodies.rectangle(widthCenter - widthHorizentalborder/2 + thickBorder/2, 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true });
    var rightWall = Bodies.rectangle(widthCenter + widthHorizentalborder/2 - thickBorder/2, 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true });  
  
    var box = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 70, 120 + h, 40, 40,{frictionAir: 0,friction: 0,frictionStatic: 0});
    boxes.push(box);
    World.add(engine.world, [leftWall, rightWall, topWall, bottomWall, box]);
  }

  // // First wall
  // var topWall = Bodies.rectangle(widthScreen/2, 50, widthScreen*0.9, 20, { isStatic: true });
  // var leftWall = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 10, 100, 20, 120, { isStatic: true });
  // var rightWall = Bodies.rectangle(widthScreen/2 + (widthScreen*0.9)/2 - 10, 100, 20, 120, { isStatic: true });
  // var bottomWall = Bodies.rectangle(widthScreen/2, 150, widthScreen*0.9, 20, { isStatic: true });

  // // Second wall
  // var topWall_2 = Bodies.rectangle(widthScreen/2, 200, widthScreen*0.9, 20, { isStatic: true });
  // var leftWall_2 = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 10, 250, 20, 120, { isStatic: true });
  // var rightWall_2 = Bodies.rectangle(widthScreen/2 + (widthScreen*0.9)/2 - 10, 250, 20, 120, { isStatic: true });
  // var bottomWall_2 = Bodies.rectangle(widthScreen/2, 300, widthScreen*0.9, 20, { isStatic: true });

  // insert boxes
  // var box = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 70, 120, 40, 40,{frictionAir: 0,friction: 0,frictionStatic: 0});
  // var box_2 = Bodies.rectangle(widthScreen/2 - (widthScreen*0.9)/2 + 70, 270, 40, 40,{frictionAir: 0,friction: 0,frictionStatic: 0});

  // World.add(engine.world, [leftWall, rightWall, topWall, bottomWall, box]);
  // World.add(engine.world, [leftWall_2, rightWall_2, topWall_2, bottomWall_2, box_2]);


  Engine.run(engine);

  Render.run(render);

}


var interval = 100;
setInterval(runx,interval);
// setInterval(runy,interval);

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
    runx("x");
});

$('.playy').on('click', function () {
    isRunningx = !isRunningx;
    v = -v;
    runx("y");
});


function runx(axis){
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

    if (axis == "x") {
      Body.setVelocity( boxes[0], {x: vScale, y: 0});
    }else{
      Body.setVelocity( boxes[0], {x: 0, y: vScale});
    }
    deltaS = v*deltaT + 0.5*a*Math.pow(deltaT,2);
    v = v + a*deltaT;
    s = s + deltaS;
    t = t + deltaT;
    vScale = v*scale;


  }
}

// function runy(){
//   if(isRunningy){

//     console.log("t = " + t);
//     console.log("s = " + s);
//     console.log("v = " + v);
//     console.log("a = " + a);  

//     objs[0].time.push(t);
//     objs[0].distance.push(s);
//     objs[0].velocity.push(v);
//     objs[0].accretion.push(a);

//     console.log(objs[0].time);
//     console.log(objs[0].distance);
//     console.log(objs[0].velocity);
//     console.log(objs[0].accretion);
//     console.log("-------------"); 
     
//     Body.setVelocity( box, {x: 0, y: vScale});

//     deltaS = v*deltaT + 0.5*a*Math.pow(deltaT,2);
//     v = v + a*deltaT;
//     s = s + deltaS;
//     t = t + deltaT;
//     vScale = v*scale;
//   }
// }