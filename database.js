var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var databaseUrl = "mongodb://localhost:27017/socialplanner";
var databaseName = "socialplanner";
var uuid = require('uuid');

var database = {
    connectDatabase: function (action) {
        MongoClient.connect(databaseUrl, { useNewUrlParser: true }, function (err, db) {
            if (err) console.log(err);
            else action(db);
        });
    },
    generalQuery: function (cookie, callback) {
        database.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: cookie }, function (err, sessionResult) {
                if (sessionResult == null) {
                    callback({ status: { login: false } });
                    db.close();
                }
                else user.findOne({ id: sessionResult.id }, function (err, userResult) {
                    userResult.status = { login: true };
                    callback(userResult);
                    db.close();
                });
            });
        });
    },
    getUser: function(id, callback){
        database.connectDatabase(function (db){
            var user = db.db(databaseName).collection('user');
            user.findOne({id: id},function(err, result){
                callback(result);
            });
        });
    }
    ,getAllUser: function(callback){
        database.connectDatabase(function (db){
            var user = db.db(databaseName).collection('user');
            user.find({}).toArray(function(err, result){
                callback(result);
            });
        });
    },
    loginRequest: function (data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            user.findOneAndUpdate({ email: data.email, password: data.password }, { $set: { lastLogin: new Date() } }, function (err, result) {
                if (result.value == null) {
                    callback({ success: false });
                    db.close();
                }
                else {
                    expireAfterSeconds = data.rememberMe ? 3600 * 24 * 30 : 3600;
                    session.insertOne({ id: result.value.id, cookie: data.cookie }, { expireAfterSeconds: expireAfterSeconds }, function (err, result) {
                        callback({ success: true });
                        db.close();
                    });
                }
            });
        });
    },
    registerRequest: function (data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            user.findOne({ email: data.email }, function (err, userResult) {
                if (userResult != null) {
                    callback({ success: false, emailExist: true });
                    db.close();
                }
                else {
                    user.insertOne({ id: uuid.v1(), email: data.email, firstName: data.firstName, lastName: data.lastName, nickname: data.nickname, phone: data.phone, password: data.password, friends: [], groups: [], events: [], preferences: null, lastLogin: null, created: new Date() }, function (err, result) {
                        callback({ success: true });
                        db.close();
                    });
                }
            });
        });
    },
    logoutRequest: function (cookie, callback) {
        this.connectDatabase(function (db) {
            var session = db.db(databaseName).collection('session');
            session.deleteMany({ cookie: cookie }, function (err, result) {
                if (result.result.ok == 1) callback({ success: true });
                else callback({ success: false });
                db.close();
            });
        });
    },
    searchPeopleRequest(data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                user.findOne({ id: sessionResult.id }, function (err, currentUser) {
                    if (currentUser == null) {
                        callback([]);
                        db.close();
                    }
                    else user.find({ phone: data.key }).toArray(function (err, result) {
                        var people = [];
                        for (var i = 0; i < result.length; i++) {
                            var item = result[i];
                            var duplicateFlag = false;
                            for (var j = 0; j < currentUser.friends.length; j++) {
                                if (currentUser.friends[j].id == item.id) {
                                    duplicateFlag = true; break;
                                }
                            }
                            if (!duplicateFlag) people.push({ id: item.id, firstName: item.firstName, lastName: item.lastName, nickname: item.nickname, phone: item.phone });
                        }
                        callback(people);
                        db.close();
                    });
                })
            });

        });
    },
    searchFriendsRequest(data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                user.findOne({ id: sessionResult.id }, function (err, currentUser) {
                    var response = [];
                    for (var i = 0; i < currentUser.friends.length; i++) {
                        var friend = currentUser.friends[i];
                        if (friend.nickname == data.key || friend.firstName == data.key || friend.lastName == data.key || friend.phone == data.key) {
                            response.push(friend);
                        }
                    }
                    callback(response);
                    db.close();
                });
            });
        });
    },
    addPeopleRequest(data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                user.findOne({ id: sessionResult.id }, function (err, currentUser) {
                    if (currentUser == null) { callback({ success: false, login: false }); db.close(); }
                    user.findOne({ id: data.id }, function (err, toAddUser) {
                        if (toAddUser == null) {
                            callback({ success: false, userExist: false, alreadyAdded: true });
                            db.close();
                        }
                        else {
                            var duplicateFlag = false;
                            console.log(currentUser);
                            for (var i = 0; i < currentUser.friends.length; i++) {
                                if (currentUser.friends[i].id == toAddUser.id) {
                                    duplicateFlag = true; break;
                                }
                            }
                            if (duplicateFlag) {
                                callback({ success: false, userExist: true, alreadyAdded: true });
                                db.close();
                            }
                            else {
                                user.findOneAndUpdate({ id: currentUser.id }, { $push: { friends: { id: toAddUser.id, nickname: toAddUser.nickname, firstName: toAddUser.firstName, lastName: toAddUser.lastName, phone: toAddUser.phone, lastMeetTime: null, picked: false } } }, function (err, result) {
                                    if (result.ok == 1)
                                        callback({ success: true, userExist: true, friend: toAddUser });
                                    else callback({ success: false, userExist: true });
                                    db.close();
                                });
                            }
                        }
                    });

                });
            });
        });
    },
    submitNewGroup(data, callback) {
        this.connectDatabase(function (db) {
            console.log(data);
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            var group = db.db(databaseName).collection('group');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                if (sessionResult == null) { callback({ success: false, login: false }); db.close(); }
                else {
                    delete data.cookie;
                    user.findOne({ id: sessionResult.id }, function (err, userResult) {
                        if (userResult == null) { callback({ success: false, login: false }); db.close(); }
                        else {
                            var createExistFlag = false;
                            for (var i = 0; i < data.groupList.length; i++) {
                                var person = data.groupList[i];
                                if (person.id == userResult.id) { createExistFlag = true; break; }
                            }
                            if (!createExistFlag) data.groupList.unshift({ id: userResult.id, nickname: userResult.nickname, firstName: userResult.firstName, lastName: userResult.lastName });
                            data.id = uuid.v1();
                            group.insertOne(data, function (err, result) {
                                for (var i = 0; i < data.groupList.length; i++) {
                                    var person = data.groupList[i];
                                    user.findOneAndUpdate({ id: person.id }, { $push: { groups: data } });
                                }
                                callback({ success: true });
                                db.close();
                            });
                        }
                    });
                }
            });
        });
    },
    submitChangeGroup(data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            var group = db.db(databaseName).collection('group');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {

                // if(sessionResult == null) {callback({success: false, login: false}); db.close();}
                // else{
                //     delete data.cookie;
                //     user.findOne({id: sessionResult.id}, function(err, userResult){
                //         if(userResult == null) {callback({success: false, login: false}); db.close();}
                //         else{
                //             group.findOneAndUpdate({id: data.id}, function(err, groupResult){
                //                 for(var i = 0; i < groupResult.groupList.length; i++){
                //                     var person = groupResult.groupList[i];
                //                     user.findOneAndUpdate({id: person.id}, {$push: {groups: data}});
                //                 }
                //                 callback({success: true});
                //                 db.close();
                //             });
                //         }
                //     });
                // }
            });
        });
    },
    submitPriorities(data, callback){
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                if (sessionResult == null) {callback({success: false, login: false}); db.close();}
                else{
                    delete data.cookie;
                    user.findOneAndUpdate({id: sessionResult.id}, {$set: {priorities: data}}, function(err, result){
                        if (result.ok == 1) callback({ success: true, userExist: true });
                        else callback({ success: false, userExist: true });
                        db.close();
                    });
                }
            });
        });

    }
    , getUserEvent(cookie, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: cookie }, function (err, sessionResult) {
                if (sessionResult != null) {
                    user.findOne({ id: sessionResult.id }, function (err, userResult) {
                        callback(userResult.events);
                        db.close();
                    });
                }
                else {
                    callback(null);
                    db.close();
                }
            });
        });
    },
    newEventRequest(data, callback) {
        this.connectDatabase(function (db) {
            var user = db.db(databaseName).collection('user');
            var session = db.db(databaseName).collection('session');
            session.findOne({ cookie: data.cookie }, function (err, sessionResult) {
                if (sessionResult != null) {
                    delete data.cookie;
                    data.id = uuid.v1();
                    user.findOneAndUpdate({ id: sessionResult.id }, { $push: { events: data } }, function (err, result) {
                        if (result.ok == 1) callback({ success: true, userExist: true });
                        else callback({ success: false, userExist: true });
                        db.close();
                    });
                }
                else {
                    callback({ success: false, userExist: false });
                    db.close();
                }
            });
        });
    }
};

module.exports = database;