chrome.runtime.onMessage.addListener(function gotMessage(request, sender, sendResponse){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {user: request.user});
    });
    sendResponse("success");
});

