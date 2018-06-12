const Tags = new Set("cuisine sport jeuVideo actualité people technologie".split(" "));
const Articles = "je tu il nous vous ils elle elles à une un qui leurs des en ces Depuis s'en les et de y a « » –".split(" ");
const Bruit = new Set([...Articles]);
const is = require('@sindresorhus/is');

const testFunction = function(data){
    if (is(data) === "string"){
        return "String"
    }else{
        return data;
    }
}

const testFucntion2 = function(data)
{
    return data;
}

module.exports = {
    Tags,
    Bruit,
    testFunction
}