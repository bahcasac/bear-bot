/**
 * Created by mehamasum on 6/30/2017.
 */

module.exports = function(controller) {
    controller.hears(['thanks', 'thank you'], 'direct_message', function(bot, message) {
        bot.reply(message, "Happy to help 😃");
    });
};