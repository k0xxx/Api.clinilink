var mongoose = require('mongoose');
var generalInformationSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	activity_level : { type: String, default: '' },
	physical_culture : { type: String, default: '' },
	food_settings : { type: String, default: '' },
	work_type : { type: String, default: '' },
	sleep_type : { type: String, default: '' },
	sleep_duration : { type: String, default: '' },
	stress_type : { type: String, default: '' },
	sex_life : { type: String, default: '' },
	sex_contraception : { type: String, default: '' },
	home_pets : { type: String, default: '' },
	smoking_years : { type: String, default: '' },
	smoking_counter : { type: String, default: '' },
	alcohol_years : { type: String, default: '' },
	drugs_years : { type: String, default: '' },
	date : { type: Date, default: Date.now },
});
var generalInformation = mongoose.model('main_medicalRecords_generalInformations', generalInformationSchema);

var allergiesSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name: { type: String, default: '' },
	reaction: { type: String, default: '' },
	type: { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
	note: { type: String, default: '' },
});
var allergies = mongoose.model('main_medicalRecords_allergies', allergiesSchema);

var analyzesSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	activity_level : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
});
var analyzes = mongoose.model('main_medicalRecords_analyzes', analyzesSchema);

var consultationsSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	activity_level : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
});
var consultations = mongoose.model('main_medicalRecords_consultations', consultationsSchema);

var diseasesSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name : { type: String, default: '' },
	state : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
	end_date: { time: {type: Date, default: Date.now } },
	note : { type: String, default: '' },
	
});
var diseases = mongoose.model('main_medicalRecords_diseases', diseasesSchema);

var immunizationsSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name: { type: String, default: '' },
	injections_count: { type: String, default: '' },
	side_effects: { type: String, default: '' },
  	note: { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
});
var immunizations = mongoose.model('main_medicalRecords_immunizations', immunizationsSchema);

var injuriesSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
	note : { type: String, default: '' },
});
var injuries = mongoose.model('main_medicalRecords_injuries', injuriesSchema);

var medicamentsSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name : { type: String, default: '' },
	vaccine_content : { type: String, default: '' },
	drug_taking_method : { type: String, default: '' },
	taking_reason : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
	end_date: { time: {type: Date, default: Date.now } },
	note : { type: String, default: '' },
});
var medicaments = mongoose.model('main_medicalRecords_medicaments', medicamentsSchema);

var operationsSchema = mongoose.Schema({
	userId : { type: String},
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	name : { type: String, default: '' },
	date: { time: {type: Date, default: Date.now } },
	note : { type: String, default: '' },
});
var operations = mongoose.model('main_medicalRecords_operations', operationsSchema);

module.exports = {
    generalInformation: generalInformation,
    allergies: allergies,
    analyzes: analyzes,
    consultations: consultations,
    diseases: diseases,
    immunizations: immunizations,
    injuries: injuries,
    medicaments: medicaments,
    operations: operations,
};