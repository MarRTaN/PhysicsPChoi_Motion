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
var scale = 0.1;
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

    var pos = getBoxPositionOnMap(i,floorLength);
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
  
    obj = {id: i, "time":[], "distance":[], "velocity":[], "accretion":[], "boxDetail":box};

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

//reset = back to first state
function resetCanvas(){
  World.clear(engine.world, true);

  var h = 0;
  if (numberOfBox % 2 == 0){
    h -= spaceBetweenBox/2 + halfAllHeightBox*(numberOfBox-1) + spaceBetweenBox*((numberOfBox-2)/2);
  }else{
    h -= halfAllHeightBox*(numberOfBox-1) + (spaceBetweenBox*(numberOfBox-1)/2);
  }

  for (var i = 0, h; i < numberOfBox; i++, h += (halfAllHeightBox*2 + spaceBetweenBox)) {
    // console.log(i,h);
    var box = Bodies.rectangle(widthCenter - widthHorizentalborder/2 + boxSize/2 + widthHorizentalborder*0.01,
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
  
    obj = {id: i, "time":[], "distance":[], "velocity":[], "accretion":[], "boxDetail":box};

    boxes.push(obj);
    World.add(engine.world, [box]);
  }
}

function clearCanvas(){
  Engine = null,
  Render = null,
  World = null,
  Bodies = null,
  Body = null;

  engine = null;

  render = null;
  boxes = [];

  rightBunker = null;
  leftBunker = null;
  document.getElementById('canvas').innerHTML = "";
}

function rescale(){

  var lineScale = Math.floor(1/scale);

  if(lineScale > 20){
    lineScale = 20;
  }

  if(lineScale % 2 != 0){
    lineScale++;
  }

  var i = engine.world.bodies.length-1;
  while(i >= staticObjNo){
    World.remove(engine.world,engine.world.bodies[i],false);
    i = engine.world.bodies.length-1;
  }

  for(i = 0; i<lineScale+1; i++){
    var height = thickBorder;
    if(i%2 == 0){
      height = height * 2;
    }
    var line = Bodies.rectangle(((widthScreen-(canvasMargin*2))*i/lineScale) + canvasMargin,
                                   thickBorder*2, 
                                   1, 
                                   height, 
                                   { isStatic: true,
                                      render: {
                                       strokeStyle: "#aaaaaa",
                                       lineWidth: 1
                                    } });
    World.add(engine.world, [line]);
  }

  var row = document.getElementById('scale-row');
  row.innerHTML = "";
  for(i = 0; i<lineScale+1; i++){
    var r = row.insertCell(i);
    var value = (maxDistance - minDistance)/(lineScale);
    if(i%2 == 0){
      r.innerHTML = Math.floor(((i*value)+minDistance));
    }
  }

  var scaleWidth = (widthScreen-(canvasMargin*2));
  var tableWidth = scaleWidth + (scaleWidth/lineScale);
  document.getElementById('scale-table').style.width = tableWidth+"px";
  document.getElementById('scale-table').style.marginLeft = (canvasMargin)+"px";

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

function run(){

    /////////////////////////////
    //////// EDIT HERE //////////
    /////////////////////////////

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
    rescale();

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
      Body.setVelocity( boxes[i].boxDetail, {x: 0, y: 0});
    }else{
      Body.setVelocity( boxes[i].boxDetail, {x: 0, y: 0});
    }

    i++;

  }
}

function popout(){
  $(".fade-black").hide();
}

function selectAxis(axis){
  baseAxis = axis;
  popout();
}

var maxStartDistance = 0;

function findSminSmaxAtStartingPoint(range){
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
