var express = require('express');
var router  = express.Router();

      /* GET HEALTH listing. */
router.get('/', function(req, res, next) {
    if( typeof global.health == 'undefined' ) {
        res.send('OK ');
    }else {
        var err = new Error('Server Issue');
        err.status = 500;
        next(err);
    }
});
module.exports = router;
