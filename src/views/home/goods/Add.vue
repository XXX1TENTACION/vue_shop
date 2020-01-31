<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable='false'
      >
      </el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave='tabsLeave' @tab-click='tabChange'>
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="goodsCate"
                :props='selectProp'
                @change="handleChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyParamsList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyParamsList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers='headerObj'
              :on-success='uploadSuccess'
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoodsClick"> 添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
      >
      <img :src="previewImgPath" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { getCateDate,getParams,addGoods } from "../../../network/home"
import _ from "lodash"
export default {
  name:'Add',
  data(){
    return{
      activeIndex:'0',
      //添加商品表单数据绑定
      addForm:{
        goods_name: '',
        goods_price: 0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      //表单验证规则
      addFormRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      goodsCate:[],
      selectProp:{
         expandTrigger: 'hover',
         label:'cat_name',
         value:'cat_id',
         children:'children'
      },
      // 选中的三级分类的id
      cateId:'',
      // 商品参数列表
      manyParamsList:[],
      onlyParamsList:[],
      uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewImgPath:'',
      dialogVisible:false
    }
  },
  methods:{
    async getDate(){
      const { data:res } = await getCateDate()
      if(res.meta.status !== 200 ) return this.$message.error('获取数据失败')
      this.goodsCate = res.data
    },
    // 监听级联选择器的变化
    handleChange(){
      // 只允许选择三级分类
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
        return
      }
      this.cateId = this.addForm.goods_cat[2]
    },
    // 标签页切换事件
    tabsLeave(activeName,oldActiveName){
      // console.log(activeName,oldActiveName)
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // tab标签页点击事件
    async tabChange(){
      if(this.activeIndex === '1'){
        const { data:res } = await getParams(this.cateId,'many')
        if(res.meta.status !== 200 ) return this.$message.error('数据获取失败')
          res.data.forEach((item) => {
            if(item.attr_vals === ''){
              item.attr_vals = []
            }else{

              item.attr_vals = item.attr_vals.split(' ')
            }
          })
        this.manyParamsList = res.data
      }else if(this.activeIndex === '2'){
        const { data:res } = await getParams(this.cateId,'only')
        if(res.meta.status !== 200 ) return this.$message.error('数据获取失败')
        this.onlyParamsList = res.data
      }
    },
    // 图片的预览
    handlePreview(file){
      this.previewImgPath = file.response.data.url
      this.dialogVisible = true
    },
    // 删除上传的图片
    handleRemove(file){
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pics === filePath)
      this.addForm.pics.splice(index,1)
    },
    // 图片上传成功
    uploadSuccess(res){
      const picInfo = {
        pics:res.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoodsClick(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return this.$message.error('必填选项待完善')
        const form = _.cloneDeep(this.addForm)
        // console.log(form)
        form.goods_cat = form.goods_cat.join(',')
        this.manyParamsList.forEach((item) => {
          const newObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newObj)
        })
        this.onlyParamsList.forEach((item) => {
          const newObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newObj)
        })
      form.attrs = this.addForm.attrs
      const { data:res } = await addGoods(form)
      console.log(res)
      if(res.meta.status !== 201) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.$router.push('/goods')
      })
    }
  },
  mounted(){
    this.getDate()
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
} 
.addBtn{
  margin-top: 15px;
}
</style>