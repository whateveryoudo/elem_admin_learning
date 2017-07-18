<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!--表格数据-->
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width:100%">
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
            <!--分页-->
            <div class="Pagination" style="text-align: left;margin-top:10px">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="20"
                layout="total,prev,next,pager"
                :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { getUserCount,getUserList } from '@/api/getData'
    export default{
        data(){
            return {
                tableData : [
                    {
                        registe_time : '2016-05-02',
                        username : '王小虎',
                        city: '上海市普陀区金沙江路 1518 弄'
                    },
                    {
                        registe_time : '2016-05-02',
                        username : '王小虎',
                        city: '上海市普陀区金沙江路 1518 弄'
                    },
                    {
                        registe_time : '2016-05-02',
                        username : '王小虎',
                        city: '上海市普陀区金沙江路 1518 弄'
                    },
                    {
                        registe_time : '2016-05-02',
                        username : '王小虎',
                        city: '上海市普陀区金沙江路 1518 弄'
                    }
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
            }
        }
    }
</script>