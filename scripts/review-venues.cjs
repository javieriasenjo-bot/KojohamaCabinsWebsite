// A review queue, not an automatic verification of opening hours.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const records=JSON.parse(fs.readFileSync(path.join(root,'data/venues.json'),'utf8')).venues;
const asOf=process.argv.find(value=>value.startsWith('--as-of='))?.slice(8) || new Date(Date.now()+9*3600000).toISOString().slice(0,10);
const everyDays=90;
const today=Date.parse(asOf+'T00:00:00Z');
if(!Number.isFinite(today))throw new Error('Use --as-of=YYYY-MM-DD');
const rows=records.map(venue=>{
 const checked=venue.hoursCheckedOn ? Date.parse(venue.hoursCheckedOn+'T00:00:00Z') : NaN;
 const next=Number.isFinite(checked) ? new Date(checked+everyDays*86400000).toISOString().slice(0,10) : '';
 return {id:venue.id,name:venue.translations.en.name,lastChecked:venue.hoursCheckedOn||'',nextReview:next,
  status:!Number.isFinite(checked)?'Baseline check needed':checked>today?'Check date is in the future':today>=checked+everyDays*86400000?'Review overdue':'Within review interval',
  source:venue.hoursSource || venue.translations.en.links.find(link=>link.kind==='map')?.href || venue.translations.en.links[0]?.href || ''};
});
const csv=values=>values.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',');
const report=[csv(['ID','Place','Hours last checked','Next review','Status','Review source']),...rows.map(row=>csv(Object.values(row)))].join('\n')+'\n';
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/VENUE-REVIEW.csv'),report);
const due=rows.filter(row=>row.status!=='Within review interval');
const summary=`Venue hours review: ${due.length} of ${rows.length} need a check as of ${asOf}. Review interval: ${everyDays} days. A photo review does not verify opening hours.\n`;
console.log(summary.trim());
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Venue review queue\n\n'+summary+'\n'+due.map(row=>`- ${row.name}: ${row.status}`).join('\n')+'\n');
