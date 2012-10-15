<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml;charset=windows-1251" />
<title>FSS Data Utilities</title>
<script type="text/javascript" src="lite/suilib_lite_packed.js"></script>
</head>
<body>

<ol>
<li>
  <p>Вставляем данные из системы в первое поле, кликаем на нем и галочками выбираем нужные чемпионаты. Кнопка "Search duplicates!" выведет вам список одинаковых имён в базе бомбардиров.</p>
  <p><i>Хинт: можно вставлять и два хэша с данными в оба поля, тогда список дубликатов будет сразу для всех выбранных чемпионатов :)</i></p>
</li>
<li>
  <p>Вставляем данные из двух систем в поля ниже, кликаем на них и галочками выбираем нужные чемпионаты. Кнопка "Concat this!" приготовит объединённый хэш для вставки.<br />
  Можно также вырезать какие-то чемпионаты из одного-двух хэшей.</p>
  <p>Включённый флаг "data fix" сделает итоговый хэш совместимым для версий системы 4.0 и выше.<br />
  <i>Хинт: чтобы только исправить данные, просто добавьте их в первое поле, при этом оставив второе пустым :)</i></p>
</li>
</ol>

<fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
<legend>Data #1</legend>
<textarea id="data_01" style="width:99%" cols="10" rows="10"></textarea></fieldset>
<div id="data_01_parts" style="margin-bottom:10px"></div>

<fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
<legend>Data #2</legend>
<textarea id="data_02" style="width:99%" cols="10" rows="10"></textarea></fieldset>
<div id="data_02_parts" style="margin-bottom:10px"></div>

<div align="center"><input type="button" id="start_search" value="Search duplicates!" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" id="start_concat" value="Concat this!" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="data_fix" />&nbsp;<label for="data_fix" style="cursor:pointer">data fix</label></div>

<div id="results">
  <fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll;display:none">
  <legend>Дубликаты</legend>
  <textarea id="search" style="width:99%" cols="10" rows="10" readonly="readonly"></textarea></fieldset>

  <fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll;display:none">
  <legend>Результат</legend>
  <textarea id="concat" style="width:99%" cols="10" rows="10" readonly="readonly" onclick="this.select()" onfocus="this.select()"></textarea></fieldset>
</div>

<script type="text/javascript">
//<![CDATA[
var objTools = {
  print: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    return 'var data = ' + this.parse(hash) + ';';
  },
  $specialChars: {
    '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\'
  },
  $replaceChars: function(chr) {
    return this.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
  },
  parse: function(hash) {
    var self = this;
    switch(typeof(hash)) {
      case 'string':
        return "\"" + hash.replace(/[\x00-\x1f\\"]/g, function(chr){ return self.$replaceChars.apply(self, [chr]); }) + "\"";
      case 'number':
        return isFinite(hash) ? String(hash) : 'null';
      case 'object':
        if(hash===null) return String(hash);
        var string = [];
        if('length' in hash) {
          for(var i=0,l=hash.length; i<l; i++) {
            if(typeof hash[i]=='undefined') continue;
            string.push(this.parse(hash[i]));
          }
          return '[' + String(string) + ']';
          break;
        }
        for(var i in hash) {
          var json = this.parse(hash[i]);
          if(json) string.push(this.parse(i) + ':' + json);
        }
        return '{' + string + '}';
      default: return String(hash);
    }
    return null;
  },
  length: function(hash, exclude) {
    if(!hash || typeof(hash)!=='object') return null;
    var len = false;
    for(var key in hash) {
      if(exclude && exclude.length && exclude.hasa(key)!==false) continue;
      len++;
    }
    return len;
  },
  clone: function(hash) {
    if(!hash || typeof(hash)!=='object') return hash;
    var newHash = hash.constructor();
    for(var key in hash)
      newHash[key] = this.clone(hash[key]);
    return newHash;
  },
  hash: function(arr) {
    if(!arr || !(arr instanceof Array)) return arr;
    if(arr.length==0) return {};
    var hash = {};
    for(var i=0,l=arr.length; i<l; i++)
      hash[i] = arr[i];
    return hash;
  },
  array: function(hash, onlyKeys, exclude) {
    if(!hash || typeof(hash)!=='object') return hash;
    if(!this.length(hash)) return [];
    var arr = [];
    for(var key in hash) {
      if(exclude && exclude.length && exclude.hasa(key)!==false) continue;
      arr.push(key);
      if(!onlyKeys) arr.push(hash[key]);
    }
    return arr;
  },
  key: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    for(var key in hash)
      break;
    return key;
  },
  lastKey: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    for(var key in hash);
    return key;
  },
  extend: function(hash, source_hash) {
    if(!hash || typeof(hash)!=='object') return null;
    for(var key in source_hash) hash[key] = source_hash[key];
    return hash;
  }
};

