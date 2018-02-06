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
                    bot.reply(message, "Aqui está uma lista completa de ações suportadas **para Professores**:  \n"

                    + "**Expediente**  \n"
                    + "-`enviar/apagar expediente`: Para enviar ou apagar horas referentes as informações do escritório  \n"
                    + "-`expediente`: Informações sobre as horas do escritório  \n"

                    + "**Site para a Sala de Aula**  \n"
                    + "-`enviar/apagar site`: Enviar ou apagar informações de um curso  \n"
                    + "-`site`: Conseguir informações sobre o site  \n"

                    + "**Link Resumo**  \n"
                    + "-`enviar/apagar resumo`: Enviar ou apagar um link do resumo  \n"
                    + "-`resumo`: Visualizar link do resmo  \n"

                    + "**Recursos do Curso**  \n"
                    + "-`set/delete recursos`: Enviar ou apagar um link de recursos do curso  \n"
                    + "-`recursos`: Pegar o link de recursos do curso  \n"


                    + "**Tarefa**  \n"
                    + "-`adicionar/atualizar/apagar tarefa`: Para tarefas com título, descrição e data  \n"
                    + "-`tarefa`: Para pegar a lista das próximas tarefas  \n"

                    + "**Exame**  \n"
                    + "-`adicionar/atualizar/apagar exame`: Para exames (quiz, midterm, finals) avisos com título, descrição e data  \n"
                    + "-`exame`: Para pegar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`adicionar/atualizar/apagar evento`: Para eventos com título, descrição e data  \n"
                    + "-`event`: Para pegar a lista dos próximos eventos  \n"

                    + "**Notícias**  \n"
                    + "-`adicionar/atualizar/apagar notícias`: Para importar anúncios e notificações  \n"
                    + "-`notícias`: Para pegar a última informação  \n"



                    + "**Pergunta**  \n"
                    + "-`enviar/apagar pergunta `: Para questões do espaço ou das pergunta  \n"
                    + "-`enviar pergunta` com `.docx` com arquivo anexado: Cria uma pergunta do arquivo  \n"
                    + "-`enviar pergunta com tex`: Criar uma pergunta com equações Latex Create pergunta with Latex equations  \n"
                    + "-`pergunta`: Visualizar a pergunta ativa  \n"
                    + "-`resultado`: Gerar resultado de uma pergunta ativa  \n"

                    + "**Configurações**  \n"
                    + "-`enviar fuso horário set timezone`: Enviar um fuso-horário, todas as consultas e lembretes vão disparar de acordo com isso.  \n"
                    + "-`fuso horário`: Exibir o fuso-horário atual  \n"
                    + "-`tornar administrador`: Dar a alguém o privilégio de administrador (usar o e-mail)  \n"
                    + "-`remover administrador`: Remover o privilégio de administrador (usar o e-mail)   \n"
                    + "-`administrador`: Visualizar o próprio status de admin  \n"

                    );
                }
                if(student>0) {
                    bot.reply(message, "Aqui está a lista de ações suportadas **para estudantes**:  \n"

                    + "**Horas do escritório**  \n"
                    + "-`enviar/apagar expediente`: Para enviar ou apagar horas referentes as informações do escritório  \n"
                    + "-`expediente`: Informações sobre as horas do escritório  \n"

                    + "**Site do Curso**  \n"
                    + "-`enviar/apagar site set/apagar site`: Enviar ou apagar informações de um curso  \n"
                    + "-`site`: Conseguir informações sobre o site  \n"

                    + "**Resumo**  \n"
                    + "-`enviar/apagar resumo`: Enviar ou apagar um link no syllabus  \n"
                    + "-`Resumo`: Conseguir um link no syllabus  \n"

                    + "**Recursos do Curso**  \n"
                    + "-`enviar/apagar recursos`: Enviar ou apagar um link de recursos do curso  \n"
                    + "-`recursos`: Pegar o link de recursos do curso  \n"

                    + "**Tarefa**  \n"
                    + "-`adicionar/alterar/apagar tarefa`: Para tarefas com título, descrição e data  \n"
                    + "-`tarefa`: Para pegar a lista das próximas tarefas \n"

                    + "**Prova**  \n"
                    + "-`adicionar/alterar/apagar prova`: Para provas (quiz, midterm, finals) avisos com título, descrição e data  \n"
                    + "-`prova`: Para pegar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`adicionar/alterar/apagar evento`: Para eventos com título, descrição e data  \n"
                    + "-`evento`: Para pegar a lista dos próximos eventos  \n"

                    + "**Notícias**  \n"
                    + "-`adcionar/alterar/apagar notícias`: Para importar anúncios e notificações  \n"
                    + "-`notícias`: Para pegar a última informação  \n"

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
