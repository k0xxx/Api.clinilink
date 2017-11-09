module.exports = function (app, passport){
    
	app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Authorization');
		next();
	});
	
	app.get('/', function(req, res){
		res.send('Welcome to API Clinilink');
	});
	
	require("./api/auth")(app, passport);
	require("./api/profile")(app);
	require("./api/profileSettings")(app, passport);
	require("./api/userInfo")(app, passport);
	require("./api/measurements")(app, passport);
	require("./api/medicalRecords")(app, passport);
	require("./api/messages")(app, passport);
	require("./api/contacts")(app, passport);
	require("./api/search")(app, passport);
	require("./api/news")(app, passport);
	require("./api/library")(app);
	require("./api/questions")(app, passport);
	require("./api/adminpage")(app);
	
	
	// Show 404 page
    app.get('/*', function(req, res){
        res.status(404);
        res.json({error: 'page not found'});
    });
};