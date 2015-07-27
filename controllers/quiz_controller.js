var models = require('../models/models.js');
//Toda respuesta a un GET tiene asociada una vista

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
        if (quiz) {
          req.quiz = quiz;
          next();
        } else { next(new Error('No existe quizId = ' + quizId)) }
      }
  ).catch(function(error) { next(error)});
};

// GET /quizes?search=busqueda
exports.index = function(req, res) {
  //var temporal = '%' + replace(req.quiz.search, ' ', '%') +'%';
  if (req.query.search===undefined) {
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes, errors: []});
    }).catch(function(error) { next(error)});
 }
 else{
   models.Quiz.findAll({where: ["pregunta like ?", "%" + req.query.search.replace(" " , "%") +"%"]}).then(function(quizes) {
     res.render('quizes/index.ejs', { quizes: quizes, errors: []});
   }).catch(function(error) { next(error)});
 }
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  if (req.query.respuesta === req.quiz.respuesta) {
    res.render('quizes/answer',
               { quiz: req.quiz, respuesta: 'Correcto' , errors: []});
  } else {
    res.render('quizes/answer',
               { quiz: req.quiz, respuesta: 'Incorrecto' , errors: []});
  }
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz , errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      }else{
          quiz
          .save({fields: ["pregunta", "respuesta", "tema"]})
          .then( function(){ res.redirect('/quizes')})   // res.redirect: Redirección HTTP a lista de preguntas
      }
    }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
