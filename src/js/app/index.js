require('less/index.less')
var EventCenter = require('../mod/event.js')
var waterfall = require('../mod/waterfall.js')
var noteAdd = require('../mod/note-add.js')

EventCenter.on('waterfall', function () {
    waterfall.init($('.content'))                    //监听事件，运行瀑布流，传入执行瀑布流的元素
})

noteAdd.load()                                //打开页面时从服务器获取数据
$('.add').on('click', function () {             //点击添加按钮时显示添加页和遮罩
    $('.mask,.new-note').css('display', 'block')
})
$('.added').on('click',function(){
    noteAdd.add()
})

$('.close').on('click', function () {                 //关闭添加页时清空输入内容
    $('.mask,.new-note').css('display', 'none')
    $('.note-text').val('')
    $('.alter').children('.degree').eq(0).nextAll().removeClass('star')
})

$(window).on('resize', function () {             //窗口大小改变时创建事件执行瀑布流
    EventCenter.fire('waterfall')
})

$(window).scroll(function () {                    //滚动条改变时决定用作“点击回到顶部”的元素是否隐藏
    if ($(window).scrollTop() >= 50) {
        $('.top').fadeIn();
    }else{
        $('.top').fadeOut()
    }
})

$('.top').on('click',function () {                 //点击元素页面回到顶部
    $('html,body').animate({ scrollTop: 0 }, 500);
})

$('.degree').mouseover(function () {                    //根据鼠标指向星星的位置点亮添加页的星星
    $(this).addClass('star')
    $(this).prevAll('.degree').addClass('star')
    $(this).nextAll('.degree').removeClass('star')
})

$('.completed').on('click',function(){               //点击页面顶部“已完成”时删除未完成数据
    $('.note.uncompleted').remove()
    $(this).addClass('selected')
    $('.whole').removeClass('selected')
    EventCenter.fire('waterfall')
})

$('.whole').on('click',function(){                       //点击页面顶部“全部”时重新获取数据
    $('.note').remove()
    $(this).addClass('selected')
    $('.completed').removeClass('selected')
    if($('.order').css('display')=='none'){          //判断“正序”的css获取不同排序数据
        noteAdd.loadReverse()
    }else{
        noteAdd.load()
    }
})

$('.order-ct').on('click',function(){                    //改变排序方式时将便签倒序
    $('.content>.note').each(function(){
      $(this).prependTo('.content')
    })
    if($('.order').css('display')=='none'){
        $('.reverse').css('display','none')
        $('.order').css('display','block')
    }else{
        $('.order').css('display','none')
        $('.reverse').css('display','block')
    }
    EventCenter.fire('waterfall')
})
