// Image filenames are derived from their contents, so replacement photos refresh.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const manifestFile = path.join(root,'data/asset-manifest.json');
const readManifest = () => fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile,'utf8')) : {images:[]};
const walk = directory => fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry => {
  if (['.git','.wrangler','node_modules','data','scripts','docs','media'].includes(entry.name)) return [];
  const file=path.join(directory,entry.name);
  return entry.isDirectory() ? walk(file) : /\.(html|css)$/.test(entry.name) ? [file] : [];
});
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
function restore() {
  const entries=readManifest().images;
  for (const file of walk(root)) {
    if (path.basename(file)==='googlefa3fab5b6b918158.html') continue;
    let source=fs.readFileSync(file,'utf8'),before=source;
    entries.forEach(image => { source=source.replaceAll(image.url,image.source); });
    if (source!==before) fs.writeFileSync(file,source);
  }
}
function build() {
  const files=new Map(walk(root).filter(file=>path.basename(file)!=='googlefa3fab5b6b918158.html').map(file=>[file,fs.readFileSync(file,'utf8')]));
  const originals=[];
  const scan=dir=>fs.readdirSync(dir,{withFileTypes:true}).forEach(entry=>{
    const file=path.join(dir,entry.name);
    if(entry.isDirectory()) scan(file); else originals.push(file);
  });scan(path.join(root,'images'));
  const images=[];fs.mkdirSync(path.join(root,'media'),{recursive:true});
  for (const file of originals) {
    const source='/'+path.relative(root,file).split(path.sep).join('/');
    if(![...files.values()].some(text=>text.includes(source))) continue;
    const buffer=fs.readFileSync(file),hash=sha(buffer),parsed=path.parse(file);
    const url=`/media/${parsed.name}.${hash.slice(0,12)}${parsed.ext}`;
    const target=path.join(root,url.slice(1));
    if(!fs.existsSync(target) || sha(fs.readFileSync(target))!==hash) fs.writeFileSync(target,buffer);
    images.push({source,url,sha256:hash,bytes:buffer.length});
    for(const [html,text]of files)files.set(html,text.replaceAll(source,url));
  }
  // Delete only old generated files whose name, location and contents match our manifest.
  const current=new Set(images.map(image=>image.url));
  for(const old of readManifest().images){
    if(current.has(old.url) || !/^\/media\/[^/]+\.[a-f0-9]{12}\.[a-z0-9]+$/.test(old.url)) continue;
    const target=path.resolve(root,'.'+old.url);
    if(target.startsWith(path.join(root,'media')+path.sep) && fs.existsSync(target) && sha(fs.readFileSync(target))===old.sha256) fs.unlinkSync(target);
  }
  for(const [file,source]of files)fs.writeFileSync(file,source);
  fs.writeFileSync(manifestFile,JSON.stringify({images},null,2)+'\n');
  console.log(`Prepared ${images.length} image URLs with content hashes.`);
}
module.exports={restore,build};
