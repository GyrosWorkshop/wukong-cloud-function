'use strict';
var secret = require('./key.json')
var request = require('request')
var Capi = require('qcloudapi-sdk')

var capi = new Capi({
    SecretId: secret.secretId,
    SecretKey: secret.secretKey,
    serviceType: 'cmq-topic-gz',
    Region: 'gz'
})

exports.main_handler = (event, context, callback) => {
    const options = JSON.parse(event.Records[0].CMQ.msgBody)
    console.log(options)
    request(options.msg, (err, res) => {
        console.error(err)
        try {
            capi.request({
                Action: 'PublishMessage',
                topicName: 'wukong-callback',
                msgBody: JSON.stringify({
                    key: options.key,
                    content: res,
                    error: err
                }),
            }, (err, data) => {
                console.error(err)
                console.log(data)
                callback(err, event)
            })
        } catch (e) {
            console.error(e)
            callback(e)
        }
    })
}
