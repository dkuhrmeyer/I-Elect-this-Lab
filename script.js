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
window.onload = createGraph(document.getElementById('graph'));