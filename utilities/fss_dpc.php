<?php
session_name('dpc');
session_start();

$url = "http://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";

if($_SERVER['REQUEST_METHOD']=='POST') {
  if(is_uploaded_file($_FILES['u']['tmp_name'])) {
    $size = getimagesize($_FILES['u']['tmp_name']);
    $_SESSION['u_name'] = $_POST['u_name'];
    $_SESSION['name'] = $_FILES['u']['name'];
    $_SESSION['result'] = base64_encode(file_get_contents($_FILES['u']['tmp_name']));
    $_SESSION['type'] = $size['mime'];
  }
  header("Location: $url"); exit;
}

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Author" content="Grigory Zarubin (https://github.com/Craigy-)" />
<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
<meta http-equiv="Content-Script-Type" content="text/javascript" />
<title>FSS Utilities :: Base64 Data Protocol Convertor</title>
<style type="text/css" media="screen, projection">
html, body {
  height: 100%; }
body {
  background: #F3F3F3;
  color: #333333;
  font: 11px Arial, Verdana, Helvetica, sans-serif;
  line-height: 130%; }
* {
  padding: 0;
  margin: 0; }
a {
  color: #436976; }
a:focus {
  outline: none; }
h1 {
  font-size: 24px;
  line-height: 120%;
  color: #434A4D;
  margin: 0 0 3px 0;
  white-space: nowrap; }
label {
  padding-left: 5px;
  cursor: pointer; }
input, .btn, select, textarea {
  font-size: 11px;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  padding: 3px 5px;
  color: #333333; }
input, img.chk {
  padding: 4px 5px; }
input[type="checkbox"], select {
  padding: 0; }
input[disabled] {
  color: #999999; }
.btn {
  background: url('data:image/gif;base64,R0lGODlhAQAVALMAAP////39/fj4+PPz8+7u7ujp6eTj497f39nZ2dXV1M/PzszMzAAAAAAAAAAAAAAAACH5BAQUAP8ALAAAAAABABUAAAQLEMhJgRikmIOSWhEAOw==') repeat-x 0 100% #F3F3F3;
  padding: 4px 5px 4px 5px;
  cursor: pointer; }
.btn input {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer; }
a.btn {
  text-decoration: none; }
.chk {
  background: none;
  border: 0; }
.hr {
  font-size: 1px;
  line-height: 1px;
  height: 1px;
  border-bottom: 1px dotted #CCCCCC; }

#container {
  min-width: 1008px;
  min-height: 100%;
  overflow: hidden; }
#header {
  position: relative;
  min-height: 85px;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAsCAYAAACkJ9JhAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAACV0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVggMjAwNId2rM8AAAAtSURBVHicY/j27dt/JgYGBgYI8f//fwYkLjYxNO6/f/+IUozfFJzqiDUei5sBj+4uCG99pbUAAAAASUVORK5CYII=') repeat-x 0 100% #F6F6F6;
  border-bottom: 2px solid #CCCCCC;
  padding: 10px 0 0 15px; }
#body {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAeCAYAAADtlXTHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAACV0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVggMjAwNId2rM8AAAAwSURBVHicY7h69ep/Jn5+fgYmBgYGKMHIyIjMQnCxyTIwMDAwMTExYdeB0yi8hgIAOYUEE8wmb3AAAAAASUVORK5CYII=') repeat-x 0 0 #F3F3F3; }
#first_start {
  padding: 30px 15px; }

.text {
  float: left;
  width: 450px; }
.console {
  margin-left: 450px;
  padding: 5px 10px 0 0; }
#mmnu {
  position: absolute;
  bottom: 0;
  right: 0; }
#mmnu li {
  background: url('data:image/gif;base64,R0lGODlh9AE2ANUAAPf39/T3+fPz8/Hx8fHy8vDw8PDx8u/w8e/v7+7w8e3w8O3t7ent7unt7+rt7+rq6uTq7Ofn5+Xl5eDn6t3m6eDg4N/f39Lg5d3d3dPg5c7e49ra2tnZ2cra4NfX18na4NXV1cfY38bY3tTU1NPT09LS0sPW3cDV3MHV3L/U273T2s7Ozs3NzczMzLjP2LXO1rTN1rXN1gei5P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHADMALAAAAAD0ATYAAAb/wJlwBrCAWsikcslsOp/QqHRKrVqv2Kx2y+16v+CweEzejiyAodrC4kQGgrh8Tq/b7/i8fs/v+/+AgYKDhIWGh4iJiouMjYIFER4sFmozICALjpqbnJ2en6ChoqOkpXgLl0MWJAimrq+wsbKztLW2dgUlFUQrmbe/wMHCw8TFmwsrABgbckhxzgLQxtPU1dbX2IkcGCAPzS3P4NHi2eXm5+jptRJHcOrv8PHy840L0vT4+fr78ywsc9Du8RtIsKBBU/cCkjvIsKHDh4MEQpxIsaLFbxczatxIMOFCjiBDijTmcaTJkyhnSUzJsqVLTitfypxJE1DMmjhz6ryps6dP/5Y8fwodujEo0aNIHRpNyrSpvqVOo0pNB3Wq1avUqmLdyvWW1q5gwyL8KLas2Vct1AS4gAKG27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEysOfOJCgEpCLrz4MMHA2cuYFyWYEOLFhUooRDTITLo0IgcmTAy5kEKB6dewAx1QkWFGABcOYuverYeBiwAaOsiRISMOcePFeSsn/UEDCgjDkx8XMH25dbMUUMQgcL27bgcxYngfD/vFiznTq5NfjzU8eunJ2cuf6n6+fbD17+u/mp96/P0AEtWfegEW2FN/Bib4E4IKNogTgw5G+BKEElaIEoUWZhgShhp2mCIRhx6GOBGIIpbIEIkmpjgQiiq2iA+LLsYID4wy1nhODEEAADs=') no-repeat 0 0;
  float: left;
  height: 15px;
  padding: 7px 15px 5px 20px;
  list-style: none;
  cursor: pointer; }
