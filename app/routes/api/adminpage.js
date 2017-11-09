var Library = require('../../models/library');

module.exports = function (app){
	app.get('/api/adminpage/library/getClasses', function(req, res){
		Library.new_libraryClass.find()
		.sort({'class_sub_index': 1})
		.select('class_id class_sub_index class_name')
		.exec(function (err, libraryClassList) {
			if(err) return res.json(err);
			res.json(libraryClassList);
		});
	});
	
	app.get('/api/adminpage/library/getCategories', function(req, res){
		Library.new_libraryCategory.find()
		.sort({'category_sub_index': 1})
		.select('category_id category_sub_index category_name items_list')
		.exec(function (err, libraryCategoryList) {
			if(err) return res.json(err);
			res.json(libraryCategoryList);
		});
	});
	
	app.get('/api/adminpage/library/getItems', function(req, res){
		Library.new_libraryItem.find()
		.sort({'sub_index': 1})
		.select('item_id sub_index name')
		.exec(function (err, libraryItemsList) {
			if(err) return res.json(err);
			res.json(libraryItemsList);
		});
	});
	
	app.route('/api/adminpage/library/getClasses/:classId')
		.get(function(req, res){
			Library.new_libraryClass.findById(req.params.classId, function(err, libClass){
				if(err) return res.json(err);
				res.json(libClass);
			});
		})
		.put(function(req, res){
			Library.new_libraryClass.findById(req.body._id, function(err, libClass){
				if(err) return res.json(err);
				
				var arr = req.body.category_list.toString().split(",");
				libClass.category_list = arr;
				
				libClass.class_name = req.body.class_name;
				libClass.class_id = req.body.class_id;
				libClass.class_index = req.body.class_index;
				libClass.class_sub_index = req.body.class_sub_index;
				libClass.main_url = req.body.main_url;
				
				
				libClass.save(function(err){
					res.json(libClass);
				});
			});
		});
	
	app.route('/api/adminpage/library/getCategories/:categoryId')
		.get(function(req, res){
			Library.new_libraryCategory.findById(req.params.categoryId, function(err, libCategory){
				if(err) return res.json(err);
				res.json(libCategory);
			});
		})
		.put(function(req, res){
			Library.new_libraryCategory.findById(req.body._id, function(err, libCategory){
				if(err) return res.json(err);
				
				var arr = req.body.items_list.toString().split("-");
				var list = [];
				console.log(arr);
				console.log(arr[0]);
				console.log(arr[1]);
				
				for(var i = parseInt(arr[0]); i <= parseInt(arr[1]); i++){
					list.push(i);
					console.log(i);
				}
				
				if(arr && list){
					libCategory.items_list = list;
				}
				
				libCategory.category_index = req.body.category_index;
				libCategory.category_sub_index = req.body.category_sub_index;
				libCategory.main_url = req.body.main_url;
				libCategory.category_id = req.body.category_id;
				libCategory.category_name = req.body.category_name;
				
				libCategory.save(function(err){
					res.json(libCategory);
				});
			});
		});
	
	app.route('/api/adminpage/library/getItems/:itemId')
		.get(function(req, res){
			Library.new_libraryItem.findById(req.params.itemId, function(err, libItem){
				if(err) return res.json(err);
				res.json(libItem);
			});
		})
		.put(function(req, res){
			Library.new_libraryItem.findById(req.body._id, function(err, libItem){
				if(err) return res.json(err);
				libItem.name = req.body.name;
				libItem.save(function(err){
					res.json(libItem);
				});
			});
		});
		
	/*app.route('/api/adminpage/library/updateClasses')
		.post(function(req, res){
			for(var y = 1; y<=21; y++){
				Library.new_libraryClass.findOne({class_id: y}, function(err, libClass){
					//console.log(libClass.category_list);
					Library.new_libraryCategory.find({category_id: {"$in" : libClass.category_list}})
						.select('_id')
						.exec(function (err, category){
							var list = [];
							for(var x = 0; x<category.length; x++){
								list.push(category[x]._id);
							}
							libClass.category_ref = list;
							libClass.save();
							console.log(libClass);
							console.log(list);
						});				

				});				
			}
		});
	
	app.route('/api/adminpage/library/updateCategories')
		.post(function(req, res){
			for(var y = 1; y<=259; y++){
				Library.new_libraryCategory.findOne({category_id: y}, function(err, libCategory){
					//console.log(libClass.category_list);
					Library.new_libraryItem.find({item_id: {"$in" : libCategory.items_list}})
						.select('_id')
						.exec(function (err, item){
							var list = [];
							for(var x = 0; x<item.length; x++){
								list.push(item[x]._id);
							}
							libCategory.items_ref = list;
							libCategory.save();
							console.log(libCategory);
							console.log(list);
						});				

				});				
			}
		});
	
	app.get('/api/adminpage/library/updateItems', function(req, res){
		Library.new_libraryItem.find()
		//.select('class_sub_index class_index class_id')
		.sort({'sub_index': 1})
		.exec(function (err, libraryItemList) {
			if(err) return res.json({'error': err, 'libraryItemList': ''});
			if(libraryItemList.length){
				for(var i=0; i < libraryItemList.length; i++){
					Library.new_libraryItem.findByIdAndUpdate(libraryItemList[i]._id, {item_id: i+1}, function(err, item){
						console.log(item);						
					});
				}
			}else{
				res.json({'error': 'libraryClassList is empty!', 'libraryClassList': ''});
			}
		});
	});
	
	/*app.get('/api/adminpage/library/getItems/:itemId', function(req, res){
	});
	
	app.put('/api/adminpage/library/getItems/:itemId', function(req, res){
		/*Library.new_libraryItem.findById(req.body._id, function(err, libItem){
			if(err) return res.json(err);
			res.json(libItem);
		});*/
	//});
	
	/*app.get('/api/edit_library/categoryUpdate', function(req, res){
		Library.old_libraryCategory.find()
		.exec(function (err, libraryCategoryList) {
			if(err) return res.json(err);
			for(var i=0; i < libraryCategoryList.length; i++){
				var newCategory = new Library.new_libraryCategory();
				newCategory.category_index = libraryCategoryList[i].category_index;
				newCategory.category_sub_index = libraryCategoryList[i].category_sub_index;
				newCategory.category_name = libraryCategoryList[i].category_name;
				//newCategory.items_ref = libraryCategoryList[i].category_name;
				newCategory.main_url = libraryCategoryList[i].main_url;
				
				newCategory.save(function(err) {
					if(err) return console.log(err);
					console.log('ok! '+i);
				});
			}
			res.json('all is ok!');
		});
	});*/
	/*app.get('/api/edit_library/itemsUpdate', function(req, res){
		Library.old_libraryItem.find()
		.exec(function (err, libraryItemsList) {
			if(err) return res.json(err);
			
			console.log(libraryItemsList);
			
			for(var i=0; i < libraryItemsList.length; i++){
				var newItem = new Library.new_libraryItem();
				newItem.index = libraryItemsList[i].index;
				newItem.sub_index = libraryItemsList[i].sub_index;
				newItem.name = libraryItemsList[i].name;
				newItem.item_class_ref = libraryItemsList[i].item_class_ref;
				newItem.item_category_ref = libraryItemsList[i].item_category_ref;
				newItem.spec = libraryItemsList[i].spec;
				newItem.description = libraryItemsList[i].description;
				newItem.cause = libraryItemsList[i].cause;
				newItem.pathogenesis = libraryItemsList[i].pathogenesis;
				newItem.clinics = libraryItemsList[i].clinics;
				newItem.diagnosis = libraryItemsList[i].diagnosis;
				newItem.treatment = libraryItemsList[i].treatment;
				newItem.prophylaxis = libraryItemsList[i].prophylaxis;
				newItem.prognosis = libraryItemsList[i].prognosis;
				newItem.drugs = libraryItemsList[i].drugs;
				newItem.people_stat = libraryItemsList[i].people_stat;
				newItem.symptom = libraryItemsList[i].symptom;
				newItem.item_type = libraryItemsList[i].item_type;
				newItem.main_url = libraryItemsList[i].main_url;
				newItem.key_words = libraryItemsList[i].key_words;
				
				newItem.save(function(err) {
					if(err) return console.log(err);
					console.log('ok! '+i);
				});
			}
			res.json('all is ok!');
		});
	});*/
	
/*	
	
	app.get('/api/libraryAdminpage/getItems', function(req, res){
		Library.new_libraryItem.find()
		.select('sub_index item_id')
		.sort({'sub_index': 1})
		.exec(function (err, libraryItemList) {
			if(err) return res.json({'error': err, 'libraryItemList': ''});
			
			if(libraryItemList.length){
				res.json({'error': '', 'libraryItemList': libraryItemList});
			}else{
				res.json({'error': 'libraryItemList is empty!', 'libraryItemList': ''});
			}
		});
	});
	
	app.get('/api/libraryAdminpage/updateCategories', function(req, res){
		Library.new_libraryCategory.find()
		//.select('class_sub_index class_index class_id')
		.sort({'category_sub_index': 1})
		.exec(function (err, libraryCategoryList) {
			if(err) return res.json({'error': err, 'libraryCategoryList': ''});
			if(libraryCategoryList.length){
				for(var i=0; i < libraryCategoryList.length; i++){
					Library.new_libraryCategory.findByIdAndUpdate(libraryCategoryList[i]._id, {category_id: i+1}, function(err, item){
						console.log(item);						
					});
				}
			}else{
				res.json({'error': 'libraryClassList is empty!', 'libraryClassList': ''});
			}
		});
	});
	
	app.get('/api/libraryAdminpage/getCategories', function(req, res){
		Library.new_libraryCategory.find()
		.select('category_sub_index category_id')
		.sort({'category_sub_index': 1})
		.exec(function (err, libraryCategoryList) {
			if(err) return res.json({'error': err, 'libraryCategoryList': ''});
			
			if(libraryCategoryList.length){
				res.json({'error': '', 'libraryCategoryList': libraryCategoryList});
			}else{
				res.json({'error': 'libraryCategoryList is empty!', 'libraryCategoryList': ''});
			}
		});
	});
	
	app.get('/api/libraryAdminpage/updateClasses', function(req, res){
		var list = [];
		for(var i = 218; i<=252; i++){
			list.push(i);
		}
		Library.new_libraryClass.findOneAndUpdate({'class_id': 20}, {category_list: list}, function(err, item){
			console.log(item);						
		});
		
	});
	
	app.get('/api/libraryAdminpage/getClasses', function(req, res){
		Library.new_libraryClass.find()
		.select('class_sub_index class_index class_id category_list')
		.sort({'class_sub_index': 1})
		.exec(function (err, libraryClassList) {
			if(err) return res.json({'error': err, 'libraryClassList': ''});
			
			if(libraryClassList.length){
				res.json({'error': '', 'libraryClassList': libraryClassList});
			}else{
				res.json({'error': 'libraryClassList is empty!', 'libraryClassList': ''});
			}
		});
	});*/
	
};