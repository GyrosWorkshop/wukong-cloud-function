'use strict';
var secret = require('./key.json')
const rp = require('request-promise-native')
const Capi = require('qcloudapi-sdk')
const zlib = require('zlib')
const dns = require('dns')

var capi = new Capi({
  SecretId: secret.secretId,
  SecretKey: secret.secretKey,
  serviceType: 'cmq-topic-gz',
  Region: 'gz',
})

/**
 * 
 * @param {request.type} string HTTP or DNS
 * @param {request.msg} 
 *  for HTTP: request parameters https://github.com/request/request#requestoptions-callback
 *  for DNS: hostname
 * @param {request.key} string unique id of current request
 */
export async function process(request) {
  return do {
    if (request.type === 'HTTP') {
      await rp({
        ...request.msg,
        resolveWithFullResponse: true,
      })
    } else {
      await new Promise((resolve, reject) => {
        dns.resolve4(request.msg, (err, addresses) => {
          if (err) return reject(err)
          else return resolve(addresses)
        })
      })
    }
  };
}

exports.main_handler = async (event, context, callback) => {
  const request = JSON.parse(event.Records[0].CMQ.msgBody)
  console.log(request)

  const msg = {
    type: request.type,
    key: request.key,
  }
  try {
    msg.content = await process(request)
  } catch(e) {
    msg.error = e
  }

  const buf = new Buffer(JSON.stringify(msg), 'utf8')
  zlib.deflate(buf, (err, buf) => {
    console.error(err)
    capi.request({
      Action: 'PublishMessage',
      topicName: 'wukong-callback',
      msgBody: buf.toString('base64'),
    }, (err, data) => {
      console.error(err)
      console.log(data)
      callback(err, event)
    })
  })
}
