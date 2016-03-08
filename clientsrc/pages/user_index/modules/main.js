var Vue = require('lib/vue');


var deletePage = require('./delete/main');
var detailPage = require('./detail/main');
var saveModal = require('./savemodal/main');

module.exports = Vue.extend({
    template: __inline('main.html'),
    components: {
        'delete': deletePage,
        'detail': detailPage,
        'saveModal': saveModal,
    },
    data: function() {
        return {
            isShowSaveModal: false,
            isShowDetailModal: false,
            initData: {}
        };
    },
    methods: {
        operate: function(event) {
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
                if (type == 'modify') {
                    this.showModifyPage(data);
                } else if (type == 'detail') {
                    this.showDetailPage(data);
                }

                // this.$refs[type].showModal(data);
            }
        },
        reloadDataGrid: function() {
            this.$refs.datagrid.reload();
        },
        showAddPage: function() {
            this.initData = {
                id: undefined,
                name: '',
                pwd: '',
                birthday: '2016-03-08',
                state: '1',
            };

            this.isShowSaveModal = true;
        },
        showModifyPage: function(data) {
            this.initData = $.extend({}, data);

            this.isShowSaveModal = true;
        },
        showDetailPage: function(data) {
            console.log('showDetailPage--');
            this.initData = $.extend({}, data);

            this.isShowDetailModal = true;
        },
        hideSaveModal: function() {
            this.isShowSaveModal = false;
        },
        hideDetailModal: function() {
            this.isShowDetailModal = false;
        },
        getDataById: function(id) {
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
    ready: function() {

    }
});
