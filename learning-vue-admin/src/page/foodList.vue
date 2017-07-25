<!--食品列表-->
<template>
    <div class="fillcontainer">
        <!--<head-top></head-top>-->
        <div class="table_container">
            <el-table :data="foodData" @expand="expand" :expand-row-keys="expandRow" :row-key="row => row.index" element-loading-text="拼命加载中" v-loading.body="loading" style="width:100%">
                <!--展开项-->
                <el-table-column type="expand" >
                    <template scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="食品名称">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="餐馆名称">
                                <span>{{ props.row.restaurant_name }}</span>
                            </el-form-item>
                            <el-form-item label="食品 ID">
                                <span>{{ props.row.item_id }}</span>
                            </el-form-item>
                            <el-form-item label="餐馆 ID">
                                <span>{{ props.row.restaurant_id }}</span>
                            </el-form-item>
                            <el-form-item label="食品介绍">
                                <span>{{ props.row.description }}</span>
                            </el-form-item>
                            <el-form-item label="餐馆地址">
                                <span>{{ props.row.restaurant_address }}</span>
                            </el-form-item>
                            <el-form-item label="食品评分">
                                <span>{{ props.row.rating }}</span>
                            </el-form-item>
                            <el-form-item label="食品分类">
                                <span>{{ props.row.category_name }}</span>
                            </el-form-item>
                            <el-form-item label="月销量">
                                <span>{{ props.row.month_sales }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="食品名称" prop="name"></el-table-column>
                <el-table-column label="食品介绍" prop="description"></el-table-column>
                <el-table-column label="评分" prop="rating"></el-table-column>
                <el-table-column label="操作" width="160">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="Pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total,prev,pager,next" :total="count">

                </el-pagination>
            </div>
            <!--编辑食品弹框-->
            <el-dialog :visible.sync="dialogFormVisible" title="修改食品信息">
                <el-form :model="selectTable" >
                    <el-form-item label="食品名称" label-width="100px">
                        <el-input v-model="selectTable.name"></el-input>
                    </el-form-item>
                    <el-form-item label="食品介绍" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="食品分类" label-width="100px">
                        <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
                            <el-option v-for="item in menuOptions" :key="item.key" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--食品图片-->
                    <el-form-item label="食品图片" label-width="100px">
                        <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/food'" :on-success="handleServiceAvatarSuc" :before-upload="beforeAvatarUpload" :show-file-list="false">
                            <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" alt="食品图片" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <!--规格表格-->
                <el-row style="overflow: hidden;text-align: center">
                    <el-table :data="specs" style="margin-bottom:20px;">
                        <el-table-column prop="specs" label="规格"></el-table-column>
                        <el-table-column prop="packing_fee" label="包装费"></el-table-column>
                        <el-table-column prop="price" label="价格"></el-table-column>
                        <el-table-column  label="操作">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="handleDeleteSpec(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--添加规格按钮-->
                    <el-button type="primary" @click="specsFormVisible = true" style="margin-bottom:10px">添加规格</el-button>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateFood">确 定</el-button>
                </div>
            </el-dialog>
            <!--添加规格弹框-->
            <el-dialog :visible.sync="specsFormVisible" title="添加规格">
                <el-form :model="specsForm" :rules="specsFormrules">
                    <el-form-item label="规格" label-width="100px" prop="specs">
                        <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item  label="包装费" label-width="100px">
                        <el-input-number v-model="specsForm.packing_fee" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="价格" label-width="100px" >
                        <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="specsFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="addspecs">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import {getFoodsCount,getFoods,getResturantDetail,getMenuById,getMenu,updateFood,deleteFood} from "@/api/getData"
    import {baseUrl,baseImgPath} from '@/config/env'
    export default{
        data(){
            return {
                baseUrl,
                baseImgPath,
                foodData : [],
                count : 0,
                offset : 0,
                limit : 20,
                currentPage : 1,
                dialogFormVisible : false,
                specsFormVisible : false,
                selectIndex : null,//选中的项的索引
                menuOptions : [],
                selectMenu : {},//选中的项
                selectTable : {},
                expandRow : [],
                specsForm: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                },//添加规格表单
                //规格验证规则
                specsFormrules: {
                    specs: [
                        { required: true, message: '请输入规格', trigger: 'blur' },
                    ],
                },
                loading: true
            }
        },
        components : { headTop },
        mounted(){

        },
        created(){
            //获取店铺id
            this.restaurant_id = this.$route.query.restaurant_id;
            this.initData();
        },

        computed:{
            specs : function(){//规格列表
                let specs = [];
                if(this.selectTable.specfoods){
                    this.selectTable.specfoods.forEach(item => {
                        specs.push({
                            specs : item.specs_name,
                            packing_fee : item.packing_fee,
                            price : item.price
                        })
                    })
                }
                return specs;
            }
        },
        methods: {
            async initData(){
                try{
                    //获取食品列表总数
                    const res = await getFoodsCount({restaurant_id : this.restaurant_id});
                    if(res.status == 1){
                        this.count = res.count;
                    }else{
                        throw new Error('数据获取失败')
                    }
                    //获取食品列表信息
                    this.getFoods();
                }catch(err){
                    console.log('获取数据失败',err);
                }
            },
            /*
             * @name
             * @param status true代表展开 false代表收起
             * @description 当用户对某一行展开或者关闭的上会触发该事件
             */
            expand(row,status){

                if(status){
                    this.getSelectItemData(row);
                }else{
                    const index = this.expandRow.indexOf(row.index);
                    this.expandRow.splice(index,1);
                }
            },
            //删除当前食品
            async handleDelete(index,row){
                try{
                    const res = await deleteFood(row.item_id);
                    if(res.status == 1){
                        this.$message.succsss("删除食品成功");
                        this.foodData.splice(index,1);
                    }else{
                        throw new Error(res.message);
                    }
                }catch (err){
                    this.$message(err.message);
                    console.log("删除食品失败");
                }
            },
            async getFoods(){
                try{
                    const res = await getFoods({offset : this.offset,limit : this.limit,restaurant_id : this.restaurant_id});
                    //情空数据表
                    this.foodData = [];
                    res.forEach((item,index) => {
                        const foodObj = {};
                        foodObj.name = item.name;
                        foodObj.item_id = item.item_id;
                        foodObj.description = item.description;
                        foodObj.rating = item.rating;
                        foodObj.month_sales = item.month_sales;
                        foodObj.restaurant_id = item.restaurant_id;
                        foodObj.category_id = item.category_id;
                        foodObj.image_path = item.image_path;
                        foodObj.specfoods = item.specfoods;
                        foodObj.index = index;
                        this.foodData.push(foodObj);
                    })
                    this.loading = false;
                }catch (err){
                    console.log("获取数据失败",err)
                }
            },
            handleSizeChange(){},
            //翻页
            handleCurrentChange(val){
                this.offset = (val-1) * this.limit;
                this.getFoods();
            },
            //编辑当前食品
            handleEdit(row){
                this.getSelectItemData(row,'edit');
                this.dialogFormVisible = true;
            },
            //获取选中食品的详情
            async getSelectItemData(row,type){
                const restaurant = await getResturantDetail(row.restaurant_id);//店铺信息
                const category = await getMenuById(row.category_id);//获取分类信息

                //获取选中食品详情(合并参数)
                this.selectTable = {
                    ...row,
                    ...{
                        restaurant_name: restaurant.name,
                        restaurant_address: restaurant.address,
                        category_name: category.name
                    }
                }
                //选中分类
                this.selectMenu = {label : category.name,value : row.category_id};
                //将当前项替换
                this.foodData.splice(row.index,1,{...this.selectTable})//这里展开项会收起来
                this.$nextTick(() => {//确定展开项
                    this.expandRow.push(row.index);
                })
                if(type == 'edit' && this.restaurant_id != row.restaurant_id){
                    this.getMenu();
                }
            },
            //判断上传图片是否符合规则
            beforeAvatarUpload(file){
                const isRightType = file.type === "image/jpg" || file.type === "image/png";
                const isLt2M = file.size / 1024 /1024 < 2;
                if(!isRightType){
                    this.$message.error('上传图片只能为jpg/png格式');
                }
                if(!isLt2M){
                    this.$message.error('上传图片大小不能超过2m');
                }
                return isRightType && isLt2M;
            },
            //上传成功的回调函数
            handleServiceAvatarSuc(res){
                if(res.status == 1){
                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error("上传图片失败");
                }
            },
            //获取分类列表
            async getMenu(){
                try{
                    const menu = await getMenu({restaurant_id : this.selectTable.restaurant_id,allMenu : true});
                    menu.forEach((item,index) => {
                        this.menuOptions.push({
                            label : item.name,
                            value : item.id,
                            index
                        })
                    })
                }catch(err){
                    console.log("获取食品种类失败",err);
                }
            },
            //处理分类选择 index为选中的id值
            handleSelect(index){
                this.selectIndex = index;
                //选择的分类信息
                this.selectMenu = this.menuOptions[index];
            },
            //跟新添加的食品
            async updateFood(){
                this.dialogFormVisible = false;
                try{
                    const subData = {new_category_id : this.selectMenu.value,specs : this.specs}
                    const postData = {...this.selectTable,subData};//请求后台参数
                    const res = await updateFood(postData);
                    if(res.status == 1){
                        this.$message.success("更新食品信息成功");
                        this.getFoods();//重新刷新食品列表
                    }else{
                        this.$message.error(res.message);
                    }
                }catch(err){
                    console.log("跟新餐馆信息失败",err);
                }
            },
            //添加一条规格
            addspecs(){
                this.specs.push({...this.specsForm});//未存入数据库
                //重置规格
                this.specsForm.specs = '';
                this.specsForm.packing_fee = 0;
                this.specsForm.price = 20;
                this.specsFormVisible = false;
            },
            //删除当前规则
            handleDeleteSpec(index){
                this.specs.splice(index,1);
            }
        }
    }
</script>
<style lang="scss">

</style>