var mongoose = require('mongoose');
var weightSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	weight : { type: String},
	date : {time: {type: Date, default: Date.now }},
	note : { type: String, default: '' },
});
var weight = mongoose.model('main_measurements_weights', weightSchema);

var glucoseSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	glucose : String,
	context : { type: String, default: '' },
	date : {time: {type: Date, default: Date.now }},
	note : { type: String, default: '' },
});
var glucose = mongoose.model('main_measurements_glucoses', glucoseSchema);

var bloodpressureSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	systolic : String,
	diastolic : String,
	pulse : String,
	arrhythmia : { type: String, default: '' },
	date : {time: {type: Date, default: Date.now }},
	note : { type: String, default: '' },
});
var bloodpressure = mongoose.model('main_measurements_bloodpressures', bloodpressureSchema);

var cholesterolSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	LNP : String,
	LVP : String,
	triglycerides : String,
	cholesterol : String,
	date : {time: {type: Date, default: Date.now }},
	note : { type: String, default: '' },
});
var cholesterol = mongoose.model('main_measurements_cholesterols', cholesterolSchema);

var heightSchema = mongoose.Schema({
	userId : String,
	userRef : { type: mongoose.Schema.Types.ObjectId, ref: 'main_users' },
	height : String,
	date : {time: {type: Date, default: Date.now }},
	note : { type: String, default: '' },
});
var height = mongoose.model('main_measurements_height', heightSchema);

module.exports = {
    weight: weight,
    glucose: glucose,
    bloodpressure: bloodpressure,
    cholesterol: cholesterol,
    height: height,
};