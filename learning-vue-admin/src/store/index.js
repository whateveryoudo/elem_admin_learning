import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
    adminInfo : {
        avatar: 'default.jpg'
    }
}
const mutations = {
    saveAdminInfo(state,adminInfo){
        state.adminInfo = adminInfo;
    }
}
//用于提交mutations
const actions = {
    async getAdminData({commit}){
        try {
            const res = await getAdminInfo();

            if(res.status == 1){
                commit('saveAdminInfo',res.data);
            }else{
                throw new Error(res);
            }
        }catch(error){
            console.log('您尚未登陆或者session失效')
        }
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions
})