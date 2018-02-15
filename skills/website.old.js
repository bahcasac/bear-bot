/**
 * Created by mehamasum on 6/30/2017.
 */
const TAG = "meha, due.js: ";

var Util = require("../components/util.js");

module.exports = function(controller){
controller.hears(['add site'], 'direct_message,direct_mention', function(bot, message){

    bot.startConversation(message, function(err, convo){

        convo.ask('Qual site você gostaria de adicionar?', function(response, convo) { 
           
            convo.say('Adicionado');
            convo.next();
        });
    })
});

}

// function roomSelected(controller, bot, convo, method, opt, rooms) {
//     if(opt >= 1 && opt <= rooms.length) {

//         var room = rooms[opt-1];

//         if(method==="SET"){
//             if(room.teacher){

//                 convo.ask()
//             }
//         }

//     }
// }
