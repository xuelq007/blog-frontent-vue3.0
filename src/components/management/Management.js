import axios from 'axios'
import qs from 'qs'
import store from '../../store.js'
import common from '../common/common.js'

const Operation = {
  Add: 3,
  Delete: 6,
  Update: 9,
  Find: 12
}

export default {
  name: 'ManagementPage',

  beforeRouteEnter (to, from, next) {
    let isLogin = store.getters.getIsLogin

    isLogin && next()
  },

  beforeRouteLeave (to, from, next) {
    store.dispatch('setIsLogin', false)
    next()
  },

  data () {
    const validateBlogName = (rule, value, callback) => {
      this.IsEmptyRule([Operation.Add, Operation.Update, Operation.Find], value, '文章名不能为空', callback)
    }

    const validateLink = (rule, value, callback) => {
      this.IsEmptyRule([Operation.Add, Operation.Update], value, '文章链接不能为空', callback)
    }

    const validateCategory = (rule, value, callback) => {
      this.IsEmptyRule([Operation.Add, Operation.Update], value, '文章分组不能为空', callback)
    }

    return {
      ruleForm: {
        blogId: '',
        blogName: '',
        link: '',
        category: ''
      },

      rules: {
        blogName: [
          { validator: validateBlogName, trigger: 'blur' }
        ],
        link: [
          { validator: validateLink, trigger: 'blur' }
        ],
        category: [
          { validator: validateCategory, trigger: 'blur' }
        ],

        blogId: [
          {required: true, message: '博客id不能为空', trigger: 'blur'}
        ]
      },

      operation: Operation.Add,

      loading: false,

      queryResult: '',

      // pwa 发送通知内容
      notification: '',

      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    }
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.operation === Operation.Add) {
            this.addBlog()
          } else if (this.operation === Operation.Delete) {
            this.deleteBlog()
          } else if (this.operation === Operation.Find) {
            this.findBlog()
          } else if (this.operation === Operation.Update) {
            this.updateBlog()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.blogId = ''
      this.queryResult = ''
    },

    onOperationChange (value) {
      this.resetForm('ruleForm')
    },

    IsEmptyRule (operationRule, value, message, callback) {
      if (operationRule.indexOf(this.operation) > -1 && !value) {
        callback(new Error(message))
      } else {
        callback()
      }
    },

    returnHomePage () {
      this.$router.push({
        path: '/'
      })
    },

    addBlog () {
      let self = this
      axios.post('/api/addBlog', qs.stringify(this.ruleForm), this.config)
        .then(function (response) {
          self.loading = false
          if (response.data.success) {
            self.$message({
              message: '添加博客成功',
              type: 'success'
            })
            self.sendNotification('xuelq007发布新博客: ' + self.ruleForm.blogName)
            self.resetForm('ruleForm')
          } else {
            self.$message.error(response.data.error || '添加博客失败')
          }
        })
        .catch(self.showError)
    },

    deleteBlog () {
      let self = this
      axios.post('/api/deleteBlog', qs.stringify({blogId: this.ruleForm.blogId}), this.config)
        .then(function (response) {
          self.loading = false
          if (response.data.success) {
            self.$message({
              message: '删除博客成功',
              type: 'success'
            })
            self.resetForm('ruleForm')
          } else {
            self.$message.error(response.data.error || '删除博客失败')
          }
        })
        .catch(self.showError)
    },

    findBlog () {
      let self = this
      axios.post('/api/findBlog', qs.stringify({blogName: this.ruleForm.blogName}), this.config)
        .then(function (response) {
          self.loading = false
          if (response.data.success) {
            self.$message({
              message: '查询成功',
              type: 'success'
            })

            self.queryResult = response.data.result
          } else {
            self.$message({
              message: response.data.error || '该博客不存在',
              type: 'warning'
            })
          }
        })
        .catch(self.showError)
    },

    updateBlog () {
      let self = this
      axios.post('/api/updateBlog', qs.stringify(this.ruleForm), this.config)
        .then(function (response) {
          self.loading = false
          if (response.data.success) {
            self.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            self.$message({
              message: response.data.error || '修改失败',
              type: 'warning'
            })
          }
        })
        .catch(self.showError)
    },

    // pwa: 向用户发送通知
    sendNotification (text) {
      let notifyText = typeof text === 'string' ? text : this.notification
      common.sendNotification(notifyText).then(() => {
        this.notification = ''
      })
    },

    showError (msg) {
      this.$message.error('脚本错误')
    }
  }
}
