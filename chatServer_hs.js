
var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;

var  day;
var name;
var month;
var year;
//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.
    socket.emit('changeBG', 'white');
    socket.emit('answer', "Horoscope Predictor."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  
  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    name = input;
    answer = 'Hello ' + name +', I will predict your future'; // output response
    waitTime = 2000;
    question = 'What is your birth "DAY" ?'; // load next question
  } else if (questionNum == 1) {
    answer = 'Thank you for the input.'; // output response
    waitTime = 500;
	day = input;
    question = 'What is your birth "MONTH"?'; // load next question
  } else if (questionNum == 2) {
    answer = 'Thank you for the input.';
    waitTime = 500;
       month = input;
    question = 'What is your birth "Year"?'; // load next question
  } else if (questionNum == 3) {
    answer = 'Thank your for the input.';
    waitTime = 500;
	year = input;
    question = 'We predicted your future. Do you wanna know? '; // load next question
  } else if (questionNum == 4) {
    if (input.toLowerCase() === 'yes' || input === 1) {
      answer = 'Nothing is free.' + '\n' + 'Pay our fees first.';
      waitTime = 3000;
      question = 'Did you pay the fees?';
    } else if (input.toLowerCase() === 'no' || input === 0) {
      
      answer = 'Good Bye.'
      question = '';
      waitTime = 0;
      
    } 
    // load next question
  } else if (questionNum == 5) {
     if (input.toLowerCase() === 'yes' || input === 1){
      if (day < 10 )
        {
         answer = 'Future: - You will have lot of money' + '\n' + 'You will have 2 children.' + '\n' + 'You will have 2 wives.' + '\n' + 'You will live long life';
	 question =  '';
         waitTime = 0;
        }else if (day >= 10 && day < 20)
        {
         answer = 'Future: - You will have very less money in future. So save some now.' + '\n' + 'You will have 1 child.' + '\n' + 'You will live a short life';
         question ='';
         waitTime= 0; 

        }else if (day > 20)
        {
         answer = 'Future: - You will have  sufficient money in money.' + '\n' + 'You will have no child.' + '\n' + 'You will never get married if not married uptil now.' + '\n' + 'You will live average life. ';
         question ='';
         waitTime = 0;
        }



       }else if (input.toLowerCase() === 'no' || input === 0)
{ answer = 'You are cheap. Good Bye!!!';
  question ='';
 waitTime = 0;
}

  
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
