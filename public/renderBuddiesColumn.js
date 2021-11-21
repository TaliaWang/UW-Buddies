// 'user' variable declared before this file is run

chrome.extension.onMessage.addListener(function renderColumns(request, sender, sendResponse){
    if (request.type == 'updateUser'){
        user = request.user;

        var coursesTableBody = document.getElementsByTagName("table")[1].getElementsByTagName("tbody")[0];
        var coursesTableRows = coursesTableBody.getElementsByTagName("tr");
        var firstCellContent = coursesTableBody.getElementsByTagName("td")[0].textContent;
    
        if (user != null && user != undefined){
            if (firstCellContent != "Buddies!"){
                var newCell = document.createElement('td');
            
                headerCell = newCell.cloneNode();
                headerCell.textContent = "Buddies!";
                headerCell.style.fontWeight = "bold";
                coursesTableRows[0].prepend(headerCell);
                
                
                // skip first row (headers)
                for (var i=1; i < coursesTableRows.length; ++i){
                    var cellClone = newCell.cloneNode();
                    cells = coursesTableRows[i].getElementsByTagName('td');
                    if (cells.length >= 7){
                        cellClone.textContent = "0"; // TODO: get DB values
                    }
                    else{
                        // not a row with a subject
                        cellClone.textContent = " ";
                    }
                    coursesTableRows[i].prepend(cellClone);
                }
            }
        }
        else{
            // user not logged in
            // remove buddies column if it exists
            if (firstCellContent == "Buddies!"){
                for (var i=0; i < coursesTableRows.length; ++i){
                    coursesTableRows[i].getElementsByTagName('td')[0].textContent = "";
                }
            }
        }
    }
    sendResponse("success");
});