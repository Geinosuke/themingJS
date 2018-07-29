// Npm depedencies
const is = require('@sindresorhus/is');

// Internal depedencies
const { Noise } = require('./constant');
const dico = require('./dico.json');

// Constant
const regex = /[.,\s’()'"]/;
const dicoMap = new Map([...Object.entries(dico)]);

/**
 * Transform an array of words into an array of k-gramms.
 * @function
 * @param {number} k - Size of the gramms wanted.
 * @param {array} textArray - Array of words.
 * @returns {array}
 */

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

/**
 * Return gramm's TF value for the list of gramm 'grammList'.
 * @function
 * @param {string} gramm - Input gramms.
 * @param {array} grammList - Array of gramms.
 * @returns {number}
 */
function getTF(gramm, grammList) {
  if (!is.string(gramm)) throw new Error('Parameter gramm should be a string');
  if (!is.array(grammList) || grammList.length === 0) throw new Error('Parameter grammList should be an array');
  let count = 0;
  grammList.forEach((element) => {
    if (element === gramm) count += 1;
  });
  return count / grammList.length;
}

/**
 * Return gramm's IDF value for the corpus of text 'corpus'.
 * @function
 * @param {string} gramm - Input gramms.
 * @param {array} corpus - Array of text.
 * @returns {number}
 */

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

/**
 * Remove all words from the 'input' array that are considered noise.
 * @function
 * @param {array} input - Array of words.
 * @returns {array}
 */

function cleanNoise(input) {
  if (!is.array(input)) {
    throw new Error('input parameter should be a array');
  }
  Noise.add(' ');
  return input.filter(word => !Noise.has(word));
}

/**
 * Replace words by their lemme.
 * @function
 * @param {array} input - Array of words.
 * @returns {array}
 */

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

/**
 * Remove noide words from the array and replace remaining words by their lemme.
 * @function
 * @param {array} input - Array of words.
 * @param {boolean} isNoise - Boolean that weather or not remove noise.
 * @returns {array}
 */

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

/**
 * Split a string into a array of words.
 * @function
 * @param {string} input - Input string.
 * @returns {array}
 */

function splitStringInput(input) {
  if (!is.string(input)) {
    throw new Error('Parameter input parameter should be a string');
  }
  return input.split(regex).filter(word => word !== '');
}

/**
 * Count the number of same words in the two arrays.
 * @function
 * @param {array} first - first array of words.
 * @param {array} second - second array of words.
 * @returns {number}
 */

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

/**
 * Return TFIDF value for the gramm 'gramm'.
 * @function
 * @param {string} gramm - word.
 * @param {array} currentDocument - Input text.
 * @param {array} corpus - Array of text.
 * @returns {number}
 */
function getTFIDF(gramm, currentDocument, corpus) {
  return getTF(gramm, currentDocument) * getIDF(gramm, corpus);
}

/**
 * Return the number of common words between 'first' and 'second' arrays.
 * @function
 * @param {array} first - first array of words.
 * @param {array} second - second array of words.
 * @returns {number}
 */
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

/**
 * Return the Jaccard indice bewteen 'first' and 'second' arrays.
 * @function
 * @param {array} first - first array of words.
 * @param {array} second - second array of words.
 * @returns {number}
 */
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
