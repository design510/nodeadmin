var Vue = require('lib/vue');

var add = require('/modules/car_index/add/main');
var modify = require('/modules/car_index/modify/main');
var deletePage = require('/modules/car_index/delete/main');
var detail = require('/modules/car_index/detail/main');

module.exports = Vue.extend({
    template: __inline('main.html'),
    components: {
        'add': add,
        'modify': modify,
        'delete': deletePage,
        'detail': detail
    },
    methods: {
        operate: function(event) {
            console.log('operate', event.target);
            var target = event.target,
                $target = $(target),
                type = $target.data('type');

            if (!type) {
                return;
            }

            switch (type) {
                case 'modify':
                    showDlgModify(this, $target);
                    break;
                case 'delete':
                    showDlgDelete(this, $target);
                    break;
                case 'detail':
                    showDlgDetail(this, $target);
                    break;
                default:
                    break;
            }
        },
        reloadDataGrid: function() {
            this.$refs.datagrid.reload();
        }
    },
    ready: function() {

    }
});

function showDlgModify(vm, jqTarget) {
    var id = jqTarget.data('id'),
        data;

    if (!id) {
        console.error('No ID!');
        return;
    }

    data = vm.$refs.datagrid.getDataById('id', id);
    if (!data) {
        console.error('No data of id=' + id);
        return;
    }

    // console.log(data);

    vm.$refs.modify.showModal(data);
}

function showDlgDelete(vm, jqTarget) {
    var id = jqTarget.data('id'),
        data;

    if (!id) {
        console.error('No ID!');
        return;
    }

    data = vm.$refs.datagrid.getDataById('id', id);
    if (!data) {
        console.error('No data of id=' + id);
        return;
    }

    // console.log(data);

    vm.$refs.delete.showModal(data);
}

function showDlgDetail(vm, jqTarget) {
    var id = jqTarget.data('id'),
        data;

    if (!id) {
        console.error('No ID!');
        return;
    }

    data = vm.$refs.datagrid.getDataById('id', id);
    if (!data) {
        console.error('No data of id=' + id);
        return;
    }

    // console.log(data);

    vm.$refs.detail.showModal(data);
}