/**
 * Created by mehamasum on 6/30/2017.
 */
const TAG = "meha, news.js: ";

var Util = require("../components/util.js");

module.exports = function(controller) {
    controller.hears(['adicionar notícias', 'enviar notícias'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "SET");
    });


    controller.hears(['atualizar notícias', 'editar notícias'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "EDIT");
    });

    
    controller.hears(['apagar notícias'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "DELETE");
    });


    controller.hears(['notícias'], 'direct_message', function(bot, message) {
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

function form(controller, bot, convo, room, idx, due) {

    var nameQ = 'Entre com um título, por exemplo:  `Aula alterada para 20 de Agosto` ou `sair` para finalizar';
    var descQ = 'Entre com uma descrição, por exemplo `Novo agendamento: MTF 10am-11am, detalhes aqui: foo.bar` ou `sair` para finalizar';
    if(due) {
        nameQ += "  \n  \n*Atual: "+due.name+"*";
        descQ += "  \n  \n*Atual: "+due.description+"*";
    }

    convo.ask(nameQ, [
        {
            pattern:  'sair',
            callback: function(response, convo) {
                convo.say('Finalizar');
                convo.next();
            }
        },
        {
            default: true,
            callback: function(response, convo) {
                // this is the name string
                var name = response.text;
                convo.ask(descQ, [
                    {
                        pattern:  'sair',
                        callback: function(response, convo) {
                            convo.say('Finalizar');
                            convo.next();
                        }
                    },
                    {
                        default: true,
                        callback: function(response, convo) {
                            // this is the description string
                            var description = response.text;

                            var notif ='Informar:  \n**'+name+'**  \n'+description+'  \n';

                            // save it
                            if(due) {
                                notif = 'Informar '+ due.name+' foi atuaizado:  \n**'+name+'**  \n'+description+'  \n';

                                // update
                                controller.storage.channels.get(room.id, function (err, room) {
                                    if (room) {
                                        room.details.news[idx]= {name: name, description: description};
                                        controller.storage.channels.save(room, function (err, id) {
                                            if (err) console.error(TAG+ "controller.storage.channels.save not working");
                                        });
                                    }
                                });

                            }
                            else {
                                controller.storage.channels.get(room.id, function (err, room) {
                                    if (room) {

                                        if(!room.details.news) room.details.news = [];

                                        room.details.news.push({name: name, description: description});

                                        controller.storage.channels.save(room, function (err, id) {
                                            if (err) console.error(TAG+ "controller.storage.channels.save not working");
                                        });
                                    }
                                });
                            }

                            // notify everyone
                            // TODO calendar
                            // get from room
                            controller.storage.channels.get(room.id, function (err, room) {
                                if (room) {
                                    bot.reply({channel: room.id}, notif);
                                }
                            });

                            convo.say('Notícias salvas');

                            convo.next();
                        }
                    }
                ]);

                convo.next();
            }
        }
    ]);
}

function roomSelected(controller, bot, convo, method, opt, rooms) {
    if(opt>=1 && opt<=rooms.length) {

        var room = rooms[opt-1];

        if(method==="SET" || method==="EDIT" || method==="DELETE") {
            if (room.teacher) {

                if(method==="SET") {
                    form(controller, bot, convo, room, null, null);
                }


                else if(method==="EDIT" || method==="DELETE" ) {
                    // get from room
                    controller.storage.channels.get(room.id, function (err, room) {
                        if(room.details.news && room.details.news.length>0) {
                            var dues = room.details.news;

                            var choice = "Quais notícias? \nReplicar com o número, ou seja, `1`, `2` etc. ou `sair` para finalizar  \n ";
                            for(var idp= 0; idp<dues.length; idp++) {
                                choice += (idp+1) + ". " + dues[idp].name +"  \n";
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
                                        var optdue = parseInt(response.text);

                                        if(optdue>=1 && optdue<=dues.length) {

                                            var due = dues[optdue-1];

                                            if(method==="EDIT") {
                                                form(controller, bot, convo, room, optdue-1, due);
                                            }
                                            else if(method==="DELETE") {
                                                Util.deleteItemFromArray(dues, optdue-1);
                                                convo.say("Apagado");
                                                room.details.news = dues;
                                                controller.storage.channels.save(room, function (err, id) {
                                                    if (err) console.error(TAG+ "controller.storage.channels.save not working");
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
                        }
                        else {
                            convo.say("Nenhuma notícia encontrada!");
                        }
                    });
                }
            }
            else { //student
                convo.say("Desculpe. Nós não estamos autorizados para colocar essa informação");
            }
        }
        else if(method==="GET") {
            // get from room
            controller.storage.channels.get(room.id, function (err, room) {
                if (room) {
                    if(room.details.news && room.details.news.length>0) {

                        var dues = room.details.news;

                        // TODO: add to cal
                        var choice = "**Notícias/Observações:**  \n";
                        var cnt = 0;
                        for(var idk= 0; idk<dues.length; idk++) {
                            cnt++;
                            choice += "**"+ cnt + ". " + dues[idk].name +"**  \n"+dues[idk].description+"  \n";
                        }

                        convo.say(choice);
                    }
                    else {
                        convo.say("Nenhuma notícia encontrada");
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