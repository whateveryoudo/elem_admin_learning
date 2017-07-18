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
            </el-form>
          </el-dialog>
        </div>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { cityGuess,getResturants,getResturantsCount,getCategory,searchplace } from '@/api/getData'
    export default{
        data(){
            return{
                tableData : [],
                city : {},
                count : 0,
                offset : 0,//请求之前的条数
                limit : 20,
              currentPage : 1,
              dialogFormVisible : false,
              selectTable : {},
              categoryOptions : [],//店铺商品分类
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
          handleEdit(index,row){
            this.selectTable = row;
            this.address.address = row.address;
            this.dialogFormVisible = true;
            this.selectedCategory = row.category.split('/');
            if(!this.categoryOptions.length){
              this.getCategory();
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
</style>
