/* Модицифированный объект "Динамические вкладки" (оригинал портирован из SUILib v1.3.x) */
var tabs = {
  init: function(args) {
    if(!args.apply) return false;
    var allNodes = args.apply.length ? $(suilib.body).filter('*',null,null,true) : [];
    var len = allNodes.length;
    for(var i=0; i<args.apply.length; i++) {
      this.all[i] = {};
      if(!args.apply[i].els && !args.apply[i].hds) continue;
      if(typeof args.apply[i].els=='string') {
        var tmp = [];
        for(var j=0; j<len; j++)
          if(allNodes[j] && allNodes[j].className && allNodes[j].className.split(' ').hasa(args.apply[i].els)!==false)
            tmp.push(allNodes[j]);
        this.all[i].els = tmp;
      } else if(typeof args.apply[i].els=='object' && args.apply[i].els.length)
        this.all[i].els = args.apply[i].els;
      if(args.apply[i].hds) {
        if(typeof args.apply[i].hds=='string') {
          var tmp = [];
          for(var j=0; j<len; j++) 
            if(allNodes[j] && allNodes[j].className && allNodes[j].className.split(' ').hasa(args.apply[i].hds)!==false)
              tmp.push(allNodes[j]);
          this.all[i].hds = tmp;
        } else if(typeof args.apply[i].hds=='object' && args.apply[i].hds.length)
          this.all[i].hds = args.apply[i].hds;
      }
      if(args.apply[i].open) {
        var what = this.all[i].els ? this.all[i].els : this.all[i].hds;
        if(typeof args.apply[i].open=='string')
          this.all[i].open = $(args.apply[i].open);
        else if(typeof args.apply[i].open=='number' && args.apply[i].open<=what.length)
          this.all[i].open = $(what[args.apply[i].open-1]);
      }
      this.all[i].callback = args.apply[i].callback || suilib.anonymous;
      this.buildTabs(this.all[i]);
    }
  },

  all: [],
  cls: ['tab', 'tab_act', 'tab_hover'],

  buildTabs: function(tArr) {
    var tHd = [], len = tArr.els ? tArr.els.length : tArr.hds.length;
    for(var i=0; i<len; i++) {
      var el = tArr.els ? $(tArr.els[i]) : null, hd = false;
      if(tArr.hds) hd = $(tArr.hds[i]); else hd = el.filter('*',null,null,true)[0];
      tHd.push(hd);
      if(!tArr.hds) el.parentNode.insertBefore(hd, $(tArr.els[0]));
      if(tArr.open && el==tArr.open) tArr.open = hd;
      if(el) el.hide();
    }

    var handlerClick = [], handlerOver = [], handlerOut = [];
    for(var i=0; i<tHd.length; i++) {
      handlerClick[i] = (function(){tabs.openTab(tArr, tHd, arguments.callee.obj);});
      handlerOver[i]  = (function(){var el = arguments.callee.obj, allCls = (el.className.split(' ') || []); if(allCls.hasa(tabs.cls[1])===false) el.classReplace('tab_hover', tabs.cls);});
      handlerOut[i]   = (function(){var el = arguments.callee.obj, allCls = (el.className.split(' ') || []); if(allCls.hasa(tabs.cls[1])===false) el.classReplace('tab', tabs.cls);});
      handlerClick[i].obj = handlerOver[i].obj = handlerOut[i].obj = tHd[i];
      handlerClick[i].$('click', tHd[i]);
      handlerOver[i].$('mouseover', tHd[i]);
      handlerOut[i].$('mouseout', tHd[i]);
    }

    this.openTab(tArr, tHd, tArr.open ? tArr.open : tHd[0]);
  },

  openTab: function(tArr, tHd, tOpen) {
    var index = 0;
    for(var i=0; i<tHd.length; i++) {
      var allCls = (tHd[i].className.split(' ') || []);
      if(tHd[i]==tOpen) {
        if(allCls.hasa(tabs.cls[1])!==false) return false;
        tHd[i].classReplace('tab_act', this.cls);
        index = i;
      } else {
        if(allCls.hasa(tabs.cls[0])!==false) continue;
        tHd[i].classReplace('tab', this.cls);
        if(tArr.els) $(tArr.els[i]).hide();
      }
    }
    var el = tArr.els ? tArr.els[index] : null;
    if(tArr.callback) tArr.callback(tHd[index], el, index+1);
    if(el) $(tArr.els[index]).show();
  }
};