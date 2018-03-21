module.exports = function(controller) {

// DM convo
// start
    controller.hears(['oi', 'olá', 'oii', 'hey'], 'direct_message', function (bot, message) {
        bot.reply(message, 'Olá 👋 Digite `ajuda` para visualizar a lista de comandos disponíveis.');
    });

};