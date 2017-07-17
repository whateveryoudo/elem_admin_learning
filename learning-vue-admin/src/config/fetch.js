/**
 * @fileName : fetch.js
 * @author : ykx
 * @createTime : 2017/7/17
 * @desc : 网络请求
 */
import { baseUrl } from './env'
export  default async(url = '',data = {},type = 'GET',method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;
    //配置get请求完成Url
    if(type == 'GET'){
        let dataStr = '';
        Object.keys(data).forEach(key => {
            dataStr += key + "=" + data[key] + "&";
        })

        if(dataStr !== ''){
            dataStr = dataStr.substr(0,dataStr.lastIndexOf("&"));
            url += "?" + dataStr;
        }
    }

    if(window.fetch && method == 'fetch'){
        let requestConfig = {
            credentials: 'include',
            method : type,
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode : "cors",
            cache : "force-cache"
        }

        if(type == 'POST'){
            Object.defineProperty(requestConfig,'body',{ value : JSON.stringify(data)})
        }

        try{
            const response = await fetch(url,requestConfig);
            const responseJson = await response.json();
            return responseJson;
        }catch(error){
            throw new Error(error);
        }
    }else{
        return new Promise((resolve,reject) => {
            let requestObj = {};
            if(window.XMLHttpRequest){
                requestObj = new XMLHttpRequest()
            }else{
                requestObj = new ActiveXObject();
            }
            let sendData = '';
            if(type == 'POST'){
                sendData = JSON.stringify(data);
            }

            requestObj.open(type,url,true);
            requestObj.setRequestHeader('Content-type','application/x-www-form-urlencoded')
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if(requestObj.readyState == 4){
                    if(requestObj.status == 200){//相应成功
                        let obj = requestObj.response;
                        if(typeof obj !== 'object'){
                            obj = JSON.parse(obj);
                        }
                        resolve(obj);//成功回调处理
                    }else{
                        reject(requestObj)//失败处理
                    }
                }
            }
        })
    }
}