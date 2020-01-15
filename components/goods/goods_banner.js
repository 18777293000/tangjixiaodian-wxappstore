module.exports = {
    currentPage: null,
    init: function(o) {
        var e = this;
        void 0 === (e.currentPage = o).onGoodsImageClick && (o.onGoodsImageClick = function(o) {
            e.onGoodsImageClick(o);
        });
    },
    onGoodsImageClick: function(o) {
        var e = this.currentPage, t = [], i = o.currentTarget.dataset.index;
        for (var r in e.data.goods.pic_list) t.push(e.data.goods.pic_list[r]);
        getApp().core.previewImage({
            urls: t,
            current: t[i]
        });
    }
};