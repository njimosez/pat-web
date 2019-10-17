const express = require('express')

const nunjucks = require('nunjucks')
const app = express()
const homeController = require('./controller/homeController');

app.set('view engine', 'njk')




//static file setup
app.use(express.static('./public'))



//view/template engine setup
nunjucks.configure('views',{
    autoescape: true,
     express: app
})


//Call/fire controllers/routes

homeController(app);



//listening to port
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
console.log('Express server listening on port ' + server.address().port);


console.log('Initiating shutdown');

process.exit();
});
