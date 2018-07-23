import test from 'ava';

const {
  getCommon,
  getGramm,
  getTF,
  getIDF,
  getTFIDF,
  splitStringInput,
  cleanNoise,
  lemmatisate,
  getJaccard,
  getUnion,
  cleanData,
} = require('../index');

/*
** Test getCommon function
*/

test('GetCommon - Should throw error if parameters are not arrays', (t) => {
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
  const error = t.throws(() => {
    getCommon(first, second);
  }, Error);
  t.is(error.message, 'Parameter should be arrays');
});

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
  t.is(getCommon(Object.keys(first), Object.keys(second)), resShouldBe);
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
  t.is(getCommon(Object.keys(first), Object.keys(second)), resShouldBe);
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
  t.is(getCommon(Object.keys(first), Object.keys(second)), resShouldBe);
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
  t.is(getIDF('WTF', [text1, text2, text3]), 0);
});

/*
** Test getTFIDF function
*/

test('getTFIDF', (t) => {
  t.is(getTFIDF('Luke,', res1gramm, [text1, text2, text3]), 0.09542425094393249);
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

/*
** Test lemmatisate function
*/

test('lemmatisate - Should throw error if input parameter is not an array', (t) => {
  const error = t.throws(() => {
    lemmatisate(42);
  }, Error);
  t.is(error.message, 'input parameter should be a array');
});

test('lemmatisate - ', (t) => {
  t.deepEqual(lemmatisate(textWithoutNoise1), ['Luke', 'jtre', 'père']); // check value of lemme "suis"
});

/*
** Test getJaccard function
*/

test('GetJaccard - Should throw error if parameters are not arrays', (t) => {
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
  const error = t.throws(() => {
    getJaccard(first, Object.keys(second));
  }, Error);
  t.is(error.message, 'Parameter should be arrays');
});

test('GetJaccard - ', (t) => {
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
  t.is(getJaccard(Object.keys(first), Object.keys(second)), 2 / 4);
});

/*
** Test GetUnion function
*/

test('GetUnion - Should throw error if parameters are not arrays', (t) => {
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
  const error = t.throws(() => {
    getUnion(first, Object.keys(second));
  }, Error);
  t.is(error.message, 'Parameter should be arrays');
});

test('GetUnion - ', (t) => {
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
  t.is(getUnion(Object.keys(first), Object.keys(second)), 4);
});

/*
** Test CleanData function
*/

test('CleanData - Should throw error if input parameter is not an array', (t) => {
  const error = t.throws(() => {
    cleanData('input', true);
  }, Error);
  t.is(error.message, '\'Input\' parameter should be an array');
});

test('CleanData - Should throw error if isNoise parameter is not boolean', (t) => {
  const error = t.throws(() => {
    cleanData([], 'true');
  }, Error);
  t.is(error.message, '\'isNoise\' parameter should be a boolean');
});

test('CleanData - When input is empty and isNoise true', (t) => {
  t.deepEqual(cleanData([], true), []);
});

test('CleanData - When input is empty and isNoise false', (t) => {
  t.deepEqual(cleanData([], false), []);
});

test('CleanData - when isNoise = false', (t) => {
  t.deepEqual(cleanData(textSplitted1, false), [
    'Luke',
    'je',
    'jtre',
    'ton',
    'père',
  ]);
});

test('CleanData - when isNoise = true', (t) => {
  t.deepEqual(cleanData(textSplitted1, true), [
    'Luke',
    'jtre',
    'père',
  ]);
});
