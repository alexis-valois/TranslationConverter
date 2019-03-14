const fs = require('fs');

if (!process.argv[2]) {
   console.error('Must specify an input file');
   process.exit(1);
} else {
   if (!process.argv[2].includes(".json")){
      console.error('Input file must have .json extension');
      process.exit(1);
   }
}

const inputFile = process.argv[2];
let outputData = {};
const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

let dataFr = {};
let dataEn = {};

for (let section in data.fr) {
   dataFr[section] = flattenData(data.fr[section]);
}

for (let section in data.en) {
   dataEn[section] = flattenData(data.en[section]);
}

outputData.fr = dataFr;
outputData.en = dataEn;

fs.writeFileSync("./out.json", JSON.stringify(outputData), 'utf8');
console.log('file out.json saved.');

function flattenData(data) {
   let result = {};

   const recurse = (cur, prop) => {
     if (Object(cur) !== cur)
       result[prop] = cur;
     else
       for (var p in cur)
         recurse(cur[p], prop ? prop + "." + p : p);
    }

    recurse(data, "");
    return result;
}
