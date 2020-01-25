<template>
  <div class="home">
    <el-button type="primary" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name:'Home',
  methods:{
    // 退出登录
    logout(){
      // 清空sessionStorage
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>