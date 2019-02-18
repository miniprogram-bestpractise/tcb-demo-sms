const config = require('./config')
const {
  AppID,
  AppKey,
  Msg
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const {
  SmsClient
} = require('sms-node-sdk');
const smsClient = new SmsClient({ AppID, AppKey })

exports.main = async (event, context) => {
  let {
    nationCode = '86',
    phoneNumber = '',
    prompttype = 2,
    msg = Msg,
    playtimes = 2,
    ext = ''
  } = event

  const wxContext = cloud.getWXContext()

  let response = {
    code: 0,
    data: {},
    message: 'success'
  }

  if (!phoneNumber) {
    response.code = 10001
    response.message = '电话号码不能为空'
    return response
  }

  try {
    let result = await smsClient.init({
      action: 'PromptVoiceSend',
      data: {
        nationCode,
        phoneNumber,
        prompttype,
        msg,
        playtimes,
        ext
      }
    })

    let resData = result.resData
    response.code = resData.result

    if (response.code) {
      response.message = resData.errmsg
    }
  }
  catch (e) {
    response.code = 10002
    response.message = e.message
  }

  return response
}