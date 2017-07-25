<template>
    <div class="fillcontain">
        <!--<head-top></head-top>-->
        <!--工具条搜索-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="initData">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addUser">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--表格数据-->
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                element-loading-text="拼命加载中" v-loading.body="loading"
                style="width:100%"
                @selection-change="selChange">
                <!--多选列-->
                <el-table-column type="selection" width="55">

                </el-table-column>
                <el-table-column type="index" width="100">

                </el-table-column>
                <el-table-column
                property="registe_time"
                label="注册日期"
                width="220"></el-table-column>
                <el-table-column
                property="username"
                label="用户姓名"
                width="220"></el-table-column>
                <el-table-column
                property="city"
                label="注册地址"
                ></el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length == 0">批量删除</el-button>
                <!--分页-->
                <div class="Pagination" style="text-align: left;float:right;margin-top:10px" >
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="20"
                            layout="total,prev,next,pager"
                            :total="count">
                    </el-pagination>
                </div>
            </el-col>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { getUserCount,getUserList } from '@/api/getData'
    export default{
        data(){
            return {
                filters : {
                    name : ''
                },
                //批量删除选择列表
                sels : [],
                loading : true,
                tableData : [
//                    {
//                        registe_time : '2016-05-02',
//                        username : '王小虎',
//                        city: '上海市普陀区金沙江路 1518 弄'
//                    },
//                    {
//                        registe_time : '2016-05-02',
//                        username : '王小虎',
//                        city: '上海市普陀区金沙江路 1518 弄'
//                    },
//                    {
//                        registe_time : '2016-05-02',
//                        username : '王小虎',
//                        city: '上海市普陀区金沙江路 1518 弄'
//                    },
//                    {
//                        registe_time : '2016-05-02',
//                        username : '王小虎',
//                        city: '上海市普陀区金沙江路 1518 弄'
//                    }
                ],//表格数据
                count : 0,
                offset : 0,
                limit : 20,
                currentPage : 1
            }
        },
        created(){
            this.initData();
        },
        components : { headTop },
        methods: {
            async initData(){
                try{
                    const countData = await getUserCount();
                    if(countData.status == 1){
                        this.count = countData.count;
                    }else{
                        throw new Error("获取数据失败")
                    }
                    this.getUsers();
                }catch (err){
                    console.log('获取数据失败',err);
                }
            },
            //新增用户
            addUser(){

            },
            //分页事件
            handleSizeChange(val){
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.getUsers();
            },
            async getUsers(){
                const Users = await getUserList({offset : this.offset,limit : this.limit})
                this.tableData = [];
                Users.forEach(item => {
                    const tableData = {};
                    tableData.username = item.username;
                    tableData.registe_time = item.registe_time;
                    tableData.city = item.city;
                    this.tableData.push(tableData);
                })
                this.loading = false;
            },
            //多/单项选择
            selChange(sels){//返回选中行的数据(数组格式)
                this.sels = sels;
            },
            //批量删除
            batchRemove(){
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm("确定要删除选中的记录吗？",'提示', {type : 'warning'
                }).then(() => {
                    this.loading = true;
                    //这里去发送请求删除
                })
            }
        }
    }
</script>