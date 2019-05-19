var express = require('express');
var router = express.Router();
var session = require('express-session');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var uuid = require('uuid/v1');
var fs = require('fs');
var database = require('./database');
var util = require('./util');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

router.use(session({
    genid: function (req) {
        return uuid();
    },
    secret: "temp"
}));

router.use(express.static('/public_html/img/*'));
router.use(express.static('/public_html/static/*'));

router.use(function (req, res, next) {
    console.log("Request to " + req.url);
    next();
});

router.get('/script.js', function(req, res){
    res.sendFile(__dirname + "/public_html/" + "script.js");
});

router.get('/', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "index.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            console.log(response);
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.get('/index.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "index.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.get('/login.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "login.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});


router.get('/register.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "register.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.get('/registration.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "registration.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            database.getCharacteristic(function(response){
                htmlPlusData = htmlPlusData.toString().replace("CHARACTERISTICJSON", JSON.stringify(response));
                res.send(htmlPlusData);
            });
        });
    });
});

router.get('/calendar.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "calendar.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.get('/event.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "event.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.get('/friends.html', function (req, res) {
    fs.readFile(__dirname + "/public_html/" + "friends.html", function(err, html){
        database.generalQuery(req.cookies['connect.sid'], function(response){
            var htmlPlusData = html.toString().replace("DATAJSON", JSON.stringify(response));
            res.send(htmlPlusData);
        });
    });
});

router.post('/loginRequest', function (req, res) {
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.loginRequest(data, function(response){
        res.send(response);
    });
});

router.post('/registerRequest', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.registerRequest(data, function(response){
        res.send(response);
    });
});

router.post('/submitRegistration', function(req, res){
    var rawData = req.body;
    var cookie = req.cookies['connect.sid'];
    util.processRegistration(rawData, cookie, function(response){
        res.send(response);
    })
});

router.get('/logoutRequest', function(req, res){
    var cookie = req.cookies['connect.sid'];
    database.logoutRequest(cookie, function(response){
        res.send(response);
    });
});

router.post('/searchPeopleRequest', function(req, res){
    var data = {cookie: req.cookies['connect.sid'], key: req.body.key};
    database.searchPeopleRequest(data, function(response){
        res.send(response);
    });
});

router.post('/searchFriendsRequest', function(req, res){
    var data = {cookie: req.cookies['connect.sid'], key: req.body.key};
    database.searchFriendsRequest(data, function(response){
        res.send(response);
    });
});

router.post('/addPeopleRequest', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.addPeopleRequest(data, function(response){
        res.send(response);
    });
});

router.post('/submitNewGroup', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.submitNewGroup(data, function(response){
        res.send(response);
    });
});

router.post('/submitChangeGroup', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.submitChangeGroup(data, function(response){
        res.send(response);
    });
});

router.post('/submitPriorities', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    database.submitPriorities(data, function(response){
        res.send(response);
    });
});

router.post('/newEventRequest', function(req, res){
    var data = req.body;
    data.cookie = req.cookies['connect.sid'];
    data.startTime = new Date(data.startTime);
    data.endTime = new Date(data.endTime);
    if(data.repeatEnd != null) data.repeatEnd = new Date(data.repeatEnd);
    if(data.startTime <= data.endTime && data.startTime >= new Date()){
        database.newEventRequest(data, function(response){
            res.send(response);
        });
    }
    else res.send({success: false, formatValid: false});
});

router.post('/getMonthEventRequest', function(req, res){
    var start = new Date(req.body.month);
    var end = new Date(start.getFullYear(), start.getMonth() + 1);
    var cookie = req.cookies['connect.sid'];
    util.flattenEventWithCookie(cookie, start, end, function(response){
        console.log(response);
        res.send({eventList: response});
    });
});

router.get('/makeEvent', function(req, res){
    util.generateEvent(function(response){
        res.send(response);
    });
});

module.exports = router;