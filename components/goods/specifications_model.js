module.exports = {
    currentPage: null,
    init: function(t) {
        var a = this;
        void 0 === (a.currentPage = t).previewImage && (t.previewImage = function(t) {
            a.previewImage(t);
        }), void 0 === t.showAttrPicker && (t.showAttrPicker = function(t) {
            a.showAttrPicker(t);
        }), void 0 === t.hideAttrPicker && (t.hideAttrPicker = function(t) {
            a.hideAttrPicker(t);
        }), void 0 === t.storeAttrClick && (t.storeAttrClick = function(t) {
            a.storeAttrClick(t);
        }), void 0 === t.numberAdd && (t.numberAdd = function(t) {
            a.numberAdd(t);
        }), void 0 === t.numberSub && (t.numberSub = function(t) {
            a.numberSub(t);
        }), void 0 === t.numberBlur && (t.numberBlur = function(t) {
            a.numberBlur(t);
        });
    },
    previewImage: function(t) {
        var a = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ a ]
        });
    },
    hideAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !0
        });
    },
    groupCheck: function() {
        var r = this, t = r.data.attr_group_num, a = r.data.attr_group_num.attr_list;
        for (var i in a) a[i].checked = !1;
        t.attr_list = a;
        r.data.goods;
        r.setData({
            group_checked: 0,
            attr_group_num: t
        });
        var e = r.data.attr_group_list, o = [], d = !0;
        for (var i in e) {
            var s = !1;
            for (var n in e[i].attr_list) if (e[i].attr_list[n].checked) {
                o.push(e[i].attr_list[n].attr_id), s = !0;
                break;
            }
            if (!s) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: r.data.goods.id,
                group_id: r.data.group_checked,
                attr_list: JSON.stringify(o)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = r.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    r.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var r = this.currentPage, a = t.target.dataset.id, i = r.data.attr_group_num, e = i.attr_list;
        for (var o in e) e[o].id == a ? e[o].checked = !0 : e[o].checked = !1;
        i.attr_list = e, r.setData({
            attr_group_num: i,
            group_checked: a
        });
        var d = r.data.attr_group_list, s = [], n = !0;
        for (var o in d) {
            var c = !1;
            for (var u in d[o].attr_list) if (d[o].attr_list[u].checked) {
                s.push(d[o].attr_list[u].attr_id), c = !0;
                break;
            }
            if (!c) {
                n = !1;
                break;
            }
        }
        n && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: r.data.goods.id,
                group_id: r.data.group_checked,
                attr_list: JSON.stringify(s)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = r.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    r.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    storeAttrClick: function(t) {
        var i = this.currentPage, a = t.target.dataset.groupId, r = parseInt(t.target.dataset.id), e = i.data.attr_group_list, o = i.data.goods.attr;
        for (var d in "string" == typeof o && (o = JSON.parse(o)), e) if (e[d].attr_group_id == a) for (var s in e[d].attr_list) {
            var n = e[d].attr_list[s];
            if (parseInt(n.attr_id) === r && n.checked ? n.checked = !1 : n.checked = parseInt(n.attr_id) === r, 
            n.attr_id === r && n.attr_num_0) return void (n.checked = !1);
        }
        var c = [];
        for (var d in o) if (0 === o[d].num) {
            var u = [];
            for (var p in o[d].attr_list) u.push(o[d].attr_list[p].attr_id);
            c.push(u);
        }
        var g = [];
        for (var d in e) for (var s in e[d].attr_list) e[d].attr_list[s].checked && g.push(e[d].attr_list[s].attr_id);
        var _ = [];
        for (var d in g) for (var s in c) if (getApp().helper.inArray(g[d], c[s])) for (var l in c[s]) c[s][l] !== g[d] && _.push(c[s][l]);
        for (var d in e) for (var s in e[d].attr_list) {
            var f = e[d].attr_list[s];
            f.attr_num_0 = getApp().helper.inArray(f.attr_id, _);
        }
        i.setData({
            attr_group_list: e
        });
        var h = [], v = !0;
        for (var d in e) {
            var m = !1;
            for (var s in e[d].attr_list) if (e[d].attr_list[s].checked) {
                if ("INTEGRAL" !== i.data.pageType) {
                    h.push(e[d].attr_list[s].attr_id), m = !0;
                    break;
                }
                o = {
                    attr_id: e[d].attr_list[s].attr_id,
                    attr_name: e[d].attr_list[s].attr_name
                };
                h.push(o);
            }
            if ("INTEGRAL" !== i.data.pageType && !m) {
                v = !1;
                break;
            }
        }
        if ("INTEGRAL" === i.data.pageType || v) {
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            });
            var A = i.data.pageType;
            if ("STORE" === A) var k = getApp().api.default.goods_attr_info; else if ("PINTUAN" === A) k = getApp().api.group.goods_attr_info; else {
                if ("INTEGRAL" === A) return getApp().core.hideLoading(), void this.integralMallAttrClick(h);
                if ("BOOK" === A) return getApp().core.hideLoading(), void this.bookAttrGoodsClick(h);
                if ("MIAOSHA" !== A) return getApp().core.showModal({
                    title: "提示",
                    content: "pageType变量未定义或变量值不是预期的"
                }), void getApp().core.hideLoading();
                k = getApp().api.default.goods_attr_info;
            }
            getApp().request({
                url: k,
                data: {
                    goods_id: "MIAOSHA" === A ? i.data.id : i.data.goods.id,
                    group_id: i.data.group_checked,
                    attr_list: JSON.stringify(h),
                    type: "MIAOSHA" === A ? "ms" : ""
                },
                success: function(t) {
                    if (getApp().core.hideLoading(), 0 == t.code) {
                        var a = i.data.goods;
                        if (a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                        "MIAOSHA" === A) {
                            var r = t.data.miaosha;
                            a.price = r.miaosha_price, i.setData({
                                miaosha_data: r
                            });
                        }
                        i.setData({
                            goods: a
                        });
                    }
                }
            });
        }
    },
    attrClick: function(t) {
        var r = this, a = t.target.dataset.groupId, i = t.target.dataset.id, e = r.data.attr_group_list;
        for (var o in e) if (e[o].attr_group_id == a) for (var d in e[o].attr_list) e[o].attr_list[d].attr_id == i ? e[o].attr_list[d].checked = !0 : e[o].attr_list[d].checked = !1;
        r.setData({
            attr_group_list: e
        });
        var s = [], n = !0;
        for (var o in e) {
            var c = !1;
            for (var d in e[o].attr_list) if (e[o].attr_list[d].checked) {
                s.push(e[o].attr_list[d].attr_id), c = !0;
                break;
            }
            if (!c) {
                n = !1;
                break;
            }
        }
        n && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.default.goods_attr_info,
            data: {
                goods_id: r.data.id,
                attr_list: JSON.stringify(s),
                type: "ms"
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = r.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, r.setData({
                        goods: a,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },
    bookAttrGoodsClick: function(e) {
        var o = this.currentPage, d = o.data.goods;
        d.attr.forEach(function(t, a, r) {
            var i = [];
            t.attr_list.forEach(function(t, a, r) {
                i.push(t.attr_id);
            }), e.sort().toString() == i.sort().toString() && (d.attr_pic = t.pic, d.num = t.num, 
            d.price = t.price, o.setData({
                goods: d
            }));
        });
    },
    integralMallAttrClick: function(t) {
        var a = this.currentPage, r = a.data.goods, i = r.attr, e = 0, o = 0;
        for (var d in i) JSON.stringify(i[d].attr_list) == JSON.stringify(t) && (e = 0 < parseFloat(i[d].price) ? i[d].price : r.price, 
        o = 0 < parseInt(i[d].integral) ? i[d].integral : r.integral, r.num = i[d].num, 
        a.setData({
            attr_integral: o,
            attr_num: i[d].num,
            attr_price: e,
            status: "attr",
            goods: r
        }));
    },
    numberSub: function() {
        var t = this.currentPage, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this.currentPage, a = t.data.form.number;
        ++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this.currentPage, r = t.detail.value;
        r = parseInt(r), isNaN(r) && (r = 1), r <= 0 && (r = 1), r > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), r = a.data.goods.one_buy_limit), a.setData({
            form: {
                number: r
            }
        });
    }
};