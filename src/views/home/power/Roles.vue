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
        <el-table-column type="expand">
          <template v-slot='scoped'>
            <el-row v-for="(item1,index) in scoped.row.children" :key="item1.id" class="bdbottom vcenter" :class="[index === 0 ? 'bdtop':'']">
              <el-col :span="5">
                <el-tag
                  closable
                  @close='deletePowerById(scoped.row,item1.id)'
                >{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" class="vcenter" :class="[index2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag 
                      type="success"
                      closable
                      @close='deletePowerById(scoped.row,item2.id)'
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag 
                      type="warning" 
                      v-for="item3 in item2.children" 
                      :key="item3.id"
                      closable
                      @close='deletePowerById(scoped.row,item3.id)'
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column  label="操作">
          <template v-slot='scoped'>
            <el-button type="primary" icon="el-icon-edit" width="100%" @click="roleEdit(scoped.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scoped.row.id)" >删除</el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" @click="showPowerDialog(scoped.row)">分配权限</el-button>
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
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="powerDialogVisible"
      width="50%"
      @close='resetTreeId'
    >
      <el-tree
        :data="treePowerList"
        show-checkbox
        :props="treeProps"
        default-expand-all
        node-key='id'
        :default-checked-keys="treeCheck"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setPower">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList,addRole,editRole,deleteRole,deleteRoleById,getPowerlist,setRole } from "../../../network/home"
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
      singleRoleInfo:{},
      // 控制分配角色对话框的显示和隐藏、
      powerDialogVisible:false,
      // 树形组件的数据
      treePowerList:[],
      // 树形组件数据绑定对象
      treeProps:{
        children:'children',
        label:'authName'
      },
      // 三级权限的id
      treeCheck:[],
      // 当前角色的id
      roleId:''
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
    },
    // 删除权限
    deletePowerById(roleInfo,id){
      this.$confirm('是否删除该权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { data:res } = await deleteRoleById(roleInfo.id,id)
          if(res.meta.status !== 200 ) this.$message.error('权限删除失败')
          // 将服务器返回的数据重新渲染到页面上，防止折叠
          roleInfo.children = res.data
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
    // 弹出分配权限对话框
    async showPowerDialog(role){
      this.roleId = role.id
      const { data:res } = await getPowerlist('tree')
      this.treePowerList = res.data
      // 获取三级权限的id
      this.getThirdId(role,this.treeCheck)
      this.powerDialogVisible = true
    },
    // 获取所有三级权限的id
    getThirdId(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getThirdId(item,arr)
      })
    },
    // 分配权限对话框关闭时清空treeCheck 数组
    resetTreeId(){
      this.treeCheck = []
    },
    // 分配权限
    async setPower(){
      const checkedArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = checkedArr.join(',')
      const { data:res } = await setRole(this.roleId,idStr)
      if(res.meta.status !== 200 ) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      // 更新权限数据
      this.getRolesList()
      // 关闭对话框
      this.powerDialogVisible = false
    }
  },
  mounted(){
    this.getRolesList()
  }

}
</script>

<style lang="scss" scoped>
.el-tag{
  margin: 7px;
}
.bdbottom{
  border-bottom: 1px solid #eee
}
// .el-row:nth-child(1){
//   border-top: 1px solid #eee;
// }
.bdtop{
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>