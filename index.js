// Node depedencies
const fs = require('fs');
const path = require('path');

// Npm depedencies
const _ = require('lodash');

// Internal depedencies
const {Tags, Bruit} = require('./Constant');
const {HistogramHandler} = require('./HistogramHandler');
const files = require('./inputFiles.json');

let HH = new HistogramHandler();

const getFile = async function(filepath, tags){
    return new Promise(function(resolve, reject){
        fs.readFile(filepath, function(err, data){
            words = data.toString().split(/[.,\s’()']/);
            const wordsArray = _.countBy(words);
            const histo = new Map(Object.entries(wordsArray));
            console.log(histo);
            for (let [k, v] of histo.entries()){
                if (Bruit.has(k)){
                    histo.delete(k);
                }
            }
            HH.add([...histo.entries()], tags);
            resolve();
        });
    });
}

const countWords = function(){
}

const clearHistogram = function (){
}

const saveData = function (){
    console.log(HH.tagCounter);
    let data =  HH.tagCounter
    console.log(data);
    fs.writeFile('configData.json', JSON.stringify(data.entries()), (err) => {
        console.log('Done')
    });
}

const run = async function() {
    let promises = [];
    for (let file of files.files){
        promises.push(getFile('./data/' + file.name, file.tags));
    }
    await Promise.all(promises);
    //HH.displayTag();
    saveData();
}
run();
