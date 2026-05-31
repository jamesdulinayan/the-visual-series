(function() {
    function e(e) {
        var n = {};
        e.split("&").forEach(function(e) {
            if (!e) return;
            e = e.split("+").join(" ");
            var t = e.indexOf("=");
            var i = t > -1 ? e.substr(0, t) : e;
            var o = t > -1 ? decodeURIComponent(e.substr(t + 1)) : "";
            var r = i.indexOf("[");
            if (r == -1) n[decodeURIComponent(i)] = o;
            else {
                var a = i.indexOf("]");
                var f = decodeURIComponent(i.substring(r + 1, a));
                i = decodeURIComponent(i.substring(0, r));
                if (!n[i]) n[i] = [];
                if (!f) n[i].push(o);
                else n[i][f] = o
            }
        });
        return n
    }

    function n(e) {
        var n = e.offsetTop;
        var t = e;
        while (t.offsetParent && t.offsetParent != document.body) {
            t = t.offsetParent;
            n += t.offsetTop
        }
        if (typeof e.getAttribute == "function") {
            var i = parseInt(e.getAttribute("data-offset-top"));
            if (i) n -= i
        }
        return n
    }

    function t(e, n, t = "auto") {
        var i = document.documentElement,
            o = document.body;
        var r = i && i.scrollLeft || o && o.scrollLeft || 0;
        var a = i && i.scrollTop || o && o.scrollTop || 0;
        var f = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if (n && (a < e && e < a + f)) {
            return
        }
        if (window.scrollTo != "undefined") {
            window.scrollTo({
                left: r,
                top: e < 0 ? 0 : e,
                behavior: t
            })
        }
    }

    function i(e, n, t) {
        if (e.addEventListener) e.addEventListener(n, t, false);
        else if (e.attachEvent) e.attachEvent("on" + n, t)
    }

    function o(e, n) {
        if (typeof e != "undefined" && typeof e.contentWindow != "undefined" && typeof e.contentWindow.postMessage == "function") {
            e.contentWindow.postMessage(n, "*")
        }
    }

    function r(e) {
        var n = 0;
        var t = 20;
        var i;
        var r = function() {
            if (n > t - 1) {
                clearInterval(i);
                return
            }
            n++;
            if (typeof gtag !== "undefined" && d) {
                gtag("get", d, "client_id", function(n) {
                    if (n) {
                        t = 0;
                        o(e, "gacid:" + n)
                    }
                })
            } else {
                var r = undefined;
                if (typeof ga != "undefined") {
                    r = ga
                } else if (typeof __gaTracker != "undefined") {
                    r = __gaTracker
                } else {
                    return
                }
                r(function(i) {
                    if (n > t - 1) {
                        return
                    }
                    if (!i) i = r.getAll()[0];
                    var a = i.get("clientId");
                    if (a) {
                        t = 0;
                        o(e, "gacid:" + a)
                    }
                })
            }
        };
        i = setInterval(r, 250);
        r()
    }

    function a(e) {
        var i = +new Date;
        if (!e.hasLoaded || i - e.hasLoaded < 500) {
            e.hasLoaded = i;
            r(e)
        } else if (typeof window.scrollTo != "undefined") {
            t(n(e))
        }
        o(e, "acuity:init")
    }

    function f(e, i) {
        if (!e || !i) return;
        if (typeof e.contentWindow != "undefined" && typeof i.source != "undefined" && e.contentWindow !== i.source) {
            return
        }
        if (typeof i.data == "undefined" || typeof i.data.split == "undefined") return;
        try {
            var o = i.data.split(":");
            var r = o[0];
            var f = parseInt(o[1]);
            var s = o[2] || "auto";
            if (r == "sizing" && f > 150) {
                if (typeof e.origCss == "undefined") {
                    e.origCss = e.style.cssText
                }
                e.style.cssText = (e.origCss ? e.origCss + ";" : "") + "height:" + f + "px !important;max-height:none;overflow:hidden;"
            } else if (r == "load") {
                a(e)
            } else if (r == "scrollTo" && !isNaN(f)) {
                t(n(e) + f, true, s)
            } else if (r == "scrollBy" && !isNaN(f)) {
                window.scrollBy({
                    top: f,
                    behavior: s
                })
            }
        } catch (e) {
            return
        }
    }

    function s(n) {
        var t = [/first_name/, /last_name/, /firstName/, /lastName/, /phone/, /email/, /certificate/, /datetime/, /field:[0-9]+?/, /appointmentType/, /appointmentTypeID/, /calendarID/];
        var i = e(location.search.substr(1));
        var o = newIfrSrc = n.src;
        for (var r in i) {
            for (var a = 0; a < t.length; a++) {
                var f = t[a];
                if (r.match(f) && o.indexOf(r + "=") === -1) {
                    var s = i[r];
                    var d = encodeURIComponent(r);
                    if (typeof s == "object") {
                        d = d + "[]";
                        s = s.join("&" + d + "=")
                    } else {
                        s = encodeURIComponent(s)
                    }
                    var c = d + "=" + s;
                    newIfrSrc += (newIfrSrc.indexOf("?") > -1 ? "&" : "?") + c
                }
            }
        }
        if (newIfrSrc != o) {
            n.src = newIfrSrc
        }
    }
    var d;

    function c(e) {
        if (!e.data || typeof e.data.split != "function") {
            return
        }
        var n = e.data.split(":");
        if (n[1] !== "gaMeasurementId") {
            return
        }
        d = n[2]
    }

    function u(e) {
        e.hasLoaded = false;
        s(e);
        i(e, "load", function() {
            a(e)
        });
        i(window, "message", function(n) {
            c(n);
            f(e, n)
        })
    }
    var l = document.getElementsByTagName("iframe");
    if (!l) return;
    var p = ["acuityscheduling.com", "acuityscheduling.net", "squarespacescheduling.com", ".as.me"];
    for (var v = 0; v < l.length; ++v) {
        for (var g = 0; g < p.length; g++) {
            if (!l[v].src) {
                continue
            }
            if (l[v].src.indexOf(p[g]) > -1) {
                u(l[v]);
                return
            }
        }
    }
})();