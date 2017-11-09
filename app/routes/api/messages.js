var Messages = require('../../models/messages');
//var formidable = require('formidable');
//var path = require('path');
//var fs = require('fs');

module.exports = function (app, passport){
    
	app.route('/api/messages')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 20}
			var start = (page * limit) - limit;
			
			Messages.dialog.find({user_dialog_list: req.user})
				.sort('-last_message_time')
				.skip(start)
				.limit(limit)
				.populate('user_dialog_list_ref', null, {_id: { $ne: req.user }})
				.lean()
				.exec(function (err, dialogList) {
					if(err) return res.json({'error': err, 'dialogList': ''});
					
					if(dialogList.length){
						res.json({'error': '', 'dialogList': dialogList});
					}else{
						res.json({'error': 'Dialog is empty or does not exists!', 'dialogList': ''});
					}
			});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			var dialogUsers = new Array();
			
			dialogUsers[0] = req.user;
			dialogUsers[1] = req.body.contact_id;
			var messageText = req.body.message;
			
			Messages.dialog.findOne({ user_dialog_list: {$all: dialogUsers, $size: 2}})
				.lean()
				.exec(function (err, dialog) {
					if(err) return res.json({'error': err, 'dialog': ''});
					
					if(dialog){
						sendMessage(dialog._id, req.user, {message: messageText, attach: ''}, function(response){
							res.json({'error': '', 'dialog': 'exists, send new message'});
						});
					}else{
						var newDialog = new Messages.dialog();
						newDialog.user_dialog_list = dialogUsers;
						newDialog.user_dialog_list_ref = dialogUsers;
						
						newDialog.save(function (err, createdDialog) {
							sendMessage(createdDialog._id, req.user, {message: messageText, attach: ''}, function(response){
								res.json({'error': '', 'dialog': 'exists, send new message'});
							});							
						});
					}
				});
		});
	
	app.route('/api/messages/:dialogId')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			Messages.dialog.findById(req.params.dialogId)
				.populate('user_dialog_list_ref', null, {_id: { $ne: req.user }})
				.lean()
				.exec(function (err, dialogInfo) {
					if(err) return res.json({'error': err, 'dialogInfo': ''});
					if(dialogInfo){
						res.json({'error': '', 'dialogInfo': dialogInfo});
					}else{
						res.json({'error': 'dialogInfo is empty!', 'dialogInfo': ''});
					}
				});
		})
	
	app.route('/api/messages/:dialogId/messages')
		.get(function(req, res){
			var page = 1;
			if(req.query.page != undefined){page = req.query.page};
			var limit = 5;
			//if(page == 1){limit = 20}
			var start = (page * limit) - limit;
			
			Messages.message.find({dialog_id: req.params.dialogId})
				.sort('-date')
				.skip(start)
				.limit(limit)
				//.populate('to_ref')
				.populate('from_ref')
				.lean()
				.exec(function (err, messageList) {
					if(err){
						res.json({'error': err, 'messageList': ''});
					}else if(messageList.length){
						res.json({'error': '', 'messageList': messageList});
					}else{
						res.json({'error': 'Messages is empty!', 'messageList': ''});
					}
				});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			sendMessage(req.params.dialogId, req.user, {message: req.body.message, attach: ''}, function(response){
				res.json({'error': '', 'message': response});
			});	
		})
		
	function sendMessage(dialog_id, from_id, messageBody, callback){
		var newMessage = new Messages.message();
			//dialog_id
			newMessage.dialog_id = dialog_id;
			newMessage.dialog_ref = dialog_id;
			//from_id
			newMessage.from_id = from_id;
			newMessage.from_ref = from_id;
			//messageText
			newMessage.text = messageBody.message;
			//messageBody
			if(messageBody.attach){
				newMessage.attach = messageBody.attach;
			}
			newMessage.save(function (err, newMessage) {
				if(err) return err;
				newMessage.populate('from_ref', function(err) {
					if(err) return err;
					return callback(newMessage);
				});	
			});
	}
	
	/*app.post('/messages/get_dialogs', function(req, res){
		var page = 1;
		if(req.body.page != undefined){page = req.body.page};
		
		var limit = 10;
		if(page == 1){limit = 50}
		var start = (page * limit) - limit;
		
		var user_id = req.session.passport.user;
		if(req.body.user_id != undefined){user_id = req.body.user_id};
		
		Messages.dialog.find({user_dialog_list: user_id})
			.sort('-last_message_time')
			.skip(start)
			.limit(limit)
			.populate('user_dialog_list_ref', null, {_id: { $ne: user_id }})
			.lean()
			.exec(function (err, dialogList) {
				if(err){
					res.json({'error': err, 'dialogList': ''});
				}else if(dialogList.length){
					res.json({'error': '', 'dialogList': dialogList});
				}else{
					res.json({'error': 'Dialog is empty or does not exists!', 'dialogList': ''});
				}
			});
    });
	
	app.post('/messages/get_messages', function(req, res){
		var page = 1;
		if(req.body.page != undefined){page = req.body.page};
		
		var limit = 10;
		if(page == 1){limit = 50}
		var start = (page * limit) - limit;
		
		var dialog_id = false;
		if(req.body.dialog_id != undefined){dialog_id = req.body.dialog_id};
		
		Messages.message.find({dialog_id: dialog_id})
			.sort('-date')
			.skip(start)
			.limit(limit)
			//.populate('to_ref')
			.populate('from_ref')
			.lean()
			.exec(function (err, messageList) {
				if(err){
					res.json({'error': err, 'messageList': ''});
				}else if(messageList.length){
					res.json({'error': '', 'messageList': messageList});
				}else{
					res.json({'error': 'Messages is empty!', 'messageList': ''});
				}
			});
    });
	
	app.post('/messages/get_dialog_info', function(req, res){		
		Messages.dialog.findById(req.body.dialog_id)
			.populate('user_dialog_list_ref')
			.exec(function (err, dialogInfo) {
				if(err){
					res.json({'error': err, 'messageList': ''});
				}else if(dialogInfo){
					res.json({'error': '', 'dialogInfo': dialogInfo});
				}else{
					res.json({'error': 'dialogInfo is empty!', 'dialogInfo': ''});
				}
			});
    });
	
	app.post('/messages/send_message', function(req, res){
		var newForm = new formidable.IncomingForm();
		
		newForm.uploadDir = './uploads/';
		var from_id = req.session.passport.user;
		var uploadFolder = from_id;
		var dialog_id = '';
		var messageText = '';
		var messageAttach = [];
		
		newForm.on('field', function(name, field) {
			//require
			if(name == 'dialog_id'){
				dialog_id = field;	
			};
			//require
			if(name == 'messageText'){
				messageText = field;
			};
			//option
			if(name == 'fileUploadId'){
				uploadFolder = field;
			};
			//option
			if(name == 'from_id'){
				from_id = field;
			};
		})
		
		// FormData On file
		newForm.on('file', function(field, file) {
			if(field == 'messageAttach[]' && file.size != 0){
				var newDestination = newForm.uploadDir + uploadFolder;
				var status = null;
				try {
					status = fs.statSync(newDestination);
				} catch (err) {
					fs.mkdirSync(newDestination);
				}
				if (status && !status.isDirectory()) {
					res.json({'err': 'folder creation error', 'send': false});
				}
				fs.rename(file.path, path.join(newDestination, file.name));
				var fileInfo = {'url': uploadFolder+ '/' + file.name, 
								'name': file.name, 
								'type': file.type, 
								'size': file.size,
								'date': file.mtime
							};
				messageAttach.push(fileInfo);
			}			
		});
		
		// FormData On errors
		newForm.on('error', function(err) {
			res.json({'err': err, 'send': false});
		});
		
		newForm.on('end', function() {
			if(dialog_id && from_id && messageText){
				var message = sendNewMessage(dialog_id, from_id, messageText, messageAttach);
				res.json({'err': '', 'send': message});
			}else{
				res.json({'err': 'Some field is empty!', 'send': false});
			}
		});
		  
		newForm.parse(req);
		
		
		
		
		
		
		
		
		/*
		
		
		if(req.body.messageAttach != undefined){
			var messageAttach = req.body.messageAttach;
			valid++;
		};
		
		if(valid == 4){
			var message = sendNewMessage(dialog_id, from_id, messageText, messageAttach);
			res.json(message);
		}else{
			res.json('some error! empty data');
		}*/
		
		
		//req.session.passport.user
		/*var newMessage = new Messages.message();
		newMessage.dialog_id = req.body.dialog_id;
		newMessage.from_id = req.body.from_id;
		newMessage.to_id = req.body.to_id;
		newMessage.text = req.body.text;
		//newDialog.attach = req.body.attach;
		newMessage.save();*/
		
		//res.json(req.body);
		/*var newMessage = new Messages.message();
		newMessage.dialog_id = req.body.dialog_id;
		newMessage.text = 'hi every body!';*/
		
		/*Messages.message.find({dialog_id: req.body.dialog_id}, null, {sort: '-date', skip: start, limit: limit}, function (err, messageList) {
			if(err){
				res.json({'error': err, 'messageList': ''});
			}else if(messageList.length){
				res.json({'error': '', 'messageList': messageList});
			}else{
				res.json({'error': 'Messages is empty!', 'messageList': ''});
			}
		});*/
    /*});
	
	app.post('/messages/new_message', function(req, res){
		var dialogUsers = new Array();
		
		var valid = 0;
		
		if(req.body.from_id != undefined){
			dialogUsers[0] = req.body.from_id;
			valid++;
		}else if(req.session.passport.user != undefined){
			dialogUsers[0] = req.session.passport.user;
			valid++;
		}
		if(req.body.message_text != undefined){
			var messageText = req.body.message_text;
			valid++;
		}
		if(req.body.contact_id != undefined){
			dialogUsers[1] = req.body.contact_id;
			valid++;
		}
		
		if(valid == 3){
			Messages.dialog.findOne({ user_dialog_list: {$all: dialogUsers, $size: 2}})
				.lean()
				.exec(function (err, dialog) {
					if(err){
						res.json({'error': err, 'dialog': ''});
					}else if(dialog){
						res.json({'error': '', 'dialog': 'exists, send new message'});
						
						sendNewMessage(dialog._id, dialogUsers[0], messageText, '');
					}else{
						var newDialog = new Messages.dialog();
						newDialog.user_dialog_list = dialogUsers;
						newDialog.user_dialog_list_ref = dialogUsers;
						newDialog.last_message = messageText.substr(0,25),
						newDialog.save();
						
						sendNewMessage(newDialog._id, dialogUsers[0], messageText, '');
						
						res.json({'error': '', 'dialog': 'is created!'});
					}
				});			
		}else{
			res.json({'error': 'so we have not information!', 'dialog': ''});
		}
		
    });
	
	function sendNewMessage(dialog_id, from_id, messageText, messageAttach){
		var newMessage = new Messages.message();
		//dialog_id
		newMessage.dialog_id = dialog_id;
		newMessage.dialog_ref = dialog_id;
		//from_id
		newMessage.from_id = from_id;
		newMessage.from_ref = from_id;
		//messageText
		newMessage.text = messageText;
		//messageAttach
		if(messageAttach){
			newMessage.attach = messageAttach;
		}
		newMessage.save();
		return newMessage;
	}
	*/
};