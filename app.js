/*global console, require*/
var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('lib'));

app.get('/', function (req, res) {
    "use strict";
    res.render('interface.ejs', { query: "Type your query here", result: "..." });
});

app.post('/', function (req, res) {
    "use strict";
    var query = req.body.query,
        cmd = 'mongo --quiet < __query.js > __result.json';
    fs.writeFile("__query.js", query, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                console.log(stderr);
            }
            fs.readFile('__result.json', function (err, data) {
                res.render('interface.ejs', { query: query, result: data });
            });
        });
    });
});

app.listen(3000, function () {
    "use strict";
    console.log('App listening on port 3000!');
});