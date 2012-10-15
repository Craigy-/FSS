/*!
 * FSS release's builder (v1.0.0)
 * Copy this script to 'scripts' in editor's main folder. Then just open any source file of FSS and execute script.
 *
 * @requires YUI Compressor v2.4.7 or newer (compressor.jar)
 *
 * Script by Grigory Zarubin (http://craigy.ru) for GridinSoft Notepad Pro (http://notepad.gridinsoft.com)
 */

// Определяем все пути
var PATH = Shell.GetCurrentFolder();

var pathArr = PATH.split('\\');
pathArr.pop();
var ROOT_PATH = pathArr.join('\\');
var COMPRESSOR = ROOT_PATH + '\\compressor.jar';
var VERSION = ROOT_PATH + '\\version.fss';

var SRC_PATH = PATH + '\\';
var HEADER = SRC_PATH + 'htmlhead.htm';
var JS_LIBRARY = SRC_PATH + 'include\\suilib_lite.js';
var JS_LIBRARY_MIN = SRC_PATH + 'include\\suilib_lite.min.js';
var STYLES_MAIN = SRC_PATH + 'css\\styles.css';
var STYLES_MAIN_MIN = SRC_PATH + 'css\\styles.min.css';
var STYLES_IE = SRC_PATH + 'css\\styles_ie.css';
var STYLES_IE_MIN = SRC_PATH + 'css\\styles_ie.min.css';
var STYLES_PRINT = SRC_PATH + 'css\\styles_print.css';
var STYLES_PRINT_MIN = SRC_PATH + 'css\\styles_print.min.css';
var FSS_HTML = SRC_PATH + 'fss.htm';
var FSS_CODE = SRC_PATH + 'fss.js';
var FSS_CODE_MIN = SRC_PATH + 'fss.min.js';
var FSS_CODE_TABS = SRC_PATH + 'include\\tabs.js';
var FSS_CODE_TABS_MIN = SRC_PATH + 'include\\tabs.min.js';
var FSS_CODE_OBJ = SRC_PATH + 'include\\obj.js';
var FSS_CODE_OBJ_MIN = SRC_PATH + 'include\\obj.min.js';
var FSS_DATA = SRC_PATH + 'input_data.js';
var FOOTER = SRC_PATH + 'htmlfoot.htm';


// Выбираем режим сборки, для удобства автоматом подставляем версию (по спецификации Semantic Versioning Specification) и запускаем сборку
var dlg = Application.Dialog;
var currentVersionArr = Shell.FileTostring(VERSION).split('.');
var newVersion = currentVersionArr[0] + '.' + currentVersionArr[1] + '.' + (parseInt(currentVersionArr[2], 10) + 1);

dlg.ClearItems();
dlg.AddItem('VERSION_LABEL','10;20;label;Версия релиза;no use');
dlg.AddItem('VERSION_VALUE','10;35;edit;'+newVersion+';200');
dlg.AddItem('BUILD_MODE_LABEL','10;65;label;Режим сборки;no use');
dlg.AddItem('BUILD_MODE_VALUE','10;80;combobox;Сжать и обфусцировать|Не сжимать;200');

