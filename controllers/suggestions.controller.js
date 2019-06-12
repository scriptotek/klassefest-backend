const { zoomService, recordService } = require('../services')
// const { marcService } = require('../services')

const getSuggestion = async (req, res, next) => {
  const {isbns, provider} = req.query  // params?
  try {
    console.log('Provider:' + provider)
    const conn = zoomService.getConnection(provider)
    const record = await zoomService.searchByIsbns(conn, isbns.split(','))
    const processed = recordService.processRecord(record.json, provider)
    // let parsed = await marcService.simplify(body)
    // other service call (or same service, different function can go here)
    // i.e. - await generateBlogpostPreview()
    res.json(processed)
    next()
  } catch(error) {
    if (!error || !error.message) {
      res.sendStatus(500)
    } else {
      console.log(error.message)
      res.status(500).json({
        error: error.message
      })  
    }
    next(error)  // Need this?
  }
}

module.exports = {
  getSuggestion
}