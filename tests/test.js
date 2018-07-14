import test from 'ava';

// const files = require('./inputFiles.json');
// const fs = require('fs');
const {
  getCommon,
  cleanData,
  getGramm,
  getJaccard,
} = require('../index');

const getFile = async function (filepath, tags) {
  console.log(`Reading Files: ${filepath}`);
  return new Promise(((resolve, reject) => {
    fs.readFile(filepath, (err, input) => {
      // Cleaning input
      const histo = cleanData(input.toString(), true);

      // Get object with words in key and count in value
      const grammsObject = _.countBy(getGramm(2, [...histo.keys()]));

      // Transform count into indice
      const inputWithIndices = getIndices(grammsObject);

      if (cpt < 2) {
        histoArray.push(inputWithIndices);
        cpt++;
      }

      // console.log(inputWithIndices);
      HH.add([...histo.entries()], tags);
      resolve();
    });
  }));
};

/*
** Test getCommon function
*/
test('GetCommon - Valid parameters two exact', (t) => {
  const first = {
    param1: 3,
    param2: 3,
    param3: 3,
  };
  const second = {
    param4: 3,
    param2: 3,
    param3: 3,
  };
  const resShouldBe = 2;
  t.is(getCommon(first, second), resShouldBe);
});

test('GetCommon - Valid parameters none exact', (t) => {
  const first = {
    param1: 3,
    param2: 3,
    param3: 3,
  };
  const second = {
    param4: 3,
    param5: 3,
    param6: 3,
  };
  const resShouldBe = 0;
  t.is(getCommon(first, second), resShouldBe);
});

test('GetCommon - Valid parameters all exact', (t) => {
  const first = {
    param1: 3,
    param2: 3,
    param3: 3,
  };
  const second = {
    param1: 3,
    param2: 3,
    param3: 3,
    param5: 'test',
  };
  const resShouldBe = 3;
  t.is(getCommon(first, second), resShouldBe);
});

/*
** Test getGramm function
*/

const text = 'Luke, je suis ton père'.split(' ');

const res1gramm = [
  'Luke,',
  'je',
  'suis',
  'ton',
  'père',
];
const res2gramm = [
  'Luke,je',
  'jesuis',
  'suiston',
  'tonpère',
];
const res3gramm = [
  'Luke,jesuis',
  'jesuiston',
  'suistonpère',
];
const res4gramm = [
  'Luke,jesuiston',
  'jesuistonpère',
];

test('getGramm - Get 1-Gramms', (t) => {
  t.deepEqual(getGramm(1, text), res1gramm);
});

test('getGramm - Get 2-Gramms', (t) => {
  t.deepEqual(getGramm(2, text), res2gramm);
});

test('getGramm - Get 3-Gramms', (t) => {
  t.deepEqual(getGramm(3, text), res3gramm);
});

test('getGramm - Get 4-Gramms', (t) => {
  t.deepEqual(getGramm(4, text), res4gramm);
});

test('getGramm - Should throw error if k parameter is not a number', (t) => {
  const error = t.throws(() => {
    getGramm('4', text);
  }, Error);
  t.is(error.message, 'k should be an number');
});

test('getGramm - Should throw error if textArray parameter is not an array', (t) => {
  const error = t.throws(() => {
    getGramm(4, {});
  }, Error);
  t.is(error.message, 'textArray should be an array');
});
