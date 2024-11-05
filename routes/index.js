var router = require('express').Router();
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

let parseTargets = function(yt) {
    let data = [];
    let id = 1;
    for(let i = 0; i < yt.length; i++) {
        for(let j = 0; j < yt[i].targets.length; j++) {
            let labels = JSON.stringify(yt[i].labels).split("\"").join("");
            let target = {id: id, target: yt[i].targets[j], labels: labels.substring(1, labels.length - 1)};
            data.push(target);
            id++;
        }
    }
    return data;
}

router.get('/read-targets/:job', function(req, res, next) {
    console.log(req.params.job);
    fs.readFile(path.join(__dirname, '../target_dirs/' + req.params.job + '/targets.yml'), function(e, yml) {
        let yt = yaml.load(yml);
	    res.json(parseTargets(yt));
    });
});

router.get('/jobs', function(req, res, next) {
	fs.readdir(path.join(__dirname, '../target_dirs'), function(e, dirs) {
        //console.log(dirs);
        res.json({jobs: dirs});
    });
});

router.post('/update-targets/:job', function(req, res, next) {
    let targetht = {};
    let targets = req.body.targets;
    for(let i = 0; i < targets.length; i++) {
        console.log(targets[i].target);
        let labels = targets[i].labels.split(',');
        let key = JSON.stringify(labels.sort()).toUpperCase();
        if(targetht.hasOwnProperty(key)) {
            if(targetht[key].targets.indexOf(targets[i].target) < 0) {
                targetht[key].targets.push(targets[i].target);
            }
        } else {
            targetht[key] = {};
            targetht[key].targets = [targets[i].target];
            targetht[key].labels = {};
            for(let j = 0; j < labels.length; j++) {
                let parselabel = labels[j].split(':');
                targetht[key].labels[parselabel[0]] = parselabel[1];
                //console.log(label);
            }
        }
    }
    let dedupedtargets = [];
    let keys = Object.keys(targetht);
    for(let i = 0; i < keys.length; i++) {
        let target = {
            targets: targetht[keys[i]].targets,
            labels: targetht[keys[i]].labels
        }
        dedupedtargets.push(target);
    }
    console.log(dedupedtargets);
    let yt = yaml.dump(dedupedtargets);
    fs.writeFile(path.join(__dirname, '../target_dirs/' + req.params.job + '/targets.yml'), yt, function(e) {
	    res.json(dedupedtargets);
    });
});

module.exports = router;