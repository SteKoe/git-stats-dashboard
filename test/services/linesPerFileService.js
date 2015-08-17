var LinesPerFileService = require('../../services/linesPerFile');

describe('GitUtils', function () {
    it('should handle concurrent git processes', function (done) {
        LinesPerFileService("https://github.com/SteKoe/git-stats-dashboard");
        LinesPerFileService("https://github.com/SteKoe/git-stats-dashboard")
            .then(function() {
                done();
            })
    });
})