<template>
    <div class="manage_page fillcontain">
        <el-row style="height:100%">
            <!--顶部折叠与用户信息-->
            <el-col :span="24" class="header">
                <el-col :span="4" class="logo" :class="isCollapse ? 'logo-collapse-width' : 'logo-width'">
                    {{isCollapse ? '' : systemName}}
                </el-col>
                <el-col :span="10">
                    <div class="tools" @click.prevent="collapse">
                        <i class="fa fa-align-justify"></i>
                    </div>
                </el-col>
                <el-col :span="4" class="userinfo">
                    <!--下拉菜单-->
                    <el-dropdown menu-align="start" @command="handleCommand">

                        <span><img :src="baseImgPath + adminInfo.avatar" alt="用户头像" class="avatar">{{adminInfo.userName}}</span>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="home">首页</el-dropdown-item>
                            <el-dropdown-item command="singout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-col>
            <!--下方的内容区-->
            <el-col :span="24" class="main">
                <aside :class="isCollapse ? 'menu-collapsed' : 'menu-expanded'">
                    <!--左边菜单项-->
                    <!--:default-active当前激活的index unique-opened值允许一个项展开  isCollapse是否开启折叠模式-->
                    <!--动态生成-->
                    <el-menu :default-active="defaultActive" v-show="!isCollapse" unique-opened style="min-height: 100%" theme="light" router>
                        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                            <!--index转为字符串-->
                            <el-submenu :index="index + ''" v-if="!item.leaf">
                                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                                    {{child.name}}
                                </el-menu-item>
                            </el-submenu>
                            <!--只有一个子节点时-->
                            <el-menu-item v-if="item.leaf && item.children.length > 0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
                        </template>
                    </el-menu>
                    <!--<el-menu :default-active="defaultActive" v-show="!isCollapse" unique-opened style="min-height: 100%" theme="light" router>-->
                    <!--<el-menu-item index="manage">-->
                    <!--<i class="el-icon-menu"></i>首页-->
                    <!--</el-menu-item>-->
                    <!--<el-submenu index="2">-->
                    <!--<template slot="title"><i class="el-icon-document"></i>数据管理</template>-->
                    <!--<el-menu-item index="userList">用户列表</el-menu-item>-->
                    <!--<el-menu-item index="shopList">商家列表</el-menu-item>-->
                    <!--<el-menu-item index="foodList">食品列表</el-menu-item>-->
                    <!--<el-menu-item index="orderList">订单列表</el-menu-item>-->
                    <!--<el-menu-item index="adminList">管理员列表</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="3">-->
                    <!--<template slot="title"><i class="el-icon-plus"></i>添加数据</template>-->
                    <!--<el-menu-item index="addShops">添加店铺</el-menu-item>-->
                    <!--<el-menu-item index="addGoods">添加商品</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="4">-->
                    <!--<template slot="title"><i class="el-icon-edit"></i>编辑</template>-->
                    <!--<el-menu-item index="vueEdit">文本编辑</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="5">-->
                    <!--<template slot="title"><i class="el-icon-setting"></i>设置</template>-->
                    <!--<el-menu-item index="adminSet">管理员管理</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="6">-->
                    <!--<template slot="title"><i class="el-icon-warning"></i>说明</template>-->
                    <!--<el-menu-item index="explain">说明</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--<el-submenu index="7">-->
                    <!--<template slot="title"><i class="el-icon-star-on"></i>图表</template>-->
                    <!--<el-menu-item index="visitor">用户分布</el-menu-item>-->
                    <!--</el-submenu>-->
                    <!--</el-menu>-->
                    <!--折叠状态-->
                    <ul class="el-menu el-menu-vertical-demo collapsed" v-show="isCollapse" ref="menuCollapsed">
                        <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
                            <template v-if="!item.leaf">
                                <!--一级标题文字-->
                                <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                    <i :class="item.iconCls"></i>
                                </div>
                                <!--二级列表-->
                                <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                    <li v-for="child in item.children" v-if="!child.hidden"  :key="child.path" class="el-menu-item" :class="$route.path == child.path ? 'is-active' : ''" @click="$router.push(child.path)">
                                        {{child.name}}
                                    </li>
                                </ul>
                            </template>
                            <!--单个子节点-->
                            <template v-else>
                                <li class="el-submenu">
                                    <div class="el-submenu__title el-menu-item" style="height: 56px;line-height: 56px;padding: 0 20px;" :class="item.children[0].path == $route.path ? 'is-active' : ''"><i :class="item.iconCls" :key="item.children[0].path" @click="$router.push(item.children[0].path)"></i>{{item.name}}</div>
                                </li>
                            </template>
                        </li>
                    </ul>
                </aside>
                <section class="content-container">
                    <div class="grid-content bg-purple-light">
                        <el-col :span="24" class="breadcrumb-container">
                            <strong class="title">{{$route.name}}</strong>
                            <el-breadcrumb separator="/" class="breadcrumb-inner">
                                <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                    {{item.name}}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </el-col>
                        <!--表格内容体-->
                        <el-col :span="24" class="content-wrapper">
                            <keep-alive>
                                <router-view></router-view>
                            </keep-alive>
                        </el-col>
                    </div>
                </section>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import { mapState,mapActions } from 'vuex'
    import {singout} from '@/api/getData'
    import {baseImgPath} from '@/config/env'
    export default{
        data(){
            return {
                isCollapse : false,
                systemName : 'ELEMSYS',
                baseImgPath
            }
        },
        computed : {
            defaultActive : function(){
                return this.$route.path;
            },
            ...mapState([
                'adminInfo'
            ])
        },
        created(){
            if(!this.adminInfo.id){
                this.getAdminData();
            }
        },
        methods : {
            ...mapActions(['getAdminData']),
            collapse(){
                this.isCollapse = !this.isCollapse;
            },
            //控制折叠后菜单显示(status控制显示隐藏)
            showMenu(i,status){
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display = status ? 'block' : 'none';
            },
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
<style lang="scss">
    @import "src/style/scss/mixin";
    .fillcontain .header{
        height:60px;
        line-height: 60px;
        background-color:#20a0ff;;
        color:#fff;
        .logo{
            width:60px;
            padding:0 20px;
            border-right:1px solid rgba(238, 241, 146, 0.3);
        }
        .logo-width{
            width:230px;
        }
        .tools{
            padding:0 23px;
            height:60px;
            line-height: 60px;
            width:16px;
            cursor: pointer;
        }
        .userinfo{
            text-align: right;
            float: right;
            span{
                color:#fff;
                cursor: pointer;
            }
        }
        /*头像*/
        .avatar{
            @include wh(36px,36px)
            border-radius:50%;
            margin:10px 37px 10px 10px;
            float: right;
        }
    }
    .menu-collapsed{
        flex : 0 0 60px;
        width:60px;
    }
    .menu-expanded{
        flex:0 0 230px;
        width:230px;
    }
    .main{
        display: flex;
        aside{
            width:230px;
            .collapsed{
                width:60px;
                .item{
                    position:relative;
                }
                .submenu{
                    display: none;
                    top:0;
                    left:60px;
                    z-index:9999;
                    height:auto;
                    position: absolute;
                }
            }
        }
    }
    .content-container{
        flex:1;
        padding:20px;
        .breadcrumb-container{
            .title{
                width:200px;
                float: left;
                color:#475669;
            }
            .breadcrumb-inner{
                float: right;
            }
        }
    }
</style>