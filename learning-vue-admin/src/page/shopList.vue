<template>
    <div class="fillcontainer">
        <head-top></head-top>
        <!--列表区-->
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width:100%">
                <!--下方展开项-->
                <el-table-column type="expand">
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="店铺名称">
                                <span>{{props.row.name}}</span>
                            </el-form-item>
                            <el-form-item label="店铺地址">
                                <span>{{props.row.address}}</span>
                            </el-form-item>
                            <el-form-item label="店铺介绍">
                                <span>{{props.row.description}}</span>
                            </el-form-item>
                            <el-form-item label="店铺 ID">
                                <span>{{props.row.id}}</span>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <span>{{ props.row.phone }}</span>
                            </el-form-item>
                            <el-form-item label="评分">
                                <span>{{ props.row.rating }}</span>
                            </el-form-item>
                            <el-form-item label="销售量">
                                <span>{{ props.row.recent_order_num }}</span>
                            </el-form-item>
                            <el-form-item label="分类">
                                <span>{{ props.row.category }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <!--主表体-->
                <el-table-column label="店铺名称" prop="address"></el-table-column>
                <el-table-column label="店铺介绍" prop="description"></el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                        <el-button size="mini" type="Success" @click="addFood(scope.$index,scope.row)">添加食品</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="Pagination">
                <el-pagination @size-change="handleSzieChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total,prev,pager,next" :total="count"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { cityGuess,getResturants,getResturantsCount } from '@/api/getData'
    export default{
        data(){
            return{
                tableData : [],
                city : {},
                count : 0,
                offset : 0,//请求之前的条数
                limit : 20
            }
        },
        components : { headTop },
        created(){
            this.initData();
        },
        methods : {
            async initData(){
                try{
                    this.city = await cityGuess();
                    const countData = await getResturantsCount();//获取所有商户数量
                    if(countData.status == 1){
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    //获取商户信息
                    this.getResturants();
                }catch(err){
                    console.log('获取数据失败',err);
                }
            },
            async getResturants(){
                const { latitude,longitude } = this.city;
                const resturants = await getResturants({latitude,longitude,offset : this.offset,limit : this.limit});
                this.tableData = [];
                resturants.forEach(item => {
                    //创建临时店铺数据对象
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.address = item.address;
                    tableData.description = item.description;
                    tableData.id = item.id;
                    tableData.phone = item.phone;
                    tableData.rating = item.rating;
                    tableData.recent_order_num = item.recent_order_num;
                    tableData.category = item.category;
                    tableData.image_path = item.image_path;
                    this.tableData.push(tableData);
                })
            }
        }
    }
</script>