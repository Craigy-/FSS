/*** Прикладные функции и обработчики ***/
var $key, $autogoals = [], $empty = true;
var $url = {
  'champ'   : 1,
  'tab'     : 1,
  'options' : [0, 0]
}
var $alias = {
  'lch'   : 'Зона Лиги чемпионов УЕФА',
  'le'    : 'Зона Лиги Европы УЕФА',
  'out'   : 'Зона вылета',
  'champ' : [
            'Действующий чемпион',
            'data:image/gif;base64,R0lGODlhDgANANUAAPnu0ffuzPjsyPXpuPPov/jos/PnvfPnt/flrPbipPDjqvDiqe7bnPLciPTac/bVdvPVYOjUf/HNaPLLM//LAPPHOP/KAP/JAP3HA/bHFPTIG//HAP/GAP/FAP/EAPTEHvLFEv/BAP3CAP3AAPvBAP3BAPK+EPO9B/K7APS6APe5APC4AP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHACwALAAAAAAOAA0AAAZSQJZwOAgMj0iTBMlkjVTN46HTYR4Aw4nF0hgKDAqUZ+y5mM8rghAiOp9JCWZmQ99ooiC3o3kIUSgYFCUHTBUcH0InHAVMKQhHDytIDAtMEYQsQQA7'
            ],
  'cup'   : [
            'Действующий обладатель Кубка',
            'data:image/gif;base64,R0lGODlhEAAMANUAAP3vqv/ts//krv/boP/Zkf/gAP3WZP/XUv/ZJv/QhuvVgOnTfv/YAP/WEf3TOOrRcf/RI//UAOnPcefOcv/OFufNZufMav/OCebLWufKYubJXv/JAPXLBuTGVeTGTu/FJP/AK//BEebDRebBQv+8HeO/Rt++Q+2/Bf26AOC6LeS5Jv2yAPe1AN62JuO4CumyIeWxHu+uBOCtJeOqB/6cAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEHADUALAAAAAAQAAwAAAZrwJpQaNGURpjKUNgRqgChjTQSQcGEnlHJkgpQKAlCo7B5WUajhaSmMIBIAwFkQ3vUHvaW8HOIQBBkMUJ6QiV3DhdUESsYNSZLNSUZHhwMDCyShpBLJ4Kbnxgjn58PGaObeKdDEykuMzITkEEAOw=='
            ],
  'new'   : [
            'Новичок лиги',
            'data:image/gif;base64,R0lGODlhDQAMAIAAAIwBAP///yH5BAEHAAEALAAAAAANAAwAAAIXjA+nCr3c3It00ftCzEjyzWleBn7jdBYAOw=='
            ]
}

/* Смена заголовка */
function makeHeader(text) {
    $('hdr').html('Панель статистики :: ' + text);
}

/* Текущее время в нужном формате */
function currentTime() {
  var all = new Date();
  return ((all.getDate() < 10) ? '0' : '') + all.getDate() + '.' + ((all.getMonth() < 9) ? '0' : '') + (parseInt(all.getMonth(), 10) + 1) + '.' + all.getFullYear().toString().substr(2) + ' ' + all.getHours() + ((all.getMinutes() < 10) ? ':0' : ':') + all.getMinutes();
}

/* Добавляет в урл параметры для псевдонавигации по системе или считывает их текущее значение

  champ  - глобальное переключение между чемпионатами (верхнее меню), по умолчанию - 1
  tab(1) - опционально, по умолчанию открывается первая вкладка
      2  - Турнирная таблица
      3  - Бомбардиры (комбинации options - [0,1], [1,1], [1,2], [0,0] по умолчанию)
*/
function modURL(mode) {
  // Парсим урл и заполняем глобальный хэш $url
  if(!mode) {
    var pars = document.location.hash.split(/\&/);
    pars.walkwith(function(el) {
      if(el) {
        var ta = el.split(/\=/);
        switch(ta[0]) {
          case 'tab':
            $url.tab = parseInt(ta[1], 10); break;
          case 'options':
            $url.options = eval(ta[1]); break;
          default:
            $url.champ = parseInt(ta[1], 10);
        }
      }
    });
  }

  // Меняем урл на основе глобального хэша
  else
    document.location.hash = '#champ=' + $url.champ + '&tab=' + $url.tab + '&options=' + objTools.parse($url.options);
}

