var cb = function(result) {

  var arr =[];
  var table = document.getElementsByTagName('tbody')[0];

  createArray();

  init: window.setTimeout(function() {
      cbApi.getData(cb);
      createArray();
    }, 5000);

  //convert the object to an array
  function createArray() {
    for( var i in result) {
      if (result.hasOwnProperty(i)){
         arr.push(result[i]);
         arr[0].sort(function(obj1, obj2) {
           // descending: first # of visits greater than the previous
           return obj2.stats.people - obj1.stats.people;
         });
      }
    }
    displayPages();
  }

  //append the info to the DOM
  function displayPages() {
    //reset the table to be empty every time it polls for updates
    table.innerHTML = "";
    for (var i=0; i<10; i++){
        table.innerHTML = table.innerHTML + '<tr><td>' + arr[0][i].stats.people + '</td>'+ '<td class="title">' + arr[0][i].title + '</td></tr>';
    }
    addClick();
  }

  //add click event listener to page titles
  function addClick() {
    var titles = document.getElementsByClassName('title');
    var refererTable;
    var dataDisplayed;
    for(var i=0; i<titles.length; i++) {
      titles[i].onclick = function(titleIndex) {
        return function(){
          if (dataDisplayed === true){
              refererTable = document.getElementsByClassName('referer-table');
              refererTable[0].style.display = "none";
              dataDisplayed = false;
            }
            else{
              displayReferers(titleIndex, arr);
              dataDisplayed = true;
            }
          };
      }(i);
    }
  }

  //display referer info on button click
  function displayReferers(titleIndex, arr){
    var referers = arr[0][titleIndex].stats.toprefs;
    //'titleIndex + 1' to account for the fact that first 'tr' is actually in the table head
    var tr = document.getElementsByTagName('tr')[titleIndex+1];
    var tableHeading = document.createElement('thead');
    var th = document.createElement('th');
    var headingText = document.createTextNode( 'Details -' + arr[0][titleIndex].title);
    var refererTable = document.createElement("table");
    var tableBody = document.createElement('tbody');
    var row, visitorCell, visitorNumber, domain, domainCell;

    th.colSpan = '2';
    th.appendChild(headingText);
    tableHeading.appendChild(th);
    refererTable.appendChild(tableHeading);
    refererTable.className = 'referer-table';
    refererTable.style.display = "block";
    tr.appendChild(refererTable);

    for(var i=0; i<referers.length; i++) {
      row = document.createElement("tr");
      visitorCell = document.createElement("td");
      domainCell = document.createElement("td");
      visitorNumber = document.createTextNode(arr[0][titleIndex].stats.toprefs[i].visitors);
      domain = document.createTextNode(arr[0][titleIndex].stats.toprefs[i].domain);
      visitorCell.appendChild(visitorNumber);
      domainCell.appendChild(domain);
      row.appendChild(visitorCell);
      row.appendChild(domainCell);
      tableBody.appendChild(row);
      refererTable.appendChild(tableBody);
      tr.appendChild(refererTable);
    }
  }

};

cbApi.getData(cb);
