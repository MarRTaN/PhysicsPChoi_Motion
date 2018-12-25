var Engine;
var engine;

var render;
var boxes = [];
var baseAxis = "x";

var rightBunker;
var leftBunker;
var numberOfBox = 0;

var intervalTime = 50;
var runnerInterval;

var canvasMargin;
var thickBorder,widthCenter,heightCenter;
var widthHorizentalborder,widthVerticalborder;
var halfAllHeightBox,spaceBetweenBox,boxSize;
var widthScreen, heightScreen;
var staticObjNo;

var startScale = 0.1;
var scale = 1;
var scaleDown = 0.9999999;
var maxDistance = -1000000;
var minDistance = 1000000;
var maxDistanceIndex = -1;
var minDistanceIndex = 1;

var hitLeftBunker = false;
var hitRightBunker = false;


function createCanvas (){

  Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

  engine = Engine.create();
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  
  var canvas = document.getElementById('canvas');
  widthScreen = canvas.offsetWidth;
  heightScreen = canvas.offsetHeight;

  render = Render.create({
  element: document.getElementById('canvas'),
  engine: engine,
  options: {
    width: widthScreen,
    height: heightScreen,
    wireframes: false
  }});

  // console.log(render)

  thickBorder = widthScreen*0.01;
  widthCenter = widthScreen/2;
  heightCenter = heightScreen/2;
  widthHorizentalborder = widthScreen*0.9;
  widthVerticalborder = heightScreen*0.12;
  halfAllHeightBox = (widthVerticalborder + thickBorder)/2;
  spaceBetweenBox = halfAllHeightBox*0.5;
  boxSize = halfAllHeightBox*2*0.4;

  canvasMargin = widthScreen*0.05 + (thickBorder*2) + (boxSize/2);
  rightBunker = widthCenter + (widthHorizentalborder/2) - boxSize;
  leftBunker = widthCenter - (widthHorizentalborder/2) + boxSize;

  // console.log(numberOfBox-1,(numberOfBox-1)/2);

  var h = 0;
  if (numberOfBox % 2 == 0){
    h -= spaceBetweenBox/2 + halfAllHeightBox*(numberOfBox-1) + spaceBetweenBox*((numberOfBox-2)/2);
  }else{
    h -= halfAllHeightBox*(numberOfBox-1) + (spaceBetweenBox*(numberOfBox-1)/2);
  }

  var floorLength = (widthScreen*0.9) - (thickBorder*2);

  for (var i = 0, h; i < numberOfBox; i++, h += (halfAllHeightBox*2 + spaceBetweenBox)) {
    // console.log(i,h);
    var bottomWall = Bodies.rectangle(widthCenter,
                                   heightCenter + (widthVerticalborder/2) + h, 
                                   floorLength, 
                                   thickBorder, 
                                   { isStatic: true });
    var topWall = Bodies.rectangle(widthCenter,
                                   heightCenter - (widthVerticalborder/2) + h, 
                                   widthScreen*0.9, 
                                   thickBorder, 
                                   { isStatic: true ,
                                       render: {
                                         fillStyle: 'transparent',
                                         strokeStyle: 'transparent'
                                      } 
                                    });

    var leftWall = Bodies.rectangle(widthCenter - (widthHorizentalborder/2) + (thickBorder/2), 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true ,
                                       render: {
                                         fillStyle: 'transparent',
                                         strokeStyle: 'transparent'
                                      } 
                                    });

    var rightWall = Bodies.rectangle(widthCenter + (widthHorizentalborder/2) - (thickBorder/2), 
                                   heightCenter + h, 
                                   thickBorder, 
                                   widthVerticalborder + thickBorder, 
                                   { isStatic: true ,
                                       render: {
                                         fillStyle: 'transparent',
                                         strokeStyle: 'transparent'
                                      } 
                                    });


    var pos = getBoxPositionOnMap(i,floorLength);

    // var box = Bodies.rectangle(widthCenter - widthHorizentalborder/2 + boxSize/2 + widthHorizentalborder*0.01,
    //                            heightCenter + h + halfAllHeightBox - thickBorder - boxSize/2,
    //                            boxSize, 
    //                            boxSize,
    //                            {frictionAir: 0,friction: 0,frictionStatic: 0, 
    //                               render: {
    //                                  fillStyle: boxData[i].fill,
    //                                  strokeStyle: boxData[i].stroke,
    //                                  lineWidth: 3
    //                               }
    //                             }

    console.log(pos + canvasMargin - boxSize/2 - widthHorizentalborder/2);
  
    var box = Bodies.rectangle(pos + canvasMargin - boxSize,
                               heightCenter + h + halfAllHeightBox - thickBorder - boxSize/2,
                               boxSize, 
                               boxSize,
                               {frictionAir: 0,friction: 0,frictionStatic: 0, 
                                  render: {
                                     fillStyle: boxData[i].fill,
                                     strokeStyle: boxData[i].stroke,
                                     lineWidth: 3
                                  }
                                }
    );
  
    obj = {id: i, "time":[], "distance":[], "velocity":[], "accretion":[], "boxDetail":box, "position":[]};

    boxes.push(obj);
    World.add(engine.world, [leftWall, rightWall, topWall, bottomWall, box]);
  }

  //Draw line

  lineScale = Math.floor(1/scale);
  staticObjNo = engine.world.bodies.length;

  for(i = 0; i<lineScale+1; i++){
    var line = Bodies.rectangle(((widthScreen-(canvasMargin*2))*i/lineScale) + canvasMargin,
                                   thickBorder*2, 
                                   1, 
                                   thickBorder, 
                                   { isStatic: true,
                                      render: {
                                       strokeStyle: "#aaaaaa",
                                       lineWidth: 1
                                    } });
    World.add(engine.world, [line]);
  }

  Engine.run(engine);
  Render.run(render);
}