/* Добавляет массив опций в селектор */
function addOption(sid, attr) {
  if(attr && attr.length)
  for(var i=0,l=attr.length; i<l; i++) {
    var opt = new Option();
    for(var j in attr[i]) {
      switch(j) {
      case 'innerHTML':
        $(opt).html(attr[i][j]); break;
      case 'selected':
        opt.selected = opt.defaultSelected = true; break;
      case 'disabled':
        opt.disabled = true; break;
      case 'value':
      default:
        opt.setAttribute(j, attr[i][j]);
      }
    }
    $(sid).appendChild(opt);
  }
}

/* Возвращает значение выбранной опции селектора */
function selOption(sid) {
  return $(sid).options[$(sid).selectedIndex].value;
}

/* Подготовка страницы в зависимости от наличия хэша данных */
function pagePrepare() {
  $('mmnu').empty(true, true);
  if(!objTools.length(data)) {
    $('first_start').show();
    $('main').hide();
    makeHeader('Первый запуск');
  } else {
    $('first_start').hide();

    for(var i in data) {
      $('mmnu').add('li', {'class':'hds'}, [add('b', null, [addtext(i)])]);
    }

    modURL();
    tabs.init({apply:[
      { hds : 'hds', open : $url.champ, callback : function(a,b,c) {
        $url.champ = c;
        modURL(true);
        $key = a.firstChild.html();
        loadData();
      }},
      { els : 'inner_els', hds : 'inner_hds', open : $url.tab, callback : function(a,b,c) {
        $url.tab = c;
        modURL(true);
      }}
    ]});
    $('main').show();
  }
}

/* Загрузка данных на страницу по ключу */
function loadData() {
  var obj = data[$key], cn = 1, tour = {}, newObj = {}, keys = [];

  // Готовим блок ввода
  $('count_home').value = $('count_guest').value = '0';
  $('com_home_div').empty(true, true);
  $('com_guest_div').empty(true, true);
  $('com_home_div').add('select', {'id':'com_home'}).$('change', selHandler);
  addOption('com_home', [{'value':'null', 'innerHTML':'Выберите команду&nbsp;&nbsp;', 'selected':'selected'}]);

  try { $('count_home').focus(); } catch(e) {}
  $('match_add').disabled = true;
  $('bombs_input').empty(true, true);

  // Сортируем данные по правилам распределения мест команд (с пропуском некоторых пунктов)
  for(var i in obj) {
    if(i!='service') keys.push(i);
  }

  keys.sort(function cmp(a, b) {
    var p1 = obj[a][0]*3 + obj[a][1], p2 = obj[b][0]*3 + obj[b][1];
    if(p1==p2) {
      var p1_ = obj[a][0], p2_ = obj[b][0];
      if(p1_==p2_) {
        var p1__ = obj[a][3] - obj[a][4], p2__ = obj[b][3] - obj[b][4];
        if(p1__==p2__) {
          var p1___ = obj[a][3], p2___ = obj[b][3];
          if(p1___==p2___) return 0;
          return (p1___ < p2___) ? 1 : -1;
        }
        return (p1__ < p2__) ? 1 : -1;
      }
      return (p1_ < p2_) ? 1 : -1;
    }
    return (p1 < p2) ? 1 : -1;
  })

  for(var i=0,l=keys.length; i<l; i++) {
    newObj[keys[i]] = obj[keys[i]];
  }
  newObj.service = obj.service;
  data[$key] = newObj; // обновляем глобальный хэш

  // Выводим отсортированные команды в таблицу и заполняем статистику бомбардиров
  $('tt').empty(true, true);
  $('tt').add('table', {'class':'z bord ieFix m10', 'width':'100%', 'id':'tt_table'}, [
    add('tbody', null, [
      add('tr', null, [
        add('th', {'innerHTML':'Место'}),
        add('th', {'width':'69%', 'innerHTML':'Команда'}),
        add('th', {'class':'c', 'innerHTML':'И'}),
        add('th', {'class':'c', 'innerHTML':'В'}),
        add('th', {'class':'c', 'innerHTML':'Н'}),
        add('th', {'class':'c', 'innerHTML':'П'}),
        add('th', {'class':'c', 'innerHTML':'Голы'}),
        add('th', {'class':'c', 'innerHTML':'Очки'})
      ])
    ])
  ]);

  for(var i in newObj) {
    if(i=='service') continue;
    addOption('com_home', [{'value':i, 'innerHTML':i}]); // тут же до кучи заполняем селекторы со списком команд в панели ввода

    var el = newObj[i], svc = newObj.service, cls = ttl = '';

    // Определяем какой нынче тур идет
    var gn = el[0] + el[1] + el[2];
    if(!tour[gn]) tour[gn] = 0;
    tour[gn]++;

    // Подсвечиваем зоны еврокубков и вылета
    for(var j in svc) {
      if(j=='edited') continue;
      if(svc[j] && $(svc[j]).hasa(cn)!==false) {
        cls = j;
        ttl = $alias[j];
      }
    }

    // Добавляем команде заслуги прошлого сезона
    var icons = [];
    if(el[6]) {
      for(var j=0; j<el[6].length; j++) {
        var item = el[6][j];
        icons.push(add('img', {'align':'top', 'alt':$alias[item][0], 'title':$alias[item][0], 'style':'padding-left:5px', 'src':$alias[item][1]}));
      }
    }

    $($('tt_table').firstChild).add('tr', (cn % 2 == 0) ? {'class':'hl'} : null, [
      add('td', {'class':cls, 'title':ttl, 'innerHTML':String(cn)}),
      add('td', {'class':'nc bb', 'innerHTML':i}, (icons.length != 0) ? icons : null),
      add('td', {'innerHTML':String(gn)}),
      add('td', {'innerHTML':String(el[0])}),
      add('td', {'innerHTML':String(el[1])}),
      add('td', {'innerHTML':String(el[2])}),
      add('td', {'noWrap':'noWrap', 'innerHTML':el[3] + ' &mdash; ' + el[4]}),
      add('td', {'class':'bb', 'innerHTML':String(el[0]*3 + el[1])})
    ]);
    cn++;
  }

  // Пишем заголовок
  makeHeader($key);

  // Дописываем текущий тур в заголовок
  keys = [];
  for(var i in tour) {
    keys.push(i);
  }
  keys.sort(function cmp(a, b) {
    if(tour[a]==tour[b]) return 0;
    return (tour[a] > tour[b]) ? -1 : 1;
  })
  if(keys[0]!=0) $('hdr').innerHTML += ' :: ' + ((keys[0] == (cn - 1) * 2 - 2 && keys.length == 1) ? 'Итоговая таблица' : 'после ' + keys[0] + ' тура');

  var node = $('com_home').cloneNode(true);
  node.setAttribute('id', 'com_guest');
  node.$('change', selHandler);
  $('com_guest_div').appendChild(node);

  $empty = true;
  createBombers($url.options[0], $url.options[1]);

  // Когда же был последний сэйв?
  $('content').filter('div','instr',null,true).filter('b',null,null,true).walkwith(function(el) {
    el.html(obj.service.edited);
  });
}

