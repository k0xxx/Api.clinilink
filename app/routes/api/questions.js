var Questions = require('../../models/questions');

module.exports = function (app, passport){
	
	app.route('/api/questions')
		.get(function(req, res){
			var query = {};
			console.log(req.query.search);
			console.log(req.query.qurrentTab);
			console.log(req.query.qurrentFilter);
			if(req.query.search){				
				query.text = {$regex: new RegExp(req.query.search, "ig")};
			}
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 30}
			var start = (page * limit) - limit;
			Questions.question.find(query)
				.sort('-date')
				.skip(start)
				.limit(limit)
				.populate('from_ref')
				.lean()
				.exec(function (err, questionList) {
					if(err){
						res.json({'error': err, 'questionList': ''});
					}else if(questionList.length){
						res.json({'error': '', 'questionList': questionList});
					}else{
						res.json({'error': 'Questions is empty or does not exists!', 'questionList': ''});
					}
				});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newQuestion = new Questions.question();
			
			newQuestion.from_id = req.user;
			newQuestion.from_ref = req.user;
			newQuestion.text = req.body.text;
			newQuestion.type = req.body.type;
			//newQuestion.type_category = newUser.req.body;
			//newQuestion.privaticy = newUser.req.body;
			//newQuestion.attach = newUser.req.body;
			
			newQuestion.save(function (err, createdQuestion) {
				if(err) return res.json(err);
				res.json({'question': createdQuestion});
			});
		});
	
	app.get('/api/questions/myQuestions', passport.authenticate('jwt', { session: false }), function(req, res){
		var query = {};
		/*console.log(req.query.search);
		console.log(req.query.qurrentTab);
		console.log(req.query.qurrentFilter);*/
		if(req.query.qurrentTab == 'myQuestions'){
			query.from_id = req.user;
		}
		if(req.query.search){
			query.text = {$regex: new RegExp(req.query.search, "ig")};
		}
		var page = 1;
		if(req.query.page != undefined) page = req.query.page;
		var limit = 10;
		if(page == 1){limit = 30}
		var start = (page * limit) - limit;
		Questions.question.find(query)
			.sort('-date')
			.skip(start)
			.limit(limit)
			.populate('from_ref')
			.lean()
			.exec(function (err, questionList) {
				if(err){
					res.json({'error': err, 'questionList': ''});
				}else if(questionList.length){
					res.json({'error': '', 'questionList': questionList});
				}else{
					res.json({'error': 'Questions is empty or does not exists!', 'questionList': ''});
				}
			});
	})
	
	
};