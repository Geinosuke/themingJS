// Npm depedencies
const is = require('@sindresorhus/is');
const _ = require('lodash');

// Internal depedencies
const { Noise } = require('./constant');
const dico = require('./dico.json');

// Constant
const regex = /[.,\s’()'"]/;
const dicoMap = new Map([...Object.entries(dico)]);

function getGramm(k, textArray) {
  if (!is.number(k)) throw new Error('k should be an number');
  if (!is.array(textArray)) throw new Error('textArray should be an array');
  const grammList = [];
  for (let i = 0; i < textArray.length - k + 1; i += 1) {
    const tokens = [];
    for (let j = 0; j < k; j += 1) {
      tokens.push(textArray[i + j]);
    }
    grammList.push(tokens);
  }
  return grammList.map(tab => tab.join(''));
}

function getTF(gramm, grammList) {
  if (!is.number(gramm)) throw new Error('Parameter gramm should be a string');
  if (!is.array(grammList) || grammList.length === 0) throw new Error('Parameter grammList should be an array');
  let count = 0;
  grammList.forEach((element) => {
    if (element === gramm) count += 1;
  });
  return count / grammList.length;
}

function getIDF(gramm, corpus) {
  if (!is.number(gramm)) throw new Error('Parameter gramm should be a string');
  if (!is.array(corpus) || corpus.length === 0) throw new Error('Parameter corpus should be an array');
  let count = 0;
  corpus.forEach((document) => {
    if (document.some(token => token === gramm)) count += 1;
  });
  return Math.log10(corpus.length / count);
}

function cleanData(input, isNoise) {
  if (!is.boolean(isNoise)) {
    throw new Error('isNoise parameter should be a boolean');
  }
  if (!is.string(input)) {
    throw new Error('input parameter should be a string');
  }
  const words = input.split(regex);
  const wordsArray = _.countBy(words);
  const histo = new Map(Object.entries(wordsArray));
  const modifs = [];
  if (isNoise) {
    histo.entries().forEach((item) => {
      if (Noise.has(item[0].toLowerCase())) {
        histo.delete(item[0]);
      } else if (dicoMap.has(item[0].toLowerCase())) {
        histo.delete(item[0]);
        modifs.push([dicoMap.get(item[0].toLowerCase()), item[1]]);
      }
    });
  }
  modifs.forEach((item) => {
    histo.set(item[0], item[1]);
  });
  return histo;
}

function splitStringInput(input) {
  if (!is.string(input)) {
    throw new Error('Parameter input parameter should be a string');
  }
  return input.split(regex);
}

function cleanNoise(input) {
  if (!is.array(input)) {
    throw new Error('input parameter should be a array');
  }
  Noise.add(' '); // refacto
  input.map((word) => {
    if (!Noise.has(word)) {
      return word;
    }
  }).filter(word => word !== undefined);
}

function lemmatisation(input) {
  if (!is.array(input)) {
    throw new Error('input parameter should be a array');
  }
  return input.map((word) => {
    if (dicoMap.has(word)) {
      return dicoMap.get(word);
    }
    return word;
  });
}

function getCommon(first, second) {
  let count = 0;
  Object.keys(first).forEach((key1) => {
    Object.keys(second).forEach((key2) => {
      if (key1 === key2) {
        count += 1;
      }
    });
  });
  return count;
}

function getTFIDF(gramm, currentDocument, corpus) {
  return getTF(gramm, currentDocument) * getIDF(gramm, corpus);
}

function getJaccard(first, second) {
  const total = Object.entries(first).length + Object.entries(second).length;
  const common = getCommon(first, second);
  return common / total;
}

module.exports = {
  getCommon,
  cleanData,
  getGramm,
  getJaccard,
};
