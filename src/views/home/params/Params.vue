<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
        >
      </el-alert>
      <el-row class="params-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="goodsList"
            :props="selectProps"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="TabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnShow" type="primary" @click="addDialogVisible = true">动态参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <el-tag closable @close="tagClose(i,scope.row)" class="tag" v-for="(item,i) in scope.row.attr_vals" :key="item.$index">{{ item }}</el-tag>
                <el-input
                  class="input-width"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDia(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deletData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnShow" type="primary" @click="addDialogVisible = true">静态属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type='expand'>
              <!-- <template slot-scope="scope">
                <el-tag closable @close="tagClose(i,scope.row)" class="tag" v-for="(item,i) in scope.row.attr_vals" :key="item.$index">{{ item }}</el-tag>
                <el-input
                  class="input-width"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template> -->
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDia(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deletData(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态参数和静态属性的对话框 -->
    <el-dialog
      :title="'添加' + diaTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close='diaClose'
    >
      <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="diaTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑' + diaTitle"
      :visible.sync="editDialogVisible"
      width="50%"
      @close='diaClose'
    >
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="diaTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateDate,getParams,addPara,editPara,deletePara,upDate } from "../../../network/home"
export default {
  name:'Params',
  data(){
    return {
      // 商品分类数据
      goodsList:[],
      // 级联选择器框中选中商品的id
      selectKeys:[],
      // 级联选择框的配置
      selectProps:{
        expandTrigger: 'hover',
        value:'cat_id',
        label: 'cat_name',
        children:'children'
      },
      // 选中的tab标签的名称
      activeName:'many',
      // 选中分类的id
      paramsId:0,
      // 选中分类的商品数据
      manyTableData:[],
      onlyTableData:[],
      // 控制对话框的现实与隐藏
      addDialogVisible:false,
      editDialogVisible:false,
      // 表单数据绑定
      addForm:{
        attr_name:''
      },
      editForm:{
        // attr_name:''
      },
      // 表单验证规则
      addFormRule:{
        attr_name:[
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      editFormRule:{
        attr_name:[
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    async getGoods(){
      const { data:res } = await getCateDate()
      if(res.meta.status !== 200 ) return this.$message.error('获取数据失败')
      this.goodsList = res.data
    },
    // 监听级联选择框的改变
    async handleChange(){
      // 判断是否选择的是三级选项
      if(this.selectKeys.length !== 3 ){
        this.selectKeys = []
        this.manyTableData = [],
        this.onlyTableData = []
        return
      }
      this.paramsId = this.selectKeys[2]
      const { data:res } = await getParams(this.paramsId,this.activeName)
      if(res.meta.status !== 200 ) return this.$message.error('获取数据失败')
      res.data.forEach((item) => {
        if(item.attr_vals){
          item.attr_vals = item.attr_vals.split(' ')
          item.inputVisible = false
          item.value = ''
        }else{
          item.attr_vals = []
        }
      })
      if(this.activeName === 'many'){
        this.manyTableData = res.data
      }else{
        this.onlyTableData = res.data
      }
    },
    // 监听标签页的改变
    async TabClick(){
      this.handleChange()
    },
    // 对话框关闭事件
    diaClose(){
      this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
      this.$refs.editFormRef && this.$refs.editFormRef.resetFields()
    },
    // 表单验证
    addData(){
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await addPara(this.paramsId,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !== 201 ) return this.$message.error('获取数据失败')
        this.$message.success('添加成功')
        this.handleChange()
      })
      this.addDialogVisible = false
    },
    showEditDia(data){
      this.editForm = data
      this.editDialogVisible = true
    },
    editData(){
      this.$refs.editFormRef.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await editPara(this.paramsId,this.editForm.attr_id,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !== 200 ) return this.$message.error('获取数据失败')
        this.$message.success('添加成功')
        this.handleChange()
      })
      this.editDialogVisible = false
    },
    deletData(data){
      this.editForm = data
       this.$confirm('删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data:res } = await deletePara(this.paramsId,this.editForm.attr_id)
          if(res.meta.status !== 200) return this.$message.error('删除失败')
          this.handleChange()
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
    showInput(rowData){
      rowData.inputVisible = true
      // 文本框自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    async handleInputConfirm(rowData){
      // console.log(rowData.inputValue)
      if(rowData.inputValue.trim().length === 0){
        rowData.inputValue = ''
        rowData.inputVisible = false
        return
      }
      // 发请求更新参数
      // const {data:res} = await upDate(this.paramsId,rowData.attr_id,
      //   {
      //     attr_name:rowData.attr_name,
      //     attr_sel:this.activeName,
      //     attr_vals:rowData.attr_vals.join(' ')
      //   }
      // )
      // console.log(res)
      // if(res.meta.status !== 200) return this.$message.error('更新失败')
      // this.$message.success('更新成功')
      this.upDateTag(rowData)
      rowData.attr_vals.push(rowData.inputValue)
      rowData.inputVisible = false
    },
    // 更新tag标签
    async upDateTag(rowData){
      // 发请求更新参数
      const {data:res} = await upDate(this.paramsId,rowData.attr_id,
        {
          attr_name:rowData.attr_name,
          attr_sel:this.activeName,
          attr_vals:rowData.attr_vals.join(' ')
        }
      )
      console.log(res)
      if(res.meta.status !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
    },
    tagClose(i,rowData){
      rowData.attr_vals.splice(i,1)
      this.upDateTag(rowData)
    }
  },
  mounted(){
    this.getGoods()
  },
  computed:{
    isBtnShow(){
      return  this.selectKeys.length !== 3
    },
    diaTitle(){
      if(this.activeName === 'many'){
        return '动态规则'
      }else{
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.params-opt{
  margin: 15px 0;
}
.tag{
  margin: 0 15px;
}
.input-width{
  width: 170px;
}
</style>