var hashes = {'data_01':{},'data_02':{}};
(function(e) {
  var el = (e.target || e.srcElement);
  if(el.value=='' || el.value.substring(0, 8)!='var data') return;

  var did = el.id + '_parts',
      num = el.id.substr(el.id.length-1),
      data = el.value.charAt(el.value.length-1)==';' ? el.value.substring(11, el.value.length-1).parseJSON() : el.value.trim().substring(11, el.value.length-2).parseJSON(),
      n = 0;

  hashes[el.id] = data;
  $(did).empty(true, true);
  for(var i in data) {
    $(did).add('input', {'type':'checkbox', 'id':'champ_'+num+'_'+n});
    $(did).add('label', {'for':'champ_'+num+'_'+n, 'style':'cursor:pointer', 'innerHTML':i});
    $(did).add('span', {'innerHTML':'&nbsp;&nbsp;'});
    n++;
  }
}).$('click', 'data_01', 'data_02');

(function(e) {
  var all = {}, keys = [];
  $('results').filter('fieldset',null,null,true).walkwith(function(el) {
    $(el).hide();
  });
  $('search').value = '';

  $('data_01_parts').filter('input',null,null,true).walkwith(function(el) {
    if(el.checked) {
      var lbl = $(el).nextSibling.innerHTML;
      all[lbl] = hashes['data_01'][lbl];
    }
  });

  $('data_02_parts').filter('input',null,null,true).walkwith(function(el) {
    if(el.checked) {
      var lbl = $(el).nextSibling.innerHTML;
      all[lbl] = hashes['data_02'][lbl];
    }
  });

  hashes['data_01'] = objTools.extend(hashes['data_01'], hashes['data_02']);
  keys = objTools.array(hashes['data_01'], true);

  for(var i=0,l=keys.length; i<l; i++) {
    if(!all[keys[i]]) continue;

    var all_bombs = {}, duplicates = {};
    for(var j in all[keys[i]]) {
      if(j=='service' || j=='extra') continue;
      var bombs = all[keys[i]][j][5];
      for(var k in bombs) {
        var com = typeof bombs[k][1]=='string' ? bombs[k][1] : j;
        if(all_bombs[k]==null) all_bombs[k] = com;
        else {
          if(k.match(/\*$/i)) continue;
          if(com==all_bombs[k]) continue;
          if(duplicates[k]==null) {
            duplicates[k] = [];
            duplicates[k].push(all_bombs[k]);
          }
          duplicates[k].push(com);
        }
      }
    }

    if(objTools.length(duplicates)) {
      $('search').value += keys[i] + '\n';

      for(var j in duplicates) {
        for(var k=0; k<duplicates[j].length; k++ ) {
          $('search').value += (j + ' (' + duplicates[j][k] + ')');
          if(k!=duplicates[j].length-1) $('search').value += ' === ';
        }
        $('search').value += '\n\n';
      }
    }
  }

  $($('search').parentNode).show();
}).$('click', 'start_search');

(function(e) {
  var concated = {}, concated_temp = {}, keys = [],
      fix = $('data_fix').checked;
  $('concat').value = '';

  $('results').filter('fieldset',null,null,true).walkwith(function(el) {
    $(el).hide();
  });

  $('data_01_parts').filter('input',null,null,true).walkwith(function(el) {
    if(el.checked) {
      var lbl = $(el).nextSibling.innerHTML;
      concated_temp[lbl] = hashes['data_01'][lbl];
    }
  });

  $('data_02_parts').filter('input',null,null,true).walkwith(function(el) {
    if(el.checked) {
      var lbl = $(el).nextSibling.innerHTML;
      concated_temp[lbl] = hashes['data_02'][lbl];
    }
  });

  hashes['data_01'] = objTools.extend(hashes['data_01'], hashes['data_02']);
  keys = objTools.array(hashes['data_01'], true);

  for(var i=0,l=keys.length; i<l; i++) {
    if(!concated_temp[keys[i]]) continue;

    if(fix) {
      for(var j in concated_temp[keys[i]]) if(j!='service' && j!='extra') {
        var cd = concated_temp[keys[i]][j];
        if('length' in cd) {
          if(cd.length < 8) concated_temp[keys[i]][j].push([]);
        } else {
          for(var k in cd) {
            if(cd[k].length < 8) concated_temp[keys[i]][j][k].push([]);
          }
        }
      }
    }

    concated[keys[i]] = concated_temp[keys[i]];
  }

  $('concat').value = objTools.print(concated);
  $($('concat').parentNode).show();
}).$('click', 'start_concat');
//]]>
</script>

</body>
</html>