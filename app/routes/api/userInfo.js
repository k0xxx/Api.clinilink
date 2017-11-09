var Users = require('../../models/users');

module.exports = function (app, passport){
    app.route('/api/userInfo')
        .get(passport.authenticate('jwt', { session: false }), function(req, res){
            Users.findById(req.user)
                .exec(function (err, profile) {
                    if(err) return res.json({'error': err, 'info': ''});
                    if(profile){
                        res.json({'error': '', 'info': profile});
                    }else{
                        res.json({'error': 'info is empty!', 'info': ''});
                    }
                });
        });
	
};