//extract email address and zip code from URL
let uri = window.location.search.substring(1);
let zipCodeStart = uri.indexOf('&zipcode');
let emailID = uri.slice(4, zipCodeStart);
let zipCode = uri.slice(zipCodeStart + 9, zipCodeStart + 14);
if(zipCodeStart === -1) {
    zipCode = 90551;//dummy value to prevent errors
}

//helper functions:

//GET request function
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); 
    xmlHttp.send(null);
}

//make table entries and append to DOM
function makeTableEntry(parentId, content) {
    let parentElem = document.getElementById(parentId);
    let td = "<td>";
    td += content + "</td>";
    parentElem.insertAdjacentHTML('beforeend', td);
}

//make table headers and append to DOM
function makeTableHeader (parentId, content) {
    let parentElem = document.getElementById(parentId);
    let th = "<th>";
    th += content + "</th>";
    parentElem.insertAdjacentHTML('beforeend', th);
}

//make checkboxes with installer IDs and append to DOM
function makeCheckbox (parentId, installerID) {
    let parentElem = document.getElementById(parentId);
    let td = "<td>";
    td += "<input class='installer_check' id=" + installerID + " type='checkbox'/></td>";
    parentElem.insertAdjacentHTML('beforeend', td);
}

//populate installer table
function populateInstallerTable (installers) {
    installers.forEach(function(installer) {
        makeTableHeader('name', installer.Name);
        makeTableEntry('about', installer.Mission);
        makeTableEntry('location', installer.Location);
        makeTableEntry('year_founded', installer.Year_founded);
        makeTableEntry('installs', installer.Installs);
        makeTableEntry('finance', installer.Offerings);
        makeCheckbox('installer_checkbox', installer.ID)
    });
}

//end helper functions

// make get request to populate installer table
function getInstallers (zipCode) {
    httpGetAsync("http://www.sunpiksolar.com/wp-json/form-submit/v1/zipcode?zipcode=" + zipCode,
    function(data) { 
        const installers = JSON.parse(data);
        if(!installers[0]) {
            document.getElementById("body_text").innerHTML = "<h2>We aren't in your area yet, but stay tuned! We will reach out to you when we are.</h2>"
        } else {
            let firstFour = installers.slice(0, 4);
            populateInstallerTable(firstFour);
        }
    });
}

//make GET request - inserts user or returns current user
httpGetAsync("http://sunpiksolar.com/wp-json/form-submit/v1/create?email=" + emailID,
function(data) {
    const user = JSON.parse(data);
    if(user === 1 || user[0] && !user[0].installers) {
        document.getElementById("pick_installer").style.display = "block";
    } else {
        document.getElementById("next_step").innerHTML = "Thank you for taking the first step to going solar!"
    }
});

//show installer table when button clicked
document.getElementById("select_btn").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("installers_table").style.display = "block";
});

//extracts data from form on submit
document.getElementById("table_submit").addEventListener("click", function(e) {
    //e.preventDefault()
    //make an array from the checkbox data
    let arr = Array.from(document.getElementsByClassName("installer_check"));
    //get the checked = true boxes and return string with corrosponding ID
    let data = arr.filter(function(elem) {
        return elem.checked;
    })
    .map(function(elem) {
        return elem.id;
    })
    .join(" ");
    //insert installer preferences into database
    httpGetAsync("http://sunpiksolar.com/wp-json/form-submit/v1/select?email=" + emailID + "&installer=" + data,
function(data) { });
});

getInstallers(zipCode);