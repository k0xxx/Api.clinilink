var mongoose = require('mongoose');
var Users = require('./users');

var contactSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	contactId: String,
	contactRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	type : { type: String, default: '1' },
	subsriber : { type: Boolean, default: true },
	created: { type: Date, default: Date.now },
});
var addContactRefToProfle = function(contactInfo){
	Users.findByIdAndUpdate(contactInfo.userId, { $addToSet: {contactsRef: contactInfo._id}}, function (err, updatedProfile) {
		if (err) console.log(err);
	});
};
contactSchema.post('save', addContactRefToProfle);

var removeContactRefFromProfle = function(contactInfo){
	Users.findByIdAndUpdate(contactInfo.userId, { $pull: {contactsRef: contactInfo._id}}, function (err, updatedProfile) {
		if (err) console.log(err);
	});
};
contactSchema.post('remove', removeContactRefFromProfle);

var contact = mongoose.model('main_contacts', contactSchema);

module.exports = {
    contact: contact,
};