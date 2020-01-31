<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" class="addcate" @click="showAddDia">添加分类</el-button>
      <!-- 第三方表格插件 -->
      <tree-table
        :data="goodsCateList"
        :columns="columns"
        show-index
        index-text='#'
        :selection-type='false'
        :expand-type='false'
        border
        :show-row-hover='false'
      >
      <!-- 是否有效模板区域 -->
        <template slot="isok" slot-scope='scope'>
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序模板区域 -->
        <template slot="level" slot-scope='scope'>
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作模板区域 -->
        <template slot="option">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="pagesizeChange"
        @current-change="pagenumChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 13, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form :model="addCateData" :rules="addCateRule" ref="addCateRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-cascader
            clearable
            v-model="parentKeys"
            :options="parentCateList"
            :props="parentCateProps"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateDate,getParentCateList,addCate } from "../../../network/home"
export default {
  name:'Cate',
  data(){
    return{
      // 获取商品分类列表的查询参数
      queryInfo:{
        type:3,
        // 当前页码值
        pagenum:1,
        // 每一页展示的数据条数
        pagesize:5
      },
      // 商品分类数据
      goodsCateList:[],
      // 分类数据总条数
      total:0,
      // 第三方插件的列的配置
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:'template',
          template:'isok'
        },
        {
          label:'排序',
          type:'template',
          template:'level'
        },
        {
          label:'操作',
          type:'template',
          template:'option'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类表单的数据绑定
      addCateData:{
        // 要添加的分类名称
        cat_name:'',
        // 要添加分类的层级
        cat_level:'',
        // 要添加分类的父级分类
        cat_pid:''
      },
      // 添加分类表单验证规则
      addCateRule:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据
      parentCateList:[],
      // 级联选择框中选择的分类id
      parentKeys:[],
      parentCateProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children',
        checkStrictly:true
      }
    }
  },
  methods:{
    async getGoodsCateList(){
      const { data:res } = await getCateDate(this.queryInfo)
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.goodsCateList = res.data.result
      this.total = res.data.total
      // console.log(this.goodsCateList)
    },
    pagesizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    pagenumChange(newNum){
      this.queryInfo.pagenum = newNum
      this.getGoodsCateList()
    },
    // 弹出添加分类对话框
    async showAddDia(){
      const { data:res } = await getParentCateList()
      if(res.meta.status !== 200) return this.$message.error('获取父级分类列表失败')
      this.parentCateList = res.data
      this.addCateDialogVisible = true
    },
    parentCateChange(){
      console.log(this.parentKeys)
      // 根据级联选择器的选择修改对应的查询数据
      if(this.parentKeys.length > 0){
        this.addCateData.cat_level = this.parentKeys.length
        this.addCateData.cat_pid = this.parentKeys[this.parentKeys.length - 1]
      }else{
        this.addCateData.cat_level = 0
        this.addCateData.cat_pid = 0
      }
    },
    //重置表单
    resetForm(){
      this.$refs.addCateRef.resetFields()
    },
    // 添加分类
    addCate(){
      this.$refs.addCateRef.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await addCate(this.addCateData)
        if(res.meta.status !== 201 ) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getGoodsCateList()
      })
      this.addCateDialogVisible = false
    }
  },
  mounted(){
    this.getGoodsCateList()
  }
}
</script>

<style lang="scss" scoped>
.addcate{
  margin-bottom: 15px;
}
.el-pagination{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>