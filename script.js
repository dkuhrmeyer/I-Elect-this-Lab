var API_SERVER = 'http://elections.huffingtonpost.com',
    API_BASE = '/pollster/api/',
    API_FILE = 'polls.json',
    callback = '?callback=pollsterPoll',
    params = '&state=US&page=2topic=2015-president',
    latest_data;

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: API_SERVER + API_BASE + API_FILE + callback + params,
        dataType: 'script',
        cache: true
    });
});

window.pollsterPoll = function(incoming_data){
    document.getElementById("methodData").innerHTML = "Method of Polling: " + incoming_data[0].method;
    document.getElementById("partisanPollData").innerHTML = "Type of Poll: " + incoming_data[0].partisan;
    document.getElementById("pollsterData").innerHTML = "Person who conducted the Poll: " + incoming_data[0].pollster;
    document.getElementById("questionData").innerHTML = "Question: " + incoming_data[0].questions[0].name;
    document.getElementById("questionData1").innerHTML = "Question: " + incoming_data[0].questions[1].name;
    document.getElementById("questionData2").innerHTML = "Question: " + incoming_data[0].questions[2].name;
    
    

    
    //document.getElementById("methodData2").innerHTML = "Method of Polling: " + incoming_data[1].method;
    //document.getElementById("partisanPollData2").innerHTML = "Type of Poll: " + incoming_data[1].partisan;
    //document.getElementById("pollsterData2").innerHTML = "Person who conducted the Poll: " + incoming_data[1].pollster;
    //document.getElementById("questionData20").innerHTML = "Question: " + incoming_data[1].questions[0].name;
    //document.getElementById("questionData21").innerHTML = "Question: " + incoming_data[1].questions[1].name;
    //document.getElementById("questionData22").innerHTML = "Question: " + incoming_data[1].questions[2].name;
    
    
    
    
//    document.getElementById("methodData3").innerHTML = "Method of Polling: " + incoming_data[2].method;
//    document.getElementById("partisanPollData3").innerHTML = "Type of Poll: " + incoming_data[2].partisan;
//    document.getElementById("pollsterData3").innerHTML = "Person who conducted the Poll: " + incoming_data[2].pollster;
//    document.getElementById("questionData3").innerHTML = "Question: " + incoming_data[2].questions[0].name;
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

