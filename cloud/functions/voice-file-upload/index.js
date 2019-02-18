const config = require('./config')
const {
  AppID,
  AppKey
} = config
const cloud = require('wx-server-sdk')
cloud.init()
const {
  SmsClient
} = require('sms-node-sdk');
const smsClient = new SmsClient({ AppID, AppKey })

exports.main = async (event, context) => {
  let {
    fileID = '',
    contentType = 'mp3'
  } = event

  if (!fileID) {
    response.code = 10003
    response.message = 'fileID 不能为空'
    return response
  }

  let response = {
    code: 0,
    data: {},
    message: 'success'
  }

  try {
    let fileResult = await cloud.downloadFile({
      fileID,
    })

    if (fileResult.fileContent) {
      let result = await smsClient.init({
        action: 'VoiceFileUpload',
        data: {
          fileContent: fileResult.fileContent,
          contentType
        }
      })

      let resData = result.resData
      response.code = resData.result

      if (response.code) {
        response.message = resData.errmsg
      }
      else {
        response.data.fid = resData.fid
      }
    }
    else {
      response.code = 10004
      response.message = '获取文件内容失败'
      return response
    }
  }
  catch (e) {
    response.code = 10002
    response.message = e.message
  }

  return response
}