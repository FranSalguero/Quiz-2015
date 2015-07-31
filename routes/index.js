var express = require('express');
var router = express.Router();

//instalamos el controlador de preguntas
var quizController = require('../controllers/quiz_controller');
//y el de comentarios
var commentController = require('../controllers/comment_controller');
//y ahora el de sesiones
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId
//Autoload de los comentarios
router.param('commentId', commentController.load);  // autoload :commentId
// Definición de rutas de sesión
router.get('/login',  sessionController.new);     // formulario login
router.post('/login', sessionController.create);  // crear sesión
router.get('/logout', sessionController.destroy); // destruir sesión

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);
//rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',            commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',              commentController.create);
//El comentario estará accesible cuando la acción publish se ejecute:
//GET funciona, pero el interfaz uniforme indica usar PUT en este caso
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	                                    sessionController.loginRequired, commentController.publish);


//GET /author
router.get('/author', function(req, res) {
  res.render('author', {errors: []});
});
module.exports = router;
