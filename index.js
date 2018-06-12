// Node depedencies
const fs = require('fs');
const path = require('path');

// Npm depedencies
const is = require('@sindresorhus/is');
const _ = require('lodash');

// Internal depedencies
const {Tags, Bruit} = require('./Constant');
const {HistogramHandler} = require('./HistogramHandler');
const files = require('./inputFiles.json');

// constant
const regex = /[.,\s’()']/;
let HH = new HistogramHandler();
const histoArray = [];
let cpt = 0;

const getFile = async function(filepath, tags){
    console.log(`Reading Files: ${filepath}`);
    return new Promise(function(resolve, reject){
        fs.readFile(filepath, function(err, data){
            // Cleaning Data
            const histo = cleanData(data.toString(), true)
            
            // Get object with words in key and count in value
            const grammsObject = _.countBy(getGramm(2, [...histo.keys()]));

            // Transform count into indice
            const dataWithIndices = getIndices(grammsObject);

            if (cpt < 2){
                histoArray.push(dataWithIndices);
                cpt++;
            }
            
            //console.log(dataWithIndices);
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
    const data = HH.tagCounter;
    fs.writeFile('configData.json', JSON.stringify(data.entries()), (err) => {
        console.log('Data saved !');
    });
}

const run = async function() {
    let promises = [];
    for (let file of files.files){
        promises.push(getFile('./data/' + file.name, file.tags));
    }
    await Promise.all(promises);
    //HH.displayTag();
    getJaccard(...histoArray);
    saveData();
}

function getGramm(k, arr){
    if (!is.number(k))
        throw new Error("k should be an number");
    if (!is.array(arr))
        throw new Error("arr should be an array");
    let res = [];
    for (let i = 0; i < arr.length - k + 1; i++){
        let tmp = [];
        for (let j = 0; j < k; j++){
            tmp.push(arr[i + j]);
        }
        res.push(tmp);
    }
    return res.map(tab => {
        return tab.join("");
    });
}

function getJaccard(first, second){
    const total = Object.entries(first).length + Object.entries(second).length;
    let common = getCommon(first, second);
    console.log(`This is Jaccard index: ${common/total}`);
    return
}

function getIndices(mapEntry){
    if (!is.object(mapEntry))
        throw new Error("mapEntry should be an object");
    const length = Object.entries(mapEntry).length;
    for (let key in mapEntry){
        mapEntry[key] /= length;
    }
    return mapEntry;
}

function cleanData(data, isNoise){
    if (!is.boolean(isNoise)){
        throw new Error("Variable isNoise should be a boolean");
    }
    if (!is.string(data)){
        throw new Error("Variable data should be a string");
    }
    const words = data.split(regex);
    const wordsArray = _.countBy(words);
    const histo = new Map(Object.entries(wordsArray));

    if (isNoise){
        for (let [k, v] of histo.entries()){
            if (Bruit.has(k)){
                histo.delete(k);
            }
        }
    }
    return histo;
}

function getCommon(first, second){
    if (!is.object(first) || !is.object(second))
        throw new Error("GetCommon parameter should be object");
    let count = 0;
    for (let key1 in first){
        for (let key2 in second){
            if (key1 === key2){
                count++;
                console.log("here");
            }
        }
    }
    return count;
}
run();

module.exports = {
    getCommon,
    cleanData,
    getIndices,
    getGramm,
    getJaccard
}
