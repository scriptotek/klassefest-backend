const zoom = require('node-zoom2');

const providers = {
  'bl': {
    dsn: 'z3950cat.bl.uk:9909/BNB03U',
  },
  'lc': {
    dsn: 'lx2.loc.gov:210/LCDB',
  },
  'libris': {
    dsn: 'z3950.libris.kb.se:210/libr',
  },
  gbv: {
    dsn: 'z3950.gbv.de/gvk'
  }
}

function getConnection(name) {
  if (!providers[name]) {
    throw new Error('Unknown provider name')
  }

  const config = providers[name]
  const connection = zoom.connection(config.dsn)
    .set('preferredRecordSyntax', 'marc21')

  if (config.username) {
    connection.set('user', config.username)
  }
  if (config.password) {
    connection.set('password', config.password)
  }

  return connection
}

function searchByIsbns(connection, isbns) {
  let records = []

  let isbn = isbns[0]  // TODO: Continue checking the other ones if we get no matches on the first one.

	return new Promise((resolve, reject) => {
    connection.query('prefix', '@attr 1=7 ' + isbn)
      .createReadStream()
      .on('data', record => {
        // console.log(record.json, record.xml, record.raw);
        console.log('[Zoom] Received record')
        records.push(record)
      })
      .on('error', err => {
        console.log('[Zoom] errored', err)
        reject(err)
      })
      .on('close', () => {
        console.log('[Zoom] Stream closed')
        if (!records.length) {
          reject(new Error('Record not found'))
        } else {
          resolve(records[0])
        }
      })
  })
}

module.exports = {
  getConnection,
  searchByIsbns
}