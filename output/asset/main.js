define('main', [
    'require',
    'exports',
    'module',
    './tab'
], function (require, exports, module) {
    var fn = require('./tab');
    var tab = new fn.Tab();
    tab.init();
});