var Users = require('../../models/users');

module.exports = function (app){
	app.get('/api/profile/:profileUrl', function(req, res){
		
		var profileUrl = req.params.profileUrl;
		
		Users.findOne({'url': profileUrl})
		.exec(function (err, profile) {
			if(err) return res.json({'error': err, 'profile': ''});
			
			if(profile){
				res.json({'error': '', 'profile': profile});
			}else{
				res.json({'error': 'profile is empty!', 'profile': ''});
			}
		});
	});
	
};