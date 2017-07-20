<template>
    <div>
        <head-top></head-top>
        <el-row>
            <el-col :span="14" :offset="4">
                <el-form :model="shopForm" ref="shopForm" :rules="shopFormrules" label-width="110px" class="form">
                    <el-form-item label="店铺名称" prop="name">
                        <el-input v-model="shopForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address" >
                        <el-autocomplete v-model="shopForm.address" style="width:100%" :fetch-suggestions="querySearchAsync" placeholder="请输入详细地址" @select="handleSelect"></el-autocomplete>
                        <span>当前城市：{{city.name}}</span>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="shopForm.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺简介">
                        <el-input v-model="shopForm.description"></el-input>
                    </el-form-item>
                    <el-form-item label="店铺标语">
                        <el-input v-model="shopForm.slogan"></el-input>
                    </el-form-item>
                    <!--联级选择-->
                    <el-form-item label="店铺分类">
                       <el-cascader :options="categoryOptions" v-model="selectCategory" change-on-select>
                       </el-cascader>
                    </el-form-item>
                    <!--店铺特点-->
                    <el-form-item label="店铺特点" style="white-space: nowrap">
                        <div class="feature_item">
                            <span>品牌保证</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isBrandInsure"></el-switch>
                        </div>
                        <div class="feature_item">
                            <span>蜂鸟专送</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isFNsend"></el-switch>
                        </div>
                        <div class="feature_item">
                            <span>新开店铺</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isNewShop"></el-switch>
                        </div>
                    </el-form-item>
                    <el-form-item style="white-space: nowrap">
                        <div class="feature_item">
                            <span>外卖保</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isInsure"></el-switch>
                        </div>
                        <div class="feature_item">
                            <span>准时达</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isAttime"></el-switch>
                        </div>
                        <div class="feature_item">
                            <span>开发票</span>
                            <el-switch on-text="" off-text="" v-model="shopForm.isInvoice"></el-switch>
                        </div>
                    </el-form-item>
                    <!--配送费-->
                    <el-form-item label="配送费" prop="packing_fee">
                        <el-input-number :min="0" :max="20" v-model="shopForm.packing_fee">

                        </el-input-number>
                    </el-form-item>
                    <!--起送价-->
                    <el-form-item label="起送价" prop="lowest_price">
                        <el-input-number :min="0" :max="100" v-model="shopForm.lowest_price">

                        </el-input-number>
                    </el-form-item>
                    <!--营业时间-->
                    <el-form-item label="营业时间">
                        <el-time-select placeholder="起始时间" v-model="shopForm.startTime" :picker-options="{start : '05:00',step:'00:15',end:'23:00'}"></el-time-select>
                        <el-time-select placeholder="结束时间" v-model="shopForm.endTime" :picker-options="{start : '05:00',step:'00:15',end:'23:00',minTime : shopForm.startTime}"></el-time-select>
                    </el-form-item>
                    <!--上传图片组-->
                    <el-form-item class="upload_container" label="证件列表">
                        <ul>
                            <li class="upload_item">
                                <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/shop'" :on-success="handleShopAvatarSuc" :show-file-list="false" :before-upload="beforeAvatarUpload">
                                    <img v-if="shopForm.image_path" :src="baseImgPath + shopForm.image_path" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <p>上传店铺头像</p>
                            </li>
                            <li class="upload_item">
                                <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/shop'" :on-success="handleBusinessAvatarSuc" :show-file-list="false" :before-upload="beforeAvatarUpload">
                                    <img v-if="shopForm.business_license_image" :src="baseImgPath + shopForm.business_license_image" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <p>上传营业执照</p>
                            </li>
                            <li class="upload_item">
                                <el-upload class="avatar-uploader" :action="baseUrl + '/v1/addimg/shop'" :on-success="handleServiceAvatarSuc" :show-file-list="false" :before-upload="beforeAvatarUpload">
                                    <img v-if="shopForm.catering_service_license_image" :src="baseImgPath + shopForm.catering_service_license_image" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                                <p>上传餐饮服务许可证</p>
                            </li>
                        </ul>
                    </el-form-item>
                    <!--优惠活动-->
                    <el-form-item label="优惠活动">
                        <el-select v-model="activityValue" @change="selectActivity" :placeholder="activityValue">
                            <el-option v-for="item in activityOptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--活动列表-->
                    <el-table :data="activities" align="center" style='min-width:600px;margin-bottom:20px;'>
                        <el-table-column prop="icon_name" label="活动标题" align="center" width="120">

                        </el-table-column>
                        <el-table-column prop="name" label="活动名称" align="center" width="120">

                        </el-table-column>
                        <el-table-column prop="description" label="活动详情" align="center">

                        </el-table-column>
                        <!--通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据-->
                        <el-table-column label="操作" width="120px">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--底部提交按钮-->
                    <el-form-item class="button_submit">
                        <el-button type="primary" @click="submitForm('shopForm')">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import headTop from '@/components/header/headTop'
    import { baseUrl,baseImgPath } from '@/config/env'
    import { searchplace,cityGuess,foodCategory,addShop } from '@/api/getData'
    import { validator } from '@/config/verifyRules'
    export default{
        data(){
            return {
                baseUrl,
                baseImgPath,
                //自定义验证规则
                shopForm : {
                    name : '',
                    address : '',
                    latitude : '',
                    longitude : '',
                    isBrandInsure : true,
                    isFNsend : true,
                    isNewShop : true,
                    isInsure : true,
                    isAttime : true,
                    isInvoice : true,
                    packing_fee : 5,
                    lowest_price : 20,
                    startTime : '',
                    endTime : '',
                    //图片
                    image_path : '',//用户头像
                    business_license_image : '',//营业执照
                    catering_service_license_image : ''//上传餐饮服务许可证
                },
                shopFormrules : {
                    name : [
                        {required : true,message : '请输入店铺名称'}
                    ],
                    address : [
                        {required : true,message : '请输入详细地址'}
                    ],
                    phone : [
                        {required : true,message : '请输入手机号'},
                        {validator : validator.phone,trigger:'blur'}
                    ]
                },
                city : {},
                categoryOptions : [],//分类项
                selectCategory : ['快餐便当','简餐'],//联级默认选中项
                //活动项(死值)
                activityOptions : [
                    {value : '满减优惠',label : '满减优惠'},
                    {value : '优惠大酬宾',label : '优惠大酬宾'},
                    {value : '新用户立减',label : '新用户立减'},
                    {value : '进店领券',label : '进店领券'}
                ],
                //默认选中活动
                activityValue : '满减优惠',
                activities : [
                    {
                        icon_name: '减',
                        name: '满减优惠',
                        description: '满30减5，满60减8'
                    }
                ],
            }
        },
        mounted(){

        },
        components : { headTop },
        created(){
            this.initData();
        },
        methods: {
            //初始化数据
            async initData(){
                try{
                    this.city = await cityGuess();//获取当前城市
                    //初始化店铺分类二级菜单
                    const categories = await foodCategory();

                    categories.forEach(item => {
                        if(item.sub_categories.length){
                            const addNew = {
                                value : item.name,
                                label : item.name,
                                children : []
                            }
                            item.sub_categories.forEach((item,index) => {
                                if(index == 0){return}
                                addNew.children.push({
                                    value : item.name,
                                    label : item.name
                                })
                            })
                            this.categoryOptions.push(addNew);
                        }
                    })

                }catch(err){
                    console.log(err);
                }
            },
            //模糊搜索
            async querySearchAsync(queryStr,cb){
                if(queryStr){
                    try{
                        const cityList = await searchplace(this.city.id,queryStr);
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
            handleSelect(address){//设置选中地址的经纬度
                this.shopForm.latitude = address.latitude;
                this.shopForm.longitude = address.longitude;
            },
            //上传前判断是否符合规则
            beforeAvatarUpload(file){
                const isRightType = file.type === 'image/jpg' || file.type == 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if(!isRightType){
                    this.$message.error("仅支持jpg/png格式图片");
                }
                if(!isLt2M){
                    this.$message.error('图片大小不超过2m');
                }
                return isRightType && isLt2M;
            },
            //上传图片成功
            handleShopAvatarSuc(res,file){
                if(res.status == 1){
                    this.shopForm.image_path = res.image_path;
                }else{
                    this.$message.error("图片上传失败");
                }
            },
            handleBusinessAvatarSuc(res,file){
                if(res.status == 1){
                    this.shopForm.business_license_image = res.image_path;
                }else{
                    this.$message.error("图片上传失败");
                }
            },
            handleServiceAvatarSuc(res,file){
                if(res.status == 1){
                    this.shopForm.catering_service_license_image = res.image_path;
                }else{
                    this.$message.error("图片上传失败");
                }
            },
            //删除当前活动
            handleDelete(index){
                this.activities.splice(index,1);
            },
            //提交添加店铺
            submitForm(formName){
                this.$refs[formName].validate(async (valid) => {
                    if(valid){
                        Object.assign(this.shopData,{activities : this.activities},{
                            category : this.selectCategory.join('/')
                        });//整合请求参数
                        try{
                            let res = await addShop(this.shopData);
                            if(res.status == 1){
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                                //重置表单
                                this.shopForm = {
                                        name : '',
                                        address : '',
                                        latitude : '',
                                        longitude : '',
                                        isBrandInsure : true,
                                        isFNsend : true,
                                        isNewShop : true,
                                        isInsure : true,
                                        isAttime : true,
                                        isInvoice : true,
                                        packing_fee : 5,
                                        lowest_price : 20,
                                        startTime : '',
                                        endTime : '',
                                        //图片
                                        image_path : '',//用户头像
                                        business_license_image : '',//营业执照
                                        catering_service_license_image : ''//上传餐饮服务许可证
                                    };
                                    this.selectCategory = ['快餐便当','简餐'],//联级默认选中项

                                    this.activities = [
                                        {
                                            icon_name: '减',
                                            name: '满减优惠',
                                            description: '满30减5，满60减8'
                                        }
                                    ]
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                });
                            }
                        }catch(err){
                            console.log(err)
                        }
                    }else{
                        this.$notify.error({
                            title : "错误",
                            message : '请检查输入是否正确',
                            offset : 100
                        })
                    }
                })
            },
            //选择活动(提醒用户输入活动对应的详情)
            selectActivity(){
                this.$prompt('请输入活动详情','提示',{
                    confirmButtonText : '确定',
                    cancelButtonText : '取消'
                }).then(({value}) => {//取到输入框的值
                    if(value == null){
                        this.$message({
                            type : 'info',
                            message : '请输入活动详情'
                        })
                        return;
                    }
                    let newObj = {};
                    switch(this.activityValue){//判断活动类型,组装table内容
                        case "满减优惠":
                            newObj = {
                                icon_name : '减',
                                name : '满减优惠',
                                descript : value
                            }
                            break;
                        case "优惠大酬宾":
                            newObj = {
                                icon_name : '特',
                                name : '优惠大酬宾',
                                descript : value
                            }
                            break;
                        case "新用户立减":
                            newObj = {
                                icon_name : '新',
                                name : '新用户立减',
                                descript : value
                            }
                            break;
                        case "进店领券":
                            newObj = {
                                icon_name : '领',
                                name : '进店领券',
                                descript : value
                            }
                            break;
                    }
                    this.activities.push(newObj);//列表数据
                })
            }
        }
    }
</script>
<style lang="scss">
    @import "src/style/scss/mixin";
    .el-row{
        margin-top:20px;
        .feature_item{
            display: inline-block;
            margin-right: 10px;
        }
        .upload_container ul{

            @include fj('flex-start');
            li.upload_item{
                margin-right:30px;
                p{
                    text-align: center;
                }
            }
        }
    }
</style>