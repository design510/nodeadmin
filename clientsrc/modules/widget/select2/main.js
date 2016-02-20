/**
 * 有两种，一种是ajax请求的，一种是现成的
 * 
 * 数据优先级依次是 select2-option > init-data > url
 *
 // 直接设置select2-option
 <select2 value="1">
    <select2-option title="hello1" value="1"></select2-option>
    <select2-option title="word2" value="2"></select2-option>
    <select2-option title="test3" value="3"></select2-option>
</select2>

// 增加一个数据源init-data，它是数据，相对于设置了一个初始的data，同时也支持select2-option（优先级高）
<select2 :init-data="select2data" init-value="2">
    <select2-option title="test4" value="4"></select2-option>
</select2>

<select2 url="/admin/user/getgroup">
    <select2-option title="test4" value="4"></select2-option>
</select2>
 */

var Vue = require('lib/vue');

Vue.component('select2', {
    template: __inline('main.html'),
    data: function() {
        return {
            /**
             * 当前select2的options范围，包括select2-option中数据和init-data或者url或者ajax数据的集合
             */
            data: [],
            /**
             * 当前select2的value值
             */
            value: undefined,
            jqSelect: undefined
        }
    },
    props: {
        /**
         * 初始值
         */
        initValue: null,
        /**
         * 初始data
         */
        initData: Array,
        /**
         * 数据来源地址
         */
        url: String,
        placeholder: {
            type: String,
            'default': '请选择'
        },
        allowClear: {
            type: Boolean,
            'default': false
        },
        /**
         * 是否懒渲染
         */
        lazy: {
            type: Boolean,
            'default': false
        }
    },
    computed: {
        options: function() {
            var result = {};

            result.data = this.data;

            if (this.allowClear) {
                result.allowClear = true;
            }

            result.placeholder = this.placeholder;

            return result;
        }
    },
    methods: {
        /**
         * 销毁select2
         */
        destroy: function() {
            if (this.jqSelect) {
                this.jqSelect.off().select2('destroy');
                this.jqSelect = undefined;
            }
        },
        init: function() {
            // 调用Init之后，要将lazy标志给取消，否则他将被隐藏
            this.lazy = false;

            // 初始化前要先销毁原来的那个
            this.destroy();

            // 获得data，如果有select2-option，则追加到data字段中，并且具有较高优先级
            var select2options = this.$children,
                data = select2options.map(function(item) {
                    return {
                        id: item.value,
                        text: item.title
                    }
                });

            // 来自init-data的数据
            if (this.initData && Array.isArray(this.initData)) {
                data = data.concat(this.initData);
            }

            // 来自url的请求数据
            var self = this;

            if (this.url) {
                $.post(this.url, function(res, status) {
                    if (res.errno === 0) {
                        data = data.concat(res.data.map(function(item) {
                            return {
                                id: item.id,
                                text: item.name
                            }
                        }));
                    }

                    self.data = data;
                    self._renderSelect2();
                });
            } else {
                this.data = data;
                this._renderSelect2();
            }

        },
        _renderSelect2: function() {
            // select2 
            var self = this,
                options = this.options,
                jqSelect = $('input', this.$el)
                .select2(options)
                .on('change', function() {
                    self.value = this.value;
                });

            this.jqSelect = jqSelect;

            // 设置默认值
            if (this.initValue) {
                this.jqSelect.val(this.initValue).trigger('change');
            }
        }
    },
    watch: {
        /**
         * 当初始data值变化了时，重新渲染select2
         */
        'initData': {
            handler: function(val, oldVal) {
                this.init();
            },
            deep: true
        }
    },
    ready: function() {
        // 如果不是lazy模式，则立即渲染
        if (!this.lazy) {
            this.init();
        }
    }
});

// newData = [{
//     id: 1,
//     text: 'hello'
// }, {
//     id: 2,
//     text: 'world'
// }, {
//     id: 3,
//     text: 'what'
// }];
