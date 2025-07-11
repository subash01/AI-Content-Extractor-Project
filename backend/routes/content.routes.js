const express = require('express');
const router = express.Router();
const { extractContent } = require('../controller/content.controller');

router.post('/', extractContent);

module.exports = router;