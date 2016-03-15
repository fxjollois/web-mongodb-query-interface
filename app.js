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
        compfile = Math.round(Math.random() * 1000000000000000),
        queryfile = '__query_' + compfile + '.js',
        resultfile = '__result_' + compfile + '.json',
        cmd = 'mongo --quiet < ' + queryfile + ' > ' + resultfile;
    fs.writeFile(queryfile, query, function (err) {
        if (err) {
            return console.log(err);
        }
        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                console.log(stderr);
            }
            fs.readFile(resultfile, function (err, data) {
                res.render('interface.ejs', { query: query, result: data });
                exec('rm ' + resultfile, function () {});
                // fs.unlinkSync(resultfile);
            });
        });
        exec('rm ' + queryfile, function () {});
    });
});

app.listen(3000, function () {
    "use strict";
    console.log('App listening on port 3000!');
});