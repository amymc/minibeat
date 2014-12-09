var cb = function(result) {

    var arr =[];
    //create document fragment for appending content to the DOM later 
    var frag = document.createDocumentFragment();

    //convert the result object to an array
    var createArray = function (result) {
        for( var i in result) {
            if (result.hasOwnProperty(i)){
                 arr.push(result[i]);
                 arr[0].sort(function(obj1, obj2) {
                     // descending: first # of visits greater than the previous
                     return obj2.stats.people - obj1.stats.people;
                 });
                 return arr;
            }
        }
    };

    //append the info to the DOM
    var displayPages = function (arr){
        var row, statsCell, titleCell;
        var table = document.getElementsByTagName('tbody')[0];
        //reset the table to be empty every time it polls for updates
        table.innerHTML = "";

        for (var i=0; i<10; i++){
            row = document.createElement("tr");
            statsCell = document.createElement("td");
            titleCell = document.createElement("td");
            titleCell.className = 'title';
            statsCell.textContent = arr[0][i].stats.people;
            titleCell.textContent = arr[0][i].title;
            row.appendChild(statsCell);
            row.appendChild(titleCell);
            frag.appendChild(row);
        }
        table.appendChild(frag);
    };

    //add click event listener to page titles
    var addClick = function () {
        var titles = document.getElementsByClassName('title');
        var refererTable = document.getElementsByClassName('referer-table');
        var dataDisplayed;
        for(var i=0; i<titles.length; i++) {
            //need to capture the value of i at each pass through the loop by passing it into a newly created 'titleIndex' object.
            //otherwise at the point that the onclick method is invoked, the for loop has already completed and the variable i already has a value of 10. 
            titles[i].onclick = function(titleIndex) {
                return function(){
                    //if referer-table is already open, close it
                    if (dataDisplayed === true){
                            refererTable[0].style.display = "none";
                            dataDisplayed = false;
                        }
                        //otherwise call displayReferers to render the table
                        else{
                            displayReferers(titleIndex, arr);
                            dataDisplayed = true;
                        }
                    };
            }(i);
        }
    };

    //display referer info on button click
    var displayReferers = function (titleIndex, arr){
        var referers = arr[0][titleIndex].stats.toprefs;
        //'titleIndex + 1' to account for the fact that first 'tr' is actually in the table head
        var tr = document.getElementsByTagName('tr')[titleIndex+1];
        var tableHeading = document.createElement('thead');
        var th = document.createElement('th');
        var refererTable = document.createElement("table");
        var tableBody = document.createElement('tbody');
        var row, visitorCell, domainCell;

        th.colSpan = '2';
        th.textContent = 'Details -' + arr[0][titleIndex].title;
        tableHeading.appendChild(th);
        refererTable.appendChild(tableHeading);
        refererTable.appendChild(tableBody);
        refererTable.className = 'referer-table';
        refererTable.style.display = "block";
        tr.appendChild(refererTable);

        for(var i=0; i<referers.length; i++) {
            row = document.createElement("tr");
            visitorCell = document.createElement("td");
            domainCell = document.createElement("td");
            visitorCell.textContent = arr[0][titleIndex].stats.toprefs[i].visitors;
            domainCell.textContent = arr[0][titleIndex].stats.toprefs[i].domain;
            row.appendChild(visitorCell);
            row.appendChild(domainCell);
            frag.appendChild(row);
        }
        tableBody.appendChild(frag);
    };

    return {
        createArray: createArray(result),
        displayPages: displayPages(arr),
        addClick: addClick(),
    };

};

//passing the cb module as a callback function
cbApi.getData(cb);

//polls for updates every 5 seconds
window.setTimeout(function() {
    cbApi.getData(cb);
}, 5000);


