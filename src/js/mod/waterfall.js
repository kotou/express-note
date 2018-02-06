var waterfall = {
    init: function ($c) {
        var _this = this
        this.$ct = $c
        this.$items = this.$ct.children()
        this.render()
    },
    render: function () {
        var _this = this
        var colHeightArr = []
        var nodeWidth = this.$items.outerWidth(true)
        var column = Math.floor(this.$ct.width() / nodeWidth)
        for (var i = 0; i < column; i++) {
            colHeightArr[i] = 0
        }
        this.$items.each(function () {
            var minValue = colHeightArr[0]
            var minIndex = 0
            for (var i = 0; i < column; i++) {
                if (colHeightArr[i] < minValue) {
                    minValue = colHeightArr[i]
                    minIndex = i
                }
            }
            $(this).css({
                left: minIndex * nodeWidth,
                top: minValue
            })
            colHeightArr[minIndex] += $(this).outerHeight(true)
        })
    }
}

module.exports = waterfall