/* Генерация таблицы бомбардиров

   type - тип таблицы для вывода (0 - по голам, 1 - по командам)
   sorting - сортировка (0 - по фамилии, 1 - по командам (только для type = 0), 2 - по голам (только для type = 1))
*/
function createBombers(type, sorting) {
  var obj = data[$key], newObj = {}, cn = 1;

  // Готовим селекторы
  var opts = $('b_sorts').options, types = $('b_types').options, sel = opts[(type == 0) ? 2 : 1].selected ? 0 : sorting;
  types[type].selected = types[type].defaultSelected = true;
  opts[sel].selected = opts[sel].defaultSelected = true;
  opts[1].disabled = (type == 0) ? false : true;
  opts[2].disabled = (type == 0) ? true : false;

  // Меняем урл
  $url.options = [type, sel];
  modURL(true);

  // Сортируем и переформировываем данные в соответствие с выбранным способом отображения
  // и создаем таблицу в соответствие с выбранным типом
  $('bt').empty(true, true);
  $('content').filter('div','instr',null,true).filter('div','pages',null,true).walkwith(function(el) {
    el.html('В скобках указаны голы, забитые с пенальти');
  });

  // Сортируем бомбардиров каждой команды по фамилии или забитым мяча (=> newObj (полный отсортированный клон data[$key]) для использования при type = 1)
  // Код вынесен сюда, чтобы по фамилии сортировалось всегда при первом выводе (надо для селектора списка бомбардиров)
  var s = (sorting == 2) ? true : false;
  newObj = objTools.clone(obj);
  for(var i in obj) {
    var keys = [], bombs = obj[i][5];
    if(!objTools.length(bombs)) continue;
    $empty = false;
    newObj[i][5] = {};
    for(var j in bombs) {
      keys.push(j);
    }

    keys.sort(function cmp(a, b) {
      if(s) {
        a = bombs[a][0];
        b = bombs[b][0];
      }
      if(a==b) return 0;
      return (a < b) ? (s ? 1 : -1) : (s ? -1 : 1);
    })

    for(var j=0,l=keys.length; j<l; j++) {
      newObj[i][5][keys[j]] = bombs[keys[j]];
    }
  }
  if(!s) data[$key] = newObj; // обновляем глобальный хэш

  switch(type) {
  case 1:
    // Бомбардиров нет
    if($empty) {
      $('bt').add('table', {'class':'z bord ieFix m10', 'width':'100%'}, [add('tbody', null, [add('tr', null, [add('th', {'class':'nc', 'innerHTML':'Голов пока никто не забивал'})])])]);
      $('content').filter('div','instr',null,true).filter('div','pages',null,true).walkwith(function(el) {
        el.html(' ');
      });
      break;
    }

    // Рисуем шапочку
    $('bt').add('table', {'class':'z bord ieFix m10', 'width':'100%', 'id':'bt_table'}, [
      add('tbody', null, [
        add('tr', null, [
          add('th', {'innerHTML':'Команды'}),
          add('th', {'width':'99%', 'innerHTML':'Бомбардиры'})
        ])
      ])
    ]);

    // Выводим отсортированных бомбардиров по командам
    for(var i in newObj) {
      if(i=='service') continue;
      
      var el = newObj[i], tempObj = {}, isBombs = objTools.length(newObj[i][5]), auto = 0;
      if(isBombs) {
        for(var j in el[5]) {
          var cur = el[5][j], fst = el[5][j][0];
          if(typeof cur[1]=='string') auto = auto + fst;
          else {
            if(s) {
              if(!tempObj[fst]) tempObj[fst] = [];
              tempObj[fst].push([j, cur[1]]);
              tempObj[fst].sort();
            }
          }
        }
        if(objTools.length(tempObj)) el[5] = tempObj;
      }

      var a = (auto == 0) ? true : false;
      $($('bt_table').firstChild).add('tr', (cn % 2 == 0) ? {'class':'hl'} : null, [
        add('td', {'class':'nc', 'vAlign':'top'}, [
          add('div', {'class':'m5 bb', 'innerHTML':i}),
          add('div', {'innerHTML':'Всего забито: ' + '<b>' + String(el[3]) + '</b>'},
            a ? null : [add('div', {'class':'s11', 'innerHTML':' (из них автоголов: <b>' + String(auto) + '</b>)'})])
        ]),
        add('td', {'class':'l', 'id':'bombs_list_'+cn})
      ]);

      if(isBombs)
        for(var j in el[5]) {
          var cur = el[5][j];
          if(typeof cur[1]=='string') continue;
          if(s) {
            var formatted = cur.walkwith(function(el) {
              return String(el[0] + (el[1] == 0 ? '' : ' (' + el[1] + ')'));
            });
          }
          $('bombs_list_'+cn).add('div', {'class':'m5', 'innerHTML':(s ? '<b>' : '') + String(j) + ' &mdash; ' + (s ? '</b>' : '') + (s ? formatted.join(', ') : '<b>' + String(cur[0]) + (cur[1] == 0 ? ' ' : ' (' + String(cur[1]) + ') ') + '</b>')});
        }
      cn++;
    }
  break;

  case 0:
  default:
    // Сортируем бомбардиров всех команд по забитым мячам и фамилии или команде => newObj (абсолютно новый отсортированный хэш с ключами = забитые мячи + auto)
    var newObj = {}, tempObj = {}, keys = [], s = (sorting == 1) ? true : false;
    for(var i in obj) {
      var el = obj[i][5];
      if(i=='service') continue;
      if(objTools.length(el))
      for(var j in el) {
        var bd = el[j], ss = (typeof el[j][1] == 'string');
        var key = ss ? 'auto' : bd[0];
        var ba = [j, ss ? bd[0] : bd[1], ss ? bd[1] : i];
        if(!ss) keys.push(parseInt(key, 10));
        if(!newObj[key]) newObj[key] = [];
        newObj[key].push(ba);
      }
    }

    // Бомбардиров нет
    if($empty) {
      $('bt').add('table', {'class':'z bord ieFix m10', 'width':'100%'}, [add('tbody', null, [add('tr', null, [add('th', {'class':'nc', 'innerHTML':'Голов пока никто не забивал'})])])]);
      $('content').filter('div','instr',null,true).filter('div','pages',null,true).walkwith(function(el) {
        el.html(' ');
      });
      break;
    }

    if(objTools.length(newObj)) {
      keys.sort(function cmp(a, b) {
        if(a==b) return 0;
        return (a < b) ? 1 : -1;
      })

      for(var i=0,l=keys.length+1; i<l; i++) {
        var arr = newObj[keys[i]] ? keys[i] : 'auto';
        if(!newObj[arr]) continue;
        newObj[arr].sort(function cmp(a, b) {
          var p1 = s ? a[2] : a[0], p2 = s ? b[2] : b[0];
          if(p1==p2) {
            if(a[0]==b[0]) return 0;
            return (a[0] < b[0]) ? -1 : 1;
          }
          return (p1 < p2) ? -1 : 1;
        })
        tempObj[arr] = newObj[arr];
      }
      newObj = tempObj;
    }

    // Рисуем шапочку
    $('bt').add('table', {'class':'z bord ieFix m10', 'width':'100%', 'id':'bt_table'}, [
      add('tbody', null, [
        add('tr', null, [
          add('th', {'class':'c', 'innerHTML':'Голы'}),
          add('th', {'width':'99%', 'innerHTML':'Игроки'})
        ])
      ])
    ]);

    // Выводим отсортированных бомбардиров по голам
    for(var i in newObj) {
      var a = (i == 'auto') ? true : false;

      // Объединяем лузеров, забивших автоголы разным командам
      if(a) {
        var tmp = {};
        for(var j=0; j<newObj[i].length; j++ ) {
          if(tmp[newObj[i][j][0]]==null) tmp[newObj[i][j][0]] = j;
          else {
            newObj[i][tmp[newObj[i][j][0]]][1] += newObj[i][j][1];
            newObj[i].splice(j, 1);
            j--;
          }
        }
        $autogoals = newObj[i]; // сохраняем в глобальный массив всех, кто забивал автоголы
      }

      var formatted = newObj[i].walkwith(function(el) {
        return String(el[0] + ' (' + el[2] + (el[1] !== 0 ? (a && el[1] == 1 ? '' : ', ' + el[1]) : '') + ')');
      });

      $($('bt_table').firstChild).add('tr', (cn % 2 == 0) ? {'class':'hl'} : null, [
        add('td', {'class':'bb', 'vAlign':'top', 'innerHTML':a ? 'в свои ворота' : i}),
        add('td', {'class':'l', 'innerHTML':formatted.join(', ')})
      ]);
      cn++;
    }
  }
}