if(dlg.Show('FSS release\'s builder (v1.0.0)', 'Выберите параметры перед началом:', 300, 200)) {
  var result = dlg.Result;
  newVersion = result.Item('VERSION_VALUE');
  var packed = result.Item('BUILD_MODE_VALUE')=='Сжать и обфусцировать';
  var RELEASE = ROOT_PATH + '\\release\\fss' + (packed ? '.htm' : '_full.htm');

  // Собираем релиз
  var all = '';
  var file_content = '';
  var temp = '';
  var temp_ = '';

  temp = Shell.FileTostring(HEADER);
  temp_ = temp.replace(/%%FSS_VERSION%%/, newVersion);
  all += temp_;
  if(packed) {
    Console.SetVisible(true);
    Console.Execute('java -jar "'+COMPRESSOR+'" --type js --charset utf-8  --verbose -o "'+JS_LIBRARY_MIN+'" "'+JS_LIBRARY+'"');
    Console.SetVisible(false);
    if(Shell.FileExist(JS_LIBRARY_MIN)) {
      file_content = Shell.FileTostring(JS_LIBRARY_MIN);
      Shell.DeleteFile(JS_LIBRARY_MIN);
    }
  }
  if(file_content=='') file_content = Shell.FileTostring(JS_LIBRARY);
  temp = '\n<script type="text\/javascript">\n\/\/<![CDATA[\n' + file_content + '\n\/\/]]>\n<\/script>\n';
  file_content = '';
  all += temp;
  if(packed) {
    Console.SetVisible(true);
    Console.Execute('java -jar "'+COMPRESSOR+'" --type css --charset utf-8  --verbose -o "'+STYLES_MAIN_MIN+'" "'+STYLES_MAIN+'"');
    Console.SetVisible(false);
    if(Shell.FileExist(STYLES_MAIN_MIN)) {
      file_content = Shell.FileTostring(STYLES_MAIN_MIN);
      Shell.DeleteFile(STYLES_MAIN_MIN);
    }
  }
  if(file_content=='') file_content = Shell.FileTostring(STYLES_MAIN);
  temp = '<style type="text\/css" media="screen, projection">\n' + file_content + '\n<\/style>\n';
  file_content = '';
  all += temp;
  if(packed) {
    Console.SetVisible(true);
    Console.Execute('java -jar "'+COMPRESSOR+'" --type css --charset utf-8  --verbose -o "'+STYLES_IE_MIN+'" "'+STYLES_IE+'"');
    Console.SetVisible(false);
    if(Shell.FileExist(STYLES_IE_MIN)) {
      file_content = Shell.FileTostring(STYLES_IE_MIN);
      Shell.DeleteFile(STYLES_IE_MIN);
    }
  }
  if(file_content=='') file_content = Shell.FileTostring(STYLES_IE);
  temp = '<!--[if lte IE 7]><style type="text\/css" media="screen, projection">\n' + file_content + '\n<\/style><![endif]-->\n';
  file_content = '';
  all += temp;
  if(packed) {
    Console.SetVisible(true);
    Console.Execute('java -jar "'+COMPRESSOR+'" --type css --charset utf-8  --verbose -o "'+STYLES_PRINT_MIN+'" "'+STYLES_PRINT+'"');
    Console.SetVisible(false);
    if(Shell.FileExist(STYLES_PRINT_MIN)) {
      file_content = Shell.FileTostring(STYLES_PRINT_MIN);
      Shell.DeleteFile(STYLES_PRINT_MIN);
    }
  }
  if(file_content=='') file_content = Shell.FileTostring(STYLES_PRINT);
  temp = '<style type="text\/css" media="print">\n' + file_content + '\n<\/style>\n';
  file_content = '';
  all += temp;
  temp = Shell.FileTostring(FSS_HTML);
  temp_ = temp.replace(/%%FSS_VERSION%%/, newVersion);
  all += temp_;
  if(packed) {
    Console.SetVisible(true);
    Console.Execute('java -jar "'+COMPRESSOR+'" --type js --charset utf-8  --verbose -o "'+FSS_CODE_TABS_MIN+'" "'+FSS_CODE_TABS+'"');
    Console.Execute('java -jar "'+COMPRESSOR+'" --type js --charset utf-8  --verbose -o "'+FSS_CODE_OBJ_MIN+'" "'+FSS_CODE_OBJ+'"');
    Console.Execute('java -jar "'+COMPRESSOR+'" --type js --charset utf-8  --verbose -o "'+FSS_CODE_MIN+'" "'+FSS_CODE+'"');
    Console.SetVisible(false);
    if(Shell.FileExist(FSS_CODE_TABS_MIN)) {
      file_content = Shell.FileTostring(FSS_CODE_TABS_MIN);
      Shell.DeleteFile(FSS_CODE_TABS_MIN);
    }
    if(Shell.FileExist(FSS_CODE_OBJ_MIN)) {
      file_content += Shell.FileTostring(FSS_CODE_OBJ_MIN);
      Shell.DeleteFile(FSS_CODE_OBJ_MIN);
    }
    if(Shell.FileExist(FSS_CODE_MIN)) {
      file_content += Shell.FileTostring(FSS_CODE_MIN);
      Shell.DeleteFile(FSS_CODE_MIN);
    }
  }
  if(file_content=='') file_content = Shell.FileTostring(FSS_CODE_TABS) + '\n\r\n' + Shell.FileTostring(FSS_CODE_OBJ) + '\n\r\n' + Shell.FileTostring(FSS_CODE);
  temp = '\n\r\n<script type="text\/javascript">\n\/\/<![CDATA[\n' + file_content + '\n\r\n' + Shell.FileTostring(FSS_DATA) + '\n\/\/]]>\n<\/script>\n';
  all += temp;
  temp = Shell.FileTostring(FOOTER);
  all += temp;

  if(Shell.FileExist(VERSION)) Shell.DeleteFile(VERSION);
  if(Shell.FileExist(RELEASE)) Shell.DeleteFile(RELEASE);
  Shell.CreateFile(VERSION, newVersion);
  Shell.CreateFile(RELEASE, all);
}

Application.Message('', 'Релиз собран в файл '+RELEASE, 0);