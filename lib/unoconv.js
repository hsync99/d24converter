'use strict'
const _ = require('underscore')
const childProcess = require('child_process')

const unoconv = exports = module.exports = {}

/**
 * Convert a document.
 *
 * @param {String} file
 * @param {String} outputFormat
 * @param {Object|Function} options
 * @api public
 */
unoconv.convert = (file, outputFormat, options = {}) => new Promise((resolve, reject) => {
  let bin = 'unoconvert'
  const stdout = []
  const stderr = []

  const args = [
    '--convert-to', outputFormat
  ]

  if (options && options.port) {
    args.push('--port', options.port)
  }

  args.push(file)

  args.push('-')

  if (options && options.bin) {
    bin = options.bin
  }

  console.info('Run ' + [bin, ...args].join(' '))
  const child = childProcess.spawn(bin, args)

  child.stdout.on('data', function (data) {
    stdout.push(data)
  })

  child.stderr.on('data', function (data) {
    stderr.push(data)
  })

  let i = 0;
  let id = setInterval(function() {
    i++;
    if (i > 15 && !stdout.length) {
      clearInterval(id);
      child.kill();
      childProcess.exec('pkill soffice.bin');
      return reject(new Error('Conversion error: libreoffice stuck'))
    }
  }, 1000);

  child.on('exit', function (code) {
    clearInterval(id);
    if (code) {
      const error = stderr ? Buffer.concat(stderr).toString() : 'Failed' + code
      return reject(new Error(error))
    }

    resolve(Buffer.concat(stdout))
  })
})
