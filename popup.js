// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('changeColor');

changeColor.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: ''});
  });
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var tab = tabs[0];
      if (tab && tab.url) {
          chrome.storage.local.get('comps', function (data) {
              var element = document.querySelector('ui-treeview');
              var result = data['comps'][getHostName(tab.url)];
              copyTextToClipboard(JSON.stringify(result));
              element.display(result);
          })
      }
  });

};

function getHostName(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
}

function copyTextToClipboard(text) {
    //Create a textbox field where we can insert text to.
    var copyFrom = document.createElement("textarea");

    //Set the text content to be the text you wished to copy.
    copyFrom.textContent = text;

    //Append the textbox field into the body as a child.
    //"execCommand()" only works when there exists selected text, and the text is inside
    //document.body (meaning the text is part of a valid rendered HTML element).
    document.body.appendChild(copyFrom);

    //Select all the text!
    copyFrom.select();

    //Execute command
    document.execCommand('copy');

    //(Optional) De-select the text using blur().
    copyFrom.blur();

    //Remove the textbox field from the document.body, so no other JavaScript nor
    //other elements can get access to this.
    document.body.removeChild(copyFrom);
}