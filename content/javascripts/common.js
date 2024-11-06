//alert('hello');

var printIcon = function(cell, formatterParams, onRendered){ //plain text value
    //return '<button type="button" class="md-button md-button--primary">Copy</button><button type="button" class="md-button">Delete</button>';
    //console.log(cell.getData());
    let buttondiv = document.createElement('div');

    let copybutton = document.createElement('button');
    copybutton.innerHTML = 'Copy';
    copybutton.className = 'md-button md-button--primary copy-button';
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

var loadTable = function(jobselect, configselect) {
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
        table.setData("/targets/" + jobselect.select2('data')[0].id + '/' + configselect.select2('data')[0].id);
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
        //console.log(jobselect.select2('data')[0].id);

        fetch("/targets/" + jobselect.select2('data')[0].id + '/' +configselect.select2('data')[0].id, {
    
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
        .then(json => {
            console.log(json)
            if(json.error == false) {
                document.getElementById('savechanges').style.display = 'none';
            } else {
                alert(json.error);
            }
        });
    });

    return table;
}

var loadConfigs = function(job, callback) {
    let configselect = $('.configselect').select2();

    configselect.empty();

    fetch("/configs/" + job, {
        method: "GET", 
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        for(let i = 0; i < json.configs.length; i++) {
            // let option = document.createElement('option');
            // option.innerText = json.jobs[i];
            // option.value = json.jobs[i];
            // jobselect.add(option);
            let newOption = new Option(json.configs[i], json.configs[i], false, false);
            configselect.append(newOption);
        }
        configselect.trigger('change');
        callback(false, configselect);
    });
}

var loadJobs = function(callback) {
    let jobselect = $('.jobselect').select2();

    fetch("/jobs", {
        method: "GET", 
    })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        for(let i = 0; i < json.jobs.length; i++) {
            // let option = document.createElement('option');
            // option.innerText = json.jobs[i];
            // option.value = json.jobs[i];
            // jobselect.add(option);
            let newOption = new Option(json.jobs[i], json.jobs[i], false, false);
            jobselect.append(newOption);
        }
        jobselect.trigger('change');
        callback(false, jobselect);

        // jobselect.addEventListener('change', function(e) {
        //     table.setData("/read-targets/" + jobselect.options[jobselect.selectedIndex].value);
        // });
    })
}

window.onload = function() {
    loadJobs(function(err, jobselect) {
        loadConfigs(jobselect.select2('data')[0].id, function(e, configselect) {
            let table = loadTable(jobselect, configselect);

            jobselect.on('change', function(e) {
                loadConfigs(jobselect.select2('data')[0].id, function(e, configselect) {
                    table.setData("/targets/" + jobselect.select2('data')[0].id + '/' + configselect.select2('data')[0].id);
                });
            });

            configselect.on('change', function(e) {
                table.setData("/targets/" + jobselect.select2('data')[0].id + '/' + configselect.select2('data')[0].id);
            });
        });
    });
}