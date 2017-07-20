// import { Message } from 'element-ui';
//通用自定义验证规则
const validator = {
    phone(rule, value, callback){
        if(!/^1[3|4|5|8][0-9]\d{4,8}$/.test(value)){
            // Message({
            //     type : 'error',
            //     message : '手机号输入错误'
            // })
            callback(new Error('手机号输入错误'));
        }else{
            callback();
        }
    }
}

export { validator }
