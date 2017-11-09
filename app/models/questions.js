var mongoose = require('mongoose');
var questionSchema = mongoose.Schema({
	from_id: {type: String, default: ''},
    from_ref: {type: mongoose.Schema.Types.ObjectId, ref: 'main_users'},
    text: {type: String, default: ''},
    type: {type: String, default: ''},
    type_category: {type: String, default: ''},
    privaticy : {type: Boolean, default: false},
    attach: [mongoose.Schema.Types.Mixed],
    date: { type: Date, default: Date.now },
    new_response: {type: Boolean, default: false},
    response: [mongoose.Schema.Types.Mixed],
});
var question = mongoose.model('main_questions', questionSchema);

var questionAnswerSchema = mongoose.Schema({
	question_user_id: {type: String, default: ''},
    question_user_id_ref: {type: mongoose.Schema.Types.ObjectId, ref: 'main_users'},
	user_id: {type: String, default: ''},
    user_id_ref: {type: mongoose.Schema.Types.ObjectId, ref: 'main_users'},
	date: { type: Date, default: Date.now },
    text: {type: String, default: ''},
    question_grade: {type: Number, default: 0},
    response_user_grade_list: [mongoose.Schema.Types.Mixed],
});

/*messageSchema.pre('save', function(next) {
	dialog.findByIdAndUpdate(this.dialog_id, { $set: { last_message: this.text.substr(0,25), last_message_time: new Date() }}, function (err, updatedMessage) {
		if (err) console.log(err);
		next();
	});
});*/

var answer = mongoose.model('main_questions_answers', questionAnswerSchema);

module.exports = {
    question: question,
	answer: answer
};