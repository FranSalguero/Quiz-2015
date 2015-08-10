var models = require('../models/models.js');

var estadisticas = {preguntas: 0, comentariosTotales: 0, preguntasSinComentarios: 0};
// construimos las estadísticas y se las pasamos a la vista
exports.show = function(req, res) {

    models.Quiz.count().then(function(result){
      estadisticas.preguntas = result;
      console.log("nPreguntas: " + result);
      //res.render('quizes/statistics', {numPreguntas: cuenta, errors: []});
    }).catch(function(error){next(error)});

    models.Comment.count().then(function(result){
      estadisticas.comentariosTotales = result;
      console.log("nComentarios: " + result);

    }).catch(function(error){next(error)});

    models.Quiz.count({
       distinct: true,
       where: [ '"Comments"."QuizId" IS NULL' ],
       include: [{
           model: models.Comment,
               required: false
       }]
     }).then(function(result){
       estadisticas.preguntasSinComentarios = result;
       console.log("preguntasSinComentarios: " + result);
       res.render('quizes/statistics', {estadisticas: estadisticas, errors: []});
   }).catch(function(error){next(error)});
    //estadisticas.preguntasSinComentarios = buscarPreguntasNoComentarios();

};
