<template>
  <div class="login">
    <div class="login-box">
      <div class="avator-box">
        <img class="avator" src="../../assets/logo.png" alt="">
      </div>
      <el-form 
        label-width="0px"  
        class="login-form" 
        :model='formData'
        :rules="formDataRules"
        ref="formDataRef"
        >
          <el-form-item prop='username'>
            <el-input 
              prefix-icon="iconfont icon-user" 
              v-model="formData.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input 
              prefix-icon="iconfont icon-3702mima" 
              v-model="formData.password"
              type='password'
            ></el-input>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary" @click="loginClick">登录</el-button>
            <el-button type="info" @click="btnClick">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from '../../network/login'
export default {
  name:'Login',
  data(){
    return{
      // 绑定表单数据
      formData:{
        username:'admin',
        password:'123456'
      },
      // 添加验证规则
      formDataRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    //表单重置
    btnClick(){
      this.$refs.formDataRef.resetFields()
    },
    //表单预验证
    loginClick(){
      this.$refs.formDataRef.validate(async (valid) => {
        if(!valid) return
        let { data:res } = await getLoginData(this.formData)
        if(res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        // 将token存在sessionStorage中
        // console.log(res)
        window.sessionStorage.setItem('token',res.data.token)
        // 路由跳转到home页面
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login-box{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    transform: translate(-50%,-50%);
    border-radius: 3px;
    .avator-box{
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 130px;
      height: 130px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      transform: translate(0,-50%);
      .avator{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login-form{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 10px;
    .form-btns{
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>