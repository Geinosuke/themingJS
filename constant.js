const Tags = new Set('cuisine sport jeuVideo actualité people technologie'.split(' '));
const Articles = "ton ta tes je tu il nous vous ils elle elles à une un qui leur leurs des en ces Depuis s'en les et de y a « » –".split(' ');
const Autres = "ni sans ça le la son se ses sa que ne par pas qu ce ces c' dont du au aux - lui".split(' ');
const Alpha = 'abcdefghijklmnopqrstuvwxyz'.split('');
const Mais = 'si ainsi lors pour ou mais ou est donc or ni car'.split(' ');
const Noise = new Set([...Articles, ...Autres, ...Alpha, ...Mais]);

Noise.add(' ');

module.exports = {
  Tags,
  Noise,
};
