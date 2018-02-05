/**
 * Created by mehamasum on 6/30/2017.
 */
const TAG = "meha, due.js: ";

var Util = require("../components/util.js");

module.exports = function(controller) {
    controller.hears(['adicionar tarefa', 'enviar tarefa'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "SET");
    });


    controller.hears(['atualizar tarefa', 'editar tarefa'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "EDIT");
    });

    controller.hears(['deletar tarefa'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "DELETE");
    });


    controller.hears(['tarefa'], 'direct_message', function(bot, message) {
        handel(controller, bot, message, "GET");
    });

};

function handel(controller, bot, message, method) {


    var person = message.original_message.personId;
    controller.storage.users.get(person, function(err, user) {
        if (!user) {
            bot.reply(message, "Desculpe. Nós não estamos em uma sala de aula!");
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
            choice += "De qual classe?  \nDigitar com um número. Por exemplo, '1', '2' etc ou `sair` para finalizar  \n  \n";
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

function form(controller, bot, convo, room, idx, due) {

    var nameQ = 'Digitar um nome, por exemplo: `Lista de Estudos  #1` ou `sair` para finalizar';
    var descQ = 'Digitar uma descrição, por exemplo: `Leia o capítulo 1 & 2 e responta a questão deste link: https:foo.bar` ou `sair` para finalizar';
    var timeQ = 'Enter due date in YYYY-MM-DD HH-MM format i.e. `2017-12-12 23:59` or `quit` to abort';
    if(due) {
        nameQ += "  \n  \n*Atual: "+due.name+"*";
        descQ += "  \n  \n*Atual: "+due.description+"*";
        timeQ += "  \n  \n*Atual: "+due.time+"*";
    }

    const TAG = "meha, due.js: form: ";
    convo.ask(nameQ, [
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
                // this is the name string
                var name = response.text;
                convo.ask(descQ, [
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
                            // this is the description string
                            var description = response.text;

                            convo.ask(timeQ, [
                                {
                                    pattern:  'sair',
                                    callback: function(response, convo) {
                                        convo.say('Finalizado');
                                        convo.next();
                                    }
                                },
                                {
                                    pattern:  new RegExp(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/),
                                    callback: function(response, convo) {

                                        /// this is time
                                        var time = response.text;

                                        var notif ='Nova tarefa adicionada:  \n**'+name+'**  \n'+description+'  \nDate: '+time;

                                        // save it
                                        if(due) {
                                            notif = 'Tarefa '+ due.name+' foi atualizada:  \n**'+name+'**  \n'+description+'  \nData: '+time;

                                            // update
                                            controller.storage.channels.get(room.id, function (err, room) {
                                                if (room) {
                                                    room.details.due[idx]= {name: name, description: description, time: time};
                                                    controller.storage.channels.save(room, function (err, id) {
                                                        if (err) console.error(TAG+ "controller.storage.channels.save not working");
                                                    });
                                                }
                                            });

                                        }
                                        else {
                                            controller.storage.channels.get(room.id, function (err, room) {
                                                if (room) {

                                                    if(!room.details.due) room.details.due = [];

                                                    room.details.due.push({name: name, description: description, time: time});

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
                                                var offset_str = null;
                                                if (room.details.timezone) {
                                                    offset_str = room.details.timezone;
                                                }
                                                var btns = Util.buildCalendarNew(room.details.title, name, description, time, offset_str);
                                                notif += "  \n📆 "+ btns[0]+" "+ btns[1]+" "+btns[2]+" "+ btns[3]+"  \n  \n";
                                                bot.reply({channel: room.id}, notif);
                                            }
                                        });

                                        convo.say('Tarefa salva');
                                        convo.next();
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
                            ]);

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
                        if(room.details.due && room.details.due.length>0) {
                            var dues = room.details.due;

                            var choice = "Qual tarefa? Responda com um número. Por exemplo `1`, `2` etc. ou `sair` para finalizar  \n";
                            for(var idp= 0; idp<dues.length; idp++) {
                                choice += (idp+1) + ". " + dues[idp].name +"  \n";
                            }

                            convo.addQuestion(choice,[
                                {
                                    pattern:  'sair',
                                    callback: function(response, convo) {
                                        convo.say('Finalizado');
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
                                                room.details.due = dues;
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
                            convo.say("Nenhuma tarefa encontrada");
                        }
                    });
                }
            }
            else { //student
                convo.say("Desculpe. Você não está autorizado a enviar essa informação");
            }
        }
        else if(method==="GET") {
            // get from room
            controller.storage.channels.get(room.id, function (err, room) {
                if (room) {
                    if(room.details.due && room.details.due.length>0) {

                        var dues = room.details.due;

                        var offset = 0, offset_str=null;
                        if(room.details.timezone) {
                            offset_str = room.details.timezone;
                            offset = parseFloat(room.details.timezone);
                        }

                        // create Date object for current location
                        var d = new Date();

                        // convert to msec
                        // subtract local time zone offset
                        // get UTC time in msec
                        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

                        // create new Date object for different city
                        // using supplied offset
                        var nd = new Date(utc + (3600000*offset));


                        // TODO: add to cal
                        var choice = "**Atualizar tarefa:**  \n";
                        var cnt = 0;
                        for(var idk= 0; idk<dues.length; idk++) {

                            var given = new Date(dues[idk].time);

                            //console.log(JSON.stringify(given)+"\n\n"+JSON.stringify(nd));

                            if(given.getTime() >= nd.getTime()) {
                                cnt++;
                                choice += "**"+ cnt + ". " + dues[idk].name +"**  \n"+dues[idk].description+"  \n"+"Date: "+dues[idk].time+"  \n";
                            }
                        }

                        convo.say(choice);
                    }
                    else {
                        convo.say("Não encontrado");
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