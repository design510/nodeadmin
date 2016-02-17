/**
 * 需要支持：
 * 1. 大数据，后台分页
 * 2. 少量数据全加载，前端分页
 *
 * 1. 原生table
 * 2. ajax动态加载生成
 */

var Vue = require('lib/vue');

Vue.component('datagrid', {
    template: __inline('main.html'),
    data: function() {
        return {
            jqTable: undefined, //table的jQuery对象
            tableId: undefined, // table的Id
            itemArray: [], // 项列表
        };
    },
    props: {
        /**
         * 列表的类型
         * 前台分页：front; 后台分页：server
         */
        'type': {
            type: String,
            'default': 'front'
        },
        'url': String,
    },
    ready: function() {
        // 缓存该值，避免重复获取
        this.$set('jqTable', $('.datagrid-table', $(this.$el)));

        // 循环遍历 $vm.$children，从中获得每一项数据，并存入到itemArray字段中
        var items = this.$children,
            itemArray = [];

        items.forEach(function(item) {
            itemArray.push({
                'name': item.name,
                'title': item.title
            });
        });

        this.$set('itemArray', itemArray);

        // 初始化
        _init(this);
    }
});


function _init(vm) {
    $(function() {

        initDataGrid(vm);

    });
}

function initDataGrid(vm) {
    switch (vm.type) {
        case 'server':
            initAjaxServer(vm);
            break;
        default:
            initAjaxFront(vm);
            break;
    }
}


function getDataGridOptions() {
    $.extend(true, $.fn.DataTable.TableTools.classes, {
        "container": "btn-group tabletools-dropdown-on-portlet",
        "buttons": {
            "normal": "btn btn-sm btn-default",
            "disabled": "btn btn-sm btn-default disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu tabletools-dropdown-menu"
        }
    });

    var options = {
        // "order": [
        //     [0, 'asc']
        // ],

        "lengthMenu": [
            [5, 10, 50, -1],
            [5, 10, 50, "All"] // change per page values here
        ],

        /**
         * https://datatables.net/reference/option/pageLength
         * Change the initial page length (number of rows per page).
         * Default value: 10.
         *
         * 设置每一页展示多少条记录，最好在lengthMenu中定义了该值，否则会导致lengthMenu中没有选中的值
         */
        "pageLength": 5,

        "language": {
            "info": "第 _START_ 条到第 _END_ 条记录 (总计 _TOTAL_ 条记录)",
            "processing": "加载中，请稍后...",
            "search": "搜索: ",
            "infoFiltered": "从 _MAX_ 条记录过滤后的结果"
        },

        "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        "tableTools": {
            "sSwfPath": "/static/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "aButtons": [{
                "sExtends": "pdf",
                "sButtonText": "PDF"
            }, {
                "sExtends": "csv",
                "sButtonText": "CSV"
            }, {
                "sExtends": "xls",
                "sButtonText": "Excel"
            }, {
                "sExtends": "print",
                "sButtonText": "Print",
                "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                "sMessage": "Generated by DataTables"
            }]
        }
    };

    return options;
}


var initAjaxFront = function(vm) {
    var jqTable = vm.jqTable;

    // url
    var url = vm.url;
    if (!url) {
        console.error('Unknown url', url, vm);
        return;
    }

    // columns and columnDefs
    var itemArray = vm.itemArray,
        columns = [],
        columnDefs = [];

    if (!itemArray.length) {
        console.error('Unknown itemArray', itemArray, vm);
        return;
    }

    itemArray.forEach(function(item) {
        columns.push({
            'data': item.name,
            'title': item.title ? item.title : item.name
        });
    });

    // 配置
    var dataTableOptions = getDataGridOptions();

    // 请求
    dataTableOptions.ajax = {
        "url": url
    };

    // columns
    dataTableOptions.columns = columns;

    // columnDefs
    if (columnDefs.length) {
        dataTableOptions.columnDefs = columnDefs;
    }

    // 开始生成datatables
    var oTable = jqTable.dataTable(dataTableOptions);

    // 获取并缓存table的id
    vm.$set('tableId', jqTable.attr('id'));

    // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    var tableWrapper = $('#' + vm.tableId + '_wrapper');

    // initialize select2 dropdown
    tableWrapper.find('.dataTables_length select').select2();
};

