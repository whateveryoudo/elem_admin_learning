<template>
    <div>
        <!--<head-top></head-top>-->
        <el-row style="margin-top:20px">
            <el-col :span="14" :offset="4">
                <header class="form_header">选择食品种类</header>
                <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form">
                    <el-row class="category_select">
                        <el-form-item label="食品种类">
                            <el-select v-model="categoryForm.categorySelect" :placeholder="selectValue.label"  style="width:100%">
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
                        <span>添加食品种类</span>
                    </div>
                </el-form>
                <header class="form_header">添加食品</header>
                <el-form :model="foodForm" :rules="foodrules" ref="foodForm" label-width="110px" class="form">
                    <el-form-item label="食品名称" prop="name">
                      <el-input v-model="foodForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="食品活动" prop="activity">
                      <el-input v-model="foodForm.activity"></el-input>
                    </el-form-item>
                  <el-form-item label="食品详情" prop="description">
                    <el-input v-model="foodForm.description"></el-input>
                  </el-form-item>
                  <!-- 食品图片-->
                  <el-form-item label="上传食品图片">
                    <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/food'" :show-file-list="false" :on-success="uploadImg" :before-upload="beforeImgUpload">
                      <img v-if="foodForm.image_path" :src="baseImgPath + foodForm.image_path" alt="" class="avatar"/>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="食品特点">
                      <!--多选 v-model绑定的是数组-->
                    <el-select v-model="foodForm.attributes" multiple placeholder="请选择">
                      <el-option v-for='item in attributes' :value="item.value" :label="item.label" :key="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="食品规格">
                    <el-radio class="radio" v-model="foodSpecs" label="one">单规格</el-radio>
                    <el-radio class="radio" v-model="foodSpecs" label="more">多规格</el-radio>
                  </el-form-item>
                  <el-row v-if="foodSpecs == 'one'">
                    <el-form-item label="包装费" v-if="foodForm.specs.length">
                      <el-input-number  v-model="foodForm.specs[0].packing_fee" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="价格" v-if="foodForm.specs.length">
                      <el-input-number  v-model="foodForm.specs[0].price" :min="0" :max="10000"></el-input-number>
                    </el-form-item>
                  </el-row>
                  <el-row v-else style="overflow: auto;text-align: center">
                    <el-button type="primary" @click="dialogFormVisible = true" style="margin-bottom:10px">添加规格</el-button>
                    <el-table :data="foodForm.specs" style="margin-bottom:20px" :row-class-name="tableRowClassName">
                      <el-table-column prop="specs" label="规格"></el-table-column>
                      <el-table-column prop="packing_fee" label="包装费"></el-table-column>
                      <el-table-column prop="price" label="价格"></el-table-column>
                      <el-table-column label="操作">
                        <template scope="scope">
                          <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-row>
                  <el-form-item>
                    <el-button type="primary" @click="addFood('foodForm')">确认添加食品</el-button>
                  </el-form-item>
                </el-form>
                <!-- 添加规格弹层-->
                <el-dialog title="添加规格" v-model="dialogFormVisible">
                  <el-form :rules="specsFormrules" :model="specsForm">
                    <!-- 这里家prop需要进行验证-->
                    <el-form-item label="规格" label-width="100px" prop="specs">
                      <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="包装费" label-width="100px">
                      <el-input-number v-model="specsForm.packing_fee" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="价格" label-width="100px">
                      <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addspecs">确 定</el-button>
                  </div>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { baseUrl,baseImgPath } from '@/config/env'
    import { getCategory,addCategory,addFood } from '@/api/getData'
    export default{
        data(){
            return {
                baseUrl,
                baseImgPath,
                //食品种类信息
                categoryForm : {
                    categoryList : [],
                    categorySelect : '',
                    name : '',
                    description : ''
                },
                //食品详情
                foodForm : {
                  image_path : '',
                  name : '',
                  description : '',
                    attributes : [],
                  activity : '',
                    specs : [{
                        specs : '默认',
                        packing_fee : 0,
                        price : 20
                    }]
                },
                //规格对象
                specsForm : {
                    specs : '默认',
                    packing_fee : 0,
                    price : 20
                },
                foodSpecs : 'one',
                //属性列表
                attributes: [{
                    value: '新品',
                    label: '新品'
                }, {
                    value: '招牌',
                    label: '招牌'
                }],
                dialogFormVisible : false,
              foodrules : {
                name: [
                  {required : true,message : '请输入食品名称',trigger : 'blur'}
                ]
              },
                specsFormrules : {
                    specs : [
                        {required : true,message : '请输入规格',trigger : 'blur'}
                    ]
                },
                showAddCategory : false,//显示添加添加属性块
                restaurant_id : '',
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
            console.log(this.baseUrl);
            //初始化数据
            this.initData();
        },
    computed : {
      selectValue:function(){//根据选择的optionj计算placeholder
        return this.categoryForm.categoryList[this.categoryForm.categorySelect] || {}
      }
    },
        methods : {
            async initData(){
                try{
                    const res = await getCategory(this.restaurant_id);
                    if(res.status == 1){
                        res.category_list.map((item,index) => {
                            item.value = index;
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
            //删除当前规格
            handleDelete(index){
                this.foodForm.specs.splice(index,1);
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
                          console.log(err)
                        }

                    }else{
                      this.$notify.error({
                        title : '错误',
                        message : "请检查输入是否正确",
                        offset : 100
                      })
                      return false;
                    }
                })
            },
            //添加食品
            addFood(foodForm){
                this.$refs[foodForm].validate(async (valid) => {
                    if(valid){//验证通过(该运算符...将一个数组，变为参数序列。)
                        const params = {
                            ...this.foodForm,
                            category_id : this.selectValue.id,
                            restaurant_id : this.restaurant_id
                        }
                        try{
                            const res = await addFood(params);
                            if(res.status == 1){
                                this.$message({
                                    type : 'success',
                                    message : '添加成功'
                                })
                                //重置表单
                                this.foodForm = {
                                    name : '',
                                    description : '',
                                    image_path : '',
                                    activity : '',
                                    attributes : [],
                                    specs : [
                                        {
                                            sepcs : '默认',
                                            packing_fee : 0,
                                            price : 20
                                        }
                                    ]
                                }
                            }else{
                                this.$message({
                                    type : 'error',
                                    message : res.message
                                })
                            }
                        }catch(err){
                            this.$notify.error({
                                title : '错误',
                                message : '请检查输入是否正确',
                                offset : 100
                            })
                        }
                    }
                })
            },
            //上传图片
            uploadImg(res,file){
                if(res.status == 1){
                  this.foodForm.image_path = res.image_path;
                }else{
                  this.$message({
                    type : 'error',
                    message : "上传图片失败"
                  })
                }
            },
          //  上传图片前判断
          beforeImgUpload(file){
            const isRightType = file.type === 'image/jpg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 /1024 < 2;
            if(!isRightType){
              this.$message.error('上传头像图片只能是 jpg/png 格式!');
            }
            if(!isLt2M){
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isRightType && isLt2M;
          },
            //添加一条规格
            addspecs(){
                this.foodForm.specs.push({...this.specsForm});
                //制空弹窗
                this.specsForm.specs = '';
                this.specsForm.packing_fee = '';
                this.specsForm.price = '';
                this.dialogFormVisible = false;//关闭弹窗
          }
        }
    }
</script>
<style lang="scss">
    @import "src/style/scss/mixin";
    .form_header{
      text-align: center;
      margin-bottom:10px;
    }
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
         .showEdit{
           height:185px;
         }
         .add_category{
           background:#f9fafc;
           padding:10px 30px 0px 10px;
           border:1px solid #eaeefb;
           border-top:none;
         }
         .add_category_button{
           text-align: center;
           line-height:40px;
           border-bottom-left-radius: 6px;
           border-bottom-right-radius: 6px;
           border:1px solid #eaeefb;
           border-top:none;
           transition: all .4s;
            cursor:pointer;
           &:hover{
              background:#f9fafc;
              span,.edit_icon{
                color:#20a0ff;
              }
            }
          span{
            @include sc(14px,#999)
            transition:all .4s;
          }
          .edit_icon{
            color:#ccc;
            transition: all .4s;
          }
         }
    }

</style>
