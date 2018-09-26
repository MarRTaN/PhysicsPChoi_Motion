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

var numberOfBox = 2;
var bunker;
createCanvas(numberOfBox,"x");

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

  // console.log(render)

  var thickBorder = widthScreen*0.02;
  var widthCenter = widthScreen/2;
  var heightCenter = heightScreen/2;
  var widthHorizentalborder = widthScreen*0.9;
  var widthVerticalborder = heightScreen*0.12;
  var halfAllHeightBox = (widthVerticalborder + thickBorder)/2;
  var spaceBetweenBox = halfAllHeightBox*0.5;
  var boxSize = halfAllHeightBox*2*0.4;
  bunker = widthCenter + (widthHorizentalborder/2) - (thickBorder/2) - boxSize;

  // console.log(num-1,(num-1)/2);

  var h = 0;
  if (num % 2 == 0){
    h -= spaceBetweenBox/2 + halfAllHeightBox*(num-1) + spaceBetweenBox*((num-2)/2);
  }else{
    h -= halfAllHeightBox*(num-1) + (spaceBetweenBox*(num-1)/2);
  }

  for (var i = 0, h; i < num; i++, h += (halfAllHeightBox*2 + spaceBetweenBox)) {
    // console.log(i,h);
    var topWall = Bodies.rectangle(widthCenter,
                                   heightCenter + (widthVerticalborder/2) + h, 
                                   widthScreen*0.9, 
                                   thickBorder, 
                                   { isStatic: true });
    var bottomWall = Bodies.rectangle(widthCenter,
                                   heightCenter - (widthVerticalborder/2) + h, 
                                   widthScreen*0.9, 
                                   thickBorder, 
                                   { isStatic: true });
    var leftWall = Bodies.rectangle(widthCenter - (widthHorizentalborder/2) + (thickBorder/2), 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true });
    var rightWall = Bodies.rectangle(widthCenter + (widthHorizentalborder/2) - (thickBorder/2), 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true });  
  
    var box = Bodies.rectangle(widthCenter - widthHorizentalborder/2 + thickBorder + boxSize/2 + widthHorizentalborder*0.01,
                               heightCenter + h + halfAllHeightBox - thickBorder - boxSize/2,
                               boxSize, 
                               boxSize,
                               {frictionAir: 0,friction: 0,frictionStatic: 0});
  
    obj = {id: i, "time":[], "distance":[], "velocity":[], "accretion":[], "boxDetail":box};

    boxes.push(obj);
    World.add(engine.world, [leftWall, rightWall, topWall, bottomWall, box]);
  }

  console.log(boxes);

  Engine.run(engine);

  Render.run(render);

}


var interval = 50;
setInterval(run,interval);
// setInterval(runy,interval);

//--------------------------------------------------

var isRunningx = false;
var isRunningy = false;
var scale = 0.2;

var t = [0,0,0,0,0];
var s = [0,0,0,0,0];
var v = [100,100,20,5,5];
var a = [5,5,50,20,20];
var vScale = [];

for (var i = 0; i < v.length; i++) {
  vScale.push(v[i]*scale);
}

// console.log(v);
// console.log(vScale);
var deltaT = interval/1000;
var deltaS = 0;

$('.playx').on('click', function () {
    isRunningx = !isRunningx;
    Body.scale(boxes[0].boxDetail,1,1.2);
});

// $('.playy').on('click', function () {
//     isRunningx = !isRunningx;
//     v = -v;
//     runx("y");
// });

function run(){
  runx(numberOfBox,"x");
}


function runx(num,axis){
  // console.log(isRunningx);
  if(isRunningx){
    console.log(num);
    var i = 0;
    while(i < num){
      console.log(i);
      console.log("t = " + t[i]);
      console.log("s = " + s[i]);
      console.log("v = " + v[i]);
      console.log("a = " + a[i]);
      // console.log("deltaS = " + deltaS);

      boxes[i].time.push(t[i]);
      boxes[i].distance.push(s[i]);
      boxes[i].velocity.push(v[i]);
      boxes[i].accretion.push(a[i]);

      console.log(boxes[i].time);
      console.log(boxes[i].distance);
      console.log(boxes[i].velocity);
      console.log(boxes[i].accretion);
      console.log("-------------");

      console.log(boxes[i].boxDetail.position.x," < ",bunker);
      if (boxes[i].boxDetail.position.x < bunker){
        if (axis == "x") {
          Body.setVelocity( boxes[i].boxDetail, {x: vScale[i], y: 0});
        }else{
          Body.setVelocity( boxes[i].boxDetail, {x: 0, y: vScale[i]});
        }

        deltaS = v[i]*deltaT + 0.5*a[i]*Math.pow(deltaT,2);
        v[i] = v[i] + a[i]*deltaT;
        s[i] = s[i] + deltaS;
        t[i] = t[i] + deltaT;
        vScale[i] = v[i]*scale;
      }else{
        Body.setVelocity( boxes[i].boxDetail, {x: 0, y: 0});
      }
      i++;

    }
    console.log("-------------");
  }
}

// function runy(){
//   if(isRunningy){

//     console.log("t = " + t);
//     console.log("s = " + s);
//     console.log("v = " + v);
//     console.log("a = " + a);  

//     boxes[i].time.push(t);
//     boxes[i].distance.push(s);
//     boxes[i].velocity.push(v);
//     boxes[i].accretion.push(a);

//     console.log(boxes[i].time);
//     console.log(boxes[i].distance);
//     console.log(boxes[i].velocity);
//     console.log(boxes[i].accretion);
//     console.log("-------------"); 
     
//     Body.setVelocity( box, {x: 0, y: vScale});

//     deltaS = v*deltaT + 0.5*a*Math.pow(deltaT,2);
//     v = v + a*deltaT;
//     s = s + deltaS;
//     t = t + deltaT;
//     vScale = v*scale;
//   }
// }