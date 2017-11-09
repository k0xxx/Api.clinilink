var Users = require('../../models/users');

module.exports = function (app, passport){
	
	app.route('/api/search')
		.get(function(req, res){
			var query = {};
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 30}
			var start = (page * limit) - limit;
			
			if(req.query.search){
				query.fullName = {$regex: new RegExp(req.query.search, "ig")};
			}
			if(req.query.country){
				query.country = {$regex: new RegExp(req.query.country, "ig")};
			}
			if(req.query.city){
				query.key_words = {$regex: new RegExp(req.query.key_words, "ig")};
			}
			if(req.query.city){
				query.city = {$regex: new RegExp(req.query.city, "ig")};
			}
			switch(req.query.type){
				case '0':
					query['status.id'] = 0;
					query.pat_main_disease = {$regex: new RegExp(req.query.pat_main_disease, "ig")};
				break;
				case '1':
					query['status.id'] = 1;
					query.med_position = {$regex: new RegExp(req.query.med_position, "ig")};
				break;
				case '3':
					query['status.id'] = 3;
					query.doc_specialization = {$regex: new RegExp(req.query.doc_specialization, "ig")};
				break;
			}

			console.log(query);

			Users.find(query)
				//.sort('-date')
				.skip(start)
				.limit(limit)
				//.populate('postOriginal')
				.lean()
				.exec(function (err, searchList) {
					if(err){
						res.json({'error': err, 'searchList': ''});
					}else if(searchList.length){
						res.json({'error': '', 'searchList': searchList});
					}else{
						res.json({'error': 'searchList is empty or does not exists!', 'searchList': ''});
					}
				});
		})
	
};