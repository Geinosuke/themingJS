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
  if (!is.string(gramm)) throw new Error('Parameter gramm should be a string');
  if (!is.array(grammList) || grammList.length === 0) throw new Error('Parameter grammList should be an array');
  let count = 0;
  grammList.forEach((element) => {
    if (element === gramm) count += 1;
  });
  return count / grammList.length;
}

function getIDF(gramm, corpus) {
  if (!is.string(gramm)) throw new Error('Parameter gramm should be a string');
  if (!is.array(corpus) || corpus.length === 0) throw new Error('Parameter corpus should be an array');
  let count = 0;
  corpus.forEach((document) => {
    if (document.some(token => token === gramm)) count += 1;
  });
  if (count) {
    return Math.log10(corpus.length / count);
  }
  return count;
}

function cleanNoise(input) {
  if (!is.array(input)) {
    throw new Error('input parameter should be a array');
  }
  Noise.add(' '); // refacto
  return input.map((word) => {
    if (!Noise.has(word)) {
      return word;
    }
  }).filter(word => word !== undefined);
}

function lemmatisate(input) {
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

function cleanData(input, isNoise) {
  if (!is.boolean(isNoise)) {
    throw new Error('\'isNoise\' parameter should be a boolean');
  }
  if (!is.array(input)) {
    throw new Error('\'Input\' parameter should be an array');
  }
  if (isNoise) {
    return lemmatisate(cleanNoise(input));
  }
  return lemmatisate(input);
}

function splitStringInput(input) {
  if (!is.string(input)) {
    throw new Error('Parameter input parameter should be a string');
  }
  return input.split(regex).filter(word => word !== '');
}

function getCommon(first, second) {
  if (!is.array(first) || !is.array(second)) {
    throw new Error('Parameter should be arrays');
  }
  let count = 0;
  first.forEach((keySecond) => {
    second.forEach((keyFirst) => {
      if (keySecond === keyFirst) {
        count += 1;
      }
    });
  });
  return count;
}

function getTFIDF(gramm, currentDocument, corpus) {
  return getTF(gramm, currentDocument) * getIDF(gramm, corpus);
}
function getUnion(first, second) {
  if (!is.array(first) || !is.array(second)) {
    throw new Error('Parameter should be arrays');
  }
  let count = first.length;
  second.forEach((keySecond) => {
    if (!first.some(keyFirst => keySecond === keyFirst)) {
      count += 1;
    }
  });
  return count;
}

function getJaccard(first, second) {
  if (!is.array(first) || !is.array(second)) {
    throw new Error('Parameter should be arrays');
  }
  return getCommon(first, second) / getUnion(first, second);
}

module.exports = {
  getCommon,
  cleanData,
  getGramm,
  getJaccard,
  getTF,
  getIDF,
  getTFIDF,
  splitStringInput,
  cleanNoise,
  lemmatisate,
  getUnion,
};
