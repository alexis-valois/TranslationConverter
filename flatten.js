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

outputData.fr = flattenData(data.fr);
//outputData.en = flattenData(data.en);

fs.writeFileSync("./out.json", JSON.stringify(outputData), 'utf8');
console.log('file out.json saved.');

function flattenData(data) {
   var result = {};
   function recurse (cur, prop) {
     if (Object(cur) !== cur) {
       result[prop] = cur;
     } else if (Array.isArray(cur)) {
       for(var i=0, l=cur.length; i<l; i++)
         recurse(cur[i], prop + "[" + i + "]");
       if (l == 0)
         result[prop] = [];
       } else {
         var isEmpty = true;
           for (var p in cur) {
             isEmpty = false;
             recurse(cur[p], prop ? prop + "." + p : p);
           }
           if (isEmpty && prop)
             result[prop] = {};
       }
    }
    recurse(data, "");
    return result;
}
