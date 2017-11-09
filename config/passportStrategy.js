var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
var passportJWT = require("passport-jwt");

const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp

var JwtStrategy = passportJWT.Strategy;
var ExtractJwt = passportJWT.ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = 'mysecretkey'; // Ключ подписи JWT

var UsersAuth = require('../app/models/users_auth');
var Users = require('../app/models/users');

module.exports = function(passport) {
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		UsersAuth.findOne({_id: jwt_payload.id}, function(err, user) {
			if (err) return done(err, false);
			if (user) {
				return done(null, user.id);
			} else {
				return done(null, false);
			}
		});
	}));
	
	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				UsersAuth.findOne({'local.email': email}, function(err, user){
					if(err) return done(err);
					if(!user){return done(null, false, { message: 'Такой учетной записи не существует!' })}
					if(!user.validPassword(password)){return done(null, false, {message: 'Введеный пароль не верный!'})}
					createJWTtoken(user, function(jwtInfo){
						return done(null, jwtInfo);
					})
				});
			});
		}
	));
	
	passport.use('local-submit', new LocalStrategy({
			usernameField: 'userId',
			passwordField: 'submit',
			passReqToCallback: true
		},
		function(req, userId, submit, done){
			process.nextTick(function(){
				UsersAuth.findById(userId, function(err, user){
					if(err) return done(err);
					if(!user){return done(null, false, { message: 'Такой учетной записи не существует!' })}
					if(user.local.verification_token != submit){return done(null, false, { message: 'Ключ подтверждения не соответствует!'})}
					if(user.local.verified){return done(null, false, { message: 'Учетная запись уже подтверждена!'})}
					createJWTtoken(user, function(jwtInfo){
						user.local.verified = true;
						user.save(function (err){
							if(err) return done(err);
							return done(null, jwtInfo);
						})				
					})
				})
			})
		}
	));

	passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			UsersAuth.findOne({'local.email': email}, function(err, user){
				if(err) return done(err);
				if(user){
					return done(null, false, {message: 'Учетная запись уже существует'});
				} else {
					var userData = new Object();
					userData.profile = {'email': email, 'password': password};
					createProfile('local', userData, function(response){
						return done(null, response);
					});
				}
			})

		});
	}));
	
	function createJWTtoken(user, callback){
		const payload = {
			id: user._id,
			url: user.url
		};
		var token = 'JWT ' + jwt.sign(payload, opts.secretOrKey); //здесь создается JWT
		let userAuth = {
			id: user._id,
			url: user.url,
			token: token
		};
		return callback(userAuth);
	}
	
	function createProfile(type, userData, callback){
		var newUser = new UsersAuth();
		
		switch(type){
			case 'vk':
				newUser.vk.id = userData.profile.id;
				newUser.vk.token = userData.accessToken;
				newUser.vk.username = userData.profile.username;
				newUser.vk.name = userData.profile.displayName;
				newUser.vk.email = userData.params.email;
				break;
			case 'odnoklassniki':
				newUser.odnoklassniki.id = userData.profile.id;
	    		newUser.odnoklassniki.token = userData.accessToken;
	    		newUser.odnoklassniki.name = userData.profile.displayName;
	    		newUser.odnoklassniki.email = userData.params.email;
				break;
			case 'google':
				newUser.google.id = userData.profile.id;
	    		newUser.google.token = userData.accessToken;
	    		newUser.google.name = userData.profile.displayName;
	    		newUser.google.email = userData.profile.emails[0].value;
				break;
			case 'facebook':
				newUser.facebook.id = userData.profile.id;
	    		newUser.facebook.token = userData.accessToken;
	    		newUser.facebook.name = userData.profile.name.givenName + ' ' + userData.profile.name.familyName;
	    		newUser.facebook.email = userData.profile.email;
				break;
			case 'local':
				var verification_token = "";
				var possibleToken = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for( var i=0; i < 15; i++ )
					verification_token += possibleToken.charAt(Math.floor(Math.random() * possibleToken.length));
				
				newUser.local.email = userData.profile.email;
				newUser.local.password = newUser.generateHash(userData.profile.password);
				newUser.local.verification_token = verification_token;
				newUser.local.verified = false;
				break;
		}
		
		newUser.save(function (err, authProfile) {
			if(!err){
				authProfile.url = 'id-'+newUser._id;
				authProfile.save(function (err, newProfile) {
					if(!err){
						var createProfile = new Users();
						createProfile._id = newUser._id;
						createProfile.id = newUser._id;
						createProfile.url = 'id-'+newUser._id;
						createProfile.isRegister = false;
						createProfile.save(function (err, createdProfile) {
							if(!err){
								return callback(newUser);
							}
						});						
					}
				});				
			}
		});
	}
	
	
	//----------Passport Local Strategy--------------//

	/*passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		session: false
	  },
	  function (email, password, done) {
		UserA.findOne({email}, (err, user) => {
		  if (err) {
			return done(err);
		  }
		  
		  if (!user || !user.checkPassword(password)) {
			return done(null, false, {message: 'Нет такого пользователя или пароль неверен.'});
		  }
		  return done(null, user);
		});
	  }
	  )
	);

	//----------Passport JWT Strategy--------//

	// Ждем JWT в Header

	const jwtOptions = {
	  jwtFromRequest: ExtractJwt.fromAuthHeader(),
	  secretOrKey: 'mysecretkey'
	};

	passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
		UserA.findById(payload.id, (err, user) => {
		  if (err) {
			return done(err)
		  }
		  if (user) {
			done(null, user)
		  } else {
			done(null, false)
		  }
		})
	  })
	);
	
	/*passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		NewUserM.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			AuthUsersM.findOne({'local.email': email}, function(err, user){
			//console.log(email);
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('message', 'That email already taken'));
				} else {
					var userData = new Object();
					userData.profile = {'email': email, 'password': password};
					createProfile('local', userData, function(response){
						return done(null, response);
					});
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				AuthUsersM.findOne({'local.email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password))
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					if(user.local.verified == false)
						return done(null, false, req.flash('loginMessage', 'verified is falied'));
					return done(null, user);
				});
			});
		}
	));

	passport.use(new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
		enableProof: true
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		AuthUsersM.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
						profile.email = '';
						if(typeof(profile.emails) != 'undefined'){
							profile.email = profile.emails[0].value;;
						}
						
						var userData = new Object();
						userData.profile = profile;
						userData.accessToken = accessToken;
						createProfile('facebook', userData, function(response){
							return done(null, response);
						});
	    			}
	    		});
	    	});
	    }
	));

	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.clientSecret,
	    callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		AuthUsersM.findOne({'google.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
						var userData = new Object();
						userData.profile = profile;
						userData.accessToken = accessToken;
						createProfile('google', userData, function(response){
							return done(null, response);
						});
	    			}
	    		});
	    	});
	    }
	));
	
	passport.use(new OdnoklassnikiStrategy({
		clientID: configAuth.odnoklassnikiAuth.clientID,
		clientPublic: configAuth.odnoklassnikiAuth.clientPublic,
		clientSecret: configAuth.odnoklassnikiAuth.clientSecret,
		callbackURL: configAuth.odnoklassnikiAuth.callbackURL
	  },
	  function(accessToken, refreshToken, params, profile, done) {
			process.nextTick(function(){
				AuthUsersM.findOne({'odnoklassniki.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
						params.email = '';
						if(typeof(params.emails) != 'undefined'){
							params.email = params.emails[0].value;;
						}
						
						var userData = new Object();
						userData.params = params;
						userData.profile = profile;
						userData.accessToken = accessToken;
						createProfile('odnoklassniki', userData, function(response){
							return done(null, response);
						});
	    			}
	    		});
			});
	   }
	));
	
	passport.use(new VKontakteStrategy({
		clientID:     configAuth.vkAuth.clientID,
		clientSecret: configAuth.vkAuth.clientSecret,
		callbackURL:  configAuth.vkAuth.callbackURL
	  },
	  function (accessToken, refreshToken, params, profile, done) {
			process.nextTick(function(){
				AuthUsersM.findOne({'vk.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
						var userData = new Object();
						userData.params = params;
						userData.profile = profile;
						userData.accessToken = accessToken;
						createProfile('vk', userData, function(response){
							return done(null, response);
						});
	    			}
	    		});
			});
	  }
	));

	function createProfile(type, userData, callback){
		var newUser = new AuthUsersM();
		
		switch(type){
			case 'vk':
				newUser.vk.id = userData.profile.id;
				newUser.vk.token = userData.accessToken;
				newUser.vk.username = userData.profile.username;
				newUser.vk.name = userData.profile.displayName;
				newUser.vk.email = userData.params.email;
				break;
			case 'odnoklassniki':
				newUser.odnoklassniki.id = userData.profile.id;
	    		newUser.odnoklassniki.token = userData.accessToken;
	    		newUser.odnoklassniki.name = userData.profile.displayName;
	    		newUser.odnoklassniki.email = userData.params.email;
				break;
			case 'google':
				newUser.google.id = userData.profile.id;
	    		newUser.google.token = userData.accessToken;
	    		newUser.google.name = userData.profile.displayName;
	    		newUser.google.email = userData.profile.emails[0].value;
				break;
			case 'facebook':
				newUser.facebook.id = userData.profile.id;
	    		newUser.facebook.token = userData.accessToken;
	    		newUser.facebook.name = userData.profile.name.givenName + ' ' + userData.profile.name.familyName;
	    		newUser.facebook.email = userData.profile.email;
				break;
			case 'local':
				var verification_token = "";
				var possibleToken = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				for( var i=0; i < 15; i++ )
					verification_token += possibleToken.charAt(Math.floor(Math.random() * possibleToken.length));
				
				newUser.local.email = userData.profile.email;
				newUser.local.password = newUser.generateHash(userData.profile.password);
				newUser.local.verification_token = verification_token;
				newUser.local.verified = false;
				
				break;
		}
		
		newUser.save(function (err, authProfile) {
			if(!err){
				authProfile.url = 'id-'+newUser._id;
				authProfile.save(function (err, newProfile) {
					if(!err){
						var createProfile = new NewUserM();
						createProfile._id = newUser._id;
						createProfile.id = newUser._id;
						createProfile.url = 'id-'+newUser._id;
						createProfile.isRegister = false;
						createProfile.save(function (err, createdProfile) {
							if(!err){
								return callback(newUser);
							}
						});						
					}
				});				
			}
		});
	}*/
};