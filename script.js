window.pollsterPoll = function(incoming_data){
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

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: 'http://elections.huffingtonpost.com/pollster/api/polls.json?callback=pollsterPoll',
        dataType: 'script',
        cache: true
    });
});