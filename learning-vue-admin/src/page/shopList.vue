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
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total,prev,pager,next" :total="count"></el-pagination>
            </div>
          <!-- 编辑弹框-->
          <el-dialog title="修改店铺信息" v-model="dialogFormVisible">
            <el-form :model="selectTable">
              <el-form-item label="店铺名称" label-width="100px">
                <el-input v-model="selectTable.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" label-width="100px">
                <!-- 模糊搜索框-->
                <el-autocomplete v-model="address.address" :fetch-suggestions="querySearchAsync" placeholder="请输入地址" style="width:100%" @select="addressSelect">

                </el-autocomplete>
                <span>当前城市：{{city.name}}</span>
              </el-form-item>
                <el-form-item label="店铺介绍" label-width="100px">
                    <el-input v-model="selectTable.description"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" label-width="100px">
                    <el-input v-model="selectTable.phone"></el-input>
                </el-form-item>
                <el-form-item label="店铺分类" label-width="100px">
                    <!--连级选择器 options数据源 -->
                    <el-cascader :options="categoryOptions" v-model="selectedCategory" change-on-select>

                    </el-cascader>
                </el-form-item>
                <!--图片上传-->
                <el-form-item label="商品图片" label-width="100px">
                    <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/shop'" :show-file-list="false" :on-success="handleServiceAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avatar" alt="">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
              <!--底部操作按钮-->
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="updateShop">确定</el-button>
              </div>

          </el-dialog>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { baseUrl,baseImgPath } from '@/config/env'
    import { cityGuess,getResturants,getResturantsCount,updateResturant,getCategory,searchplace,foodCategory,deleteResturant } from '@/api/getData'
    export default{
        data(){
            return{
                baseUrl,
                baseImgPath,
                tableData : [],
                city : {},
                count : 0,
                offset : 0,//请求之前的条数
                limit : 20,
              currentPage : 1,
              dialogFormVisible : false,
              selectTable : {},
              categoryOptions : [],//店铺分类
              selectedCategory : [],
              address : {}
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
            //添加食品
            addFood(index,row){
                this.$router.push({path : 'addGoods',query : { restaurant_id : row.id}});
            },
            //编辑
          handleEdit(index,row){
            this.selectTable = row;
            this.address.address = row.address;
            this.dialogFormVisible = true;
            this.selectedCategory = row.category.split('/');
            if(!this.categoryOptions.length){
              this.getCategory();
            }
          },
            //删除
          async  handleDelete(index,row){
              try{
                  const res = await deleteResturant(row.id);
                  if(res.status == 1){
                      this.$message({
                          type : "success",
                          message : "删除店铺成功"
                      })
                      this.tableData.splice(index,1);//去除当前项
                  }else{
                      throw new Error(res.message);
                  }
              }catch(err){
                  this.$message({
                      type : "error",
                      message : err.message
                  })
                    console.log("删除店铺失败",err)
              }
            },
          //模糊搜索
          //map与foreach区别
          //foreach没有返回值不对原来数组进行修改，；但是可以自己通过数组的索引来修改原来的数组；
          //map有返回值，可以return 出来。map的回调函数中支持return返回值；return的是啥，相当于把数组中的这一项变为啥（并不影响原来的数组，只是相当于把原数组克隆一份，把克隆的这一份的数组中的对应项改变了）；

            async querySearchAsync(queryString,cb){
              if(queryString){
                try{
                  const cityList = await searchplace(this.city.id,queryString);
                  if(cityList instanceof Array){
                    cityList.map(item => {
                      item.value = item.address;
                      return item;
                    })
                    cb(cityList);
                  }
                }catch(err){
                  console.log(err);
                }
              }
          },
          //选择城市
          addressSelect(value){
            const { address,latitude,longitude } = value;
            this.address = { address,latitude,longitude };
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
            },
            //上传之前回调
            beforeAvatarUpload(file){
                const isRightType = file.type === 'image/jpg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;//小于2m
                if(!isRightType){
                    this.$message.error("上传图片只能为jpg/png格式");
                }
                if(!isLt2M){
                    this.$message.error("上传图片最大为2M");
                }
                return isRightType || isLt2M;
            },
            //上传图片成功回调
            handleServiceAvatarSuccess(res,file){
                if(res.status == 1){
                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error("上传图片失败");
                }
            },
            //获取食品分类
            async getCategory(){//处理店铺分类数据
                try{
                    const categories = await foodCategory();
                    categories.forEach(item => {
                        if(item.sub_categories.length){//无子项
                            const addnew = {
                                value : item.name,
                                label : item.name,
                                children : []
                            }
                            item.sub_categories.forEach((subitem,index) => {
                                if(index == 0){return}//排除全部商品
                                addnew.children.push({
                                    value : subitem.name,
                                    label : subitem.name
                                })
                            })
                            this.categoryOptions.push(addnew);
                        }
                    })
                    console.log(this.categoryOptions);
                }catch(err){
                    console.log('获取商铺种类失败',err);
                }
            },
            handleCurrentChange(){

            },
            handleSizeChange(val){
                console.log(`每页 ${val} 条`);
            },
            //点击确定保存
            async updateShop(){
                this.dialogFormVisible = false;//关闭弹框
                try{
                // 浅拷贝、对象属性的合并
                    Object.assign(this.selectTable,this.address);
                    this.selectTable.category = this.selectedCategory.join("/");//设置选择的店铺与对应商品
                    const res = await updateResturant(this.selectTable);//跟新列表
                    if(res.status == 1){
                        this.$message({
                            type : "success",
                            message : "店铺信息跟新成功"
                        })
                    }else{
                        this.$message({
                            type : "error",
                            message : res.message
                        })
                    }
                }catch(err){
                    console.log("跟新店铺信息失败",err);
                }
            }
        }
    }
</script>
<style lang="scss">
  /*这里为什么不能家scoped*/
  @import "src/style/scss/mixin";
  /*展开列表*/
  /*父级设置防止文本节点间距*/
  .demo-table-expand{
    font-size:0
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item{
    margin-right:0;
    margin-bottom:0;
    width:50%
  }
    /*列表*/
    .table_container{
        padding-top:20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top:8px;
    }
    /*头像上传容器*/
    .avatar-uploader .el-upload{
        border:1px dashed #d9d9d9;
        border-radius:6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover{
        border-color:#20a0ff;
    }
    .avatar-uploader-icon{
        font-size:28px;
        color:#8c939d;
        width:120px;
        height:120px;
        text-align: center;
    }
    .avatar{
        width:120px;
        height:120px;
        display: block;
    }
</style>
