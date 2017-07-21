<template>
    <div>
        <head-top></head-top>
        <visitor-pie :pieData="pieData"></visitor-pie>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import visitorPie from '@/components/visitorPie'
    import {getUserCity} from '@/api/getData'
    export default{
        data(){
            return {
                pieData : []
            }
        },
        mounted(){
            this.initData()
        },
        components : { headTop,visitorPie },
        created(){

        },
        methods: {
            async initData(){
                try{
                    const res = await getUserCity();
                    if(res.status == 1){

                        this.pieData = res.user_city;
                    }else{
                        throw new Error(res);
                    }
                }catch(err){
                    console.log("获取用户分布失败",err)
                }
            }
        }
    }
</script>
<style lang="scss">

</style>