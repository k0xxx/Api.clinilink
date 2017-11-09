var News = require('../../models/news');

module.exports = function (app, passport){
	
	app.route('/api/news')
		.get(function(req, res){
			var query = {};			
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 20}
			var start = (page * limit) - limit;
		
			News.post.find(query)
				.sort('-date')
				.skip(start)
				.limit(limit)
				.populate('postOriginal')
				.lean()
				.exec(function (err, newsList) {
					if(err){
						res.json({'error': err, 'newsList': ''});
					}else if(newsList.length){
						res.json({'error': '', 'newsList': newsList});
					}else{
						res.json({'error': 'News is empty or does not exists!', 'newsList': ''});
					}
				});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newPost = new News.post();
			
			newPost.author = req.user;
			newPost.author_ref = req.user;
			newPost.title = req.body.title;
			newPost.text = req.body.text;
			newPost.status.access = req.body.access;
			
			newPost.save(function (err, createdPost) {
				if(err) return res.json(err);
				createdPost.populate('author_ref', function(err) {
					res.json({'post': createdPost});
				});	
				
			});
		});
	
	app.route('/api/news/:newsId')
		.get(function(req, res){
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
		})
	
	app.route('/api/news/:newsId/comments')
		.get(function(req, res){
			News.comment.find({'mainPost': req.params.newsId})
			.populate('authorRef')
			.exec(function (err, commentsList) {
				if(err) return res.json({'error': err, 'commentsList': ''});
				if(commentsList.length){
					res.json({'error': '', 'commentsList': commentsList});
				}else{
					res.json({'error': 'commentsList is empty!', 'commentsList': ''});
				}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newsId = req.params.newsId;
			
			var newComment = new News.comment();

			newComment.mainPost = newsId;
			newComment.mainPostRef = newsId;
			newComment.author = req.user;
			newComment.authorRef = req.user;
			newComment.text = req.body.text;
			newComment.save(function (err, comment) {
				if(!err){
					comment.populate('authorRef', function(err) {
						res.json({'err': '', 'comment': comment});
					});						
				}else{
					res.json({'err': err, 'comment': ''})
				}
			});
		});
	
	app.route('/api/news/:newsId/likes')
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newsId = req.params.newsId;
			
			var newLike = new News.post();
			
			newLike.postType = 'userLike';
			newLike.author = req.user;
			newLike.author_ref = req.user;
			newLike.postOriginal = newsId;
			
			newLike.status.access = 1;
			
			
			newLike.save(function (err, like) {
				if(!err){
					like.populate('author_ref').populate('postOriginal', function(err) {
						res.json({'err': '', 'like': like});
					});						
				}else{
					res.json({'err': err, 'like': ''})
				}
			});			
		})
	
	app.route('/api/news/:newsId/reposts')
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var newsId = req.params.newsId;
			
			var newRepost = new News.post();
			
			newRepost.postType = 'userRepost';
			newRepost.text = req.body.text;
			newRepost.author = req.user;
			newRepost.author_ref = req.user;
			newRepost.postOriginal = newsId;
			
			newRepost.status.access = 1;
			
			newRepost.save(function (err, repost) {
				if(!err){
					repost.populate('author_ref').populate('postOriginal', function(err) {
						res.json({'err': '', 'repost': repost});
					});						
				}else{
					res.json({'err': err, 'repost': ''})
				}
			});	
		})
	
};