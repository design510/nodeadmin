define('modules/login_index/loginpanel/main', function(require, exports, module) {

  'use strict';
  
  var Vue = require('modules/lib/vue');
  
  var Validator = require('modules/common/validator');
  var Msg = require('modules/components/msg/main');
  var Loading = require('modules/components/loading/main');
  
  module.exports = Vue.extend({
      template: "<form class=\"login-form\" action=\"/admin/login/login\" method=\"post\">\r\n    <h3 class=\"form-title\">欢迎登录</h3>  \r\n\r\n    <div class=\"form-group errwrap\">\r\n        <!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->\r\n        <label class=\"control-label visible-ie8 visible-ie9\">用户名</label>\r\n        <div class=\"input-icon\">\r\n            <i class=\"fa fa-user\"></i>\r\n            <input name=\"username\" type=\"text\" class=\"form-control placeholder-no-fix\" autocomplete=\"off\" placeholder=\"用户名\" autofocus/>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"form-group errwrap\">\r\n        <label class=\"control-label visible-ie8 visible-ie9\">密码</label>\r\n        <div class=\"input-icon\">\r\n            <i class=\"fa fa-lock\"></i>\r\n            <input name=\"password\" type=\"password\" class=\"form-control placeholder-no-fix\" autocomplete=\"off\" placeholder=\"密码\" />\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"form-actions\">\r\n        <he-checkbox name=\"remember\" title=\"记住密码\" checked></he-checkbox>\r\n        <button type=\"submit\" class=\"btn btn-info pull-right\"> 登录 </button>\r\n    </div>\r\n\r\n</form>",
      data: function data() {
          return {
              jqForm: undefined
          };
      },
      methods: {
          getRulesOptions: function getRulesOptions() {
              return {
                  username: {
                      required: {
                          rule: true,
                          message: '用户名不能为空！'
                      }
                  },
                  password: {
                      required: {
                          rule: true,
                          message: '密码不能为空！'
                      },
                      minlength: {
                          rule: 3,
                          message: '最小长度为3'
                      }
                  }
              };
          },
  
          handleValidator: function handleValidator() {
              Validator.check(this.jqForm, this.getRulesOptions(), {
                  submitHandler: function submitHandler(form) {
                      // http://malsup.com/jquery/form/
                      $(form).ajaxSubmit({
                          success: function success(responseText, statusText) {
                              if (statusText !== 'success' || responseText.errno !== 0) {
                                  Msg.error('登录失败，请输入正确的用户名和密码！');
                              } else {
                                  Loading.show('登录成功，正在跳转...');
  
                                  // 跳转到主页面
                                  window.location.href = '/admin/';
                              }
                          },
                          error: function error(err) {
                              // {readyState: 4, responseText: "{"errno":500,"errmsg":"Connection refused, mysql:/…thinkjs.org/doc/error_message.html#econnrefused"}", responseJSON: Object, status: 500, statusText: "Internal Server Error"}
                              if (err.status === 500) {
                                  Msg.error('内部错误，请联系管理员！');
                              } else {
                                  Msg.error('登录失败！');
                              }
                          }
                      });
                  }
              });
          },
  
          handleEnter: function handleEnter() {
              var self = this;
              $('input', this.jqForm).keypress(function (e) {
                  if (e.which == 13) {
                      if (self.jqForm.validate().form()) {
                          self.jqForm.submit();
                      }
                      return false;
                  }
              });
          }
      },
      ready: function ready() {
          this.jqForm = $(this.$el);
  
          this.handleValidator();
  
          this.handleEnter();
      }
  });

});
