var express = require('express');
var router = express.Router();
var session = require('express-session');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var uuid = require('uuid/v1');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(cookieParser());

router.use(session({
   genid: function(req) {
     return uuid();
   },
   secret: "temp"
 }));

router.use(express.static('public_html'));

router.get('/', function (req, res) {
   res.sendFile(__dirname + "/public_html/" + "index.html" );
});


module.exports = router;