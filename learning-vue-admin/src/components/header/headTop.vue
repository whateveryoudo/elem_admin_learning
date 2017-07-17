<template>
    <div class="header_container">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path : '/manage'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!--下拉菜单-->
        <el-dropdown menu-align="start" @command="handleCommand">
            <img :src="baseImgPath + adminInfo.avatar" alt="用户头像" class="avatar">
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="singout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
    import { mapState,mapActions } from 'vuex'
    import {singout} from '@/api/getData'
    import {baseImgPath} from '@/config/env'
    export default{
        data(){
            return{
                baseImgPath
            }
        },
        created(){
            if(!this.adminInfo.id){
                this.getAdminData();
            }
        },
        computed : {
            ...mapState([
                'adminInfo'
            ])
        },
        methods : {
            ...mapActions(['getAdminData']),
            async handleCommand(command){
                if(command == 'home'){//点击home
                    this.$router.push('/manage');
                }else if(command == 'singout'){//点击退出登录
                    const res = await singout();
                    if(res.status == 1){
                        this.$message({
                            type : 'success',
                            message : '退出成功'
                        })
                        this.$router.push('/');//回到登录页
                    }else{
                        this.$message({
                            type : 'error',
                            message : res.message
                        })
                    }
                }
            }

        }
    }
</script>
<style lang="scss" scoped>
    @import "src/style/scss/mixin";
    .header_container{
        background-color: #EFF2F7;
        height:60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
    }
    .avatar{
        @include wh(36px,36px)
        border-radius:50%;
        margin-right:37px;
    }
    .el-dropdown-menu__item{
        text-align: center
    }
</style>