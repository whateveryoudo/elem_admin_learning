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
/**
 * 获取当前店铺种类
 */
const getCategory = restaurant_id => fetch('/shopping/getcategory/' + restaurant_id)
/**
 * 城市框的模糊搜索
 */
const searchplace = (cityid,value) => fetch('/v1/pois',{
  type:'search',
  city_id : cityid,
  keyword : value
})
//获取食品分类
const foodCategory = (latitude,longitude) => fetch('/shopping/v2/restaurant/category')
//跟新店铺列表
const updateResturant = data => fetch('/shopping/updateshop',data,'POST')
//删除当前店铺
const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id,{},'DELETE');
//在当前店铺下添加食品分类
const addCategory = data => fetch('/shopping/addcategory',data,'POST')
//添加食品
const addFood = data => fetch('/shopping/addfood', data, 'POST')
//添加商铺
const addShop = data => fetch('/shopping/addShop', data, 'POST');
export { getAdminInfo,
  login,
  singout,
  apiCount,
  apiAllCount,
  userCount,
  orderCount,
  adminDayCount,
  adminCount,
  getUserCount,getOrderCount,
  getUserList,cityGuess,
  getResturants,
  getResturantsCount,
  getCategory,
  searchplace,
    foodCategory,
    updateResturant,
    deleteResturant,
    addCategory,
    addFood,
    addShop
  }

