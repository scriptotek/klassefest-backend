const _ = require('lodash')
const jp = require('jsonpath')

getRecordId = (record, provider) => {
  if (provider === 'lc') {
    return jp.query(record, '$.fields[*]["010"].subfields.*.a').shift() || ''
  }
  return jp.value(record, '$.fields[*]["001"]') || ''
}

processSubjectField = (field) => {
  const vocabMap = {
    '0': 'lcsh',
    '2': 'mesh',
    '7': jp.query(field, '$.subfields.*.2').shift(),
  }

  return {
    type: '650',
    id: jp.query(field, '$.subfields.*.0').shift(),
    vocabulary: vocabMap[_.get(field, 'ind2')],
    value: _.trimEnd(
          jp.value(field, '$.subfields')
          .filter(subfield => ['a', 'b', 'v', 'x', 'y', 'z'].indexOf(_.keys(subfield).shift()) !== -1)
          .map(x => _.values(x).shift())
          .join(' : '),
          '.'
    )
  }
}

getSuggestions = (record) => {
  const fields = _.get(record, 'fields', [])
  return {

    ddc: jp.query(record, '$.fields[*]["082"]')
      .map(field => ({
        type: '082',
        vocabulary: 'ddc23nor',
        value: jp.query(field, '$.subfields.*.a').map(x => x.replace('/', '')).join(''),
        edition: jp.value(field, '$.subfields.*.2'),
        agency: _.get(field, 'ind2') === '0' && 'lc' || jp.value(field, '$.subfields.*.q'),
      })),
    
    subjects: jp.query(record, '$.fields[*]["650"]')
      .map(field => processSubjectField(field)),
    // subjects: _.concat(
    //   _.get(record, 'fields.648', []),
    //   _.get(record, 'fields.650', []),
    //   _.get(record, 'fields.651', []),
    //   _.get(record, 'fields.655', [])
    // ),
  }
}

const processRecord = (record, provider) => {
  return {
    id: getRecordId(record, provider).trim(),
    suggestions: getSuggestions(record),
    record,
  }
}

module.exports = {
  processRecord,
}