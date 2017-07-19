<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top:20px">
            <el-col :span="14" :offset="4">
                <header class="form_header">选择食品种类</header>
                <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form">
                    <el-row class="category_select">
                        <el-form-item label="食品种类">
                            <el-select v-model="categoryForm.categorySelect"  style="width:100%">
                                <el-option v-for="item in categoryForm.categoryList" :key="item.value" :label="item.label" :value='item.value'></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row class="add_category_row" :class="showAddCategory ? 'showEdit' : ''">
                        <div class="add_category">
                            <el-form-item label="食品种类" prop="name">
                                <el-input v-model="categoryForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="种类描述" prop="description">
                                <el-input v-model="categoryForm.description"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitcategoryForm('categoryForm')">提交</el-button>
                            </el-form-item>
                        </div>
                    </el-row>
                    <!--底部toggle块的箭头-->
                    <div class="add_category_button" @click="addCategoryFun">
                        <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i>
                        <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
                    </div>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { getCategory,addCategory } from '@/api/getData'
    export default{
        data(){
            return {
                categoryForm : {
                    categoryList : [],
                    categorySelect : ''
                },
                showAddCategory : true,//显示添加添加属性块
                restaurant_id : '',
                name : '',
                description : ''
            }
        },
        mounted(){

        },
        components : { headTop },
        created(){
            if(this.$route.query.restaurant_id){
                this.restaurant_id = this.$route.query.restaurant_id;
            }else{
                this.restaurant_id = Math.ceil(Math.random() * 10);
                this.$msgbox({
                    title : "提示",
                    message : "添加食品需要选择一个商铺,现在就去选择商铺吗？",
                    showCancelButton : true,
                    confirmButtonText : "确定",
                    cancelButtonText : '取消',
                    beforeClose : (action, instance, done) => {
                        if(action == 'confirm'){
                            this.$router.push('/shopList')
                            done();
                        }else{
                            this.$message({
                                type : "info",
                                message : '取消'
                            })
                            done();
                        }
                    }
                })
            }
            //初始化数据
            this.initData();
        },
        methods : {
            async initData(){
                try{
                    const res = await getCategory(this.restaurant_id);
                    if(res.status == 1){
                        res.category_list.map((item,index) => {
                            item.index = index;
                            item.label = item.name
                        })
                        this.categoryForm.categoryList = res.category_list;
                    }else{
                        console.log("获取食品分类失败")
                    }
                }catch(err){
                    console.log(err);
                }
            },
            //控制属性显示切换
            addCategoryFun(){
                this.showAddCategory = !this.showAddCategory;
            },
            submitcategoryForm(categoryForm){//refs的name
                this.$refs[categoryForm].validate(async (valid) => {
                    if(valid){
                        const params = {
                            name : this.categoryForm.name,
                            description : this.categoryForm.description,
                            restaurant_id : this.restaurant_id
                        }
                        try{
                            const res = await addCategory(params);
                            if(res.status == 1){
                                //重新刷新列表
                                this.initData();
                                //重置表单
                                this.categoryForm.name = ''
                                this.categoryForm.description = ''
                                this.showAddCategory = false;
                                //提示
                                this.$message({
                                    type : 'success',
                                    message : '添加成功'
                                })
                            }
                        }catch(err){

                        }

                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    @import "src/style/scss/mixin";
    .form{
        min-width: 400px;
        margin-bottom:30px;
        &:hover{
            box-shadow: 0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);
            border-radius: 6px;
            transition: all .4s;
         }
         /*下拉选择对应食物*/
         .category_select{
             border:1px solid #eaeefb;
             padding:10px 30px 10px 10px;
             border-top-right-radius : 6px;
             border-top-left-radius : 6px;
         }
         .add_category_row{
             height:0;
             overflow: hidden;
             transition: all .4s;
             background-color: #f9fafc;
         }
    }

</style>