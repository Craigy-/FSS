<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="application/xhtml+xml;charset=windows-1251" />
<title>FSS Simple Tosser</title>
<script type="text/javascript" src="lite/suilib_lite_packed.js"></script>
</head>
<body>

<p>Утилита эмулирует простой процесс жеребьёвки команд.</p>
<p>После нажатия кнопки "Toss!" выбранная абсолютно случайным образом команда из общего списка будет перемещена в одну из групп, также выбранную случайно.</p>
<i>Флаг "random group's cycle" включает всегда случайный режим выбора группы.</i></p>

<div style="float:left;width:48%">
  <fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
  <legend>Команды</legend>
  <ul id="commands"></ul>
  </fieldset>
</div>
<div style="margin-left:52%">
  <fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
  <legend>Группа A</legend>
  <ul id="group_1"></ul>
  </fieldset>
  <fieldset style="border:1px solid grey;padding:5px;margin:5px;overflow:scroll">
  <legend>Группа B</legend>
  <ul id="group_2"></ul>
  </fieldset>
</div>

<div style="clear:both;padding-top:20px" align="center"><input type="button" id="start_toss" value="Toss!" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" id="random_groups_cycle" />&nbsp;<label for="random_groups_cycle" style="cursor:pointer">random group's cycle</label></div>

<script type="text/javascript">
//<![CDATA[
var commands = [
  'Иванов Д.',
  'Есипов Е.',
  'Никифоров А.',
  'Татаринов А.',
  'Тамбулатов М.',
  'Корягин Ю.',
  'Малютина М.',
  'Никитский К.'
];

for(var i=0,l=commands.length; i<l; i++) {
  $('commands').innerHTML += '<li>' + commands[i] + '</li>';
}

var previous_group = false, all_commands = false;
(function(e) {
  function getRandomNum(start, end) { // получаем целое случайное число в диапазоне
    return Math.floor(Math.random() * (end - start + 1)) + start;
  }

  if(commands.length == 0) return false;
  if(!all_commands) {
    all_commands = commands.length;
  }
  var command = commands.length == 1 ? 0 : getRandomNum(0, commands.length-1),
      group = previous_group ? (previous_group == 1 ? 2 : 1) : getRandomNum(1, 2);

  if($('group_'+group).firstChild && ($('group_'+group).filter('li', false, false, false).length >= (all_commands / 2))) {
    group = group == 1 ? 2 : 1;
  }
  if(!$('random_groups_cycle').checked) previous_group = group;

  var commands_items = $('commands').filter('li', false, false, false);
  $('group_'+group).innerHTML += '<li>' + commands[command] + '</li>';
  for(var i=0,l=commands_items.length; i<l; i++) {
    if($(commands_items[i]).html() == commands[command]) $(commands_items[i]).unset();
  }
  commands.splice(command, 1);
}).$('click', 'start_toss');
//]]>
</script>

</body>
</html>