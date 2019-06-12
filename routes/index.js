const express = require('express')
const { suggestionsController } = require('../controllers')
const router = express.Router()

router.get('/suggestions', suggestionsController.getSuggestion)

module.exports = router
