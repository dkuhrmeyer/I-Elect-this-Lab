
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
var democrats = ['Clinton','Sanders'];
var democratsImages = ['Candidates/hillaryClinton.jpg', 'Candidates/bernieSanders.jpg'];
var republicans = ['Bush', 'Carson', 'Cruz', 'Kasich', 'Rubio', 'Trump'];
var gopImages = ['Candidates/jebBush.jpg', 'Candidates/BenCarson.jpg', 'Candidates/tedCruz.jpg', 'Candidates/johnKasich.jpg', 'Candidates/marcoRubio.jpg', 'Candidates/donaldTrump.jpg'];
function checkForParty(party) {
    var color;
    if(party === 'Rep') {
        color = '#A00';
    }
    
    //check for repubplicans
    if( party === 'Dem') {
        color = '#00A';
    }
    
    //return correct color
    return color;
}
function dataColor(string) {
    var color;
    if(string === 'Favorable' || string === 'Right Direction' || string === 'Approve') {
        color = '#0A0';
    } else if(string === 'Unfavorable' || string === 'Wrong Track' || string === 'Disapprove') {
        color = '#A00';
    } else {
        color = '#808080';
    }
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
    graphData.push({choice: 'Favorable', value: 0, party: null});
    graphData.push({choice: 'Unfavorable', value:0, party: null});
    graphData.push({choice: 'Undecided', value: 0, party:null});
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
function findImage(data) {
    var image;
    if(data.party === null) {
        if(data.choice === 'Approve' || data.choice === 'Favorable' || data.choice === 'Right Direction') {
            image =  'images/approve.png';  
        } else if(data.choice === 'Disapprove' || data.choice === 'Unfavorable' || data.choice === 'Wrong Track') {
            image = 'images/disapprove.png';   
        } else {
            image = 'images/questionMark.png'; 
        }
    } else {
        if(data.party === 'Rep') {
            image = gopImages[republicans.indexOf(data.choice)];
        } else {
            image = democratsImages[democrats.indexOf(data.choice)]; 
        }
    }
    return image;
}
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
    var endY = (graph.data.length > 2) ? 450 : 350;
    var textY = (graph.data.length > 2) ? 460 : 360;
    console.log(textY);
    //draw Y axis
    drawLine(ctx, 150, 50, 150, endY);
    // draw x axis
    drawLine(ctx, 150, endY, 752, endY);
    //draw x axis lines
    for (var i = 0; i < 6; i++) {
        var x = (i == 0) ? 145 : (i == 5) ? 135 : 140;
        drawLine(ctx, (150 + (i * 120)), endY, (150 + (i * 120)), textY);   
        ctx.fillText(i * 20, x + (i * 120), textY + 20);
    }    
    ctx.fillText(graph.xName, 360, textY + 55);
}
function drawData (canvas, graph){
    //draw rectangle each person is 6px
    var ctx = canvas.getContext('2d');
    //draw rectangle for first candidate
    var startY = (graph.data.length > 2) ? 95 : 105;
    var textY = (graph.data.length > 2) ? 125 : 135;
    var space = (graph.data.length > 2) ? 125 : 120;
    for (var i = 0; i < graph.data.length; i++) {
        ctx.fillStyle = (graph.data[i].party === null) ? dataColor(graph.data[i].choice) : checkForParty(graph.data[i].party);
        ctx.fillRect(152, startY + (space * i), graph.data[i].value * 6, 50);
        ctx.fillStyle = '#fff';
        ctx.fillText(graph.data[i].value, 127 + (graph.data[i].value * 6), textY + (space * i));
    }
}
function drawCandidates(canvas,graph) {
    var ctx = canvas.getContext('2d');
    var startY = (graph.data.length > 2) ? 70 : 70;
    var space = (graph.data.length > 2) ? 130 : 140;
    var image = new Image();
    image.onload = function() {
        ctx.drawImage(image,65,startY,75,117);
    }
    image.src = findImage(graph.data[0]);
    var imageTwo = new Image();
    imageTwo.onload = function() {
        ctx.drawImage(imageTwo,65,startY + (space * 1),75,117);
    }
    imageTwo.src = findImage(graph.data[1]);
    if(graph.data.length > 2) {
        var imageThree = new Image();
        imageThree.onload = function() {
            ctx.drawImage(imageThree,65,startY + (space * 2), 75,117);   
        }
        imageThree.src = findImage(graph.data[2]);
    }
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
    canvas.height = (graphData.length > 2) ? 550 : 450;
    var graph = new Graph('Percentage of people polled', graphData);
    //display graph to page
    displayGraph(graph, canvas);
    drawData(canvas, graph);
    drawCandidates(canvas,graph);
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


