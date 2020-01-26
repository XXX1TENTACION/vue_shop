<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../../assets/images/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuWidth">
        <div class="toggleCollapse" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#377fbd"
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          router
          :default-active="activePath"
        >
        <!-- 一级菜单 -->
          <el-submenu 
            :index="item.id + ''" 
            v-for="item in menuList" 
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item 
              :index="'/' + item2.path" 
              v-for="item2 in item.children" 
              :key="item2.id" 
              @click="menuChange('/' + item2.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item2.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '../../network/home'
export default {
  name: "Home",
  data(){
    return{
      menuList:[],
      iconObj:{
        125:'iconfont icon-user',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  methods: {
    // 退出登录
    logout() {
      // 清空sessionStorage
      window.sessionStorage.clear();
      // 跳转到登录页面
      this.$router.push("/login");
    },
    // 获取菜单栏数据
    async getMenuData(){
      let { data:res }  = await getMenuList()
      if(res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.menuList = res.data
    },
    // 切换菜单的折叠和展开
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 切换二级菜单的高亮
    menuChange(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  mounted(){
    this.getMenuData()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  computed:{
    menuWidth(){
     return this.isCollapse ? '64px' : '200px'
    }
  }
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  padding-left: 0;
  .logo {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 16px;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
  .toggleCollapse{
    background-color: #485164;
    line-height: 24px;
    color: #fff;
    font-size: 10px;
    letter-spacing: .2rem;
    text-align: center;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
</style>