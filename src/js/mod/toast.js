require('less/toast.less')
function toast(msg, time) {
    this.msg = msg
    this.time = time || 1000
    this.createToast()
    this.showToast()
}

toast.prototype = {
    createToast: function () {
        this.tpl = $('<div class="notice"><span>' + this.msg + '</span></div>')
        $('body').append(this.tpl)
    },
    showToast: function () {
        var _this = this
        this.tpl.fadeIn(300, function () {
            setTimeout(function () {
                _this.tpl.fadeOut(300, function () {
                    _this.tpl.remove()
                })
            }, _this.time)
        })
    }
}

function Toast(msg, time) {
    return new toast(msg, time)
}

module.exports.Toast = Toast