// TODO reload
var initAjaxServer = function(vm) {
    var jqTable = vm.jqTable;

    var url = vm.url;
    if (!url) {
        console.error('Unknown url', url, vm);
        return;
    }

    $.extend(true, $.fn.DataTable.TableTools.classes, {
        "container": "btn-group tabletools-dropdown-on-portlet",
        "buttons": {
            "normal": "btn btn-sm btn-default",
            "disabled": "btn btn-sm btn-default disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu tabletools-dropdown-menu"
        }
    });

    var oTable = jqTable.dataTable({
        "order": [
            [0, 'asc']
        ],

        "lengthMenu": [
            [10, 20, 50, -1],
            [10, 20, 50, "All"] // change per page values here
        ],

        /**
         * https://datatables.net/reference/option/pageLength
         * Change the initial page length (number of rows per page).
         * Default value: 10.
         *
         * 设置每一页展示多少条记录，最好在lengthMenu中定义了该值，否则会导致lengthMenu中没有选中的值
         */
        "pageLength": 10,

        "language": {
            "info": "第 _START_ 条到第 _END_ 条记录 (总计 _TOTAL_ 条记录)",
            "processing": "加载中，请稍后...",
            "search": "搜索: ",
            "infoFiltered": "从 _MAX_ 条记录过滤后的结果"
        },

        "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        "tableTools": {
            "sSwfPath": "/static/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
            "aButtons": [{
                "sExtends": "pdf",
                "sButtonText": "PDF"
            }, {
                "sExtends": "csv",
                "sButtonText": "CSV"
            }, {
                "sExtends": "xls",
                "sButtonText": "Excel"
            }, {
                "sExtends": "print",
                "sButtonText": "Print",
                "sInfo": 'Please press "CTR+P" to print or "ESC" to quit',
                "sMessage": "Generated by DataTables"
            }]
        },
        "ordering": false, //关闭列排序

        "processing": true,

        /**
         * https://datatables.net/reference/option/serverSide
         * 服务器模式，在分页和查找时会重新去请求数据
         */
        "serverSide": true,

        /**
         * https://datatables.net/reference/option/deferRender
         * 默认是 false 。即默认情况下，DataTables会将获得的数据全部渲染成 HTML 元素，但这种处理在大数据时会影响性能，尤其在 IE6-IE8。
         * 推荐在后台分页处理时，将其设置为 true，即延迟渲染，按需渲染。
         */
        // "deferRender": true,

        /**
         * https://datatables.net/reference/option/destroy
         * Destroy any existing table matching the selector and replace with the new options. 
         * Default value: false.
         *
         * 如果某个table已经被渲染成了DataTables，是否采用销毁的方式来重渲染表格。
         */
        // "destroy": true,
        "ajax": {
            "url": url,
            "type": "POST",
            "data": function(d) {
                d.myKey = "myValue";
                // d.custom = $('#myInput').val();
                // etc
                // 此处可以追加一些请求参数
            }
        },
        "columns": [{
            "data": "first_name",
            "title": "first_name"
        }, {
            "data": "last_name",
            "title": "last_name"
        }, {
            "data": "position",
            "title": "position"
        }, {
            "data": "office",
            "title": "office"
        }, {
            "data": "start_date",
            "title": "start_date"
        }, {
            "data": "salary",
            "title": "salary",
            "render": function(data, type, row, meta) {
                return data.replace(/\$/g, "￥");
            }
        }],

        /**
         * https://datatables.net/reference/option/columnDefs
         * Set column definition initialisation properties.
         *
         * 非常像 columns，用于定义如何初始化属性，但它不要求每一列都要定义。因为下面的冲突规则，因此建议如果需要动态改变的，则使用 columnDefs 来定义，例如 visible 属性，这样便于控制。而且也方便集中批量配置。
         *
         * 定义冲突规则：
         * 1. columns 中的优先级要高
         * 2. columnDefs 中使用数组来定义的属性要比其他的定义的高，比如下例中第一列和第二列将显示，其他列隐藏
         * 
         */
        "columnDefs": [{
            targets: [0, 1],
            visible: true
        }, {
            targets: '_all',
            visible: false
        }]

    });

    // 获取并缓存table的id
    vm.$set('tableId', jqTable.attr('id'));

    // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    var tableWrapper = $('#' + vm.tableId + '_wrapper');

    // initialize select2 dropdown
    tableWrapper.find('.dataTables_length select').select2();
};
