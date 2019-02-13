var currentActiveBox = -1;
var boxObj = [null,null,null,null];
var boxColor = ["#4FCEC4", "#FF6B6B", "#C7F464", "#fdc02f"];
var boxStroke = ["#2fa49b", "#d33a3a", "#8dba29", "#b88817"];

/*
	box info ::
	id, t, s, v, a, show
*/

$(document).ready(function(){
	$(".box-button").click(function(){
		var id = $(this).attr("id").split("-")[2];

		console.log("currentActiveBox = "+currentActiveBox);
		console.log("id = "+id);

		if(currentActiveBox != -1){
			console.log("case 1");
			$("#box-button-"+currentActiveBox).toggleClass("active");
			$(".box").toggleClass("box-"+currentActiveBox);
		} 

		if(currentActiveBox == id){
			console.log("case 2");
			currentActiveBox = -1;
			document.getElementById("create-btn").innerHTML = "สร้าง";
		} else if(currentActiveBox != id){
			console.log("case 3");
			currentActiveBox = id;
			$(this).toggleClass("active");
		}

		changeBoxInfo();

	});
	setInterval(checkBoxInfoField, 100);
});

function changeBoxInfo(){

	$(".box").toggleClass("box-"+currentActiveBox);

	if(boxObj[currentActiveBox] != null){
		var obj = boxObj[currentActiveBox];
		document.getElementById("box-s").value = obj.s;
		document.getElementById("box-v").value = obj.v;
		document.getElementById("box-a").value = obj.a;
		$('#box-show')[0].checked = obj.show;
	} else {
		clearTextField();
	}
}

function addBox(id){
	obj = {
		"id" : id,
		"t" : 0,
		"s" : parseFloat($('#box-s').val()),
		"v" : parseFloat($('#box-v').val()),
		"a" : parseFloat($('#box-a').val()),
		"vScale": $('#box-v').val() * scale,
		"show" : $('#box-show')[0].checked,
		"fill" : boxColor[id],
		"stroke": boxStroke[id],
	};
	boxObj[id] = obj;
}

function checkBoxInfoField(){
	if(currentActiveBox == -1){
		document.getElementById("create-btn").disabled = true;
		document.getElementById("box-s").disabled = true;
		document.getElementById("box-v").disabled = true;
		document.getElementById("box-a").disabled = true;
		document.getElementById("box-show").disabled = true;
	} else{
		document.getElementById("box-s").disabled = false;
		document.getElementById("box-v").disabled = false;
		document.getElementById("box-a").disabled = false;
		document.getElementById("box-show").disabled = false;
		if($('#box-s').val() !== "" &&
		   $('#box-v').val() !== "" &&
		   $('#box-a').val() !== ""){
			document.getElementById("create-btn").disabled = false;
		} else {
			document.getElementById("create-btn").disabled = true;
		}

		if(boxObj[currentActiveBox] != null){
			document.getElementById("create-btn").innerHTML = "Update";
			$('#delete-btn').removeClass("hide");
		} else {
			document.getElementById("create-btn").innerHTML = "Create";
			$('#delete-btn').addClass("hide");
		}
	}
	countBoxes();
	if(numberOfBox == 0){
		document.getElementById("generate-btn").disabled = true;
	} else {
		document.getElementById("generate-btn").disabled = false;
	}
}

function createBox(){
	if(boxObj[currentActiveBox] == null){
		$("#box-button-"+currentActiveBox).toggleClass("box-"+currentActiveBox);
	}
	addBox(currentActiveBox);
}

function deleteBox(){
	$('#delete-btn').addClass("hide");
	document.getElementById("create-btn").innerHTML = "Create";
	boxObj[currentActiveBox] = null;
	$("#box-button-"+currentActiveBox).toggleClass("box-"+currentActiveBox);
	$("#box-button-"+currentActiveBox).toggleClass("active");
	changeBoxInfo();
	currentActiveBox = -1;
}

function deleteAll(){
	$('#delete-btn').addClass("hide");
	document.getElementById("create-btn").innerHTML = "Create";
	currentActiveBox = -1;
	for(i = 0; i < boxObj.length; i++){
		$("#box-button-"+i).removeClass("active");
		$(".box").removeClass("box-"+i);
		if(boxObj[i] != null){
			$("#box-button-"+i).removeClass("box-"+i);
			boxObj[i] = null;
		}
	}
	clearTextField();
}

function clearTextField(){
	document.getElementById("box-s").value = "";
	document.getElementById("box-v").value = "";
	document.getElementById("box-a").value = "";
	$('#box-show')[0].checked = true;
}

// generate v1 //
// function generate(){
// 	genBoxData();
// 	// clearCanvas();

// 	findTheFurtherestStartPosition();
// 	createCanvas();
// 	// predictFurtherstDistance(10);
// 	// rescale();
// 	document.getElementById("play-btn").disabled = false;
// }

function generate(){
	genBoxData();
	console.log("to findSminSmaxAtStartingPoint");
	findSminSmaxAtStartingPoint();
	console.log("to createCanvas");
	createCanvas();
	document.getElementById("play-btn").disabled = false;
}

function genBoxData(){
	var count = 0;
	for(i = 0; i < boxObj.length; i++){
		if(boxObj[i] != null) {
			boxData[count] = boxObj[i];
			count++;
		}
	}
	numberOfBox = count;
}

function countBoxes(){
	var count = 0;
	for(i = 0; i < boxObj.length; i++){
		if(boxObj[i] != null) {
			count++;
		}
	}
	numberOfBox = count;
}