module.exports = function(controller){

        controller.hears(['teste'], 'direct_message', function(bot, message) {
            bot.reply(message,  'oi ');
    });
}