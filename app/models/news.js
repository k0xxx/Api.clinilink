var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    postType : {type: String, default: 'userPost'},
	postOriginal : { type: mongoose.Schema.Types.ObjectId, ref: 'main_posts' },
    title : {type: String, default: ''},
    text : {type: String, default: ''},
	attach: [mongoose.Schema.Types.Mixed],
    author: {type: String, default: ''},
	status: {
		access: {type: Number, default: 0},
		icon: {type: String, default: 'globe'},
		iconText: {type: String, default: 'some'},
	},
	author_refPath: {type: String, default: 'main_users'},
	author_ref: {type: mongoose.Schema.Types.ObjectId, refPath: 'author_refPath'},
	date: { type: Date, default: Date.now },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'main_comments' }],
	likes: [String],
	likesRef: [{ type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
	reposts: [String],
	repostsRef: [{ type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
});
var autoPopulateAuthor = function(next) {
	this.populate('author_ref');
	next();
};
var autoActionInc = function(next){
	console.log(this);
	switch(this.postType){
		case 'userRepost':
			post.findByIdAndUpdate(this.postOriginal, { $addToSet: { reposts: this.author, repostsRef: this.author,}}, function (err, updatedMainPost) {
				if (err) console.log(err);
				next();
			});
			break;
		case 'userLike':
			post.findByIdAndUpdate(this.postOriginal, { $addToSet: { likes: this.author, likesRef: this.author,}}, function (err, updatedMainPost) {
				if (err) console.log(err);
				next();
			});
			break;
		default: next();
	}
	
};
postSchema.pre('findOne', autoPopulateAuthor).pre('find', autoPopulateAuthor).pre('save', autoActionInc);
var post = mongoose.model('main_posts', postSchema);

var commentSchema = mongoose.Schema({
    mainPost: { type: String },
    mainPostRef: { type: mongoose.Schema.Types.ObjectId, ref: 'main_posts' },
	author: { type: String },
    authorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	text: {type: String, default: ''},
	date: { type: Date, default: Date.now },
});

commentSchema.pre('save', function(next) {
	post.findByIdAndUpdate(this.mainPost, { $addToSet: { comments: this._id}}, function (err, updatedMainPost) {
		if (err) console.log(err);
		next();
	});
});

var comment = mongoose.model('main_posts_comments', commentSchema);

module.exports = {
    post: post,
	comment: comment
};