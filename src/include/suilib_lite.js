/*!
 * Яваскриптовый фреймворк
 * Версия: 1.0.24 Final (03.11.2009)
 * Авторы: Иван Азарёнок (azaryonok@mail.ru), Григорий Зарубин (grinder@tsu.tula.ru), Андрей Сидоров (takandar@gmail.com)
 */

var suilib = {

  version: 'lite-1.0.24',

  collector: {events:[], elements:[], cache:{}},

  anonymous: function(){},

  client: {
    domSupported:  !!document.getElementById,
    nativeWrapper: !!window.HTMLElement,

    opera:    !!window.opera,
    msie:     !!(document.all && document.all.item && !window.opera && !window.postMessage),
    trident:  !!(document.all && document.all.item && !window.opera),
    safari:   !!(navigator.appVersion && navigator.appVersion.toLowerCase().indexOf('applewebkit') >= 0),
    gecko:    !!(window.Components && window.controllers),
    netscape: !!document.layers
  },

  debug: {
    info: window.console && console.firebug ? window.console.info : this.anonymous,
    error: window.console && console.firebug ? window.console.error : this.anonymous,
    log: window.console && console.firebug ? window.console.log : this.anonymous,
    warn: window.console && console.firebug ? window.console.warn : this.anonymous
  },

  ready: function(method, context, args) {
    if(!this.init.initialize) this.init.initialize = []
    this.init.initialize.push({method:(method || suilib.anonymous), context:(context || window), args:(args || [])})
  },

  init: function() {
    if(suilib.init.done) return null
    suilib.init.done = true
    suilib.body = (!!document.body ? document.body : document.getElementsByTagName('body')[0])
    if(window.addEventListener)
      window.addEventListener('click', suilib.clickCapture, true);
    else
      suilib.clickCapture.$('click', window, document);
    if(arguments.callee.initialize && arguments.callee.initialize.length)
      for(var i=0,l=arguments.callee.initialize.length; i<l; i++)
        arguments.callee.initialize[i].method.
        apply(arguments.callee.initialize[i].context, arguments.callee.initialize[i].args)
  },

  body: {},

  capturedClick: {},

  clickCapture: function(e) {
    suilib.capturedClick = e
  },

  extensions: {
    Array: {
      hasa: function(val) {
        for(var i=0; i<this.length; i++)
          if(this[i]===val) return i
        return false
      },
      walkwith: function(cb) {
        var ret = []
        for(var i=0; i<this.length; i++)
          ret.push(cb(this[i]))
        return ret
      },
      filter: function() {
        var flatten = []
        for(var i=0,l=arguments.length; i<l; i++)
          flatten.push(arguments[i])
        return suilib.domExt.filter.apply(this, flatten)
      },
      hash: function() {
        var result = {}
        for(var i=0,l=this.length; i<l; i++)
          result[i] = this[i]
        return result
      },
      tweener: function(obj, options) {
        return suilib.domExt.tweener.call(this, obj && options ? obj : null, !options ? obj : options)
      }
    },
    String: {
      trim: function(what) {
        var sym = [' ', '\r', '\n'], result = this
        if(what) for(var i=0,l=what.length; i<l; i++) sym.push(what.charAt(i))
        while(sym.hasa(result.charAt(0))!==false) result = result.substr(1)
        while(sym.hasa(result.charAt(result.length-1))!==false) result = result.substr(0, result.length-1)
        return result.toString()
      },
      camelize: function() {
        var parts = this.split('-'), len = parts.length
        if(len == 1) return parts[0];
        var c = this.charAt(0) == '-' ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1) : parts[0]
        for(var i=1; i<len; i++) c += parts[i].charAt(0).toUpperCase() + parts[i].substring(1)
        return c.toString()
      },
      find: function(what) {
        return (this.indexOf(what)>=0 ? true : false)
      }
    },
    Date: {
      isLeapYear: function() {
        var year = this.getFullYear()
        return ((((year%4==0) && (year%100!=0)) || (year%400==0)) ? true : false)
      }
    },
    Function: {
      $: function() {
        var e = arguments[0], g = suilib.client.gecko
        for(var i=1,l=arguments.length; i < l; i++) {
          if(!arguments[i]) continue
          try {
            if(typeof arguments[i]=='object' && 'length' in arguments[i] && 'hasa' in arguments[i]) {
              var clone = []
              arguments[i].walkwith(function(el) { clone.push(el) })
              clone.unshift(e)
              this.$.apply(this, clone)
              continue
            }
            arguments[i] = $(arguments[i]); if(!arguments[i]) continue
            if(arguments[i].attachEvent) arguments[i].attachEvent('on'+e, this)
            else arguments[i].addEventListener(e, this, false)
            if(e!='unload') suilib.collector.events.push([this, e, arguments[i]]);
          } catch(ext) { suilib.debug.error('$\n'+ext) }
        }
        return this
      },
      $$: function() {
        var e = arguments[0], g = suilib.client.gecko
        for(var i=1,l=arguments.length; i < l; i++) {
          if(!arguments[i]) continue
          try {
            if(typeof arguments[i]=='object' && 'length' in arguments[i] && 'hasa' in arguments[i]) {
              var clone = []
              arguments[i].walkwith(function(el) { clone.push(el) })
              clone.unshift(e)
              this.$$.apply(this, clone)
              continue
            }
            arguments[i] = $(arguments[i]); if(!arguments[i]) continue
            if(arguments[i].detachEvent) arguments[i].detachEvent('on'+e, this)
            else arguments[i].removeEventListener(e, this, false)
          } catch(ext) { suilib.debug.error('$$\n'+ext) }
        }
        return this
      }
    }
  },

  domExt: {
    __e__: true,
    $: function() {
      var e = arguments[0]
      for(var i=1,l=arguments.length; i < l; i++)
        if(arguments[i] && arguments[i].$)
          arguments[i].$(e, this)
      return this
    },
    $$: function() {
      var e = arguments[0]
      for(var i=1,l=arguments.length; i < l; i++)
        if(arguments[i] && arguments[i].$$)
          arguments[i].$$(e, this)
      return this
    },
    filter: function(tag, cls, attr, deep) {
      var result = []; result.filter = suilib.extensions.Array.filter
      if(this instanceof Array) {
        for(var i=0,l=this.length; i<l; i++)
          if(this[i] && this[i].filter)
            result = result.concat(this[i].filter(tag, cls, attr, deep))
        return result
      }
      var list = (deep ? this.getElementsByTagName(tag || '*') : this.childNodes)
      outerLoop:
      for(var i=0,l=list.length; i<l; i++) {
        if(!list[i] || list[i].nodeType!=1) continue
        if(!deep && tag && tag!='*' && list[i].tagName.toLowerCase()!=tag.toLowerCase()) continue
        if(cls && list[i].className.split(' ').hasa(cls)===false) continue
        if(attr) for(var j in attr) try {
          if(list[i].getAttribute(j).toLowerCase()!==attr[j].toLowerCase()) continue outerLoop
        } catch(e) { continue outerLoop }
        result.push($(list[i]))
      }
      return result
    },
    unset: function(rmid) {
      if(rmid && this.removeAttribute) {
        var oid = this.getAttribute('id')
        if(suilib.collector.cache[oid]) delete(suilib.collector.cache[oid])
        this.removeAttribute('id')
      }
      this.parentNode.removeChild(this)
      return this
    },
    empty: function(deep, rmid) {
      while(this.firstChild) {
        if(deep && this.firstChild.nodeType==1) $(this.firstChild).empty(deep, rmid)
        if(rmid && this.firstChild.removeAttribute) {
          var oid = this.firstChild.getAttribute('id')
          if(suilib.collector.cache[oid]) delete(suilib.collector.cache[oid])
          this.firstChild.removeAttribute('id')
        }
        this.removeChild(this.firstChild)
      }
      return this
    },
    show: function(interval, args) {
      if(interval) {
        args = args.split(','); var params = {}
        for(var i=0,l=args.length; i<l; i++) switch(args[i].trim()) {
          case 'fade':
            params.opacity = [0, 100]
            this.setstyle('opacity:0')
          break
        }
        this.style.display = ''
        this.animate(interval, params)
      } else this.style.display = '' 
      return this
    },
    hide: function(interval, args) {
      if(interval) {
        args = args.split(','); var params = {}, self = this
        for(var i=0,l=args.length; i<l; i++) switch(args[i].trim()) {
          case 'fade':
            params.opacity = [100, 0]
            this.setstyle('opacity:100')
          break
        }
        this.animate(interval, params, function() {
          self.hide(); self.setstyle('opacity:100') })
      } else this.style.display = 'none'
      return this
    },
    toggle: function(node, interval, args) {
      if(!node) return false
      if(interval) {
        args = args.split(','); var params = {}, effect, self = this
        for(var i=0,l=args.length; i<l; i++) switch(args[i].trim()) {
          case 'fade':
            params.opacity = [100, 0]
            this.setstyle('opacity:100')
            effect = args[i].trim()
          break
        }
        this.animate(interval, params, function() {
          self.hide(); self.setstyle('opacity:100'); $(node).show(interval, effect) })
      } else {
        this.style.display = 'none'
        $(node).style.display = ''
      }
      return this
    },
    animate: function(interval, args, complete, aic) {
      var timer = 0, step = 0, self = this, icall = (aic || 100)
      var stepdelta = interval * 1000 / icall

      var convert = function(prop, val) {
        var result
        switch(prop.camelize().trim()) {
          case 'width': case 'height': case 'left': case 'top': case 'fontSize':
            result = val + 'px'
          break
          case 'color': case 'backgroundColor':
            result = '#'+Color.hsl2hex(val, 100, 100)
          break
          default:
            result = val
        }
        return result
      }
      var callback = function(args, step) {
        var fn = arguments.callee
        if(!fn.$queue)  fn.$queue  = {}
        if(!fn.$ignore) fn.$ignore = {}

        for(var a in args) if(!fn.$queue[a]) {
          fn.$queue[a] = false
          if(typeof args[a]=='function' && args[a].call) {
            this.setstyle(a+':'+args[a].call(fn, step, a))
            continue
          }  
          if(!('$'+a in fn)) fn['$'+a] = args[a][0]
          var delta = (Math.max(args[a][0], args[a][1]) - Math.min(args[a][0], args[a][1])) / stepdelta
          if(!delta) delta = 1
          this.setstyle(a+':'+convert(a, fn['$'+a]))
          if(args[a][1] > args[a][0]) {
            fn['$'+a] += delta
            if(fn['$'+a] >= args[a][1]) {
              fn.$queue[a] = true
              this.setstyle(a+':'+convert(a, args[a][1]))
            }  
          } else if(args[a][1] < args[a][0]) {
            fn['$'+a] -= delta
            if(fn['$'+a] <= args[a][1]) {
              fn.$queue[a] = true
              this.setstyle(a+':'+convert(a, args[a][1]))
            }  
          } else {
            this.setstyle(a+':'+convert(a, args[a][0]))
            fn.$queue[a] = true
          }  
        }

        var done = true; for(var i in fn.$queue) if(!fn.$ignore[i] && fn.$queue[i]!==true) done = false
        if(done) fn.stop()
      }
      callback.loop = function(mode, prop) {
         this.$ignore[prop] = !!mode
      }
      callback.stop = function() {
        clearInterval(timer); if(complete) complete()
      }
      if(this.$intervalid) clearInterval(this.$intervalid)
      this.$intervalid = timer = setInterval(function(){step++; callback.apply(self, [args, step])}, icall)
    },
    tweener: function(obj, options) {
      if('jTweener' in window) return $t(obj && typeof(obj)=='object' && options ? obj : this, !options ? obj : options); else {
        suilib.debug.warn('jTweener not included!');
        return {
          'tween'         : suilib.anonymous,
          'percent'       : suilib.anonymous,
          'stop'          : suilib.anonymous,
          'addOptions'    : suilib.anonymous,
          'clearOptions'  : suilib.anonymous,
          'removeOptions' : suilib.anonymous
        }
      }
    },
    setstyle: function(style) {
      var rules = style.split(';')
      for(var i=0,l=rules.length; i<l; i++) {
        var hash = rules[i].split(':')
        var prop = hash[0].camelize().trim()
        try { switch(prop) {
          case 'float':
            this.style['styleFloat'] = hash[1].trim()
            this.style['cssFloat']   = hash[1].trim()
          break
          case 'opacity':
            var op = parseInt(hash[1], 10)
            if(document.body.filters) {
              var alph = (this.filters['DXImageTransform.Microsoft.alpha'] || this.filters.alpha)
              if(alph) alph.opacity = op
              else this.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+op+")"
            } else {
              var aop = op / 100
              this.style.opacity = aop;
              this.style.MozOpacity = aop;
              this.style.KhtmlOpacity = aop;
            }
          break
          default:
            this.style[prop] = hash[1].trim()
        } } catch(exc) {  }
      }
      return this
    },
    classAdd: function(cls) {
      var allCls = this.className.split(' ') || []
      if(allCls.hasa(cls)) return null
      allCls.push(cls)
      this.className = allCls.join(' ').trim()
      return this
    },
    classReplace: function(clsNew, clsOld) {
      if (typeof clsOld=='object' && clsOld.length)
        for(var i=0,l=clsOld.length; i<l; i++) this.classRemove(clsOld[i])
      else this.classRemove(clsOld)
      this.classAdd(clsNew)
      return this
    },
    classRemove: function(cls) {
      var allCls = this.className.split(' ') || []
      for(var i=0,l=allCls.length; i<l; i++)
        if(allCls[i]==cls) allCls.splice(i, 1)
      this.className = allCls.join(' ')
      return this
    },
    offset: function(d) {
      var x = this.offsetLeft,y = this.offsetTop
      if(this.offsetParent && d) {
        var pos = $(this.offsetParent).offset(d)
        x += pos[0]; y += pos[1]
      }
      return [x,y]
    },
    html: function(html) {
      if(html && html.length && html.length===parseInt(html.length, 10))
        this.innerHTML = html
      return this.innerHTML
    },
    add: function(e, a, c) {
      var child = $(document.createElement(e))
      if(a) for(var p in a) {
        switch(p) {
          case 'class': child.classAdd(a[p]); break
          case 'style': child.setstyle(a[p]); break
          case 'innerHTML': child.html(a[p]); break
          default: child.setAttribute(p, a[p])
        }
      }
      if(c) for(var i=0,l=c.length; i<l; i++) if(c[i]) child.appendChild(c[i])
      if(this && this!=window && this!=document && this.appendChild) this.appendChild(child)
      return child
    },
    addtext: function(t) {
      var child = document.createTextNode(t)
      if(this && this!=window && this!=document && this.appendChild) this.appendChild(child)
      return child
    }
  },

  addProps: function(d, s, p) {
    for(var p in s)
      if(d[p] && p) continue
      else d[p] = s[p]
    return d
  },

  ajax: function(url, params, method, handler) {
    if(!url) url = document.location.protocol + '//' + document.location.hostname + 
                   document.location.pathname + document.location.search
    handler  = (handler || suilib.anonymous)
    var pick = function() {
      var v  = [
        function(){return new XMLHttpRequest()},
        function(){return new ActiveXObject("Msxml2.XMLHTTP")},
        function(){return new ActiveXObject("Msxml3.XMLHTTP")},
        function(){return new ActiveXObject("Microsoft.XMLHTTP")}
      ], result
      for(var i=0,l=v.length; i<l; i++) {
        try { result = v[i]()
        } catch(exc) { continue }
        break
      }
      return result
    }
    var provider = pick()
    var xmlhttp  = provider
    var closure  = function() {
      handler({readyState: xmlhttp.readyState,
               statusCode:(xmlhttp.readyState==4) ? xmlhttp.status : null,
               responseJS:(xmlhttp.readyState==4 && xmlhttp.status==200) ? 
                          (function(x){try{eval('try{var r='+(x.responseText || 'null')+'}catch(e){};')}catch(e){ suilib.debug.error(e+'\n\n'+x.responseText) };return r})(xmlhttp) : null
               })
      if(xmlhttp.readyState==4) xmlhttp = null
    }
    if(!!params.hasa) params = params.join('&')
    if(method=='get') url += (url.match(/\?/) ? '&' : '?') + params
    url += (url.match(/\?/) ? '&' : '?') + '$js=' + ((new Date()).getTime())
    try {
      provider.open(method, url.toLowerCase(), true)
      provider.onreadystatechange = closure
      provider.setRequestHeader('X-Requested-With', 'Shogo UI/'+suilib.version)
      if(method=='post') provider.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      provider.setRequestHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*')
      provider.setRequestHeader('Connection', 'close')
      provider.send(method=='post'?params:null)
    } catch(exc) {suilib.debug.error(exc+' '+params)}
    return provider
  },

  get: function(params, handler) {
    return this.ajax(null, params, 'get', handler)
  },

  post: function(params, handler) {
    return this.ajax(null, params, 'post', handler)
  },

  switchWait: function(mode, loader) {
    try { // это для ебучего ie6
      var ie = suilib.client.trident, szs = ie ? suilib.screensizes() : [];
      if(!arguments.callee.floatMover) arguments.callee.floatMover = function(e) {
        var scrlX  = document.documentElement.scrollLeft + document.body.scrollLeft;
        var scrlY  = document.documentElement.scrollTop  + document.body.scrollTop;
        floatloader.style.left = parseInt(e.pageX ? e.pageX : e.x+scrlX, 10) - 16 + 'px';
        floatloader.style.top  = parseInt(e.pageY ? e.pageY : e.y+scrlY, 10) - 15 + 'px';
      }

      var ipath   = 'i/ajax/',
          loaders = [ ipath + 'loader.gif', ipath + 'ajax.' + (ie ? 'gif' : 'png')];
      if(mode) {
        if(loader && loaders[loader]) {
          var floatloader = new Image();
          floatloader.src = loaders[loader];
          suilib.body.appendChild(floatloader);
          $(floatloader).setstyle('position:absolute; z-index:200');
          var evt = (window.event || suilib.capturedClick);
          try { if(evt.type!='click') evt = (ie ? window.event : suilib.capturedClick) } catch(e) {}
          var scrlX  = document.documentElement.scrollLeft + document.body.scrollLeft;
          var scrlY  = document.documentElement.scrollTop  + document.body.scrollTop;
          if(evt) {
            var sl = parseInt(evt.pageX ? evt.pageX : evt.x+scrlX, 10) - 16;
            var st = parseInt(evt.pageY ? evt.pageY : evt.y+scrlY, 10) - 15;
            szs[2] = ie ? szs[2] : Math.max(document.body.scrollWidth, window.innerWidth);
            szs[3] = ie ? szs[3] : Math.max(document.body.scrollHeight, window.innerHeight);
            if(isNaN(sl)) sl = Math.ceil(szs[2]/2) - 16;
            if(isNaN(st)) st = Math.ceil(szs[3]/2) - 16;
            $(floatloader).setstyle('top:' + st + 'px; left:' + sl + 'px');
          }
          if(!arguments.callee.floatloader) arguments.callee.floatloader = floatloader;
          arguments.callee.floatMover.$('mousemove', window, document);
        } else if(loader) { // невидимый запрос
        } else { // дефолтный статусбар
          if(!arguments.callee.wdiv)
            arguments.callee.wdiv = $(suilib.body).add('div', {'style' : 'position:' + (ie ? 'absolute' : 'fixed') + '; left:0; top:0; z-index:9998; margin:0; background:#000000; width:' + (ie ? szs[0]+'px' : '100%') + '; height:' + (ie ? szs[3]+'px' : '100%')});
            arguments.callee.wdiv.setstyle('opacity:30');
          if(!arguments.callee.idiv)
            arguments.callee.idiv = $(suilib.body).add('div', {'style' : 'position:' + (ie ? 'absolute' : 'fixed') + '; z-index:9999; text-align:center; padding-top:20%; color:#EBEBEB; width:100%; left:0; top:' + (ie ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)+'px' : '0')}, [
              addtext('Пожалуйста, подождите...'),
              add('br'),
              add('img', {'src' : loaders[0]})
            ]);
        }
      } else {
        if(loader && loaders[loader]) {
          arguments.callee.floatMover.$$('mousemove', window, document);
          try { suilib.body.removeChild(arguments.callee.floatloader) } catch(e) {}
          arguments.callee.floatMover = null; arguments.callee.floatloader = null;
        } else if(loader) { // невидимый запрос
        } else { // дефолтный статусбар
          $(arguments.callee.wdiv).unset(true);
          $(arguments.callee.idiv).unset(true);
          arguments.callee.wdiv = null; arguments.callee.idiv = null;
          window.scrollBy(1,1);
          window.scrollBy(-1,-1);
        }
      }
    } catch(err) {}
  },

  screensizes: function() {
    var wW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0;
    var wH = window.innerHeight ||  document.documentElement.clientHeight || document.body.clientHeight || 0;

    return [wW, wH, Math.min(document.body.scrollWidth, wW), Math.max(document.body.scrollHeight, wH)];
  },

  free: function() {
    for(var i=0; i<this.length; i++) {
      if(!this[i][0] || !this[i][0].$$ || !this[i][1] || !this[i][2]) continue
      this[i][0].$$(this[i][1], this[i][2]); this[i][0] = this[i][2] = this[i] = null
    }
  }
}

