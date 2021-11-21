chrome.extension.onMessage.addListener(function renderColumns(request, sender, sendResponse){
    if (request.type == 'updateUser'){
        user = request.user;

        var coursesTableBody = document.getElementsByTagName("table")[1].getElementsByTagName("tbody")[0];
        var coursesTableRows = coursesTableBody.getElementsByTagName("tr");
        var firstCellContent = coursesTableBody.getElementsByTagName("td")[0].textContent;
    
        if (user != null && user != undefined){
            if (firstCellContent != "Buddies!"){
                var newCell = document.createElement('td');
                var cellBtn = document.createElement('btn');
            
                headerCell = newCell.cloneNode();
                headerCell.textContent = "Buddies!";
                headerCell.style.fontWeight = "bold";
                coursesTableRows[0].prepend(headerCell);
                
                
                // skip first row (headers)
                for (var i=1; i < coursesTableRows.length; ++i){
                    var cellClone = newCell.cloneNode();
                    var btnClone = cellBtn.cloneNode();
                    cells = coursesTableRows[i].getElementsByTagName('td');
                    if (cells.length >= 7){
                        btnClone.textContent = 0;
                        btnClone.id = coursesTableRows[i].getElementsByTagName('td')[0].textContent + coursesTableRows[i].getElementsByTagName('td')[1].textContent + " btn";
                        btnClone.style.setProperty('width', '100px');
                        btnClone.style.setProperty('text-align', 'center');
                        btnClone.onclick=function(e){
                            var btn = e.target;
                            var numBuddies = parseInt(btn.textContent);
                            if (btn.style.backgroundColor == 'rgb(144, 238, 144)'){
                                // remove
                                btn.style.setProperty('background-color', 'white');
                                btn.textContent = (numBuddies - 1)
                            }
                            else{
                                // add
                                btn.style.setProperty('background-color', 'rgb(144, 238, 144)');
                                btn.textContent = (numBuddies + 1)
                            }
                        }
                        cellClone.appendChild(btnClone);
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
    else if (request.type == 'updateBuddies') {
        subjects = request.subjects;
        let subjectDict = Object.assign({}, ...subjects.map((x) => ({[x.subject]: x.users})));
        //alert(JSON.stringify(subjectDict));

        var coursesTableBody = document.getElementsByTagName("table")[1].getElementsByTagName("tbody")[0];
        var coursesTableRows = coursesTableBody.getElementsByTagName("tr");
        var firstCellContent = coursesTableBody.getElementsByTagName("td")[0].textContent;

        if (user != null && user != undefined && firstCellContent == "Buddies!") {
            // skip first row (headers)
            for (var i = 1; i < coursesTableRows.length; ++i) {
                var cells = coursesTableRows[i].getElementsByTagName('td');
                if (cells.length >= 7){ // not a spacer row
                    var cell = cells[0];
                    var subjectName = cells[1].textContent + cells[2].textContent;
                    var users = subjectDict[subjectName];
                    cell.getElementsByTagName('btn')[0].textContent = users.length.toString();
                }
            }
        }
    }
    else if (request.type == 'updateUserSubjects'){
        //alert("HIGHLIGHT USER SUBJECTS:" + request.subjects);
        for (var i = 0; i < request.subjects.length; ++i){
            //alert(request.subjects[i] + " btn");
            document.getElementById(request.subjects[i] + " btn").style.setProperty('background-color', 'rgb(144, 238, 144)'); // light green
        }
    }
    sendResponse("success");
});