/* Создание списка ввода бомбардиров и обработка смены его селекторов */
function createBombsList() {
  var list = {}, cn = 1, hv = parseInt($('count_home').value, 10), gv = parseInt($('count_guest').value, 10), hs = selOption('com_home'), gs = selOption('com_guest');

  // Очищаем и подготавливаем блок бомбардиров
  $('bombs_input').empty(true, true);
  if(hv + gv <= 0) return null;
  $('bombs_input').add('div', {'class':'m5 bb', 'innerHTML':'Голы забили:'});
  $('bombs_input').add('ol', {'id':'bombs_list'});

  // Добавляем элементы списка
  for(var i=0, l=hv+gv; i<l; i++) {
    list[cn] = (i < hv) ? hs : gs;
    cn++;
  }

  for(var i in list) {
    var sn = (list[i] == hs) ? 0 : 1, cid = 'bombs_comms_' + i, pid = 'bombs_players_' + i;
    $('bombs_list').add('li', null, [
      add('div', {'class':'m5'}, [
        add('select', {'id':pid}).$('change',
          function(e) {
            // Обработчик выбора ввода нового игрока
            var slc = e.target || e.srcElement;
            if(selOption(slc)=='add') {
              $(slc).hide();
              $(slc.id + '_inp').show();
            }
          }),
        add('input', {'type':'text', 'size':'30', 'id':pid + '_inp'}).hide().$('keyup',
          function(e) {
            // Отмена ввода нового игрока по нажатию ESC
            var inp = e.target || e.srcElement;
            if(e.keyCode==27 && inp.previousSibling && inp.previousSibling.options.length!=0) {
              $(inp.previousSibling).show();
              $(inp).hide();
            }
          })
      ]),
      add('div', {'class':'m10', 'innerHTML':'из команды&nbsp;&nbsp;'}, [add('select', {'id':cid}).$('change',
        function(e) {
          // Перезаполняем селектор при смене команды
          var sid = (e.target || e.srcElement).id;
          var bid = 'bombs_players_' + sid.substr(sid.length - 1), pid = $('bombs_penalty_' + sid.substr(sid.length - 1)), aid = $('bombs_auto_' + sid.substr(sid.length - 1));

          while($(bid).options.length) $(bid).remove($(bid).options.length - 1);
          insertBombs(bid, selOption(sid));
          if(aid.style.display=='none') {
            aid.show();
            if(pid.checked) pid.checked = false;
            pid.disabled = true;
          } else {
            aid.hide();
            pid.disabled = false;
          }
        })
      ]),
      add('div', {'class':'m5'}, [
        add('input', {'type':'checkbox', 'class':'chk', 'id':'bombs_penalty_' + i}),
        add('label', {'for':'bombs_penalty_' + i, 'innerHTML':'с пенальти'}),
        add('span', {'id':'bombs_auto_' + i}, [
          add('input', {'type':'checkbox', 'disabled':'disabled', 'checked':'checked', 'class':'chk', 'style':'margin-left:15px'}),
          add('label', {'class':'red', 'innerHTML':'в свои ворота'})
        ]).hide()
      ])
    ]);

    addOption(cid, [
      {'value':hs, 'innerHTML':hs + '&nbsp;&nbsp;'},
      {'value':gs, 'innerHTML':gs + '&nbsp;&nbsp;'}
    ]);
    $(cid).options[sn].selected = $(cid).options[sn].defaultSelected = true;

    insertBombs(pid, list[i]);
  }
}