;(function(h){for(var n in h)   suilib.addProps(window[n].prototype, h[n])})(suilib.extensions)
if(suilib.client.nativeWrapper) suilib.addProps(window.HTMLElement.prototype, suilib.domExt)
var add = suilib.domExt.add, addtext = suilib.domExt.addtext, __e__ = true

function $() {
  if(!arguments[0]) return null
  var r = []
  if(arguments.length > 1)
    for(var i=0,l=arguments.length; i < l; i++)
      r.push($(arguments[i]))
  else switch(typeof arguments[0]) {
    case 'string': try {
      r = suilib.collector.cache[arguments[0]] ? suilib.collector.cache[arguments[0]] : document.getElementById(arguments[0])
      suilib.collector.cache[arguments[0]] = r } catch (e) { suilib.debug.error('[wrong node]:\n'+e) }
    break
    default:
      r = arguments[0]
  } try {
  if(arguments.length==1 && !r.__e__) r = suilib.addProps(r, suilib.domExt, true)
  } catch(e) { suilib.debug.error('[extend error]: '+arguments[0]+'\n'+e) } return r
}

;(function() {
  if(document.addEventListener) document.addEventListener("DOMContentLoaded", function(){
    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
    suilib.init();
  }, false)
  if(document.attachEvent) {
    document.attachEvent("onreadystatechange", function(){
      if(document.readyState==="complete") {
        document.detachEvent("onreadystatechange", arguments.callee);
        suilib.init();
      }
    });
    if(document.documentElement.doScroll && window==window.top) (function(){
      if(suilib.init.done) return;
      try {
        document.documentElement.doScroll("left");
      } catch(e) {
        setTimeout(arguments.callee, 0);
        return;
      }
      suilib.init();
    })();
  }
  window.onload = suilib.init;
  (function() {
    suilib.free.call(suilib.collector.events)
    with(suilib.collector)
      for(var i=0; i<cache.length; i++)
        cache[i] = null
  }).$('unload', window)
})();

