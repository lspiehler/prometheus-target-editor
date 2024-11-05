//alert('hello');

var printIcon = function(cell, formatterParams, onRendered){ //plain text value
    //return '<button type="button" class="md-button md-button--primary">Copy</button><button type="button" class="md-button">Delete</button>';
    //console.log(cell.getData());
    let buttondiv = document.createElement('div');

    let copybutton = document.createElement('button');
    copybutton.innerHTML = 'Copy';
    copybutton.className = 'md-button md-button--primary';
    copybutton.addEventListener('click', function(e) {
        let celldata = cell.getData();
        //console.log(celldata);
        //console.log(cell.getTable().getRowPosition(cell.getRow()));
        let table = cell.getTable();
        let newid = table.getDataCount() + 1;
        table.addData([{id:newid, target:celldata.target, labels:celldata.labels}], false, table.getRowPosition(cell.getRow()));
    });
    buttondiv.appendChild(copybutton);

    let deletebutton = document.createElement('button');
    deletebutton.innerHTML = 'Delete';
    deletebutton.className = 'md-button';
    deletebutton.addEventListener('click', function(e) {
        cell.getRow().delete()
    });
    buttondiv.appendChild(deletebutton);
    return buttondiv;
};

var initTable = function(job) {
    var table = new Tabulator("#example-table", {
        columns:[
            {
                title:"Target",
                field:"target",
                editor:"input"
            },
            {
                title:"Labels",
                field:"labels",
                editor:"input"
            },
            {
                formatter:printIcon,
                headerSort:false,
                hozAlign:"center",
                /*cellClick:function(e, cell){
                    cell.getRow().delete()
                }*/
            }
        ]
    });

    table.on("tableBuilt", function(){
        table.setData("/read-targets/" + job);
    });

    table.on("dataChanged", function(data){
        document.getElementById('savechanges').style.display = 'inline-block';
    });

    document.getElementById('addtarget').addEventListener('click', function(e) {
        let newid = table.getDataCount() + 1;
        table.addData([{id:newid, target:"", labels:""}], true);
    });

    document.getElementById('savechanges').addEventListener('click', function(e) {
        let data = table.getData();
        console.log({targets: data});
        let jobselect = document.getElementById('jobs');

        fetch("/update-targets/" + jobselect.options[jobselect.selectedIndex].value, {
    
            // Adding method type
            method: "POST",
            
            // Adding body or contents to send
            body: JSON.stringify({targets: data}),
            
            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        
        // Converting to JSON
        .then(response => response.json())
        
        // Displaying results to console
        .then(json => console.log(json));
    });
}

var loadJobs = function() {
    fetch("/jobs", {
    
        // Adding method type
        method: "GET",
        
    })
    
    // Converting to JSON
    .then(response => response.json())
    
    // Displaying results to console
    .then(json => {
        console.log(json);
        let jobselect = document.getElementById('jobs');
        for(let i = 0; i < json.jobs.length; i++) {
            let option = document.createElement('option');
            option.innerText = json.jobs[i];
            option.value = json.jobs[i];
            jobselect.add(option);
        }

        jobselect.addEventListener('change', function(e) {
            alert('reload table');
        });

        initTable(jobselect.options[jobselect.selectedIndex].value);
    })
}

window.onload = function() {
    loadJobs();
}