var Note = require('./note.js').Note
var Toast = require('./toast.js').Toast
var EventCenter = require('./event.js')

var noteAdd = {
    add: function () {         //添加新便签
        new Note()
    },
    load: function () {
        $.get('/api/notes').done(function (result) {                  //请求所有便签数据
            if (result.status === 0) {
                $.each(result.data, function (index, data) {
                    new Note({
                        id: data.id,
                        content: data.text,
                        time: data.time,
                        index: parseInt(data.index),
                        complete: data.complete
                    })
                })
                EventCenter.fire('waterfall')
            } else {
                Toast(result.errorMsg)
            }
        }).fail(function () {
            Toast('网络异常')
        })
    },
    loadReverse: function(){
        $.get('/api/notesreverse').done(function (result) {                  //已完成便签数据
            if (result.status === 0) {
                $.each(result.data, function (index, data) {
                    new Note({
                        id: data.id,
                        content: data.text,
                        time: data.time,
                        index: parseInt(data.index),
                        complete: data.complete
                    })
                })
                EventCenter.fire('waterfall')
            } else {
                Toast(result.errorMsg)
            }
        }).fail(function () {
            Toast('网络异常')
        })
    }
}

module.exports = noteAdd