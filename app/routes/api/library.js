var Library = require('../../models/library');

module.exports = function (app){
	
	// Получение списка классов МКБ
	app.get('/api/library', function(req, res){
		Library.new_libraryClass.find()
		//.populate('category_ref')
		.exec(function (err, libraryClassList) {
			if(err) return res.json({'error': err, 'libraryClassList': ''});
			
			if(libraryClassList.length){
				res.json({'error': '', 'libraryClassList': libraryClassList});
			}else{
				res.json({'error': 'libraryClassList is empty!', 'libraryClassList': ''});
			}
		});
	});
	
	// Получение класса МКБ по названию + категории
	app.get('/api/library/:libClass', function(req, res){
		Library.new_libraryClass.findOne({'main_url': req.params.libClass})
		.populate('category_ref')
		.exec(function (err, libraryClassItem) {
			if(err) return res.json({'error': err, 'libraryClassItem': ''});
			
			if(libraryClassItem){
				res.json({'error': '', 'libraryClassItem': libraryClassItem});
			}else{
				res.json({'error': 'libraryClassItem is empty!', 'libraryClassItem': ''});
			}
		});
	});
	
	// Получение категории МКБ по названию + заболевания
	app.get('/api/library/:libClass/:libCategory', function(req, res){
		Library.new_libraryCategory.findOne({'main_url': req.params.libCategory})
		.populate('items_ref')
		.exec(function (err, libraryCategoryItem) {
			if(err) return res.json({'error': err, 'libraryCategoryItem': ''});
			
			if(libraryCategoryItem){
				res.json({'error': '', 'libraryCategoryItem': libraryCategoryItem});
			}else{
				res.json({'error': 'libraryCategoryItem is empty!', 'libraryCategoryItem': ''});
			}
		});
	});
	
	// Получение заболевания МКБ по названию + класс + категория
	app.get('/api/library/:libClass/:libCategory/:libItem', function(req, res){
		Library.new_libraryItem.findOne({'main_url': req.params.libItem})
		.exec(function (err, libraryItem) {
			if(err) return res.json({'error': err, 'libraryItem': ''});
			
			if(libraryItem){
				res.json({'error': '', 'libraryItem': libraryItem});
			}else{
				res.json({'error': 'libraryItem is empty!', 'libraryItem': ''});
			}
		});
	});
	
};