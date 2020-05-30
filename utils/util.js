/**
 * Copyright (C) 2018-2019
 * All rights reserved, Designed By www.zhihuizan.com
 * 注意：
 * 本软件为www.zhihuizan.com开发研制，未经购买不得使用
 * 购买后可获得全部源代码（禁止转卖、分享、上传到码云、github等开源平台）
 * 一经发现盗用、分享等行为，将追究法律责任，后果自负
 */
const validate = require('./validate.js')

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-TOKEN': wx.getStorageSync('token')
            },
            success: function(res) {

                if (res.statusCode == 200) {

                    if (res.data.errcode == "40001" || res.data.errcode == "40002") {
                        // 清除登录相关内容
                        try {
                            wx.removeStorageSync('userInfo');
                            wx.removeStorageSync('token');
                        } catch (e) {
                            // Do something when catch error
                        }
                        // 切换到登录页面
                        wx.navigateTo({
                            url: '/pages/auth/login/login'
                        });
                    } else {
                        resolve(res.data);
                    }
                } else {
                    reject(res.errMsg);
                }

            },
            fail: function(err) {
                reject(err)
            }
        })
    });
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//空值过滤器
const filterForm = (form) => {
    let obj = {};
    Object.keys(form).forEach(ele => {
        if (!validate.validatenull(form[ele])) {
            obj[ele] = form[ele]
        }
    });
    return obj;
}

module.exports = {
    request,
    formatTime: formatTime,
    filterForm: filterForm
}
