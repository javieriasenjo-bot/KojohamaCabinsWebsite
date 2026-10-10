// A review queue, not an automatic verification of opening hours.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const records=JSON.parse(fs.readFileSync(path.join(root,'data/venues.json'),'utf8')).venues;
const asOf=process.argv.find(value=>value.startsWith('--as-of='))?.slice(8) || new Date(Date.now()+9*3600000).toISOString().slice(0,10);
const everyDays=90;
const today=Date.parse(asOf+'T00:00:00Z');
if(!Number.isFinite(today))throw new Error('Use --as-of=YYYY-MM-DD');
const rows=records.map(venue=>{
 const reviewedOn=venue.hoursCheckedOn || venue.accessCheckedOn;
 const checked=reviewedOn ? Date.parse(reviewedOn+'T00:00:00Z') : NaN;
 const next=Number.isFinite(checked) ? new Date(checked+everyDays*86400000).toISOString().slice(0,10) : '';
 return {id:venue.id,name:venue.translations.en.name,lastChecked:reviewedOn||'',nextReview:next,
  status:!Number.isFinite(checked)?(venue.reviewAttemptedOn?'Direct confirmation needed':'Baseline check needed'):checked>today?'Check date is in the future':today>=checked+everyDays*86400000?'Review overdue':'Within review interval',
  source:venue.hoursSource || venue.accessSource || venue.reviewSource || venue.translations.en.links.find(link=>link.kind==='map')?.href || venue.translations.en.links[0]?.href || '',
  reviewType:venue.accessCheckedOn?'Access information':venue.hoursCheckedOn?'Published hours':'Unconfirmed',attemptedOn:venue.reviewAttemptedOn||'',note:venue.reviewNote||''};
});
const csv=values=>values.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',');
const report=[csv(['ID','Place','Information last checked','Next review','Status','Review source','Review type','Last research attempt','Follow-up note']),...rows.map(row=>csv(Object.values(row)))].join('\n')+'\n';
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/VENUE-REVIEW.csv'),report);
const due=rows.filter(row=>row.status!=='Within review interval');
const summary=`Venue information review: ${due.length} of ${rows.length} need direct confirmation or review as of ${asOf}. Review interval: ${everyDays} days. Access reviews do not verify opening hours; research attempts are not confirmations.\n`;
console.log(summary.trim());
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## Venue review queue\n\n'+summary+'\n'+due.map(row=>`- ${row.name}: ${row.status}`).join('\n')+'\n');
