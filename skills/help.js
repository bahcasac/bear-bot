module.exports = function(controller) {
    controller.hears(['ajuda'], 'direct_message', function(bot, message) {
        //bot.reply(message, 'Hold on while I gather a list of available commands for you.');

        var person = message.original_message.personId;

        controller.storage.users.get(person, function(err, user) {
            if (!user) {
                bot.reply(message, "Desculpe. Nós não estamos em uma sala de aula compartilhada!");
            }
            else {

                var rooms = user.details.rooms;
                var teacher = 0;
                var student = 0;

                for(var idx= 0; idx<rooms.length; idx++) {
                    var room = rooms[idx];

                    if (room.teacher) teacher++;
                    else student++;
                }

                if(teacher>0) {
                    bot.reply(message, "Aqui está uma lista completa de ações **para Professores**:  \n"

                    + "**Atividade extra-classe**  \n"
                    + "-`enviar/apagar atividade extra-classe`: Para enviar ou apagar uma atividade já enviada  \n"
                    + "-`atividade extra-classe`: Informações sobre as horas do escritório  \n"

                    + "**Site para a Sala de Aula**  \n"
                    + "-`enviar/apagar site`: Enviar ou apagar informações de um curso  \n"
                    + "-`site`: Conseguir informações sobre o site  \n"

                    + "**Links para Resumo**  \n"
                    + "-`enviar/apagar resumo`: Enviar ou apagar um link do resumo  \n"
                    + "-`resumo`: Visualizar link do resmo  \n"

                    + "**Links para Estudo**  \n"
                    + "-`enviar/deletar estudos`: Enviar ou apagar um link de estudo do curso  \n"
                    + "-`estudos`: Pegar o link de recursos do curso  \n"


                    + "**Tarefa**  \n"
                    + "-`adicionar/atualizar/apagar tarefa`: Para tarefas com título, descrição e data  \n"
                    + "-`tarefa`: Para visualizar a lista das próximas tarefas  \n"

                    + "**Prova**  \n"
                    + "-`adicionar/atualizar/apagar prova`: Para provas (título, descrição e data)  \n"
                    + "-`prova`: Para visualizar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`adicionar/atualizar/apagar evento`: Para eventos com título, descrição e data  \n"
                    + "-`evento`: Para visualizar a lista dos próximos eventos  \n"

                    + "**Notícias**  \n"
                    + "-`adicionar/atualizar/apagar notícias`: Para importar anúncios e notificações  \n"
                    + "-`notícias`: Para visualizar a última informação  \n"



                    + "**Pergunta**  \n"
                    + "-`enviar/apagar pergunta `: Para questões do espaço ou das pergunta  \n"
                    // + "-`enviar pergunta` com `.docx` com arquivo anexado: Cria uma pergunta do arquivo  \n"
                    // + "-`enviar pergunta com tex`: Criar uma pergunta com equações Latex  \n"
                    + "-`pergunta`: Visualizar a pergunta ativa  \n"
                    + "-`resultado`: Gerar resultado de uma pergunta ativa  \n"

                    + "**Configurações**  \n"
                    + "-`enviar fuso horário`: Enviar um fuso-horário, todas as consultas e lembretes vão disparar de acordo com isso.  \n"
                    + "-`fuso horário`: Exibir o fuso-horário atual  \n"
                    + "-`tornar administrador`: Dar a alguém o privilégio de administrador (usar o e-mail)  \n"
                    + "-`remover administrador`: Remover o privilégio de administrador (usar o e-mail)   \n"
                    + "-`administrador`: Visualizar o próprio status de admin  \n"

                    );
                }
                if(student>0) {
                    bot.reply(message, "Aqui está a lista de ações suportadas **para estudantes**:  \n"

                    + "**Atividades Extra-classe**  \n"
                    + "-`Atividade Extra-classe`: Para visualizar as informações  \n"

                    + "**Site para a Sala de Aula**  \n"
                    + "-`site`: Para visualizar as informações  \n"

                    + "**Links para Resumo**  \n"
                    + "-`Resumo`: Para visualizar link de resumo  \n"

                    + "**Links para Estudo**  \n"
                    + "-`estudos`: Para visualizar os links para estudo  \n"

                    + "**Fuso Horário**  \n"
                    + "-`Fuso horário`: Oara visualizar o fuso horário atual  \n"



                    + "**Tarefa**  \n"
                    + "-`tarefa`: Para visualizar a lista de tarefas  \n"

                    + "**Prova**  \n"
                    + "-`prova`: Para visualizar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`evento`: Para visualizar a lista dos próximos eventos  \n"

                    + "**Notícas**  \n"
                    + "-`notícias`: Para visualizar as últimas notícias  \n"


                    + "**Pergunta**  \n"
                    + "-`pergunta`: Para visualizar as perguntas que foram feitas  \n"

                    );
                }
            }
        });

    });

}