var isRunningx = false;
var isRunningy = false;

var t = [0,0,0,0,0];
var s = [0,0,0,0,0];
var v = [100,100,20,5,5];
var a = [5,5,50,20,20];
var vScale = [];

var tempt = [0,0,0,0,0];
var temps = [0,0,0,0,0];
var tempv = [100,100,20,5,5];
var tempa = [5,5,50,20,20];

var boxData = [];
var tempBoxData = [];

for (var i = 0; i < v.length; i++) {
  vScale.push(v[i]*scale);
}

// console.log(v);
// console.log(vScale);
var deltaT = intervalTime/1000;
var deltaS = 0;

$('#play-btn').on('click', function () {
    isRunningx = !isRunningx;
    if(isRunningx){
      var i = 0;
      console.log(boxData);
      while(i < numberOfBox){
        boxData[i].t = tempBoxData[i].t;
        boxData[i].s = tempBoxData[i].s;
        boxData[i].v = tempBoxData[i].v;
        boxData[i].vScale = tempBoxData[i].v*scale;
        i++;
      }
      runnerInterval = setInterval(run,intervalTime);
    } else {
      $(this).html("Play");
      clearInterval(runnerInterval);
      stop();
    }
});

// $('.playy').on('click', function () {
//     isRunningx = !isRunningx;
//     v = -v;
//     runx("y");
// });


function run(){
    var i = 0;

    var longestDistanceRight = -1;
    var theFirstPlaceIdRight = -1;

    var longestDistanceLeft = 1;
    var theFirstPlaceIdLeft = -1;

    var currentScale = scale;
    
    while(i < numberOfBox){

      boxes[i].time.push(boxData[i].t);
      boxes[i].distance.push(boxData[i].s);
      boxes[i].velocity.push(boxData[i].v);
      boxes[i].accretion.push(boxData[i].a);
      boxes[i].position.push(boxes[i].boxDetail.position.x);

      if (boxes[i].boxDetail.position.x > rightBunker){
        console.log("Crash !! ... rescale = ",scale);
        scale = scale * scaleDown;

        //hit right bunker
        if(Math.abs(boxData[i].s) > maxDistance){
          maxDistance = Math.abs(boxData[i].s);
        }

        //related velocity

        if(baseAxis == "x" && boxData[i].s > longestDistanceRight){
          longestDistanceRight = boxData[i].s;
          theFirstPlaceIdRight = i;
        }

      } else if(boxes[i].boxDetail.position.x < leftBunker){


        //hit left bunker
        if(Math.abs(boxData[i].s) < minDistance){
          minDistance = Math.abs(boxData[i].s);
        }

        //related velocity

        if(baseAxis == "x" && boxData[i].s > longestDistanceLeft){
          longestDistanceLeft = boxData[i].s;
          theFirstPlaceIdLeft = i;
        }

      } else {
        if (baseAxis == "x") {
          Body.setVelocity( boxes[i].boxDetail, {x: boxData[i].vScale, y: 0});
        }else{
          Body.setVelocity( boxes[i].boxDetail, {x: 0, y: boxData[i].vScale});
        }
      }

      deltaS = boxData[i].v*deltaT + 0.5*boxData[i].a*Math.pow(deltaT,2);
      boxData[i].v = boxData[i].v + boxData[i].a*deltaT;
      boxData[i].s = boxData[i].s + deltaS;
      boxData[i].t = boxData[i].t + deltaT;
      boxData[i].vScale = boxData[i].v*scale;

      i++;
      // h += halfAllHeightBox*2 + spaceBetweenBox;

    }

    maxDistance = Math.ceil(maxDistance/100)*100;
    minDistance = Math.floor(minDistance/100)*100;
    // rescale();

    if(currentScale != scale){
      for(i = 0; i < numberOfBox; i++){
        Body.scale( boxes[i].boxDetail, scale/0.1, scale/0.1);
      }
    }

    if(longestDistanceRight != -1){
      var theFirstPlaceV = boxData[theFirstPlaceIdRight].vScale;
      var i = 0;
      while(i < numberOfBox){
        if (baseAxis == "x") {
          Body.setVelocity( boxes[i].boxDetail, {x: (boxData[i].vScale - theFirstPlaceV), y: 0});
        }else{
          Body.setVelocity( boxes[i].boxDetail, {x: 0, y: (boxData[i].vScale - theFirstPlaceV)});
        }
        i++;
      }
    }
}

