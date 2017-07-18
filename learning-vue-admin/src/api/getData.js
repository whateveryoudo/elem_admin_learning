/**
 * Created by lenovo on 2017/7/17.
 * 公共api
 */
import fetch from '@/config/fetch'
//获取用户信息
const getAdminInfo = () => fetch('/admin/info');
//点击登录
const login = data => fetch('/admin/login',data,'POST');
//退出登录
const singout = () => fetch('/admin/singout');
//api请求量
const apiCount = date => fetch('/statis/api/' + date + '/count');
//所有api请求量
const apiAllCount = () => fetch('/statis/api/count');
//用户某天注册量
const userCount = date => fetch('/statis/user/' + date + '/count');
//获取总用户量
const getUserCount = data => fetch('/v1/users/count', data);
//某天的订单数
const orderCount = date => fetch('/statis/order/' + date + '/count');
//总订单量
const getOrderCount = data => fetch('/bos/orders/count', data);
//某天的管理员注册量
const adminDayCount = date => fetch('/statis/admin/' + date + '/count');
//总管理员注册量
const adminCount = () => fetch('/admin/count');
//获取用户列表
const getUserList = data => fetch('/v1/users/list', data);
//获取当前城市信息
const cityGuess = () => fetch('/v1/cities',{
    type : 'guess'
});
//获取店铺信息列表
const getResturants = data => fetch('/shopping/restaurants', data);
//获取店铺总量
const getResturantsCount = () => fetch('/shopping/restaurants/count');
export { getAdminInfo,login,singout,apiCount,apiAllCount,userCount,orderCount,adminDayCount,adminCount,getUserCount,getOrderCount,getUserList,cityGuess,getResturants,getResturantsCount }

