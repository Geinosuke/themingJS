import test from 'ava';

// const files = require('./inputFiles.json');
// const fs = require('fs');
const {
  getCommon,
  getGramm,
  getTF,
  getIDF,
  splitStringInput,
  cleanNoise,
  lemmatisate,
} = require('../index');
/*
const getFile = async function (filepath, tags) {
  console.log(`Reading Files: ${filepath}`);
  return new Promise(((resolve, reject) => {
    fs.readFile(filepath, (err, input) => {
      // Cleaning input
      const histo = cleanData(input.toString(), true);

      // Get object with words in key and count in Luke
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
}; */

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

const text1 = 'Luke, je suis ton père'.split(' ');
const text2 = 'Un Lannister paie toujours ses dettes.'.split(' ');
const text3 = 'Mon père lui a fait une offre qu\'il ne pouvait pas refuser.'.split(' ');

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

test('getGramm - Should throw error if k parameter is not a number', (t) => {
  const error = t.throws(() => {
    getGramm('4', text1);
  }, Error);
  t.is(error.message, 'k should be an number');
});

test('getGramm - Should throw error if textArray parameter is not an array', (t) => {
  const error = t.throws(() => {
    getGramm(4, {});
  }, Error);
  t.is(error.message, 'textArray should be an array');
});

test('getGramm - Get 1-Gramms', (t) => {
  t.deepEqual(getGramm(1, text1), res1gramm);
});

test('getGramm - Get 2-Gramms', (t) => {
  t.deepEqual(getGramm(2, text1), res2gramm);
});

test('getGramm - Get 3-Gramms', (t) => {
  t.deepEqual(getGramm(3, text1), res3gramm);
});

test('getGramm - Get 4-Gramms', (t) => {
  t.deepEqual(getGramm(4, text1), res4gramm);
});

/*
** Test getTF function
*/

const Luke = 'Luke,';
const LukeJe = 'Luke,je';
const Lucy = 'Lucy';

test('getTF - Should throw error if gramm parameter is not a string', (t) => {
  const error = t.throws(() => {
    getTF(42, res1gramm);
  }, Error);
  t.is(error.message, 'Parameter gramm should be a string');
});

test('getTF - Should throw error if grammList parameter is not an array', (t) => {
  const error = t.throws(() => {
    getTF(Luke, {});
  }, Error);
  t.is(error.message, 'Parameter grammList should be an array');
});

test('getTF - 1 gramm when 1', (t) => {
  t.is(getTF(Luke, res1gramm), 1 / 5);
});

test('getTF - 1 gramm when 0', (t) => {
  t.is(getTF(Lucy, res1gramm), 0);
});

test('getTF - 2 gramm when 1', (t) => {
  t.is(getTF(LukeJe, res2gramm), 1 / 4);
});

test('getTF - 2 gramm when 0', (t) => {
  t.is(getTF(Lucy, res2gramm), 0);
});

/*
** Test getIDF function
*/

test('getIDF - Should throw error if gramm parameter is not a string', (t) => {
  const error = t.throws(() => {
    getIDF(42, [text1, text2, text3]);
  }, Error);
  t.is(error.message, 'Parameter gramm should be a string');
});

test('getIDF - Should throw error if corpus parameter is not an array', (t) => {
  const error = t.throws(() => {
    getIDF(Luke, {});
  }, Error);
  t.is(error.message, 'Parameter corpus should be an array');
});

test('getIDF - 1 gramm when 2 occured', (t) => {
  t.is(getIDF('père', [text1, text2, text3]), Math.log10(3 / 2));
});

test('getIDF - 1 gramm when 1 occured first word', (t) => {
  t.is(getIDF(Luke, [text1, text2, text3]), Math.log10(3));
});

test('getIDF - 1 gramm when 1 occured last word', (t) => {
  t.is(getIDF('dettes.', [text1, text2, text3]), Math.log10(3));
});

test('getIDF - 1 gramm when 0 occured', (t) => {
  t.is(getIDF('WTF', [text1, text2, text3]), Math.log10(3 / 0));
});

/*
** Test splitStringInput function
*/
const textStr1 = 'Luke, je suis ton père';
const textStr2 = 'Je veux qu\'il vienne';
const textSplitted1 = [
  'Luke',
  'je',
  'suis',
  'ton',
  'père',
];

const textSplitted2 = [
  'Je',
  'veux',
  'qu',
  'il',
  'vienne',
];

const textWithoutNoise1 = [
  'Luke',
  'suis',
  'père',
];

test('splitStringInput - Should throw error if input parameter is not a string', (t) => {
  const error = t.throws(() => {
    splitStringInput(42);
  }, Error);
  t.is(error.message, 'Parameter input parameter should be a string');
});

test('splitStringInput - handle comma', (t) => {
  t.deepEqual(splitStringInput(textStr1), textSplitted1);
});

test('splitStringInput - handle apostrophe', (t) => {
  t.deepEqual(splitStringInput(textStr2), textSplitted2);
});

/*
** Test cleanNoise function
*/

test('cleanNoise - Should throw error if input parameter is not an array', (t) => {
  const error = t.throws(() => {
    cleanNoise(42);
  }, Error);
  t.is(error.message, 'input parameter should be a array');
});

test('cleanNoise - Should throw error if input parameter is not an array', (t) => {
  const error = t.throws(() => {
    cleanNoise('Hello World!');
  }, Error);
  t.is(error.message, 'input parameter should be a array');
});

test('cleanNoise - handle apostrophe', (t) => {
  t.deepEqual(cleanNoise(textSplitted1), textWithoutNoise1);
});
