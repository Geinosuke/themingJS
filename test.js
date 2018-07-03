import test from 'ava';
const { testFunction } = require('./Constant.js');
const { 
    getCommon,
    cleanData,
    getIndices,
    getGramm,
    getJaccard
} = require('./index');

// Test getCommon function 
test('GetCommon - Valid parameters two exact', t => {
    const first = {
        "param1": 3,
        "param2": 3,
        "param3": 3,
    };
    const second = {
        "param4": 3,
        "param2": 3,
        "param3": 3,
    };
    const resShouldBe = 2;
    t.is(getCommon(first, second), resShouldBe);
});

test('GetCommon - Valid parameters none exact', t => {
    const first = {
        "param1": 3,
        "param2": 3,
        "param3": 3,
    };
    const second = {
        "param4": 3,
        "param5": 3,
        "param6": 3,
    };
    const resShouldBe = 0;
    t.is(getCommon(first, second), resShouldBe);
});

test('GetCommon - Valid parameters all exact', t => {
    const first = {
        "param1": 3,
        "param2": 3,
        "param3": 3,
    };
    const second = {
        "param1": 3,
        "param2": 3,
        "param3": 3,
        "param5": "test"
    };
    const resShouldBe = 3;
    t.is(getCommon(first, second), resShouldBe);
});
