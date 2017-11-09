var Measurements = require('../../models/measurements');
var moment = require('moment');
moment.locale('ru');

module.exports = function (app, passport){
	app.route('/api/measurements/:type')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			var currentMeasurement = Measurements[req.params.type];
			currentMeasurement.find()
				.sort('-date')
				//.skip(start)
				//.limit(limit)
				.lean()
				.exec(function (err, measurementsList) {
					if(err){
						res.json({'error': err, 'measurementsList': ''});
					}else if(measurementsList.length){
						res.json({'error': '', 'measurementsList': measurementsList});
					}else{
						res.json({'error': 'measurementsList is empty or does not exists!', 'measurementsList': ''});
					}
				});
			/*var query = {'userId': req.user, 'type': req.params.type};			
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 30}
			var start = (page * limit) - limit;
			*/
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var type = req.body.type;
			var currentMeasurement = Measurements[type];
			
			var newMeasurement = new currentMeasurement();

			newMeasurement.userId = req.user;
			newMeasurement.userRef = req.user;
			
			switch(type){
                case 'weight':
                    newMeasurement.date.time = moment(req.body.date.time);
                    newMeasurement.weight = req.body.weight;
                    newMeasurement.note = req.body.note;
					break;
				case 'glucose':
                    newMeasurement.date.time = moment(req.body.date.time);
                    newMeasurement.glucose = req.body.glucose;
                    newMeasurement.context = req.body.context;
                    newMeasurement.note = req.body.note;
					break;
                case 'bloodpressure':
                    newMeasurement.date.time = moment(req.body.date.time);
					newMeasurement.systolic = req.body.systolic;
					newMeasurement.diastolic = req.body.diastolic;
					newMeasurement.pulse = req.body.pulse;
					newMeasurement.arrhythmia = req.body.arrhythmia;
					newMeasurement.note = req.body.note;
					break;
                case 'cholesterol':
                    newMeasurement.date.time = moment(req.body.date.time);
					newMeasurement.LNP = req.body.LNP;
					newMeasurement.LVP = req.body.LVP;
					newMeasurement.triglycerides = req.body.triglycerides;
					newMeasurement.cholesterol = req.body.cholesterol;
					newMeasurement.note = req.body.note;
					break;
                case 'height':
                    newMeasurement.date.time = moment(req.body.date.time);
					newMeasurement.height = req.body.height;
					newMeasurement.note = req.body.note;
					break;
				
				default: return res.json({'err': 'undefined type', 'measurement': ''});
			}

			newMeasurement.save(function(err) {
				if(err) return res.json({'err': err, 'measurement': ''});
				res.json({'err': '', 'measurement': newMeasurement});
			});
        });
        
    app.route('/api/measurements/:type/:id')
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			var currentMeasurement = Measurements[req.params.type];
			if(!currentMeasurement) return res.json({'err': 'undefined measurment type', 'measurment':''});
			currentMeasurement.findByIdAndUpdate(req.params.id, req.body, function(err){
				if(err) return res.json({'error': err, 'measurement': false});
				res.json({'error': '', 'measurement': true});
			})
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			var currentMeasurement = Measurements[req.params.type];
			if(!currentMeasurement) return res.json({'err': 'undefined measurment type', 'measurment':''});
			currentMeasurement.findByIdAndRemove(req.params.id, function(err){
				if(err) return res.json({'error': err, 'measurement': false});
				res.json({'error': '', 'measurement': true});
			})
		})
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			var currentMeasurement = Measurements[req.params.type];
			if(!currentMeasurement) return res.json({'err': 'undefined measurment type', 'measurment':''});
			currentMeasurement.findById(req.params.id)
				.exec(function (err, measurement) {
					if(err){
						res.json({'error': err, 'measurement': ''});
					}else if(measurement){
						res.json({'error': '', 'measurement': measurement});
					}else{
						res.json({'error': 'measurement is empty or does not exists!', 'measurement': ''});
					}
				}) 
		})
};