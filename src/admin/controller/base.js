'use strict';

export default class extends think.controller.base {
    /**
     * some base method in here
     */

    async __before() {
        let userInfo = await this.session('userInfo');

        // ���û��¼������ת����¼ҳ��
        if (think.isEmpty(userInfo)) {

            return this.redirect('/admin/login');
        }

        this.assign('user', userInfo);
    }
}