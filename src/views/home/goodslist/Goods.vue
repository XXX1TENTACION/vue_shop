<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear='getData'>
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table border stripe :data="GoodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="600px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
       <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList,deleteGoods } from "../../../network/home"
export default {
  name:'Goods',
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 商品数据
      GoodsList:[],
      total:0
    }
  },
  methods:{
    async getData(){
      const { data:res } = await getGoodsList(this.queryInfo)
      if(res.meta.status !== 200 ) return this.$message.error('获取数据失败')
      this.GoodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize  =newSize
      this.getData()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getData()
    },
    deleteGoods(row){
      this.$confirm('是否删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(async () => {
          const { data:res } = await deleteGoods(row.goods_id)
          console.log(res)
          if(res.meta.status !== 200 ) return this.$message.error('删除失败')
          this.$message.success('删除成功')
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      });
    },
    goAddPage(){
      this.$router.push('/goods/add')
    }
  },
  mounted(){
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.el-pagination{
  margin-top: 15px;
}
</style>