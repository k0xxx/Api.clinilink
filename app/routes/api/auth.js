var Users = require('../../models/users');
var Users_auth = require('../../models/users_auth');
const crypto = require('crypto');

module.exports = function (app, passport){
	
	app.post('/api/auth/afterRegistration', passport.authenticate('jwt', { session: false }), function(req, res){
		Users.findById(req.user, function(err, userProfile){
			userProfile.isRegister = true;
			
			if(req.body.lastname != undefined){var lastName = req.body.lastname};
			if(req.body.name != undefined){var firstName = req.body.name};
			
			if(lastName){
				userProfile.lastName = lastName;
				userProfile.fullName = lastName;
			}
			if(firstName){
				userProfile.firstName = firstName;
				userProfile.fullName += ' '+firstName;
			}
			
			switch(req.body.status){
				case 'patient':
					userProfile.status.id = 0;
					userProfile.status.name = 'Patient';
					userProfile.status.name_rus = 'Пациент';
				break;
				case 'specialist':
					userProfile.status.id = 1;
					userProfile.status.name = 'Specialist';
					userProfile.status.name_rus = 'Специалист';
					//newUser.status.icon = '';
					if(req.body.med_position != undefined){userProfile.med_position = req.body.med_position};
				break;
				case 'Doctor':
					userProfile.status.id = 2;
					userProfile.status.name = 'Doctor';
					userProfile.status.name_rus = 'Врач';
					userProfile.status.icon = '<i class="fa fa-plus-square mr-2 text-muted"></i>';
				break;
			}
			
			callsRegistratoin(req.user)
			
			userProfile.save(function (err) {
				if(err) return res.json(err);
				res.json(true);
			});
		})
	});
	
	app.post('/api/auth/login', function(req, res){
		passport.authenticate('local-login', function(err, user, info) {
			if (err) return res.json(err);
			if (!user) {
				return res.json({user: user, info: info});
			}else{
				return res.json({user: user, info: info});
			}
		})(req, res);
	});
	
	app.post('/api/auth/signup', function(req, res){
		passport.authenticate('local-register', function(err, user, info) {
			if (err) return res.json(err);
			if(user){
				sendVerificationToken(user.local.email)
				return res.json({user: true, info: info});
			}else{
				return res.json({user: false, info: info});
			}
		})(req, res);
	});
	
	app.post('/api/auth/send_verification', function (req, res) {
		sendVerificationToken(req.body.email)
	});

	app.post('/api/auth/chek_verification', function(req, res){
		passport.authenticate('local-submit', function(err, jwtInfo, info) {
			if (err) return res.json({error: err, jwtInfo: false});
			if(jwtInfo){
				//sendVerificationToken(user.local.email)
				return res.json({error: '', jwtInfo: jwtInfo});
			}else{
				return res.json({error: info, jwtInfo: false});
			}
		})(req, res);
	})

	function sendVerificationToken(email, callback){
		Users_auth.findOne({'local.email': email}, function (err, user) {
			if(user){
				if (user.local.verified == false){
					var nodemailer = require('nodemailer');
					var fs = require('fs');
					var emailConf = require('../../../config/emailConfig');
					var transporter = nodemailer.createTransport(emailConf.smpt);
					
					var submitMail = fs.readFileSync('./emails/submit_registration.html').toString();
					var submitString = 'https://main.clinilink.org/submit_profile/'+user._id+'/'+user.local.verification_token;
					submitMail = submitMail.replace('---SUBMIT_REGISTRATION---', submitString);
					
					var mailOptions = {
						from: emailConf.from,
						to: user.local.email,
						subject: 'Спасибо за регистрацию в Clinilink! ✔',
						html: submitMail,
					};
					
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) return callback(error);
						return callback({'message': 'Код подтверждения успешно отправлен!'});
					});
				} else {
					return callback({'message': 'Учетная запись пользователя уже подтверждена! Пожалуйста перейдите на главную страницу для входа в профиль!'});	
				}
			}else{
				return callback({'message': 'Учетная запись не найдена'});
			}
		});
	}

	app.get('/api/auth/profileInfo', function(req, res){
		passport.authenticate('jwt', function(err, user, info) {
			if (err) return res.json(err);
			if (!user) {
				return res.json({user: user, info: info});
			}else{
				//console.log(user);
				Users.findById(user)
				//.select('id', 'status', )
				.exec(function (err, profile) {
					if(err) return res.json({'error': err, 'profile': ''});
					
					if(profile){
						res.json({'error': '', 'profile': profile});
					}else{
						res.json({'error': 'profile is empty!', 'profile': ''});
					}
				});
			}
		})(req, res);
	});
	
	app.post('/api/auth/logout', function(req, res){
		passport.authenticate('local-login', function(err, user, info) {
			if (err) return res.json(err);
			if (!user) {
				return res.json({user: user, info: info});
			}else{
				return res.json({user: user, info: info});
			}
		})(req, res);
	});
	
	app.post('/api/auth/call_auth', passport.authenticate('jwt', { session: false }), function(req, res){
		Users.findById(req.user, function(err, userProfile){
			res.writeHead(200, {"Content-Type": "text/plain"});
			if(userProfile.calls.isRegister){
				let voxLogin = crypto.createHash('md5').update(userProfile.calls.login + ":voximplant.com:" + userProfile.calls.password).digest("hex");
				let key = crypto.createHash('md5').update(req.body.key + "|" + voxLogin).digest("hex");
				res.end(key);
			}else{
				res.end(false);
			}
		})
	});

	app.post('/api/auth/call_registration', passport.authenticate('jwt', { session: false }), function(req, res){
		Users.findById(req.user, function(err, userProfile){
			callsRegistratoin(req.user)
		})
	});

	function callsRegistratoin(userId){
		const https = require('https');
		const querystring = require('querystring');
		var passGenerator = require('generate-password');		

		const options = {
			hostname: 'api.voximplant.com',
			port: 443,
			path: '/platform_api/AddUser',
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		};
		
		Users.findById(userId, function(err, userProfile){
			if(err) console.log(err);
			if(userProfile){
				if(userProfile.calls.isRegister){
					console.log('allready registred!')
					return false;
				}else{
					var password = passGenerator.generate({length: 10, numbers: true});
					const newVoxUser = querystring.stringify({
						account_id: '1828853',
						api_key: 'a351b334-56cb-445d-b98b-1a76c901225b',
						user_name: userProfile.id,
						user_display_name: userProfile.id,
						user_password: password,
						application_name: 'videocall'
					});
					const request = https.request(options, (res) => {
						console.log('statusCode:', res.statusCode);
						//console.log('headers:', res.headers);
						res.on('data', (d) => {
							let voxResponse = JSON.parse(d)
							console.log(voxResponse)
							if(voxResponse.result == 1){
								userProfile.calls.id = voxResponse.user_id;
								userProfile.calls.login = userProfile.id;
								userProfile.calls.password = password;
								userProfile.calls.isRegister = true;
								userProfile.save(function (err) {
									if(err) console.log(err);
									return true;
								});
							}else{
								console.log(voxResponse);
								return false;
							}
						});
					});
					request.on('error', (e) => {
						userProfile.calls.error.msg = e.message;
						userProfile.calls.error.code = e.code;
						userProfile.save(function (err) {
							if(err) console.log(err);
							return false;
						});
					});
					request.write(newVoxUser);
					request.end();
				}
			}else{
				console.log('cannot find profile')
				return false;
			}
		})
	}
	
};