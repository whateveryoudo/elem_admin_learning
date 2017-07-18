<!--走势图-->
<template>
    <div class="line1">
        <div id="line1" style="width:90%;height:450px"></div>
    </div>
</template>
<script>
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/toolbox';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/tooltip';
    export default{
        mounted(){
            this.myChart = echarts.init(document.getElementById('line1'));
            this.initData();
        },
        props : ['sevenDate','sevenDay'],
        methods : {//查询api熟悉
            initData(){
                const colors = ['#d14a61', '#5793f3', '#675bba', '#13CE66'];
                const option = {
                    color : colors,
                    title : {
                        text : "走势图",
                        subtext : ''
                    },
                    tooltip : {
                        trigger : 'axis'
                    },
                    legend : {
                        data : ['API请求量','新注册用户','新增订单','新增管理员']
                    },
                    toolbox : {
                        show : true,
                        feature : {
                            dataZoom : {
                                yAxisIndex : 'none',
                            },
                            dataView : {
                                readOnly : false
                            },
                            magicType : {
                                type : ['bar','line']
                            },
                            restore : {}
                        }
                    },
                    //横坐标
                    xAxis : {
                        type : 'category',
                        boundaryGap : false,
                        data : this.sevenDay
                    },
                    //纵坐标
                    yAxis : [
                        {
                            type: 'value',
                            name: 'API请求量',
                            min: 0,
                            max: 200000,
                            position: 'left',
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                        {
                            type: 'value',
                            name: '用户、订单',
                            min: 0,
                            max: 400,
                            position: 'right',
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            axisLabel: {
                                formatter: '{value}'
                            }
                        },
                    ],
                    //当前值(坐标线)
                    series : [
                        {
                            name:'API请求量',
                            type:'line',
                            data:this.sevenDate[0],
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'新注册用户',
                            type:'line',
                            data:this.sevenDate[1],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'新增订单',
                            type:'line',
                            data:this.sevenDate[2],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        },
                        {
                            name:'新增管理员',
                            type:'line',
                            data:this.sevenDate[3],
                            yAxisIndex: 1,
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                        }
                    ]
                }
                this.myChart.setOption(option);
            }
        },
        watch : {
            sevenDate : function(){
                this.initData();
            },
            sevenDay : function(){
                this.initData();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "src/style/scss/mixin";
    .line1{
        display: flex;
        justify-content: center;
    }
</style>