function stop(){
  console.log("STOP");

  for(i = 0; i < numberOfBox; i++){

    tempBoxData[i].t = boxData[i].t;
    tempBoxData[i].s = boxData[i].s;
    tempBoxData[i].v = boxData[i].v;

    boxData[i].t = 0;
    boxData[i].v = 0;
    boxData[i].s = 0;
    boxData[i].vScale = 0;
  }

  var i = 0;

  while(i < numberOfBox){

    if (baseAxis == "x") {
      Body.setVelocity( boxes[i].boxDetail, {x: boxData[i].vScale, y: 0});
    }else{
      Body.setVelocity( boxes[i].boxDetail, {x: 0, y: boxData[i].vScale});
    }

    i++;

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

function popout(){
  $(".fade-black").hide();
}

function selectAxis(axis){
  baseAxis = axis;
  popout();
}

function predictFurtherstDistance(time){
  // maxDistance = 100;
  // minDistance = -100;
  // if(boxData.length > 1){
  //   for(i = 0; i < boxData.length; i++){
  //     //calculate distance
  //     u = boxData[i].v;
  //     a = boxData[i].a;
  //     s0 = boxData[i].s;
  //     s = (rightBunker - leftBunker)*scale;
  //     t = time; //sec
  //     if(s > maxDistance){
  //       maxDistance = s;
  //       maxDistanceIndex = i;
  //     }
  //     if(s < minDistance){
  //       minDistance = s;
  //       minDistanceIndex = i;
  //     }
  //   }
  //   if(maxDistance >= 0 && minDistance >= 0){
  //     minDistance = 0;
  //   } else if(maxDistance < 0 && minDistance < 0){
  //     maxDistance = 0;
  //   }
  // } else if(boxData.length == 1){
  //   maxDistanceIndex = 0;
  //   minDistanceIndex = 0;
  //   u = boxData[0].v;
  //   a = boxData[0].a;
  //   s0 = boxData[i].s;
  //   s = (rightBunker - leftBunker)*scale;
  //   t = time; //sec
  //   s = (u*t) + (a*t*t/2);
  //   if(s >= 0){
  //     minDistance = 0;
  //     maxDistance = s;
  //   }
  //   if(s < 0){
  //     minDistance = s;
  //     maxDistance = 0;
  //   }
  // }
}

var maxStartDistance = 0;

function findTheFurtherestStartPosition(){
  for(i = 0; i < boxData.length; i++){
    if(Math.abs(boxData[i].s) > maxStartDistance){
      maxStartDistance = Math.abs(boxData[i].s);
    }
  }
  if(maxStartDistance < 75){
    maxStartDistance = 75;
  }
}

function getBoxPositionOnMap(index,floorLength){
  maxDistance = maxStartDistance/0.75; // range [-max, max]
  minDistance = -maxStartDistance/0.75;
  var posOnMap = ((boxData[index].s-minDistance)/(maxDistance-minDistance))*floorLength;
  return posOnMap;
}
