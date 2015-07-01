var express = require('express');
var router = express.Router();

//instalamos el controlador de preguntas
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//rutas nuevas para preguntas y respuestas
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

//GET /author
router.get('/author', function(req, res) {
  res.render('author');
});
module.exports = router;
