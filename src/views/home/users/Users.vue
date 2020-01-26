<template>
  <div class="users">
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="params.query" clearable @clear='getUserInfo'> 
            <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" >
          <!-- 作用域插槽获取每一行用户的数据 -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="infoChange(scope.row)"
            >
            </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scoped">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scoped.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletUser(scoped.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum" 
        :page-sizes="[2, 3, 4, 5]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close='cancel'
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="ruleForm.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="valid">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      >
      <el-form ref="editForm" :model="singleUserInfo" label-width="70px" :rules="rules">
        <el-form-item label="用户名">
          <el-input v-model="singleUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="singleUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="singleUserInfo.mobile" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editValid">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList,changeStatus,addUser,editUser,deleteUser } from "../../../network/home"

export default {
  name:'Users',
  data(){
    // 自定义邮箱验证规则
    var checkEmail = (rule,value,callback) => {
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(reg.test(value)){
        return callback()
      }
      callback(new Error('邮箱格式错误'))
    }
    // 自定义手机号验证规则
    var checkMobile = (rule,value,callback) => {
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if(reg.test(value)){
        return callback()
      }
      callback(new Error('手机号格式错误'))
    }
    return {
      userList:[],
      total:0,
      params:{
        // 查询的参数
        query:'',
        // 当前所在页码数
        pagenum:1,
        // 每页显示的信息数
        pagesize:2
      },
      // 控制添加用户对话框的显示和隐藏
      dialogVisible:false,
      // 添加用户表单数据绑定
      ruleForm:{
        username:'admin1',
        password:'123456',
        email:'937859043@qq.com',
        mobile:'17796508284'
      },
      // 添加用户表单验证规则
      rules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger:'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger:'blur' }
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      // 修改之前每个用户的信息
      singleUserInfo:{}
    }
  },
  methods:{
    // 获取用户列表数据
    async getUserInfo(){
      let { data:res } = await getUserList(this.params)
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听每页显示信息数改变事件
    handleSizeChange(newSize){
      this.params.pagesize = newSize
      this.getUserInfo()
    },
    //监听当前所在页码变化事件
    handleCurrentChange(newPage){
      this.params.pagenum = newPage
      this.getUserInfo()
    },
    // 修改用户状态
    async infoChange(info){
      const { data:res } = await changeStatus(info)
      if( res.meta.status !== 200 ){
        info.mg_state = !info.mg_state
        return this.$message.error('状态修改失败')
      }
      this.$message.success('状态修改成功')
    },
    // 重置添加用户对话框
    cancel(){
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    // 添加用户表单预验证
    valid(){
      this.dialogVisible = false
      this.$refs.ruleForm.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await addUser(this.ruleForm)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 关闭对话框
        this.dialogVisible = false
        // 重新发起请求刷新用户列表
        this.getUserInfo()
      })
    },
    // 点击显示修改用户对话框
    editUser(userInfo){
      this.editDialogVisible = true
      this.singleUserInfo = userInfo
    },
    // 重置修改用户对话框
    cancelEdit(){
      this.editDialogVisible = false
      this.$refs.editForm.resetFields()
    },
    // 修改用户
    editValid(){
      this.editDialogVisible = false
      this.$refs.editForm.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await editUser(this.singleUserInfo)
        if(res.meta.status !== 200 ) return this.$message.error('修改失败')
        this.editDialogVisible = false
        this.getUserInfo()
        this.$message.success('修改成功')
      })
    },
    // 删除用户
    deletUser(id){
      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送网络请求删除用户
        const { data:res } = await deleteUser(id)
        if(res.meta.status !== 200 ) return this.$message.error('删除失败')
        this.getUserInfo()
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
    }
  },
  mounted(){
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>

</style>