/**
 * Created by mehamasum on 6/30/2017.
 */

const TAG = "meha, office_hour.js: ";


module.exports = function(controller) {
    controller.hears(['enviar expediente'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "SET");
    });

    controller.hears(['deletar expediente'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "DELETE");
    });

    controller.hears(['expediente'], 'direct_message', function(bot, message) {
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
                        convo.say('Finalizado');
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
            if (room.teacher) {

                if(method==="SET") {
                    convo.ask('Entre com o expediente, por exemplo: `MTF 9am-11am` ou `sair` para finalizar', [
                        {
                            pattern:  'sair',
                            callback: function(response, convo) {
                                convo.say('Finalizado');
                                convo.next();
                            }
                        },
                        {
                            default: true,
                            callback: function(response, convo) {
                                // this is the office hours string

                                // add to room
                                controller.storage.channels.get(room.id, function (err, room) {
                                    if (room) {
                                        room.details.office_hours = response.text;
                                        controller.storage.channels.save(room, function (err, id) {
                                            if (err) console.error(TAG+ "controller.storage.channels.save not working");
                                        });
                                    }
                                });

                                // notify everyone
                                bot.reply({channel: room.id}, 'Novo expediente foi colocado para '+ response.text+'  \nDigite `expediente` em uma **conversa pessoal (1:1)** para consultar depois');

                                // done
                                convo.say('Expediente alterado');
                                convo.next();
                            }
                        }
                    ]);
                }
                else if(method==="DELETE") {
                    // delete from room
                    controller.storage.channels.get(room.id, function (err, room) {
                        if (room) {
                            room.details.office_hours = null;
                            controller.storage.channels.save(room, function (err, id) {
                                if (err) console.error(TAG+ "controller.storage.channels.save not working");
                            });

                            //notify everyone
                            bot.reply({channel: room.id}, 'O expediente foi removido');
                        }
                    });

                    // done
                    convo.say('Expediente removido');
                    convo.next();
                }
            }
            else { //student
                convo.say(" Desculpe. Você não está autorizado a enviar essa informação");
            }
        }
        else if(method==="GET") {
            // get from room
            controller.storage.channels.get(room.id, function (err, room) {
                if (room) {
                    if(room.details.office_hours) {
                        convo.say(room.details.office_hours);
                    }
                    else {
                        convo.say("Expediente não foi alterado");
                    }
                }
            });
        }
        convo.next();
    }
    else {
        convo.say("Escolha um número da lista!");
        // just repeat the question
        convo.repeat();
        convo.next();
    }
}