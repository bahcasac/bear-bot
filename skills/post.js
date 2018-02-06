/**
 * Created by mehamasum on 6/30/2017.
 */
const TAG = "meha, post.js: ";
var wordfilter = require('wordfilter');

module.exports = function(controller) {
    controller.hears(['post'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "SET");
    });
};

function handel(controller, bot, message, method) {
    var person = message.original_message.personId;
    controller.storage.users.get(person, function(err, user) {
        if (!user) {
            bot.reply(message, "Desculpe. Nós não estamos em uma sala de aula compartilhada!");
            return;
        }

        var rooms = user.details.rooms;

        if(rooms.length===1) {
            bot.startConversation(message, function(err,convo) {
                roomSelected(controller, bot, convo, method, 1, rooms);
            });
            return;
        }

        // start a conversation to handle this response.
        bot.startConversation(message, function(err,convo) {

            var choice = "";
            choice += "Para qual sala? \nEntrar com um número. Por exemplo,  `1`, `2` etc. ou `sair` para finalizar  \n  \n";
            for(var idy= 0; idy<rooms.length; idy++) {
                choice += (idy+1) + ". " + rooms[idy].title +"  \n";
            }

            convo.addQuestion(choice,[
                {
                    pattern: 'sair',
                    callback: function(response,convo) {
                        convo.say('Finalizado');
                        convo.next();
                    }
                },
                {
                    pattern: new RegExp(/^\d+$/),
                    callback: function(response,convo) {

                        var opt = parseInt(response.text);
                        roomSelected(controller, bot, convo, method, opt, rooms);

                    }
                },
                {
                    default: true,
                    callback: function(response,convo) {
                        // just repeat the question
                        convo.repeat();
                        convo.next();
                    }
                }
            ],{},'default');

        })

    });
}

function roomSelected(controller, bot, convo, method, opt, rooms) {
    if(opt>=1 && opt<=rooms.length) {

        var room = rooms[opt-1];

        if(method==="SET") {
            if (!room.teacher) {
                convo.ask('Escreva sua mensagem ou `sair` para finalizar', [
                    {
                        pattern: 'sair',
                        callback: function(response,convo) {
                            convo.say('Finalizado');
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo) {
                            // this is the post string

                            // post
                            if (!wordfilter.blacklisted(response.text)) {
                                bot.reply({channel: room.id}, '**Estudante Anônimos:**  \n'+ response.text);
                                convo.say('Post anônimo!');
                            } else {
                                convo.say('Post bloqueado por linguagem ofensiva');
                            }

                            convo.next();
                        }
                    }
                ]);
            }
            else { //teacher
                convo.say("Desculpe. Estudantes apenas");
            }
        }
        convo.next();
    }
    else {
        convo.say(" Entre com um número da lista!");
        // just repeat the question
        convo.repeat();
        convo.next();
    }
}