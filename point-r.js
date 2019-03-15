const fs = require('fs');
const os = require('os');
const windows1252 = require('windows-1252');

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

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

for ( let sectionName in data.fr ) {
   generateRFile(sectionName);
}

function generateRFile(sectionName) {
   let moduleName = '';

   if (sectionName === 'yard')
      moduleName = 'dwv';
   else if (sectionName === 'global')
      moduleName = 'dw';
   else
      moduleName = 'dwc';

   const fileName = moduleName.toUpperCase() + sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

   let rFile = `resources ${moduleName}:${fileName}${os.EOL}`;
   rFile += '{' + os.EOL;
   rFile += 'att json' + os.EOL + os.EOL;
   rFile += generateStringRessources(sectionName);
   rFile += '}';

   fs.appendFileSync(`./rFiles/${fileName}.r`, windows1252.encode(rFile));
   console.log(`${fileName}.r saved.`);
}

function generateStringRessources(sectionName) {
   const sectionFr = data.fr[sectionName];
   const sectionEn = data.en[sectionName];

   let stringResources = '';

   for (txKey in sectionFr) {
      stringResources += generateSingleStringRes(txKey, sectionFr, sectionEn);
   }

   return stringResources;
}

function generateSingleStringRes(txKey, sectionFr, sectionEn) {
   let stringRes = 'string ' + txKey + os.EOL;
   stringRes += '   {' + os.EOL;
   stringRes += `   title "${sectionEn[txKey]}"${os.EOL}`;
   stringRes += `   titlef "${sectionFr[txKey]}"${os.EOL}`;
   stringRes += '   }' + os.EOL;
   return stringRes;
}
