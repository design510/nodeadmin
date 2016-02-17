'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        //auto render template file index_index.html
        return this.display();
    }

    /**
     * index action
     * @return {Promise} []
     */
    async loginAction() {
        // ʵ��������˴����ǵ���Ϊ��չ��ҳ�棬��ʹ��logic��У�����Ӻ���
        // if (this.isGet()) {
        //     return this.fail("not post");
        // }

        //data is validated in logic
        let data = this.post();
        let md5 = think.md5('think_' + data.password);

        let result = await this.model('user').findUser(data.username, md5);

        if (think.isEmpty(result)) {
            return this.fail('login fail');
        }

        //set userInfo to session
        await this.session('userInfo', result);

        return this.success(result.name);
    }
}