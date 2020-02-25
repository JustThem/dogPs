// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
cloud.init()
//wx84ca45db2e45386c
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://api.remove.bg/v1.0/account',
      headers: {
        'X-Api-Key': event.key
        //
        //UGNDgug4rQ17rstQW2taRbqv
        //iPZG5nJd4YfHKjMh6eBEniY7
      },
      encoding: null
    }, function (error, response, body) {
      if(error){
        reject({error:error})
      }else if (response.statusCode === 200){
        resolve({ body: body})
      }else{
        reject({error:error,statusCode:response.statusCode})
      }
    })
  })
}