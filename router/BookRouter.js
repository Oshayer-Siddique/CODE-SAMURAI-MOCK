const express = require('express')

const router = express.Router();

//const {postaboutpage,getaboutpage} = require('../controller/AboutController');


router.post('/iut-cse/admin/aboutpage',postaboutpage);
router.get('/iut-cse/aboutpage',getaboutpage);


module.exports = router;