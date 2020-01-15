Page({
    data: {
        order: null,
        getGoodsTotalPrice: function() {
            return this.data.order.total_price;
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().core.showLoading({
            title: "正在加载"
        }), getApp().request({
            url: getApp().api.miaosha.order_details,
            data: {
                order_id: t.id
            },
            success: function(t) {
                0 == t.code && e.setData({
                    order: t.data
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    copyText: function(t) {
        var e = t.currentTarget.dataset.text;
        getApp().core.setClipboardData({
            data: e,
            success: function() {
                getApp().core.showToast({
                    title: "已复制"
                });
            }
        });
    },
    location: function() {
        var t = this.data.order.shop;
        getApp().core.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            address: t.address,
            name: t.name
        });
    }
});