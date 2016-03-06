define('modules/codingitem_index/main', function(require, exports, module) {

  'use strict';
  
  var Vue = require('modules/lib/vue');
  
  var addPage = require('modules/codingitem_index/add/main');
  var modifyPage = require('modules/codingitem_index/modify/main');
  var deletePage = require('modules/codingitem_index/delete/main');
  var detailPage = require('modules/codingitem_index/detail/main');
  var codinginfoPage = require('modules/codingitem_index/codinginfo/main');
  
  module.exports = Vue.extend({
      template: "<div class=\"codingitem_index-main\">\r\n\r\n    <codinginfo :assign=\"assign\"></codinginfo>\r\n\r\n    <admin-main-toolbar v-if=\"isShowToolbar\">\r\n         <button class=\"btn btn-success\" v-on:click=\"showAddPage\">\r\n            新增 <i class=\"fa fa-plus\"></i>\r\n        </button>\r\n    </admin-main-toolbar>\r\n\r\n    <add-page v-if=\"isShowAddPage\" :assign=\"assign\" v-on:backtoinit=\"backToInit\"></add-page>\r\n    <modify v-ref:modify v-on:savesuccess=\"reloadDataGrid\"></modify>\r\n    <delete v-ref:delete v-on:savesuccess=\"reloadDataGrid\"></delete>\r\n    <detail v-ref:detail></detail>\r\n\r\n    <portlet v-if=\"isShowDatagrid\" title=\"代码生成器字段列表\" icon=\"globe\">    \r\n        <datagrid :url=\"getDataUrl\" pagelength=\"4\" v-on:click=\"operate\" v-ref:datagrid>\r\n            <datagrid-item name=\"id\" title=\"ID\"></datagrid-item>\r\n            <datagrid-item name=\"fieldName\" title=\"字段名称\"></datagrid-item>\r\n            <datagrid-item name=\"cnName\" title=\"中文名称\"></datagrid-item>\r\n            <datagrid-item name=\"dbName\" title=\"英文名称\"></datagrid-item>\r\n            <datagrid-item name=\"stateShow\" title=\"状态\"></datagrid-item>\r\n            <datagrid-item name=\"id\" title=\"操作\" render=\"commonOperate | detail modify delete\" disableorder></datagrid-item>\r\n        </datagrid>\r\n    </portlet>   \r\n\r\n</div>\r\n",
      data: function data() {
          return {
              isShowToolbar: true,
              isShowAddPage: false,
              isShowDatagrid: true
          };
      },
      components: {
          addPage: addPage,
          'modify': modifyPage,
          'delete': deletePage,
          'detail': detailPage,
          'codinginfo': codinginfoPage
      },
      props: {
          /**
           * thinkjs后台设置过来的值，由于无法传递对象，因此此处需要进行一些转义
           */
          'assign': {
              required: true,
              coerce: function coerce(val) {
                  return JSON.parse(val);
              }
          }
      },
      computed: {
          getDataUrl: function getDataUrl() {
              // `this` 指向 vm 实例
              return '/admin/codingitem/getdata/codingid/' + this.assign.id;
          }
      },
      methods: {
          /**
           * 打开新增页面
           */
          showAddPage: function showAddPage() {
              this.isShowToolbar = false;
              this.isShowAddPage = true;
              this.isShowDatagrid = false;
          },
          backToInit: function backToInit() {
              this.isShowToolbar = true;
              this.isShowAddPage = false;
              this.isShowDatagrid = true;
          },
          operate: function operate(event) {
              var target = event.target,
                  $target = $(target),
                  type = $target.data('type'),
                  id,
                  data;
  
              if (!type || ['modify', 'delete', 'detail'].indexOf(type) < 0) {
                  return;
              }
  
              id = $target.data('id');
  
              data = this.getDataById(id);
  
              if (data) {
                  this.$refs[type].showModal(data);
              }
          },
          reloadDataGrid: function reloadDataGrid() {
              this.$refs.datagrid.reload();
          },
          getDataById: function getDataById(id) {
              if (!id) {
                  console.error('No ID!');
                  return;
              }
  
              var data = this.$refs.datagrid.getDataById('id', id);
  
              if (!data) {
                  console.error('No data of id=' + id);
                  return;
              }
  
              return data;
          }
      },
      ready: function ready() {}
  });

});
