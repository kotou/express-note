require('less/note.less')
require('less/dialog.less')
var Toast = require('./toast.js').Toast
var EventCenter = require('./event.js')

function note(set) {
    this.init(set)
    this.found()
    this.bind()
}

note.prototype = {
    init: function (set) {
        var myDate = new Date()                                    //获取当前时间
        var added = $('.note-text').val()                          // 获取添加页的用户的输入内容
        var index = $('.alter').children('.star').length - 1       //通过class判断添加页鼠标指向星星的index
        var year = myDate.getFullYear()
        var month = (myDate.getMonth() + 1)
        var daily = myDate.getDate()
        month = (month.toString().length = 1) ? '0' + month : month
        daily = (myDate.getDate().length = 1) ? '0' + daily : daily
        this.default = {
            id: '',
            $ct: $('.content'),
            content: added,
            index: index,
            time: year + '年' + month + '月' + daily + '日',
            complete: 'no'                 //便签是否完成，默认未完成
        }
        this.set = $.extend({}, this.default, set || {})  //获取数据时用传入数据创建，添加时用默认数据创建
        if (this.set.id) {
            this.id = this.set.id
        }
    },
    found: function () {
        var _this = this
        var tpl = '<div class="note">\
       <div class = "note-header clearfix">\
       <span class="time"></span>\
       <span class = "delete iconfont icon-delete"></span>\
       </div>\
       <div class="note-ct">\
       <div class = "note-panel"><pre class="panel-text"></pre></div>\
       <ul class="star-level clearfix">\
        <li class="extent star iconfont icon-score"></li>\
        <li class="extent iconfont icon-score"></li>\
        <li class="extent iconfont icon-score"></li>\
        <li class="extent iconfont icon-score"></li>\
        <li class="extent iconfont icon-score"></li>\
       </ul >\
       </div >\
        <div class="btn">\
         <span class="state">已完成</span>\
         <span class="iconfont icon-complete"></span>\
        </div >\
       </div>'
        this.$note = $(tpl)
        this.set.$ct.append(this.$note)                        //添加到页面
        this.$note.find('.time').text(this.set.time)                  //传入时间
        this.$note.find('.panel-text').text(this.set.content)         //传入内容
        this.$note.find('.star-level').children('.extent').eq(this.set.index).addClass('star')      //给对应index的星星加class点亮星星
        this.$note.find('.star-level').children('.extent').eq(this.set.index).prevAll().addClass('star')  //给index前的星星添加class
        this.$state = this.$note.find('.state')
        this.$complete = this.$note.find('.icon-complete')
        if (this.set.complete === 'yes') {                    //便签的完成与否显示在页面上
            this.$complete.css('z-index', '-1')
            this.$state.css('z-index', '0')
            this.$note.removeClass('uncompleted')
        } else {
            this.$state.css('z-index', '-1')
            this.$complete.css('z-index', '0')
            this.$note.addClass('uncompleted')
        }
        if (!this.id) {                                 //判断this.id是否存在知道当前是添加新便签还是从服务器获取数据添加便签，决定是否执行向服务器添加数据
            var info = {
                time: _this.set.time,
                noteText: _this.set.content,
                index: _this.set.index
            }
            _this.add(info)
        }
    },

    publish: function () {
        EventCenter.fire('waterfall')      //创建事件运行瀑布流组件
    },

    bind: function () {
        var _this = this
        var $note = this.$note
        var $icModify = $note.find('.icon-modify')
        var $delete = $note.find('.delete')
        var $noteCt = $note.find('.note-ct')
        var $starLe = $note.find('.star-level')

        /* 修改 */
        $noteCt.on('click', function () {
            var tpl = '<div class="modify-note">\
            <span class="close iconfont icon-delete"></span>\
                <h3>编辑便签</h3>\
                <textarea class="note-edit" name="" id="" cols="40" rows="10" placeholder="输入内容"></textarea>\
                <div class="mod-level clearfix">\
                    <p class="grade">重要星级：&nbsp;&nbsp;</p>\
                    <ul class="change clearfix">\
                        <li class="degree star iconfont icon-score"></li>\
                        <li class="degree iconfont icon-score"></li>\
                        <li class="degree iconfont icon-score"></li>\
                        <li class="degree iconfont icon-score"></li>\
                        <li class="degree iconfont icon-score"></li>\
                    </ul>\
                </div>\
                <span class="edit">修改</span>\
                </div>'
            _this.$modify = $(tpl)
            $('body').prepend(_this.$modify)   //点击页面内容与星星区域时创建修改页到页面上
            $('.mask').css('display', 'block')   //显示遮罩
            _this.$panel = $(this).find('.panel-text')          //选中被点击元素的对应子元素
            _this.$level = $(this).find('.star-level')
            _this.$time = $(this).find('.time')
            var $change = _this.$modify.find('.change')         //选中修改页上的对应子元素
            var $del = _this.$modify.find('.icon-delete')
            var $edit = _this.$modify.find('.edit')
            var $noteEdit = _this.$modify.find('.note-edit')
            var main = _this.$panel.text()                         //获取被点击元素的便签内容
            var idx = _this.$level.children('.star').length - 1    //获取被点击元素的点亮的最后一个星星的index
            $change.find('.degree').mouseover(function () {        //鼠标指在修改页星星上时添加class
                $(this).addClass('star')
                $(this).prevAll('.degree').addClass('star')
                $(this).nextAll('.degree').removeClass('star')
            })

            $del.on('click', function () {                         //关闭修改页
                _this.$modify.remove()
                $('.mask').css('display', 'none')
            })

            $noteEdit.val(main)                                     //将被点击元素获取的便签内容添加到修改页中
            $change.children('.degree').eq(idx).addClass('star')    //根据被点击元素获取的最后一个星星的index改变修改页的点亮星星数
            $change.children('.degree').eq(idx).nextAll().removeClass('star')
            $change.children('.degree').eq(idx).prevAll().addClass('star')
            $edit.on('click', function () {
                var myDate = new Date()
                var year = myDate.getFullYear()
                var month = (myDate.getMonth() + 1)
                var daily = myDate.getDate()
                month = (month.toString().length = 1) ? '0' + month : month
                daily = (myDate.getDate().length = 1) ? '0' + daily : daily
                var time = year + '年' + month + '月' + daily + '日'
                main = $noteEdit.val()              //点击修改时修改页的内容
                idx = $change.children('.star').length - 1   //点击修改时最后一个点亮星星的index
                _this.info = {
                    index: idx,
                    noteText: main,
                    time: time
                }
                _this.modify(_this.info)
                _this.$modify.remove()
                $('.mask').css('display', 'none')
            })
        })

        /* 删除 */
        $delete.on('click', function () {
            _this.delete()
        })

        /* 完成 */
        this.$state.on('click', function () {
            _this.set.complete = 'no'              //点击时更改完成状态
            _this.fulfil()
        })
        this.$complete.on('click', function () {
            _this.set.complete = 'yes'
            _this.fulfil()
        })
    },


    add: function (info) {
        var _this = this
        $.post('/api/notes/add', {
            note: info.noteText,
            time: info.time,
            index: info.index
        }).done(function (result) {
            if (result.status === 0) {
                var id = result.id
                _this.id = id                                      //创建新便签成功后给当前便签添加id，否则无法修改
                $('.mask,.new-note').css('display', 'none')        //隐藏遮罩的添加页
                $('.note-text').val('')                            //添加完成后清空添加页的用户输入内容
                $('.alter').children('.degree').eq(0).nextAll().removeClass('star') //添加完成后清空点亮的星星为默认值
                Toast('已添加')                                      //提示内容
                _this.publish()                                     //瀑布流
            } else {
                $('.mask,.new-note').css('display', 'none')
                _this.$note.remove();                              //添加失败时删除创建的便签
                Toast(result.errorMsg)
            }
        }).fail(function () {
            $('.mask,.modify-note').css('display', 'none')
            Toast('网络异常')
        })
    },

    modify: function (info) {
        var _this = this
        $.post('/api/notes/modify', {
            id: this.id,
            note: info.noteText,
            time: info.time,
            index: info.index
        }).done(function (result) {
            if (result.status === 0) {
                _this.$panel.text(_this.info.noteText)            //修改成功后将修改页的用户便签内容放在被点击元素上
                _this.$time.text(_this.info.time)
                _this.$level.children().eq(_this.info.index).addClass('star')           //修改成功后给被点击元素的对应index的星星添加class
                _this.$level.children().eq(_this.info.index).nextAll().removeClass('star')    //给被点击元素的对应index的后面的星星删除class
                _this.$level.children().eq(_this.info.index).prevAll().addClass('star')     //给被点击元素的对应index前面的星星添加class
                Toast('已修改')
                _this.publish()
            }
            if (result.status === 1) {    //失败时处理不同返回值
                Toast(result.errorMsg)
            }
            if (result.status === 2) {
                Toast(result.errorMsg)
            }
            if (result.status === 3) {
                Toast(result.errorMsg)
            }
        }).fail(function () {
            Toast('网络异常')
        })
    },

    delete: function () {
        var _this = this
        $.post('/api/notes/delete', {
            id: this.id
        }).done(function (result) {
            if (result.status === 0) {
                Toast('已删除')
                _this.$note.remove()
                _this.publish()
            } else {
                Toast(result.errorMsg)
            }
        }).fail(function () {
            Toast('网络异常')
        })
    },

    fulfil: function () {
        var _this = this
        $.post('/api/notes/fulfil', {
            id: this.id,
            complete: this.set.complete                     //上传被点击元素便签的的完成状态
        }).done(function (result) {
            if (result.status === 0) {
                if (_this.set.complete === 'yes') {              //成功后修改被点击元素便签的的完成状态
                    _this.$complete.css('z-index', '-1')
                    _this.$state.css('z-index', '0')
                    _this.$note.removeClass('uncompleted')
                    Toast('已完成')
                } else {
                    _this.$state.css('z-index', '-1')
                    _this.$complete.css('z-index', '0')
                    _this.$note.addClass('uncompleted')
                    Toast('未完成')
                }
            } else {
                Toast(result.errorMsg)
            }
        }).fail(function () {
            Toast('网络异常')
        })
    }
}

module.exports.Note = note