
var API_SERVER = 'http://elections.huffingtonpost.com',
    API_BASE = '/pollster/api/',
    API_FILE = 'polls.json',
    callback = '?callback=pollsterPoll',
    params = '&state=US&page=5topic=2016-president',
    latest_data;

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: API_SERVER + API_BASE + API_FILE + callback + params,
        dataType: 'script',
        cache: true
    });
});


var Graph = function (scale, xName, yName, dataOne, dataTwo, question) {
    this.scale = scale;
    this.xName = xName;
    this.yName = yName;
    this.dataOne = dataOne;
    this.dataTwo = dataTwo;
    this.question = question;
};
function drawLine(ctx, startx, startY, finishx, finishy) {
    ctx.beginPath();
    ctx.moveTo(startx, startY);
    ctx.lineTo(finishx, finishy);
    ctx.stroke();
}
function displayGraph(graph, canvas) {
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = '4';
    ctx.font = '18px Arial';
    //draw Y axis
    drawLine(ctx, 150, 150, 150, 450);
    // draw x axis
    drawLine(ctx, 150, 450, 752, 450);
    //draw x axis lines
    for (var i = 0; i < 6; i++) {
        var x = (i == 0) ? 145 : (i == 5) ? 135 : 140;
        drawLine(ctx, (150 + (i * 120)), 450, (150 + (i * 120)), 460);   
        ctx.fillText(i * 20, x + (i * 120), 480);
    }    
    ctx.fillText(graph.xName, 360, 515);
}
function drawData (canvas, graph){
    //draw rectangle each person is 6px
    var ctx = canvas.getContext('2d');
    //draw rectangle for first candidate
    ctx.fillStyle = '#f00';
    ctx.fillRect(152, 225, graph.dataOne * 6, 50);
    //draw rectangle for second candidate
    ctx.fillStyle = '#00f';
    ctx.fillRect(152, 325, graph.dataTwo * 6, 50);
    
    ctx.fillStyle = '#fff';
    ctx.fillText(graph.dataOne, 115 + (graph.dataOne * 6), 255);
    ctx.fillText(graph.dataTwo, 115 + (graph.dataTwo * 6), 355);
}

function createGraph (canvas) {
    //get name of poll
    var nameOfPoll = '';
    //get type of poll
    var typeOfPoll = '';
    //poll question
    var question = '';
    //first data
    var dataOne = 88;
    //second data
    var dataTwo = 15;
    //build graph
    var graph = new Graph(100, 'Percentage of people polled', 'candidates', dataOne, dataTwo);
    //display graph to page
    displayGraph(graph, canvas);
    drawData(canvas, graph);
}

window.pollsterPoll = function(incoming_data){
    document.getElementById("questionData").innerHTML = "Question: " + incoming_data[0].questions[0].name;
    document.getElementById("questionData1").innerHTML = "Question: " + incoming_data[0].questions[1].name;
    document.getElementById("questionData2").innerHTML = "Question: " + incoming_data[0].questions[2].name;
    document.getElementById("methodData").innerHTML = "Method of Polling: " + incoming_data[0].method;
    document.getElementById("partisanPollData").innerHTML = "Type of Poll: " + incoming_data[0].partisan;
    document.getElementById("pollsterData").innerHTML = "Person who conducted the Poll: " + incoming_data[0].pollster;
    
    
    

    document.getElementById("questionData20").innerHTML = "Question: " + incoming_data[1].questions[0].name;
    document.getElementById("questionData21").innerHTML = "Question: " + incoming_data[1].questions[1].name;
    document.getElementById("questionData22").innerHTML = "Question: " + incoming_data[1].questions[2].name;
    document.getElementById("methodData2").innerHTML = "Method of Polling: " + incoming_data[1].method;
    document.getElementById("partisanPollData2").innerHTML = "Type of Poll: " + incoming_data[1].partisan;
    document.getElementById("pollsterData2").innerHTML = "Person who conducted the Poll: " + incoming_data[1].pollster;
    document.getElementById("questionData20").innerHTML = "Question: " + incoming_data[1].questions[0].name;
    //document.getElementById("questionData21").innerHTML = "Question: " + incoming_data[1].questions[1].name;
    //document.getElementById("questionData22").innerHTML = "Question: " + incoming_data[1].questions[2].name;
    
    
    
    document.getElementById("questionData30").innerHTML = "Question1: " + incoming_data[4].questions[0].name;
    document.getElementById("questionData31").innerHTML = "Question2: " + incoming_data[4].questions[1].name;
    document.getElementById("questionData32").innerHTML = "Question3: " + incoming_data[4].questions[2].name;
    document.getElementById("methodData3").innerHTML = "Method of Polling: " + incoming_data[4].method;
    document.getElementById("partisanPollData3").innerHTML = "Type of Poll: " + incoming_data[4].partisan;
    document.getElementById("pollsterData3").innerHTML = "Person who conducted the Poll: " + incoming_data[4].pollster;
    
    console.log(incoming_data);
    
};

$(function() {
    $( "#tabs-1" ).tabs({
    show: { 
        effect: "blind", 
        duration: 800 
    }
    });
});


