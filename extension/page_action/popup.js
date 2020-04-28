'use strict';

loadDataInPopup();

function loadDataInPopup() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: ''});
    });
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        const tab = tabs[0];
        if (tab && tab.url) {
            chrome.storage.local.get('comps', function (data) {
                const element = document.querySelector('ui-treeview');
                const result = data['comps'][getHostName(tab.url)];
                document.querySelector('#website').textContent = result.domain;
                copyTextToClipboard(JSON.stringify(result.productMatches));
                element.display(result.productMatches);
            })
        }
    });
}

function getHostName(href) {
    const l = document.createElement("a");
    l.href = href;
    return l.hostname;
}

function copyTextToClipboard(text) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}