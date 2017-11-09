var mongoose = require('mongoose');
var dialogSchema = mongoose.Schema({
	user_dialog_list: [{type: String, default: ''}],
	user_dialog_list_ref: [{ type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
	last_message: {type: String, default: ''},
	last_message_time: { type: Date, default: Date.now },
	new_message: {type: Boolean, default: true},
	// dm - dirrect message
	dialog_type: {type: String, default: 'dm'}
});
var dialog = mongoose.model('main_dialogs', dialogSchema);

var messageSchema = mongoose.Schema({
	dialog_id: {type: String, default: ''},
	dialog_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'main_dialogs' },
	from_id: {type: String, default: ''},
	from_ref: { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	text: {type: String, default: ''},
	attach: [mongoose.Schema.Types.Mixed],
	is_read: {type: Boolean, default: false},
	date: { type: Date, default: Date.now }
});

messageSchema.pre('save', function(next) {
	dialog.findByIdAndUpdate(this.dialog_id, { $set: { last_message: this.text.substr(0,25), last_message_time: new Date() }}, function (err, updatedMessage) {
		if (err) console.log(err);
		next();
	});
});

var message = mongoose.model('main_messages', messageSchema);

module.exports = {
    dialog: dialog,
	message: message
};