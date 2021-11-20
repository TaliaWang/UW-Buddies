var user = localStorage.getItem('user');
alert("USER: " + user);

if (user == null || user == undefined){
    alert("Please log in to the UW Buddies extension!");
}
else{
    var coursesTableBody = document.getElementsByTagName("table")[1].getElementsByTagName("tbody")[0];
    var coursesTableRows = coursesTableBody.getElementsByTagName("tr");
    var newCell = document.createElement('td');
    
    headerCell = newCell.cloneNode();
    headerCell.textContent = "Buddies!";
    headerCell.style.fontWeight = "bold";
    coursesTableRows[0].prepend(headerCell);
    
    
    // skip first row (headers)
    for (var i=1; i < coursesTableRows.length; ++i){
        var cellClone = newCell.cloneNode();
        cellClone.textContent = "0";
        coursesTableRows[i].prepend(cellClone);
    }
    
    alert("done!");
}