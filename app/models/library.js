var mongoose = require('mongoose');

var old_libraryClassSchema = mongoose.Schema({
	class_index : Number,
    class_name : String,
    class_sub_index : String,
    category_ref : [],
    main_url : String
});
var old_libraryClass = mongoose.model('clinilink_library_classes', old_libraryClassSchema);
var old_libraryCategorySchema = mongoose.Schema({
	category_index : Number,
    category_sub_index : String,
    category_name : String,
	category_ref : {type: mongoose.Schema.Types.ObjectId, refPath: 'clinilink_library_classes'},
    main_url : String
});
var old_libraryCategory = mongoose.model('clinilink_library_categories', old_libraryCategorySchema);
var old_libraryItemSchema = mongoose.Schema({
	index : Number,
    sub_index : String,
    name : String,
    item_class_ref : {type: mongoose.Schema.Types.ObjectId, refPath: 'clinilink_library_classes'},
    item_category_ref : {type: mongoose.Schema.Types.ObjectId, refPath: 'clinilink_library_categories'},
    spec : [String],
    description : String,
    cause : String,
    pathogenesis : String,
    clinics : String,
    diagnosis : String,
    treatment : String,
    prophylaxis : String,
    prognosis : String,
    drugs : [],
    people_stat : [],
    symptom : String,
    item_type : String,
    main_url : String,
    key_words : String
});
var old_libraryItem = mongoose.model('clinilink_library', old_libraryItemSchema);

var new_libraryClassSchema = mongoose.Schema({
	class_id : Number,
	class_index : Number,
    class_name : String,
    class_sub_index : String,
	category_list : [Number],
    category_ref : [{type: mongoose.Schema.Types.ObjectId, ref: 'library_categories'}],
    main_url : String
});
var new_libraryClass = mongoose.model('library_classes', new_libraryClassSchema);

var new_libraryCategorySchema = mongoose.Schema({
	category_id : Number,
	category_index : Number,
    category_sub_index : String,
    category_name : String,
	items_list : [Number],
	items_ref : [{type: mongoose.Schema.Types.ObjectId, ref: 'library_items'}],
    main_url : String
});
var new_libraryCategory = mongoose.model('library_categories', new_libraryCategorySchema);

var new_libraryItemSchema = mongoose.Schema({
	item_id : Number,
	index : Number,
    sub_index : String,
    name : String,
    item_class_ref : {type: mongoose.Schema.Types.ObjectId, refPath: 'clinilink_library_classes'},
    item_category_ref : {type: mongoose.Schema.Types.ObjectId, refPath: 'clinilink_library_categories'},
    spec : [String],
    description : String,
    cause : String,
    pathogenesis : String,
    clinics : String,
    diagnosis : String,
    treatment : String,
    prophylaxis : String,
    prognosis : String,
    drugs : [],
    people_stat : [],
    symptom : String,
    item_type : String,
    main_url : String,
    key_words : String
});
var new_libraryItem = mongoose.model('library_items', new_libraryItemSchema);

module.exports = {
    old_libraryClass: old_libraryClass,
    new_libraryClass: new_libraryClass,
	
    old_libraryCategory: old_libraryCategory,
    new_libraryCategory: new_libraryCategory,
    
	old_libraryItem: old_libraryItem,
    new_libraryItem: new_libraryItem,
};