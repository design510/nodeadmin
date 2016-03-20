var Vue = require('lib/vue');

var Model = require('../model');
var saveModal = require('./savemodal/main');
var mixinsIndexModal = require('mixins/modal/crudindex/main');

module.exports = Vue.extend({
    template: __inline('main.html'),
    components: {
        'saveModal': saveModal,
    },
    mixins: [mixinsIndexModal],
    methods: {
        beforeShowDataGrid: function() {
            this.datagridTitle = '用户信息列表';
            this.datagridUrl = '/admin/user/getdata';

            this.datagridItem = Model.getDatagridItem([
                'id',
                'name',
                'pwd',
                'birthday',
                'createTime',
                'updateTime',
                'stateShow'
            ], {
                name: {
                    css: 'namecss'
                },
                pwd: {
                    hide: true
                }
            }, [{
                name: 'id',
                title: '操作',
                render: 'commonOperate | detail modify delete',
                disableorder: true
            }]);
        },
        beforeShowAddPage: function() {
            this.saveTitle = '新增用户信息';
            this.saveUrl = '/admin/user/add';

            this.initData = {
                birthday: '2016-03-01',
                state: '1',
            };

            this.fieldData = [{
                filedName: 'name',
                elementType: 'input'
            }, {
                filedName: 'pwd',
                elementType: 'input',
                elementParam: {
                    type: 'password'
                }
            }, {
                filedName: 'state',
                elementType: 'select2',
                elementParam: {
                    options: [{
                        title: '有效',
                        value: '1'
                    }, {
                        title: '无效',
                        value: '-1'
                    }]
                }
            }, {
                filedName: 'birthday',
                elementType: 'date'
            }];

            this.saveField = Model.getNameMap([
                'name',
                'birthday',
                'state',
                'pwd'
            ]);

            var config = {};

            config.state = {
                required: true
            };

            config.birthday = {
                required: {
                    rule: true,
                    message: '生日不能为空！'
                }
            };

            config.name = {
                required: {
                    rule: true,
                    message: '用户名不能为空！'
                },
                minlength: {
                    rule: 3,
                    message: '最小长度为3'
                },
                maxlength: {
                    rule: 64,
                    message: '最大长度为64'
                }
            };

            config.pwd = {
                required: {
                    rule: true,
                    message: '密码不能为空！'
                },
                minlength: {
                    rule: 5,
                    message: '最小长度为5'
                },
                maxlength: {
                    rule: 32,
                    message: '最大长度为32'
                }
            };

            this.validatorOptions = config;
        },
        beforeShowModifyPage: function(data) {
            this.saveTitle = '修改用户信息';
            this.saveUrl = '/admin/user/modify';

            this.initData = $.extend({}, data);

            this.fieldData = [{
                filedName: 'id',
                elementType: 'input',
                elementParam: {
                    readonly: true
                }
            }, {
                filedName: 'name',
                elementType: 'input',
                elementParam: {
                    readonly: true
                }
            }, {
                filedName: 'state',
                elementType: 'select2',
                elementParam: {
                    options: [{
                        title: '有效',
                        value: '1'
                    }, {
                        title: '无效',
                        value: '-1'
                    }]
                }
            }, {
                filedName: 'birthday',
                elementType: 'date'
            }];

            this.saveField = Model.getNameMap([
                'id',
                'name',
                'birthday',
                'state'
            ]);

            var config = {};

            config.state = {
                required: true
            };

            config.birthday = {
                required: {
                    rule: true,
                    message: '生日不能为空！'
                }
            };

            this.validatorOptions = config;
        },
        beforeShowDetailPage: function(data) {
            this.detailTitle = '查看用户信息';

            this.initData = $.extend({}, data);
            this.detailField = Model.getNameMap([
                'id',
                'name',
                'birthday',
                'stateShow',
                'createTime',
                'updateTime'
            ]);
        },
        beforeShowDeletePage: function(data) {
            this.deleteTitle = '删除用户信息';
            this.deleteUrl = '/admin/user/delete';

            this.initData = $.extend({}, data);
            this.deleteField = Model.getNameMap([
                'id',
                'name',
                'stateShow',
                'createTime',
                'updateTime'
            ]);

            this.deleteParam = [{
                key: 'id',
                fieldName: 'id'
            }];
        },
    },
    ready: function() {

    }
});
