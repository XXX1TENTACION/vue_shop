<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <el-table
        :data="rolesList"
        border
        stripe
      >
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <template v-slot='scoped'>
            <el-button type="primary" icon="el-icon-edit" width="100%" @click="roleEdit(scoped.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scoped.row.id)" >删除</el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
      @close='resetForm'>
      <el-form :model="addRoleData" :rules="addRoleRules" ref="addRoleRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="valid">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
      >
      <el-form :model="singleRoleInfo" :rules="addRoleRules" ref="editRoleRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="singleRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="singleRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList,addRole,editRole,deleteRole } from "../../../network/home"
export default {
  name:'Roles',
  data(){
    return{
      rolesList:[],
      // 控制添加角色对话框显示和隐藏
      addRoleDialogVisible:false,
      // 添加角色数据绑定
      addRoleData:{
        roleName:'',
        roleDesc:''
      },
      // 添加角色验证规则
      addRoleRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: false, message: '请输入角色描述', trigger: 'blur' },
        ]
      },
      // 控制修改角色对话框
      editRoleDialogVisible: false,
      // 每个角色的信息
      singleRoleInfo:{}
    }
  },
  methods:{
    async getRolesList(){
      const { data:res } = await getRolesList()
      if(res.meta.status !== 200 ) return
      this.rolesList = res.data
    },
    // 弹出添加角色对话框
    addRole(){
      this.addRoleDialogVisible = true
    },
    // 重置添加角色对话框
    resetForm(){
      this.$refs.addRoleRef.resetFields()
    },
    // 添加角色表单预验证
    valid(){
      this.addRoleDialogVisible = false
      this.$refs.addRoleRef.validate(async (valid) => {
        if(!valid) return
        const { data:res } = await addRole(this.addRoleData)
        if(res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.getRolesList()
      })
    },
    // 弹出修改角色对话框
    roleEdit(singleRoleInfo){
      this.editRoleDialogVisible = true
      this.singleRoleInfo = singleRoleInfo
    },
    // 修改角色
    validEdit(){
      this.editRoleDialogVisible = false
      this.$refs.editRoleRef.validate(async (valid) => {
        if(!valid) return 
        const { data:res } = await editRole(this.singleRoleInfo)
        if(res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.$message.success('修改角色成功')
        this.getRolesList()
      })
    },
    // 弹出删除角色提示框
    deleteRole(id){
      this.$confirm('是否删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data:res } = await deleteRole(id)
          if(res.meta.status !== 200 ) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getRolesList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  mounted(){
    this.getRolesList()
  }

}
</script>