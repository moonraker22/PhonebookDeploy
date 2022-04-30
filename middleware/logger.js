const morgan = require('morgan')

const logger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    '\n',
    `Body: ${JSON.stringify(req.body)}`,
  ].join(' ')
})

module.exports = logger