/* Заполняет селектор сохраненными бомбардирами нужной команды */
function insertBombs(sid, com) {
  var bombs = data[$key][com.toString()][5], names = [], isAG = false;

  $(sid).show();
  $(sid + '_inp').hide();

  // Добавляем в массив фамилии бомбардиров команды
  for(var i in bombs) {
    if(typeof bombs[i][1]=='string') continue;
    names.push(i);
  }

  // Добавляем в массив фамилии авторов автоголов команды
  $($autogoals).walkwith(function(el) {
    if(el[2]==com.toString()) {
      isAG = true;
      names.push(el[0]);
    }
  });

  // Удаляем возможные дубликаты и сортируем фамилии, если для команды были найдены авторы автоголов
  if(isAG) {
    var tmp = {};
    for(var j=0; j<names.length; j++ ) {
      if(tmp[names[j]]==null) tmp[names[j]] = j;
      else {
        names.splice(j, 1);
        j--;
      }
    }
    names.sort();
  }

  // Заполняем селектор опциями
  $(names).walkwith(function(el) {
    addOption(sid, [{'value':el, 'innerHTML':el}]);
  });
  if(names.length!=0) addOption(sid, [{'value':'add', 'class':'shl', 'innerHTML':'Новый игрок&nbsp;&nbsp;'}]);
  
  // Скрываем селектор, если нет бомбардиров, авторов автоголов или сохранены только авторы автоголов из других команд
  if(names.length==0) {
    $(sid).hide();
    $(sid + '_inp').show();
  }
}


