function updateSubjectsInDatabase(){
    var coursesTableBody = document.getElementsByTagName("table")[1].getElementsByTagName("tbody")[0];
    var coursesTableRows = coursesTableBody.getElementsByTagName("tr");

    var subjectName = "";
    var subjects = [];
    for (var i=1; i < coursesTableRows.length; ++i){
        cells = coursesTableRows[i].getElementsByTagName('td');
        if (cells.length >= 7){
            if (cells.length == 8){
                // buddies column exists
                subjectName = cells[1].textContent + cells[2].textContent;
            }
            else if (cells.length == 7){
                subjectName = cells[0].textContent + cells[1].textContent;
            }
            console.log(subjectName);
            subjects.push(subjectName);
        }
    }

    alert(subjects);
}

//START
updateSubjectsInDatabase()