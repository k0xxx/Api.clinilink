var MedicalRecords = require('../../models/medicalRecords');
var moment = require('moment');
moment.locale('ru');

module.exports = function (app, passport){
	
	app.route('/api/medical_records/general_information')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.generalInformation.findOne({'userId': req.user})
			.exec(function (err, generalInformation) {
				if(err) return res.json({'error': err, 'generalInformation': ''});
				if(generalInformation){
					res.json({'error': '', 'generalInformation': generalInformation});
				}else{
					res.json({'error': 'generalInformation is empty or does not exists!', 'generalInformation': ''});
				}
			});
		})
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.generalInformation.findOne({'userId': req.user})
			.exec(function (err, generalInformation) {
				if(err) return res.json({'error': err, 'generalInformation': ''});
				if(!generalInformation){
					var generalInformation = new MedicalRecords.generalInformation();
					generalInformation.userId = req.user;
					generalInformation.userRef = req.user;
				}
				generalInformation.activity_level = req.body.activity_level;
				generalInformation.physical_culture = req.body.physical_culture;
				generalInformation.food_settings = req.body.food_settings;
				generalInformation.work_type = req.body.work_type;
				generalInformation.sleep_type = req.body.sleep_type;
				generalInformation.sleep_duration = req.body.sleep_duration;
				generalInformation.stress_type = req.body.stress_type;
				generalInformation.sex_life = req.body.sex_life;
				generalInformation.sex_contraception = req.body.sex_contraception;
				generalInformation.home_pets = req.body.home_pets;
				generalInformation.smoking_years = req.body.smoking_years;
				generalInformation.smoking_counter = req.body.smoking_counter;
				generalInformation.alcohol_years = req.body.alcohol_years;
				generalInformation.drugs_years = req.body.drugs_years;

				generalInformation.save(function(err) {
					if(err) return res.json({'err': err, 'generalInformation': ''});
					res.json({'err': '', 'generalInformation': generalInformation});
				});
			})
		})
	
	app.route('/api/medical_records/allergies')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.allergies.find()
			.exec(function (err, allergies) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(allergies.length){
					res.json({'error': '', 'medicalRecordsList': allergies});
				}else{
					res.json({'error': 'allergies is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.allergies();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.reaction = req.body.reaction;
			newMedicalRecord.type = req.body.type;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.note = req.body.note;

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		})
	
	app.route('/api/medical_records/allergies/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.allergies.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.allergies.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.allergies.findById(req.params.id)
				.exec(function (err, allergie) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(allergie){
						res.json({'error': '', 'medicalRecord': allergie});
					}else{
						res.json({'error': 'allergie is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})

	app.route('/api/medical_records/analyzes')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.analyzes.find()
			.exec(function (err, analyzes) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(analyzes.length){
					res.json({'error': '', 'medicalRecordsList': analyzes});
				}else{
					res.json({'error': 'analyzes is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			
		})
		
	app.route('/api/medical_records/consultations')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.consultations.find()
			.exec(function (err, consultations) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(consultations.length){
					res.json({'error': '', 'medicalRecordsList': consultations});
				}else{
					res.json({'error': 'consultations is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			
		})
		
	app.route('/api/medical_records/diseases')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.diseases.find()
			.exec(function (err, diseases) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(diseases.length){
					res.json({'error': '', 'medicalRecordsList': diseases});
				}else{
					res.json({'error': 'diseases is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.diseases();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.state = req.body.state;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.end_date.time = req.body.end_date.time;
			newMedicalRecord.note = req.body.note,

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		});

	app.route('/api/medical_records/diseases/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.diseases.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.diseases.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.diseases.findById(req.params.id)
				.exec(function (err, disease) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(disease){
						res.json({'error': '', 'medicalRecord': disease});
					}else{
						res.json({'error': 'disease is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})
		
	app.route('/api/medical_records/immunizations')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.immunizations.find()
			.exec(function (err, immunizations) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(immunizations.length){
					res.json({'error': '', 'medicalRecordsList': immunizations});
				}else{
					res.json({'error': 'immunizations is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.immunizations();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.injections_count = req.body.injections_count;
			newMedicalRecord.side_effects = req.body.side_effects;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.note = req.body.note;

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		})
	
	app.route('/api/medical_records/immunizations/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.immunizations.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.immunizations.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.immunizations.findById(req.params.id)
				.exec(function (err, immunization) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(immunization){
						res.json({'error': '', 'medicalRecord': immunization});
					}else{
						res.json({'error': 'immunization is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})
	
	app.route('/api/medical_records/injuries')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.injuries.find()
			.exec(function (err, injuries) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(injuries.length){
					res.json({'error': '', 'medicalRecordsList': injuries});
				}else{
					res.json({'error': 'injuries is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.injuries();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.note = req.body.note;

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		})
	
	app.route('/api/medical_records/injuries/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.injuries.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.injuries.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.injuries.findById(req.params.id)
				.exec(function (err, injurie) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(injurie){
						res.json({'error': '', 'medicalRecord': injurie});
					}else{
						res.json({'error': 'injurie is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})

	app.route('/api/medical_records/medicaments')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.medicaments.find()
			.exec(function (err, medicaments) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(medicaments.length){
					res.json({'error': '', 'medicalRecordsList': medicaments});
				}else{
					res.json({'error': 'medicaments is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.medicaments();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.vaccine_content = req.body.vaccine_content;
			newMedicalRecord.drug_taking_method = req.body.drug_taking_method;
			newMedicalRecord.taking_reason = req.body.taking_reason;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.end_date.time = req.body.end_date.time;
			newMedicalRecord.note = req.body.note;

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		})
	
	app.route('/api/medical_records/medicaments/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.medicaments.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.medicaments.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.medicaments.findById(req.params.id)
				.exec(function (err, medicament) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(medicament){
						res.json({'error': '', 'medicalRecord': medicament});
					}else{
						res.json({'error': 'medicament is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})

	app.route('/api/medical_records/operations')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.operations.find()
			.exec(function (err, operations) {
				if(err) return res.json({'error': err, 'medicalRecordsList': ''});
				if(operations.length){
					res.json({'error': '', 'medicalRecordsList': operations});
				}else{
					res.json({'error': 'operations is empty or does not exists!', 'medicalRecordsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newMedicalRecord = new MedicalRecords.operations();

			newMedicalRecord.userId = req.user;
			newMedicalRecord.userRef = req.user;
			
			newMedicalRecord.name = req.body.name;
			newMedicalRecord.date.time = req.body.date.time;
			newMedicalRecord.note = req.body.note;

			newMedicalRecord.save(function(err) {
				if(err) return res.json({'err': err, 'medicalRecord': ''});
				res.json({'err': '', 'medicalRecord': newMedicalRecord});
			});
		})

	app.route('/api/medical_records/operations/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.operations.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.operations.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'medicalRecord': false});
				res.json({'error': '', 'medicalRecord': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			MedicalRecords.operations.findById(req.params.id)
				.exec(function (err, operation) {
					if(err) return res.json({'error': err, 'medicalRecord': ''});
					if(operation){
						res.json({'error': '', 'medicalRecord': operation});
					}else{
						res.json({'error': 'operation is empty or does not exists!', 'medicalRecord': ''});
					}
				});
		})
};