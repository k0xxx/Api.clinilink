var Users = require('../../models/users');
var Contacts = require('../../models/contacts');

module.exports = function (app, passport){
	
	app.route('/api/contacts')
		.get(passport.authenticate('jwt', { session: false }), function(req, res){
			var page = 1;
			if(req.query.page != undefined) page = req.query.page;
			var limit = 10;
			if(page == 1){limit = 30}
			var start = (page * limit) - limit;
			var query = { userId: req.user };
			switch(req.query.relationType){
				case 'out_requests': query.type = '1'; break;
				case 'in_requests': query.type = '2'; break;
				case 'subsribers': query.subsriber = true; break;
				default: query.type = '3';
			}
			var contactMath = {};
			if(req.query.contactsSearch) contactMath.fullName = {$regex : req.query.contactsSearch};
			switch(req.query.contactsType){
				case '0': 
					contactMath.status = {id: 0};
					break;
				case '1': 
					contactMath.status = {id: 1};
					break;
				case '2': 
					contactMath.status = {id: {$gt: 2}};
					break;
			}
			Contacts.contact.find(query)
				.skip(start)
				.limit(limit)
				.populate({
					path: 'contactRef',
					match: contactMath,
				})
				//.sort('-date')
				/*.populate({
					path: 'contactsRef',
					match: { contactId: req.user},
					// Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
					select: 'type -_id',
				})*/
				.lean()
				.exec(function (err, contactsList) {
					if(err){
						res.json({'error': err, 'contactsList': ''});
					}else if(contactsList.length){
						res.json({'error': '', 'contactsList': contactsList});
					}else{
						res.json({'error': 'contactsList is empty or does not exists!', 'contactsList': ''});
					}
				});
		})
		.put(passport.authenticate('jwt', { session: false }), function(req, res){
			createContact('1', req.user, req.body.contactId, function(response){
				createContact('2', response.contactId, response.userId, function(response){
					res.json({'err': '', 'isContact': true});
				})
			})
		})
		.post(passport.authenticate('jwt', { session: false }), function(req, res){
			console.log(req.body);
			Contacts.contact.findOneAndUpdate({'userId': req.user, 'contactId': req.body.contactId}, {type: '3'}, function(err, contact){
				if (err) res.json({'error': err, 'update': false});
				Contacts.contact.findOneAndUpdate({'userId': req.body.contactId, 'contactId': req.user}, {type: '3'}, function(err, contact){
					if (err) res.json({'error': err, 'update': false});
					res.json({'error': '', 'update': true});
				})
			})
			/*createContact('1', req.user, req.body.contactId, function(response){
				createContact('2', response.contactId, response.userId, function(response){
					res.json({'err': '', 'isContact': true});
				})
			})*/
		})
		.delete(passport.authenticate('jwt', { session: false }), function(req, res){
			Contacts.contact.findOne({'userId': req.user, 'contactId': req.query.contactId}, function(err, contact){
				if (err) res.json({'error': err, 'isRemoved': false});
				contact.remove(function(err){
					if (err) res.json({'error': err, 'isRemoved': false});
					Contacts.contact.findOne({'userId': req.query.contactId, 'contactId': req.user}, function(err, contact){
						if (err) res.json({'error': err, 'isRemoved': false});
						contact.remove(function(err){
							if (err) res.json({'error': err, 'isRemoved': false});
							res.json({'error': '', 'isRemoved': true});
					   })
					})
			   })
			})
		})
		
	function createContact(type, userId, contactId, callback){
		Contacts.contact.findOne({'userId': userId, 'contactId': contactId})
				.exec(function (err, isContact) {
					if(err) console.log(err);
					
					if(!isContact){
						var newContact = new Contacts.contact();
						newContact.userId = userId;
						newContact.userRef = userId;
						newContact.contactId = contactId;
						newContact.contactRef = contactId;
						newContact.type = type;

						newContact.save(function(err) {
							if(err) console.log(err);
							return callback(newContact);
						});
					}else{
						return callback(isContact);
					}
				});
	}
};