/*** Обработчики ***/

/* Глобальный обработчик селекторов ввода */
function selHandler(e) {
  var val = selOption(e.target || e.srcElement), el = e.target || e.srcElement, btn = $('match_add');
  var another = (el.id == 'com_home') ? selOption('com_guest') : selOption('com_home');
  if(val==another) { // защита от дурака о_О
    if(!btn.disabled) {
      btn.disabled = true;
      $('bombs_input').empty(true, true);
    }
    el[0].selected = el[0].defaultSelected = true;
    return false;
  }
  if(val!='null' && another!='null' && parseInt($('count_home').value + $('count_guest').value, 10)>=0) {
    btn.disabled = false;
    createBombsList();
  } else btn.disabled = true;
}

/* DOMContentLoaded */
suilib.ready(function() {
  pagePrepare();

  // Скрытие/раскрытие левого блока
  (function(e) {
    var left = $('menu'), right = $('content'), all = $('all'), btn = e.target || e.srcElement;
    if(btn.className=='toggler') {
      left.animate(.5, {width:[315, 5]}, function() {
        all.hide();
        left.style.paddingLeft = 0;
        right.style.marginLeft = '5px';
        btn.classAdd('open');
      });
    } else {
      left.animate(.5, {width:[5, 315]}, function() {
        all.show();
        left.style.paddingLeft = '15px';
        right.style.marginLeft = '330px';
        btn.classRemove('open');
      });
    }
  }).$('click', 'toggler');

  // Печать статистики
  (function(e) {
    e.returnValue = false;
    if(e.preventDefault) e.preventDefault();

    window.print();
  }).$('click', 'print');

  // Создаем турнир(ы)
  (function() {
    if(objTools.length(data)) pagePrepare(); else alert('Запуск невозможен: не создан ни один турнир!');
  }).$('click', 'sys_load');
  (function() {
    var ol = objTools.length(data);
    if(ol) {
      if(confirm('Создано: '+ol+' турнир(ов). Вы действительно хотите сбросить их?')) {
        data = {};
        alert('Все данные удалены: можно начинать сначала!');
      }
    } else alert('Действие невозможно: данные не созданы или уже были удалены!');
  }).$('click', 'data_reset');
  (function(e) {
    var name = $('trn_name').value, coms = [], inp = e.target || e.srcElement;
    $('commands').filter('input', null, {'type':'text'}, true).walkwith(function(el) {
      var val = el.value;
      if(val) coms.push(val);
    });

    if(!name || coms.length<=1) {
      alert('Для сохранения необходимо назвать турнир и добавить хотя бы две команды!');
      return false;
    }
    var org = inp.value;
    inp.value = 'Сохраняем...';
    setTimeout(function(){ inp.value = org; }, 500);

    data[name] = {};
    data[name].service = {};
    for(var i=0,l=coms.length; i<l; i++) {
      data[name][coms[i]] = [0, 0, 0, 0, 0, {}];
      var sv = selOption($('zones_'+i).firstChild); // подсвечивать зону?
      if(sv!='null') {
        if(!data[name].service[sv]) data[name].service[sv] = [];
        data[name].service[sv].push(i+1);
      }

      if($('champ_'+i).checked) { // у команды есть статусы?
        if(!data[name][coms[i]][6]) data[name][coms[i]][6] = [];
        data[name][coms[i]][6].push('champ');
      }
      if($('cup_'+i).checked) {
        if(!data[name][coms[i]][6]) data[name][coms[i]][6] = [];
        data[name][coms[i]][6].push('cup');
      }
      if($('new_'+i).checked) {
        if(!data[name][coms[i]][6]) data[name][coms[i]][6] = [];
        data[name][coms[i]][6].push('new');
      }
    }
    data[name].service.edited = currentTime();
  }).$('click', 'trn_save');
  (function() {
    $('trn').reset();
    $('commands').empty(true, true);
  }).$('click', 'trn_reset');
  (function() {
    $('commands').empty(true, true);
    var num = parseInt($('commands_num').value);

    // Создаем селектор выбора зоны еврокубков и вылета
    var selector = add('select');
    addOption(selector, [
      {'value':'null', 'innerHTML':'не выделять зону', 'selected':'selected'},
      {'value':'lch', 'innerHTML':$alias['lch']},
      {'value':'le', 'innerHTML':$alias['le']},
      {'value':'out', 'innerHTML':$alias['out']}
    ]);

    var stimg = function(name) {
      return [add('img', {'align':'top', 'alt':$alias[name][0], 'title':$alias[name][0], 'style':'padding-right:10px', 'src':$alias[name][1]})];
    }

    for(var i=0; i<num; i++) {
      $('commands').add('div', {'class':'block'}, [
        add('div', {'class':'left', 'innerHTML':i+1+'. '}),
        add('div', {'class':'nofloat'}, [
          add('div', {'class':'m5'}, [add('input', {'type':'text', 'size':'24'})]),
          add('div', {'class':'m5', 'id':'zones_'+i}),
          // Выбор статуса команды
          add('div', null, [
            add('input', {'type':'checkbox', 'class':'chk', 'id':'champ_'+i}),
            add('label', {'for':'champ_'+i}, stimg('champ')),
            add('input', {'type':'checkbox', 'class':'chk', 'id':'cup_'+i}),
            add('label', {'for':'cup_'+i}, stimg('cup')),
            add('input', {'type':'checkbox', 'class':'chk', 'id':'new_'+i}),
            add('label', {'for':'new_'+i}, stimg('new'))
          ])
        ])
      ]);

      var node = selector.cloneNode(true);
      $('zones_'+i).appendChild(node);
    }
  }).$('click', 'commands_add');

  // Смена типов и сортировок таблицы бомбардиров
  (function(e) {
    var type = parseInt((e.target || e.srcElement).value), sorting = parseInt(selOption('b_sorts'));
    createBombers(type, sorting);
  }).$('change', 'b_types');
  (function(e) {
    var type = parseInt(selOption('b_types')), sorting = parseInt((e.target || e.srcElement).value);
    createBombers(type, sorting);
  }).$('change', 'b_sorts');

  // Ввод данных
  (function(e) {
    var val = parseInt((e.target || e.srcElement).value, 10), btn = $('match_add');
    if(selOption('com_home')!='null' && selOption('com_guest')!='null' && val>=0) {
      btn.disabled = false;
      createBombsList();
    } else btn.disabled = true;
  }).$('keyup', 'count_home', 'count_guest');
  if(objTools.length(data)) selHandler.$('change', 'com_home', 'com_guest');

  // Добавляем матч
  (function(e) {
    var hv = parseInt($('count_home').value, 10), gv = parseInt($('count_guest').value, 10), hs = selOption('com_home'), gs = selOption('com_guest');
    var total = (objTools.length(data[$key]) - 1) * 2 - 2;
    var arr = function(c) {
      return data[$key][c.toString()];
    }

    if((arr(hs)[0]+arr(hs)[1]+arr(hs)[2])>=total || (arr(gs)[0]+arr(gs)[1]+arr(gs)[2])>=total) { // защита от дурака о_О
      alert('Все матчи одной или обеих команд уже были сыграны!');
      return false;
    }

    // Проверяем заполнены ли все поля ввода новых бомбардиров
    var isBombs = (hv + gv == 0) ? false : true,
        isEmpty = false,
        all = $('bombs_input').filter('li', null, null, true),
        names = [], pnls = [], autos = [], coms = [];

    if(isBombs) {
      $(all).walkwith(function(el) {
        var childs = $(el).filter('div', null, null, true);
        var name = (childs[0].firstChild.style.display == 'none') ? childs[0].firstChild.nextSibling.value : selOption(childs[0].firstChild);
        if(name=='' || name=='add') isEmpty = true;
        names.push(name);
        pnls.push(childs[2].firstChild.checked);
        autos.push($(childs[2]).filter('span', null, null, true)[0].style.display == 'none' ? false : true);
        coms.push(selOption($(childs[1]).filter('select', null, null, true)[0]));
      });
      if(isEmpty) { // защита от другого дурака O_О
        alert('Необходимо ввести фамилии всех бомбардиров!');
        return false;
      }
    }

    // Сохраняем победы-ничьи-поражения и разницу мячей
    if(hv>gv) {
      arr(hs)[0]++; arr(gs)[2]++;
    } else if(hv==gv) {
      arr(hs)[1]++; arr(gs)[1]++;
    } else {
      arr(gs)[0]++; arr(hs)[2]++;
    }
    arr(hs)[3] += hv; arr(hs)[4] += gv;
    arr(gs)[3] += gv; arr(gs)[4] += hv;

    // Сохраняем бомбардиров
    if(isBombs) {
      for(var i=0,l=all.length; i<l; i++) {
        var rc = autos[i] ? (coms[i] == hs ? gs : hs) : coms[i];

        if(!arr(rc)[5][names[i]]) arr(rc)[5][names[i]] = [0, 0];
        arr(rc)[5][names[i]][0]++;
        if(pnls[i]) arr(rc)[5][names[i]][1]++;
        if(autos[i]) arr(rc)[5][names[i]][1] = coms[i];
      }
    }

    // Сохраняем время редактирования и перегружаем страницу
    data[$key].service.edited = currentTime();
    loadData();
  }).$('click', 'match_add');

  // Выводим хэш данных для ручного сохранения
  (function(e) {
    var ie = suilib.client.msie, szs = suilib.screensizes(), ts = function(){ $('data').select(); };
    $(suilib.body).add('div', {'id':'saver', 'style':'position:' + (ie ? 'absolute' : 'fixed') + ';top:0;left:0;z-index:9998;background:#000000;width:' + (ie ? szs[2]+'px' : '100%') + ';height:' + (ie ? szs[3]+'px' : '100%')});
    if(!ie) $('saver').setstyle('opacity:0');
    $('saver').setstyle('opacity:20');
    $('popup').setstyle('top:' + Math.ceil(szs[1]/2 - 170) + 'px;left:' + Math.ceil(szs[0]/2 - 350) + 'px');
    $('popup').show(.4, 'fade');
    $('data').value = objTools.print(data);
    setTimeout(ts, 500);
    ts.$('click', 'data');
  }).$('click', 'data_save');
  (function() {
    document.location.reload(true);
  }).$('click', 'data_refresh');
  (function(e) {
    $('popup').hide();
    $('saver').unset(true);
  }).$('click', 'data_close');
});