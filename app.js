/*global console, require*/
var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
var UglifyJS = require("uglify-js");

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('lib'));

var listDB = ["test", "gym"];

app.get('/', function (req, res) {
    "use strict";
    res.render('interface.ejs', { query: "Type your query here", result: "...", dbs: listDB });
});

app.post('/', function (req, res) {
    "use strict";
    var db = 'test',
        queryStart = req.body.query,
        ugly = UglifyJS.minify(queryStart, {fromString: true}),
        query = ugly.code,
        compfile = Math.round(Math.random() * 1000000000000000),
        queryfile = '__query_' + compfile + '.js',
        resultfile = '__result_' + compfile + '.json',
        cmd = 'mongo ' + db + ' --quiet < ' + queryfile + ' > ' + resultfile;

    console.log(req.body.whichdb);
    console.log(query);
    fs.writeFile(queryfile, query, function (err) {
        if (err) {
            console.log("Error writeFile:", err);
            return null;
        }
        exec(cmd, function (err, stdout, stderr) {
            if (err) {
                console.log("Error exec:", stderr);
                return null;
            }
            fs.readFile(resultfile, function (err, data) {
                res.render('interface.ejs', { query: req.body.query, result: data, dbs: listDB });
                exec('rm ' + resultfile, function () {});
                // fs.unlinkSync(resultfile);
                exec('rm ' + queryfile, function () {});
            });
        });
    });
});

app.listen(3000, function () {
    "use strict";
    console.log('App listening on port 3000!');
});