<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table
        :data="powerList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scoped">
            <el-tag :type="tagObj[scoped.row.level][0]">{{ tagObj[scoped.row.level][1] }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getPowerlist } from '../../../network/home'
export default {
  name:'Rights',
  data(){
    return{
      // 权限列表数据
      powerList:[],
      // tag标签颜色
      tagObj:{
        0:['','等级一'],
        1:['success','等级二'],
        2:['warning','等级三']
      }
    }
  },
  methods:{
    async getPowerData(){
      let { data:res } = await getPowerlist()
      if(res.meta.status !== 200) return
      this.powerList = res.data
      // console.log(res)
    }
  },
  mounted(){
    this.getPowerData()
  }
}
</script>