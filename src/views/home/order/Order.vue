<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span='8'>
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border stripe :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDia"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='diaClose'
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="editForm.address1"
              :options="cityData"
              :props="cityProps"
              clearable
              @change="handleChange">
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流查询 -->
    <el-dialog
      title="物流信息"
      :visible.sync="wuliuDialogVisible"
      width="50%"
    >
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(item, index) in deliverInfo"
        :key="index"
        :timestamp="item.time">
        {{item.context}}
      </el-timeline-item>
    </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList,deliver } from "../../../network/home"
import cityData from "../../../assets/js/citydata"
export default {
  name:'order',
  data(){
    return{
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      editDialogVisible: false,
      editForm:{
        address1: [],
        address2:''
      },
      editFormRules:{
        address1:[
          { required: true, message: '请选择城市', trigger: 'blur' }
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      cityProps:{ 
        expandTrigger: 'hover',
        value: 'value',
        label: 'label',
        children: 'children'
      },
      wuliuDialogVisible: false,
      deliverInfo: [],
      reverse: false
    }
  },
  methods:{
    async getListData(){
      const { data:res } = await getOrderList(this.queryInfo)
      if(res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getListData()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getListData()
    },
    showEditDia(){
      this.editDialogVisible = true
    },
    diaClose(){
      this.$refs.editFormRef.resetFields()
    },
    handleChange(){
      console.log(this.editForm.address1)
    },
    async showBox(){
      const { data:res } = await deliver()
      console.log(res)
      if(res.meta.status !== 200 ) return this.$message.error('获取物流失败')
      this.deliverInfo = res.data
      this.wuliuDialogVisible = true
    }
  },
  mounted(){
    this.getListData()
  }
}
</script>

<style lang="scss" scoped>
.el-pagination{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>