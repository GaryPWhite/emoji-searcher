require('es6-promise').polyfill();
const fetch = require('isomorphic-fetch');
const process = require('process');
const fs = require('fs');

const transformBodytoJSON = (body) => {
  return JSON.stringify(
    body.split("\n")
      .filter(line => /<img.*$/g.test(line)) // only lines with tags
      .map(line => {
        let [imgTagRaw, emojiNameRaw] = line.split('|') // split on markdown table syntax
        const imgTag = imgTagRaw.replace("src=\"", "src=\"https://raw.githubusercontent.com/buildkite/emojis/master/").trim();
        const emojiName = emojiNameRaw.replace(/\`/g, "").trim();
        return { imgTag, emojiName };
      }));
}

fetch('https://raw.githubusercontent.com/buildkite/emojis/master/README.md')
  .then((res) => {
    if (!res.ok) {
      throw Error("something's wrong with the emojis and it's time to panic");
    }
    return res.text();
  })
  .then((resdoc) => transformBodytoJSON(resdoc))
  .then(json => {
    fs.writeFileSync('src/buildkitemoji.json', json, {encoding:'utf8'}) // intentionally left blank to clear file
  })
  .catch((error) => {
    process.exitCode = 420;
    console.error(error);
  });