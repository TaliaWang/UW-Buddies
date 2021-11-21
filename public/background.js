chrome.runtime.onMessage.addListener(function gotMessage(request, sender, sendResponse){
    if (request.type == 'updateUser'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: 'updateUser', user: request.user});
        });
    }
    sendResponse("success");
});

