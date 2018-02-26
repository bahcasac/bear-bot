/**
 * Created by mehamasum on 6/30/2017.
 */

module.exports = function(controller) {
    controller.hears(['obrigado', 'obrigada'], 'direct_message', function(bot, message) {
        bot.reply(message, "Feliz em ajudar 😃");
    });
    controller.hears(['ok', 'certo', 'consegui','ta bom', 'beleza'], 'direct_message', function(bot, message) {
        bot.reply(message, "Certo! 😃");
    });
};