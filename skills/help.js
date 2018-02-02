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
                    + "-`alterar/deletar expediente`: Para enviar ou deletar horas referentes as informações do escritório  \n"
                    + "-`expediente`: Informações sobre as horas do escritório  \n"

                    + "**Site para a Sala de Aula**  \n"
                    + "-`set/delete website`: Enviar ou deletar informações de um curso  \n"
                    + "-`website`: Conseguir informações sobre o site  \n"

                    + "**Link Resumo**  \n"
                    + "-`enviar/deletar resumo`: Enviar ou deletar um link do resumo  \n"
                    + "-`resumo`: Visualizar link do resmo  \n"

                    + "**Recursos do Curso**  \n"
                    + "-`set/delete resources`: Enviar ou deletar um link de recursos do curso  \n"
                    + "-`resources`: Pegar o link de recursos do curso  \n"


                    + "**Tarefa**  \n"
                    + "-`adicionar/atualizar/apagar tarefa`: Para tarefas com título, descrição e data  \n"
                    + "-`tarefa`: Para pegar a lista das próximas tarefas  \n"

                    + "**Exame**  \n"
                    + "-`add/update/delete exam`: Para exames (quiz, midterm, finals) avisos com título, descrição e data  \n"
                    + "-`exam`: Para pegar a lista das próximas provas  \n"

                    + "**Evento**  \n"
                    + "-`add/update/delete event`: Para eventos com título, descrição e data\n"
                    + "-`event`: Para pegar a lista dos próximos eventos  \n"

                    + "**Notícias**  \n"
                    + "-`add/update/delete news`: Para importar anúncios e notificações  \n"
                    + "-`news`: Para pegar a última informação  \n"



                    + "**Poll**  \n"
                    + "-`set/delete poll`: Para questões do espaço ou das polls  \n"
                    + "-`set poll` com `.docx` com arquivo anexado: Cria uma poll do arquivo  \n"
                    + "-`set poll with tex`: Criar uma poll com equações Latex Create poll with Latex equations  \n"
                    + "-`poll`: Visualizar a poll ativa To view the active poll  \n"
                    + "-`result`: Gerar resultado de uma poll ativa  \n"

                    + "**Configurações**  \n"
                    + "-`set timezone`: Enviar um fuso-horário, todas as consultas e lembretes vão disparar de acordo com isso.  \n"
                    + "-`timezone`: Exibir o fuso-horário atual  \n"
                    + "-`make admin`: Dar a alguém o privilégio de administrador (usar o e-mail)  \n"
                    + "-`remove admin`: Remover o privilégio de administrador (usar o e-mail)   \n"
                    + "-`admin`: Visualizar o próprio status de admin  \n"

                    );
                }
                if(student>0) {
                    bot.reply(message, "Aqui está a lista de ações suportadas **para estudantes**:  \n"

                    + "**Horas do escritório**  \n"
                    + "-`set/delete office hours`: Para enviar ou deletar horas referentes as informações do escritório  \n"
                    + "-`office hours`: Informações sobre as horas do escritório  \n"

                    + "**Site do Curso**  \n"
                    + "-`set/delete website`: Enviar ou deletar informações de um curso  \n"
                    + "-`website`: Conseguir informações sobre o site  \n"

                    + "**Syllabus**  \n"
                    + "-`set/delete syllabus`: Enviar ou deletar um link no syllabus  \n"
                    + "-`syllabus`: Conseguir um link no syllabus  \n"

                    + "**Recursos do Curso**  \n"
                    + "-`set/delete resources`: Enviar ou deletar um link de recursos do curso  \n"
                    + "-`resources`: Pegar o link de recursos do curso  \n"

                    + "**Due**  \n"
                    + "-`add/update/delete due`: Para dues (homework, assignments, reports) com título, descrição e data  \n"
                    + "-`due`: Para pegar a lista das próximas dues  \n"

                    + "**Exam**  \n"
                    + "-`add/update/delete exam`: Para exames (quiz, midterm, finals) avisos com título, descrição e data  \n"
                    + "-`exam`: Para pegar a lista das próximas provas  \n"

                    + "**Events**  \n"
                    + "-`add/update/delete event`: Para eventos com título, descrição e data  \n"
                    + "-`event`: Para pegar a lista dos próximos eventos  \n"

                    + "**News**  \n"
                    + "-`add/update/delete news`: Para importar anúncios e notificações  \n"
                    + "-`news`: Para pegar a última informação  \n"

                        + "**Poll**  \n"
                        + "-`poll`: Questões ou polls de participantes anônimos da sala de aula  \n"

                        + "**Anonymous Group Post**  \n"
                        + "-`post`: Post anônimo de uma questão  \n"

                    );
                }
            }
        });

    });

}
