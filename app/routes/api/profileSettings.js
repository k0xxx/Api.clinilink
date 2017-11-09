var Users = require('../../models/users');
var moment = require('moment');
moment.locale('ru');

module.exports = function (app, passport){
	app.route('/api/profileSettings')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			
			Users.findById(req.user)
			.exec(function (err, profileSettings) {
				if(err) return res.json({'error': err, 'profileSettings': ''});
				
				if(profileSettings){
					res.json({'error': '', 'profileSettings': profileSettings});
				}else{
					res.json({'error': 'profileSettings is empty!', 'profileSettings': ''});
				}
			});
		})
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			Users.findById(req.user, function(err, profile){
				if(!err){
					if(req.body.lastName != undefined && req.body.lastName){
						profile.lastName = req.body.lastName;
						profile.fullName = req.body.lastName;
					};
					if(req.body.firstName != undefined && req.body.firstName){
						profile.firstName = req.body.firstName
						profile.fullName += ' '+req.body.firstName;
					};
					if(req.body.surName != undefined && req.body.surName){
						profile.surName = req.body.surName;
						profile.fullName += ' '+req.body.surName;
					};
					
					if(profile.status.id == 0){
						profile.fullName = profile.login;
					}
					
					if(req.body.gender != undefined && req.body.gender){profile.gender = req.body.gender};
					if(req.body.birthday != undefined && req.body.birthday){profile.birthday = moment(req.body.birthday.time)};

                    if(req.body.bloodType != undefined && req.body.bloodType){profile.bloodType = req.body.bloodType};
					if(req.body.familyStatus != undefined && req.body.familyStatus){profile.familyStatus = req.body.familyStatus};
					if(req.body.doc_work_place != undefined && req.body.doc_work_place){profile.doc_work_place = req.body.doc_work_place};
					if(req.body.doc_specialization_experience != undefined && req.body.doc_specialization_experience){profile.doc_specialization_experience = req.body.doc_specialization_experience};
					if(req.body.doc_category != undefined && req.body.doc_category){profile.doc_category = req.body.doc_category};
					if(req.body.med_position != undefined && req.body.med_position){profile.med_position = req.body.med_position};
					
					if(req.body.phone != undefined && req.body.phone){profile.phone = req.body.phone};
					if(req.body.email != undefined && req.body.email){profile.email = req.body.email};
					if(req.body.country != undefined && req.body.country){profile.country = req.body.country};
					if(req.body.city != undefined && req.body.city){profile.city = req.body.city};
					if(req.body.doc_work_place_adress != undefined && req.body.doc_work_place_adress){profile.doc_work_place_adress = req.body.doc_work_place_adress};
					
					profile.save(function (err) {
						if(!err) res.json(profile);
					});	
				}
			})
		});
	
};