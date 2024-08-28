var fakeLocationBar;

window.onload = function() {
    fakeLocationBar = document.getElementById('document-location');
    fakeLocationBar.textContent = location.hash.substr(1);
};

window.onhashchange = function(event) {
    var newURL = event.newURL;
    var newHash = '';
    if (newURL && newURL.indexOf('#')) {
        newHash = newURL.substr(newURL.indexOf('#') + 1);
    }
    fakeLocationBar.textContent = newHash;
};

function restoreWindow() {
    var target = document.querySelector('#window');
    appendClass(target, 'restore');
}

function minimiseWindow() {
    var target = document.querySelector('#window');
    removeClass(target, 'restore');
}

function appendClass(_target, _className) {
    var matcher = new RegExp('(?:^|\\s)' + _className + '(?!\\S)', 'g');
    _target.className += _target.className.match(matcher) ? '' : _className;
}

function removeClass(_target, _className) {
    var matcher = new RegExp('(?:^|\\s)' + _className + '(?!\\S)', 'g');
    _target.className = _target.className.replace(matcher, '');
}