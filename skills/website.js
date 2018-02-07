/**
 * Created by mehamasum on 6/30/2017.
 */
const TAG = "meha, due.js: ";

var Util = require("../components/util.js");

module.exports = function (controller) {
    controller.hears(['adicionar site', 'enviar site'], 'direct_message', function (bot, message) {
        handel(controller, bot, message, "SET");
    });


    // controller.hears(['atualizar site', 'editar site'], 'direct_message', function(bot, message) {
    //     handel(controller, bot, message, "EDIT");
    // });

    // controller.hears(['apagar site'], 'direct_message', function(bot, message) {
    //     handel(controller, bot, message, "DELETE");
    // });


    // controller.hears(['site'], 'direct_message', function(bot, message) {
    //     handel(controller, bot, message, "GET");
    // });

};

function handel(controller, bot, message, method) {


    var person = message.original_message.personId;
    controller.storage.users.get(person, function (err, user) {
        if (!user) {
            bot.reply(message, "Desculpe. Nós não estamos em uma sala de aula!");
            return;
        }

        var rooms = user.details.rooms;
        if (rooms.length === 1) {
            bot.startConversation(message, function (err, convo) {
                roomSelected(controller, bot, convo, method, 1, rooms);
            });
            return;
        }

        // start a conversation to handle this response.
        bot.startConversation(message, function (err, convo) {

            var choice = "";
            choice += "De qual classe? \nDigitar com um número. Por exemplo, '1', '2' etc ou `sair` para finalizar  \n  \n";
            for (var idy = 0; idy < rooms.length; idy++) {
                choice += (idy + 1) + ". " + rooms[idy].title + "  \n";
            }

            convo.addQuestion(choice, [
                {
                    pattern: 'sair',
                    callback: function (response, convo) {
                        convo.say('Finalizado');
                        convo.next();
                    }
                },
                {
                    pattern: new RegExp(/^\d+$/),
                    callback: function (response, convo) {

                        // console.log("%d => "+ JSON.stringify(response));
                        var opt = parseInt(response.text);
                        roomSelected(controller, bot, convo, method, opt, rooms);
                    }
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        // just repeat the question
                        convo.repeat();
                        convo.next();
                    }
                }
            ], {}, 'default');

        })

    });
}

    