var Color = {
  rgb2hex: function(rgb) {
    var x = '0123456789ABCDEF', s = rgb.split(','), hex = ''
    for(var i=0; i<3; i++) {
      var n  = parseInt(s[i], 10)
      hex += x.charAt(n >> 4) + x.charAt(n & 15)
    }
    return hex
  },

  hex2rgb: function(hex) {
    var x = '0123456789ABCDEF', c = []
    hex = hex.toUpperCase()
    for(var i=0; i<6; i+=2) c.push(16 * x.indexOf(hex.charAt(i)) + x.indexOf(hex.charAt(i+1)))
    c = c.join(', '); return c
  },

  hsl2rgb: function(hue, sat, lum) {
    var R, G, B, nH, nS, nL, nF, nP, nQ, nT, lH
    var lim = function(val, l, h) {
      if(val < l) val = l; if(val > h) val = h
      return val
    }
    if(sat > 0) {
      nH = hue / 60; nL = lum / 100; nS = sat / 100;
      lH = parseInt(nH, 10); nF = nH - lH
      nP = nL * (1 - nS); nQ = nL * (1 - nS * nF); nT = nL * (1 - nS * (1 - nF))
      switch (lH) {
        case 0:
          R = nL * 255; G = nT * 255; B = nP * 255
        break
        case 1:
          R = nQ * 255; G = nL * 255; B = nP * 255
        break
        case 2:
          R = nP * 255; G = nL * 255; B = nT * 255
        break
        case 3:
          R = nP * 255; G = nQ * 255; B = nL * 255
        break
        case 4:
          R = nT * 255; G = nP * 255; B = nL * 255
        break
        case 5:
          R = nL * 255; G = nP * 255; B = nQ * 255
        break
      }
    } else {
      R = (lum * 255) / 100; G = R; B = R
    }
    return parseInt(lim(R, 0, 255), 10)+', '+parseInt(lim(G, 0, 255), 10)+', '+parseInt(lim(B, 0, 255), 10)
  },

  hsl2hex: function(hue, sat, lum) {
    return this.rgb2hex(this.hsl2rgb(hue, sat, lum))
  }
}