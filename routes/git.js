var express = require('express');
var router = express.Router();
var del = require('del');
var path = require('path');
var Git = require('git-exec');
var fs = require('fs');

module.exports = router;

router.get('/committers/amount', function (req, res, next) {
    var url = req.query.url;

    console.log(req.query);
    if(!url) {
        res.status(404).send('Not Found')
    } else {
        var path = url.replace(/([a-zA-Z]*)\:\/\//, "");
        var targetPath = 'tmp/' + path;
        if(fs.existsSync(targetPath)) {
            asd(new Git(targetPath));
        } else {
            Git.clone(url, targetPath, function (repo) {
                asd(repo);
            });
        }

        function asd(repo) {
            repo.exec('log', ['--pretty=format:"%an"'], function (err, out) {
                var authors = {};
                out.split('\n').forEach(function(author) {
                    if(authors[author]) {
                        authors[author]++;
                    } else {
                        authors[author] = 1;
                    }
                });
                res.send(authors);
            });
        }
    }

});
