/* Объект для работы с хэшами */
var objTools = {
  print: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    return 'var data = ' + this.parse(hash) + ';';
  },
  $specialChars: {
    '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'
  },
  $replaceChars: function(chr) {
    return this.$specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
  },
  parse: function(hash) {
    var self = this;
    switch(typeof(hash)) {
      case 'string':
        return "'" + hash.replace(/[\x00-\x1f\\"]/g, function(chr){ return self.$replaceChars.apply(self, [chr]); }) + "'";
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
  length: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    var j = false;
    for(var i in hash) j++;
    return j;
  },
  clone: function(hash) {
    if(!hash || typeof(hash)!=='object') return hash;
    var newHash = hash.constructor();
    for(var i in hash) {
      newHash[i] = this.clone(hash[i]);
    }
    return newHash;
  },
  hash: function(hash) {
    if(!hash || !(hash instanceof Array)) return hash;
    if(hash.length==0) return {};
    var newHash = {};
    for(var i=0; i<hash.length; i++)
      newHash[i] = hash[i];
    return newHash;
  },
  key: function(hash) {
    if(!hash || typeof(hash)!=='object') return null;
    for( var key in hash )
      break;
    return key;
  }
};