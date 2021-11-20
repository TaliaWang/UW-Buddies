chrome.runtime.onMessage.addListener(function gotMessage(request, sender, sendResponse){
    alert("MESSAGE RECEIVED: " + request.user.displayName);
    chrome.tabs.executeScript({
        file: 'renderBuddiesColumn.js'
    });
});

