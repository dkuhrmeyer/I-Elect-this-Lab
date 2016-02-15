
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
var democrats = ['hilary','bernie'];
var republicans = ['jeb bush','ben carson','ted cruz','john kasich','marco rubio','donald trump'];
function checkForParty(stringToParse) {
    var color;
    if(stringToParse.equals('Rep')) {
        color = '#f00';
    }
    
    //check for repubplicans
    if( stringToParse.equals('Dem')) {
        color = '#00f';
    }
    //return correct color
    return color;
}
function findTopCandidates(data) {
    data.sort(function(a, b) {
        return a.value - b.value; 
    });
    
    var graphData = [];
    graphData.push(data.pop());
    graphData.push(data.pop());
    if(data.length > 0) {
        graphData.push(data.pop());   
    }
    return graphData;
}
function findFavorable(data) {
    var graphData = [];   
    graphData.push({choice: 'Favorable', value: 0});
    graphData.push({choice: 'Unfavorable', value:0});
    graphData.push({choice: 'Undecided', value: 0});
    for(var i = 0; i < data.length; i++) {
        if(data[i].choice.toLowerCase().indexOf('unfavorable') > -1) {
            graphData[1].value += data[i].value;
        } else if(data[i].choice.toLowerCase() === 'undecided') { 
            graphData[2].value += data[i].value;
        } else {
            graphData[0].value += data[i].value;   
        }
    }
    return graphData;
}
var Graph = function (xName, data) {
    this.data = data;
    this.xName = xName;
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
    drawLine(ctx, 150, 50, 150, 350);
    // draw x axis
    drawLine(ctx, 150, 350, 752, 350);
    //draw x axis lines
    for (var i = 0; i < 6; i++) {
        var x = (i == 0) ? 145 : (i == 5) ? 135 : 140;
        drawLine(ctx, (150 + (i * 120)), 350, (150 + (i * 120)), 360);   
        ctx.fillText(i * 20, x + (i * 120), 380);
    }    
    ctx.fillText(graph.xName, 360, 415);
}
function drawData (canvas, graph){
    //draw rectangle each person is 6px
    var ctx = canvas.getContext('2d');
    //draw rectangle for first candidate
    ctx.fillStyle = '#f00';
    ctx.fillRect(152, 125, graph.dataOne * 6, 50);
    //draw rectangle for second candidate
    ctx.fillStyle = '#00f';
    ctx.fillRect(152, 225, graph.dataTwo * 6, 50);
    
    ctx.fillStyle = '#fff';
    ctx.fillText(graph.dataOne, 115 + (graph.dataOne * 6), 155);
    ctx.fillText(graph.dataTwo, 115 + (graph.dataTwo * 6), 255);
}

function createGraph (canvas, data, topic) {
    var graphData;
    if(topic.indexOf('primary') > -1) {
        graphData = findTopCandidates(data);
    } else if(topic.indexOf('approval') > -1) {
        graphData = data;
    } else if(topic === '') {
        graphData = data;
    } else if(topic.indexOf('favorable') > -1) {
        graphData = findFavorable(data);
    }
    console.log(graphData);
    //build graph
    var graph = new Graph('Percentage of people polled', graphData);
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
    createGraph(document.getElementById('chartData'),                                                  incoming_data[0].questions[0].subpopulations[0].responses,                        incoming_data[0].questions[0].topic);
    createGraph(document.getElementById('chartData1'),                                                  incoming_data[0].questions[1].subpopulations[0].responses,                        incoming_data[0].questions[1].topic);
    createGraph(document.getElementById('chartData2'),                                                  incoming_data[0].questions[2].subpopulations[0].responses,                        incoming_data[0].questions[2].topic);
    
    document.getElementById("questionData20").innerHTML = "Question: " + incoming_data[1].questions[0].name;
    document.getElementById("questionData21").innerHTML = "Question: " + incoming_data[1].questions[1].name;
    document.getElementById("questionData22").innerHTML = "Question: " + incoming_data[1].questions[2].name;
    document.getElementById("methodData2").innerHTML = "Method of Polling: " + incoming_data[1].method;
    document.getElementById("partisanPollData2").innerHTML = "Type of Poll: " + incoming_data[1].partisan;
    document.getElementById("pollsterData2").innerHTML = "Person who conducted the Poll: " + incoming_data[1].pollster;
    document.getElementById("questionData20").innerHTML = "Question: " + incoming_data[1].questions[0].name;
    //document.getElementById("questionData21").innerHTML = "Question: " + incoming_data[1].questions[1].name;
    //document.getElementById("questionData22").innerHTML = "Question: " + incoming_data[1].questions[2].name;
    createGraph(document.getElementById('chartData20'),                                              incoming_data[1].questions[0].subpopulations[0].responses,                        incoming_data[1].questions[0].topic);
    createGraph(document.getElementById('chartData21'),                                              incoming_data[1].questions[1].subpopulations[0].responses,                        incoming_data[1].questions[1].topic);
    createGraph(document.getElementById('chartData22'),                                              incoming_data[1].questions[2].subpopulations[0].responses,                        incoming_data[1].questions[2].topic);
    
    document.getElementById("questionData30").innerHTML = "Question1: " + incoming_data[4].questions[0].name;
    document.getElementById("questionData31").innerHTML = "Question2: " + incoming_data[4].questions[1].name;
    document.getElementById("questionData32").innerHTML = "Question3: " + incoming_data[4].questions[2].name;
    document.getElementById("methodData3").innerHTML = "Method of Polling: " + incoming_data[4].method;
    document.getElementById("partisanPollData3").innerHTML = "Type of Poll: " + incoming_data[4].partisan;
    document.getElementById("pollsterData3").innerHTML = "Person who conducted the Poll: " + incoming_data[4].pollster;
    
    createGraph(document.getElementById('chartData30'),                                              incoming_data[4].questions[0].subpopulations[0].responses,                        incoming_data[4].questions[0].topic);
    createGraph(document.getElementById('chartData31'),                                              incoming_data[4].questions[1].subpopulations[0].responses,                        incoming_data[4].questions[1].topic);
    createGraph(document.getElementById('chartData32'),                                              incoming_data[4].questions[2].subpopulations[0].responses,                        incoming_data[4].questions[2].topic);
    
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


