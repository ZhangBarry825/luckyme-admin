<template>
  <div class="main">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item :label="$t('userinfo.avatar')">
        <el-input v-model="form.avatar" style="display: none"></el-input>
        <img class="avatar" :src="form.avatar" @click="uploadAvatar">
        <input type="file" @change="uploadFile($event)" id="avatarInput" style="display: none">
      </el-form-item>
      <el-form-item :label="$t('userinfo.name')">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.roles')">
        <el-select v-model="form.roles" :placeholder="$t('userinfo.selectRole')">
          <el-option :label="$t('userinfo.admin')" value="admin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('userinfo.email')">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.address')">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item :label="$t('userinfo.createTime')">
        <el-col :span="11">
          <el-date-picker type="date" :placeholder="$t('userinfo.selectDate')" v-model="form.create_time" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item :label="$t('userinfo.description')">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ $t('userinfo.submit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getUserInfo,updateUserInfo,uploadAvatar } from '@/api/userInfo'
  import {Message} from "element-ui";
  export default {
    name: "UserInfo",
    data(){
      return{
        form: {
          avatar: '',
          name: '',
          roles: '',
          email: '',
          address: '',
          create_time: '',
          description: '',
        },
        file: ''
      }
    },
    methods: {
      onSubmit() {
        console.log(this.form);
        var data={
          name:this.form.name,
          roles:this.form.roles,
          avatar:this.form.avatar,
          description:this.form.description,
          address:this.form.address,
          email:this.form.email,
          create_time:Date.parse(this.form.create_time)/1000
        }
        updateUserInfo(data).then(response=>{
          Message({
            message: response.msg,
            type: 'success',
            duration: 2000
          })
          this.$store.commit('SET_AVATAR',this.form.avatar)
          this.$store.commit('SET_NAME',this.form.name)
          this.$store.commit('SET_ROLES',this.form.roles)
        })
      },
      uploadFile(event) {
        this.file = event.target.files[0];
        let formData = new FormData();
        const isJPG = this.file.type === 'image/jpeg';
        const isLt2M = this.file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }else if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }else {
          formData.append('files', this.file);
          uploadAvatar(formData).then(response=>{
            this.form.avatar=this.GLOBALDATA.serverUrl+response.data
          })
        }
      },
      uploadAvatar(){
        document.getElementById('avatarInput').click()
      }
    },
    mounted(){
      getUserInfo().then(response=>{
        console.log(response.data)
        this.form=response.data
      })
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .main{
    max-width: 500px;
    padding:20px;
    padding-top:30px;
    padding-bottom:0;
    box-sizing: border-box;
    .avatar{
      width: 50px;
      height: 50px;
      border-radius: 10px;
    }
  }
</style>
