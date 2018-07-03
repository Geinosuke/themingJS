const Tags = new Set("cuisine sport jeuVideo actualité people technologie".split(" "));
const Articles = "je tu il nous vous ils elle elles à une un qui leur leurs des en ces Depuis s'en les et de y a « » –".split(" ");
const Autres = "ça le la son se ses sa que ne par qu ce ces c' dont du au aux - lui".split(" ");
const Alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
const Mais = 'mais ou est donc or ni car'.split(' ');
const Bruit = new Set([...Articles, ...Autres, ...Alpha, ...Mais]);
const is = require('@sindresorhus/is');

module.exports = {
    Tags,
    Bruit
}