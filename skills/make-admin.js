/**
 * Created by mehamasum on 7/17/2017.
 */
const TAG = "meha, make_admin.js: ";
module.exports = function(controller) {
    controller.hears('tornar admin', 'direct_message', function(bot, message) {
        handel(controller, bot, message, "SET");
    });
    controller.hears('remover admin', 'direct_message', function(bot, message) {
        handel(controller, bot, message, "DELETE");
    });
    controller.hears(['admin', 'status'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "GET");
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
            choice += "Para qual sala?  \nReplicar com o número, ou seja, `1`, `2` etc. ou `sair` para finalizar  \n  \n";
            for(var idy= 0; idy<rooms.length; idy++) {
                choice += (idy+1) + ". " + rooms[idy].title +"  \n";
            }

            convo.addQuestion(choice,[
                {
                    pattern: 'sair',
                    callback: function(response,convo) {
                        convo.say('Finalizar');
                        convo.next();
                    }
                },
                {
                    pattern: new RegExp(/^\d+$/),
                    callback: function(response,convo) {

                        // console.log("%d => "+ JSON.stringify(response));
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

        if(method==="SET" || method==="DELETE") {

            var teach = false;
            var confirm = "Remover privilégios de admin";
            if(method==="SET") {
                teach = true;
                confirm = "Deixar como admin";
            }

            if (room.teacher) {
                convo.ask(' Entrar com o e-mail da pessoa ou  pressione `sair` para finalizar', [
                    {
                        pattern:  'sair',
                        callback: function(response, convo) {
                            convo.say('cancelar');
                            convo.next();
                        }
                    },
                    {
                        pattern:  new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
                        callback: function(response, convo) {
                            // this is the email
                            var input_email = response.text;

                            // no change to room, only extract personId
                            controller.storage.channels.get(room.id, function (err, room) {
                                if (room) {
                                    var mems = room.details.members;
                                    mems.forEach(function (element) {
                                        if(element.personEmail===input_email) {
                                            var found = element.id;

                                            // change in person
                                            controller.storage.users.get(found, function(err, user_data) {
                                                var his_rooms = user_data.details.rooms;
                                                for(var j=0; j<his_rooms.length; j++) {
                                                    if (his_rooms[j].id === room.id) {

                                                        his_rooms[j].teacher = teach;
                                                        break;
                                                    }
                                                }

                                                user_data.details.rooms = his_rooms;
                                                controller.storage.users.save(user_data, function (err, id) {
                                                    if (err) console.error(TAG+ "controller.storage.user.save not working");
                                                });
                                            });
                                        }
                                    });
                                }
                            });

                            convo.say(confirm);
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo) {
                            convo.repeat();
                            convo.next();
                        }
                    }

                ]);
            }
            else { //student
                convo.say("Desculpe. Você não está autorizado par modificar essa informação");
            }
        }
        else if(method==="GET") {
            if (room.teacher) {
                convo.say(" Status de Admin: Você tem privilégios de administrador");
            }
            else { //student
                convo.say("Status de Admin: Você **não** tem privilégios de administrador");
            }
        }
        convo.next();
    }
    else {
        convo.say("Coloque um número da lista!");
        // just repeat the question
        convo.repeat();
        convo.next();
    }
}