module.exports = {
    init: function(t) {
        var e = this;
        e.currentPage = t, e.setNavi(), void 0 === t.cutover && (t.cutover = function(t) {
            e.cutover(t);
        });
    },
    setNavi: function() {
        var i = this.currentPage;
        "pages/index/index" == this.getCurrentPageUrl() && i.setData({
            home_icon: !0
        }), getApp().getConfig(function(t) {
            var e = t.store.quick_navigation;
            e.home_img || (e.home_img = "/images/quick-home.png"), i.setData({
                setnavi: e
            });
        });
    },
    getCurrentPageUrl: function() {
        var t = getCurrentPages();
        return t[t.length - 1].route;
    },
    cutover: function() {
        var a = this.currentPage;
        a.setData({
            quick_icon: !a.data.quick_icon
        });
        var o = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), n = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), r = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), c = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        }), p = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        getApp().getConfig(function(t) {
            var e = a.data.store, i = -55;
            a.data.quick_icon ? (e.option && e.option.wxapp && e.option.wxapp.pic_url && (p.translateY(i).opacity(1).step(), 
            i -= 55), e.show_customer_service && 1 == e.show_customer_service && e.service && (c.translateY(i).opacity(1).step(), 
            i -= 55), e.option && e.option.web_service && (r.translateY(i).opacity(1).step(), 
            i -= 55), 1 == e.dial && e.dial_pic && (n.translateY(i).opacity(1).step(), i -= 55), 
            o.translateY(i).opacity(1).step()) : (o.opacity(0).step(), r.opacity(0).step(), 
            n.opacity(0).step(), c.opacity(0).step(), p.opacity(0).step()), a.setData({
                animationPlus: o.export(),
                animationcollect: r.export(),
                animationPic: n.export(),
                animationTranspond: c.export(),
                animationInput: p.export()
            });
        });
    }
};