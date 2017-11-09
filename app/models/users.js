var mongoose = require('mongoose');
var doc_work_days_schema = new mongoose.Schema({
	dayOfWeek: 'string',
	startTime: 'string',
	endTime: 'string',
	ordered: {type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }
});
var UserSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	id: String,
	
	// UserInfo
	login: {type: String, default: 'Аноним', trim: true},
	url: {type: String, default: '', trim: true},
	img: {type: String, default: 'http://cdn.clinilink.org/images/defaultProfile.png'},
	lastName: {type: String, default: '', trim: true},
	firstName: {type: String, default: '', trim: true},
	surName: {type: String, default: '', trim: true},
	fullName: {type: String, default: 'Аноним', trim: true},
	gender: { type: String, default: ''},
	birthday: { type: Date, default: Date.now},
	bloodType: { type: String, default: ''},
	familyStatus: { type: String, default: ''},
	email: {type: String, default: '', trim: true},
	phone: { type: String, default: '', trim: true},
	
	country: { type: String, default: ''},
	city: { type: String, default: ''},
	
	key_words: [String],
	
	// UserStatus
	status: {
		id: {type: Number, default: 0},
		name: {type: String, default: 'Patient'},
		name_rus: {type: String, default: 'Пациент'},
		icon: {type: String, default: ''},
		on_accept: {type: Boolean, default: false},
	},

	// User info items
	/*infoBlock: [

	],*/

	// Vox implant settings
	calls: {
		id: {type: String, default: ''},
		login: {type: String, default: ''},
		password: {type: String, default: ''},
		isRegister: {type: Boolean, default: false},
		error: {
			msg: {type: String, default: ''},
			code: {type: String, default:''}
		}
	},

	// 	Сonnections
	contactsRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_contacts' }],
	/*contacts: {
		friends: [String],
		friendsRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
		inAccept: [String],
		inAcceptRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
		outAccept: [String],
		outAcceptRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
	},
	subscribers: {
		list: [String],
		listRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_users' }],
	},*/
	
	// PatSettings
	pat_main_disease: { type: String, default: ''},
	
	// SpecialistSettings
	med_position: { type: String, default: ''},
	
	// DocSettings
	doc_specialization: { type: String, default: ''},
	doc_work_place: { type: String, default: ''},
	doc_work_place_adress: { type: String, default: ''},
	doc_specialization_experience: { type: String, default: ''},
	doc_category: { type: String, default: ''},
	doc_work_days: [doc_work_days_schema],
	
	//DocGrade
	grade: {
		votes: {type: Number, default: 0},
		total: {type: Number, default: 0},
		rating: {type: Number, default: 100},
		votesRef: [{type: mongoose.Schema.Types.ObjectId, ref: 'main_users'}],
	},
	
	// Settings
	isRegister: {type: Boolean, default: true},
	isOnline: {type: Boolean, default: false},
	lastQuery: {type: Date, default: Date.now},
	dateOfRegister: { type: Date, default: Date.now }
},{toObject: {virtuals: true}, toJSON: {virtuals: true}});

/*UserSchema.virtual('isContact').get(function(){
	return this.login + ' ' + this.url;
});*/

module.exports = mongoose.model('main_users', UserSchema);