#mmnu li.tab_act {
  background-position: 0 -27px;
  cursor: default; }
#mmnu li * {
  color: #436976;
  text-decoration: none; }
#mmnu li.tab_hover * {
  text-decoration: underline; }
#mmnu li.tab_act * {
  color: #07A2E4; }
.smnu {
  height: 28px;
  border-bottom: 1px solid #CCCCCC;
  margin-bottom: 15px; }
.smnu li {
  float: left;
  background: #FFFFFF;
  height: 9px;
  border: 1px solid #CCCCCC;
  margin: 0 5px 0 0;
  padding: 7px 20px 11px 20px;
  list-style: none;
  cursor: pointer; }
.smnu li.tab_act {
  border: 1px solid #9AA9B6;
  background: #C6D9EC;
  cursor: default; }
.smnu li * {
  font-size: 12px;
  color: #436976;
  text-decoration: none; }
.smnu li.tab_act * {
  font-weight: normal;
  color: #000000; }
.toggler, .open {
  float: right;
  width: 5px;
  height: 9px;
  cursor: pointer;
  background: url('data:image/gif;base64,R0lGODlhCgAJAIAAALS0tP///yH5BAUUAAEALAAAAAAKAAkAAAIRjANwm7nYnIkR0mbpua8+uBQAOw==') no-repeat 0 0; }
.open {
  background-position: -5px 0; }
.inner_els {
  padding-right: 15px; }
.block {
  float: left;
  width: 200px;
  height: 90px;
  white-space: nowrap;
  margin: 0 8px 0 0; }
@media screen and (-webkit-min-device-pixel-ratio:0) {
  .block {
    width: 210px; }
}
html:first-child .block {
  width: 200px; }
.instr {
  font-style: italic;
  height: 25px; }
.pages, .print {
  float: left;
  padding-right: 30px; }
.pages * {
  margin-right: 7px; }
.print {
  background: url('data:image/gif;base64,R0lGODlhEAAQANX/ACEYISEhGDExMTk5OUJCQlJSUmNjY2tra3Nzc4SEhIyMjIyMlJSUlJSUnJSt95ycnJyczpyt95yt/6WlpaWlraWlxqWtpaW9/6XWpa2tra2tta3G/7W1tb29vb29xr3Gvb3G573O/8bGxsbO587Ozs7O1s7W3s7e/9bW1tbn/97e3t7n7+fn5+fn7+fn/+/v7+/v9/f398DAwP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADIALAAAAAAQABAAQAaeQJkQQoREIsJk8kEiqUQczKdCmXA8E6UMcgptLhKtbPF4zVqih4KRMAwCAISW670gxcIHivTooP4iGUkMGRMZIigvL08ZDwsMCloPDyUMAwUNiAlzKV1fd3hbnhcOoUIuJyAgIyYkDGJ9GRksMC8rexyvY4ckIiokFh0kgLkyDywsHRMaWAyPDQoHm3kPMTMoDwQAAAIGCZGwSQnfSUEAOw==') no-repeat 0 0;
  font-style: normal;
  padding: 0 0 6px 22px; }
.buttons {
  text-align: right; }
.bord {
  font-size: 12px;
  border-right: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC; }
.bord th {
  background: #E9EDEF;
  border-left: 1px solid #CCCCCC;
  border-top: 1px solid #CCCCCC;
  text-align: left;
  padding: 7px; }
.bord th.c {
  text-align: center;
  width: 5%; }
.bord td {
  text-align: center;
  border-left: 1px solid #CCCCCC;
  border-top: 1px solid #CCCCCC;
  padding: 5px 7px 5px 7px; }
.bord td.l {
  text-align: left; }
.bord td.nc {
  text-align: left;
  white-space: nowrap; }
td.lch {
  background: #D5E2F0!important; }
td.le {
  background: #DAE0DC!important; }
td.out {
  background: #D8D8D8!important; }
.hl td {
  background: #ECECEC; }
.nofloat {
  overflow: hidden; }
#popup .btns {
  float: right;
  padding-right: 5px; }
#popup .btns div {
  cursor: pointer;
  width: 10px;
  height: 10px;
  border: 1px solid #999999;
  background: url('data:image/gif;base64,R0lGODlhCAAIAIAAAJmZmf///yH5BAEHAAEALAAAAAAIAAgAAAIOBIJhi7zcYDTpUWiTAgUAOw==') no-repeat 1px 1px; }
</style>
</head>

<body>

<? if(isset($_SESSION['result'])) { ?>
<fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
<legend><?=$_SESSION['name']?></legend>
<textarea style="width:99%" cols="10" rows="10" readonly="readonly" onclick="this.select()" onfocus="this.select()"><?=$res=htmlspecialchars("'data:{$_SESSION['type']};base64,{$_SESSION['result']}'") ?></textarea></fieldset>
<? if(strlen($res)>2048) { ?><p style="background-color:#f99;padding:4px;font-family:monospace;font-size:14px"><b>Внимание!</b> Длина результирующего кода превышает 2048 символов, что приведет к неработоспособности его в браузерах Internet Explorer.</p><? } ?>

<fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
<legend>Строчка для копирования в базу картинок FSS</legend>
<textarea id="fss_code" style="width:99%" cols="10" rows="10" readonly="readonly" onclick="this.select()" onfocus="this.select()"></textarea></fieldset>
<p style="margin:0;padding:0;background-color:#339900;padding:4px;font-family:monospace;font-size:14px">
  Пример рабочего хэша:
  <pre style="margin:0 0 20px;padding:10px 0 0;background-color:#C2FFA6">
  var emblems = {
    "ЦСКА"      : "data:image/gif;base64,R0lGODlhEAAQAJH/AEpSc4SEtcDAwAAAACH5BAEAAAIALAAAAAAQABAAQAIclI8pwO0dzJssLvosBhbtfnzKSJbmiabqyrZoAQA7",
    "Зенит"     : "data:image/gif;base64,R0lGODlhEAAQAJH/AEpSc4SEtcDAwAAAACH5BAEAAAIALAAAAAAQABAAQAIclI8pwO0dzJssLvosBhbtfnzKSJbmiabqyrZoAQA7",
    "Локомотив" : "data:image/gif;base64,R0lGODlhEAAQAJH/AEpSc4SEtcDAwAAAACH5BAEAAAIALAAAAAAQABAAQAIclI8pwO0dzJssLvosBhbtfnzKSJbmiabqyrZoAQA7"
  };
  </pre>
</p>

<script type="text/javascript">
//<![CDATA[
var current_code = {
  '<?=$_SESSION['u_name']?>' : <?=$res?>
};
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

var data = objTools.parse(current_code);
document.getElementById('fss_code').value = data.substring(1, data.length-1);
//]]>
</script>
<? } ?>

<form action="<?=$url?>" method="post" enctype="multipart/form-data">
  <input type="text" name="u_name" value="Имя" />
  <input type="file" name="u" />&nbsp;<input type="submit" value="Convert this!" />
</form>

</body>
</html>
