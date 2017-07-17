/*
 * @name
 * @param baseUrl 域名地址
 * @param routerMode 路由模式
 * @param baseImgPath 图片存放地址
 * @description 线上环境与测试环境切换
 */
let baseUrl = '';
let routerMode = 'history';
let baseImgPath = 'http://images.cangdu.org/';

if(process.env.NODE_ENV == 'development'){

}else{
    baseUrl = 'http://cangdu.org:8001';
}
export {
    baseUrl,routerMode,baseImgPath
}
