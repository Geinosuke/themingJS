class HistogramHandler {
    constructor(){
        //map Should be private
        this.map = new Map();
        this.histoWithTags = new Map();
        this.tagCounter = new Map();
    }

    //tag should be an array
    add(histoTmp, tags){
        let inputData = new Map(histoTmp);
        for (let tag of tags){
            if (!this.histoWithTags.has(tag)){
                this.histoWithTags.set(tag, inputData);
                this.tagCounter.set(tag, 1);
            } else {
                let tmp = this.histoWithTags.get(tag);
                this.merge(tmp, inputData, tag);
                this.histoWithTags.set(tag, tmp);
                this.tagCounter.set(tag, this.tagCounter.get(tag) + 1);
            }
        }
    }

    merge(ReferencedMap, newMap, tag){
        for (let [word, value] of newMap.entries()){
            if (!ReferencedMap.has(word)){
                ReferencedMap.set(word, value);
            } else {
                let currentValue = ReferencedMap.get(word);
                let count = this.tagCounter.get(tag);
                let newValue = (count * currentValue + value) / (count + 1);
            }
        }
    }

    displayTag(){
        console.log(this.tagCounter);
    }
}

module.exports = {
    HistogramHandler
}