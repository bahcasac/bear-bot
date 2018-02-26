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

                    + "**Link para Resumo**  \n"
                    + "-`enviar/apagar resumo`: Enviar ou apagar um link do resumo  \n"
                    + "-`resumo`: Visualizar link do resmo  \n"

                    + "**Links para Estudo**  \n"
                    + "-`enviar/deletar recursos`: Enviar ou apagar um link de recursos do curso  \n"
                    + "-`recursos`: Pegar o link de recursos do curso  \n"


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

                    + "**Atividade extra-classe**  \n"
                    + "-`enviar/apagar atividade extra-classe`: Para enviar ou apagar horas referentes as informações do escritório  \n"
                    + "-`atividade extra-classe`: Informações sobre as horas do escritório  \n"

                    + "**Site do Curso**  \n"
                    + "-`enviar/apagar site`: Enviar ou apagar informações de um curso  \n"
                    + "-`site`: Conseguir informações sobre o site  \n"

                    + "**Resumo**  \n"
                    + "-`enviar/apagar resumo`: Enviar ou apagar o link para resumo  \n"
                    + "-`Resumo`: Visualizar o link do resumo  \n"

                    + "**Recursos do Curso**  \n"
                    + "-`enviar/apagar recursos`: Enviar ou apagar um link de recursos do curso  \n"
                    + "-`recursos`: Pegar o link de recursos do curso  \n"

                    + "**Tarefa**  \n"
                    + "-`adicionar/alterar/apagar tarefa`: Para tarefas com título, descrição e data  \n"
                    + "-`tarefa`: Para visualizar a lista das próximas tarefas \n"

                    + "**Prova**  \n"
                    + "-`adicionar/alterar/apagar prova`: Para provas (título, descrição e data)  \n"
                    + "-`prova`: Para visualizar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`adicionar/alterar/apagar evento`: Para eventos (título, descrição e data)  \n"
                    + "-`evento`: Para visualizar a lista dos próximos eventos  \n"

                    + "**Notícias**  \n"
                    + "-`adcionar/alterar/apagar notícias`: Para importar anúncios e notificações  \n"
                    + "-`notícias`: Para visualizar a última informação  \n"

                        + "**Pergunta**  \n"
                        + "-`pergunta: Questões de participantes anônimos da sala de aula  \n"

                        + "**Gupo de post anônimo**  \n"
                        + "-`post`: Post anônimo de uma questão  \n"

                    );
                }
            }
        });

    });

}
