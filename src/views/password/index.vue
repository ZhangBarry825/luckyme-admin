<template>
  <div class="main">
    <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('password.oldPassword')" prop="old_password">
        <el-input v-model="ruleForm2.old_password" type="password"/>
      </el-form-item>
      <el-form-item :label="$t('password.newPassword')" prop="new_password">
        <el-input v-model="ruleForm2.new_password" type="password" />
      </el-form-item>
      <el-form-item :label="$t('password.repeatPassword')" prop="repeat_password">
        <el-input v-model="ruleForm2.repeat_password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">{{ $t('password.submit') }}</el-button>
        <el-button @click="resetForm('ruleForm2')">{{ $t('password.reset') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { updatePassword } from '@/api/userInfo'
export default {
  name: 'Password',
  data() {
    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.msg1))
      }
      if (value.length < 6) {
        return callback(new Error(this.msg2))
      }
      callback()
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.msg3))
      } else if (value.length < 6) {
        return callback(new Error(this.msg6))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('repeat_password')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.msg4))
      } else if (value !== this.ruleForm2.new_password) {
        callback(new Error(this.msg5))
      } else {
        callback()
      }
    }
    return {
      msg1: this.$t('password.msg1'),
      msg2: this.$t('password.msg2'),
      msg3: this.$t('password.msg3'),
      msg4: this.$t('password.msg4'),
      msg5: this.$t('password.msg5'),
      msg6: this.$t('password.msg6'),
      success: this.$t('password.success'),
      ruleForm2: {
        new_password: '',
        repeat_password: '',
        old_password: ''
      },
      rules2: {
        new_password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        repeat_password: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        old_password: [
          { validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    sendSubmit() {
      const data = {
        old_password: this.ruleForm2.old_password,
        new_password: this.ruleForm2.new_password
      }
      updatePassword(data).then(response => {
        Message({
          message: this.success,
          type: 'success',
          duration: 2000
        })
        this.resetForm('ruleForm2')
      })
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .main{
    max-width: 350px;
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
