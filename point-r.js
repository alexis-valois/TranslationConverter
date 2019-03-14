const fs = require('fs');
const os = require('os');

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
      moduleName = 'dw_v';
   else if (sectionName === 'global')
      moduleName = 'dw';
   else
      moduleName = 'dw_c';

   let rFile = `resources giro.${moduleName}:${sectionName}${os.EOL}`;
   rFile += '{' + os.EOL;
   rFile += 'att json' + os.EOL + os.EOL;
   rFile += generateStringRessources(sectionName);
   rFile += '}';

   fs.appendFileSync(`./rFiles/${sectionName}.r`, rFile);
   console.log(`${sectionName}.r saved.`);
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
