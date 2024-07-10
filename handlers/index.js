'use strict'

const fs = require('fs')
const uuid = require('uuid')
const unoconv = require('../lib/unoconv')
const formats = require('../lib/data/formats.json')
const pkg = require('../package.json')
const Boom = require('@hapi/boom')

module.exports.handleUpload = request => new Promise((resolve, reject) => {
  const convertToFormat = request.params.format
  const input = request.payload.file

  if (!input) {
    return reject(new Error('No data'))
  }

  const nameArray = input.hapi.filename.split('.')
  const fileEndingOriginal = nameArray.pop()
  const temporaryName = uuid.v4()
  const pathPre = process.cwd() + '/uploads/' + temporaryName
  const fileNameTempOriginal = pathPre + '.' + fileEndingOriginal
  const file = fs.createWriteStream(fileNameTempOriginal)

  file.on('error', error => console.error(error))

  input.pipe(file)

  console.log('File uploaded')

  input.on('end', (err) => {
    if (err) {
      console.error(err)
      reject(new Error(err))
    } else {
      console.log('Start conversion ...')
      unoconv.convert(fileNameTempOriginal, convertToFormat)
        .then(resolve)
        .catch(err => {
          console.error(err)
          const error = Boom.serverUnavailable(err);
          error.reformat();
          reject(error);
        })
        .finally(() => {
          console.info('Done')
          fs.unlink(fileNameTempOriginal, error => {
            error ? console.error(error) : console.log(`${fileNameTempOriginal} deleted`)
          })
        })
    }
  })
})

module.exports.showFormats = () => formats

module.exports.showFormat = request => {
  const params = request.params
  const format = params ? formats[request.params.type] : false
  if (!format) {
    return 'Format type not found'
  } else {
    return format
  }
}

module.exports.showVersions = () => pkg.dependencies
