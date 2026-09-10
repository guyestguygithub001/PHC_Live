const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/HP/.gemini/antigravity/scratch/PHC_Live/clinic-app/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    // regex to replace fetch('url') with fetch('url', { cache: 'no-store' })
    const regex = /fetch\((['"`][^,\n]+['"`])\)/g;
    content = content.replace(regex, "fetch($1, { cache: 'no-store' })");
    fs.writeFileSync(file, content);
});
console.log("Replaced!");
