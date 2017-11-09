// Ядро Express
const express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// Ядро Mongoose
const mongoose = require('mongoose');
//mongoose.set('debug', true); // Отладка mongoose

const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

// Загрузка базовых настроек
const mainConf = require('./config/mainConfig.js');

// Создание приложения Express
const app = express();

app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true }))

// Подключение авторизации
require('./config/passportStrategy')(passport);
app.use(passport.initialize());

// Расшареные папки (сейчас root!)
app.use(express.static(path.join(__dirname, '/')));

// Создание подключения к БД и старт сервера
mongoose.connect(mainConf.dbUrl, {useMongoClient: true}, function(err){
	if (err) return console.log(err);	
});

// Подгрузка путей	
require('./app/routes/index.js')(app, passport);

// Загрузка файлов серитификата
if(mainConf.isSSL){
	var privateKey = fs.readFileSync(mainConf.privateKey);
	var certificate = fs.readFileSync(mainConf.certificate);
	var credentials = {key: privateKey, cert: certificate};
	var server = https.createServer(credentials, app);
}else{
	var server = http.createServer(app);
}

// Старт сервера на порту
server.listen(mainConf.port, function(){
	console.log('Server running on port: ' + mainConf.port);
});