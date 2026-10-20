// Export only aggregate contribution counts. gh keeps its credential; none is copied into Hub.
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const output=process.argv[2];if(!output)throw Error('Usage: node scripts/github-export.mjs /private/path/github.json');
const end=new Date(),start=new Date();start.setUTCDate(end.getUTCDate()-27);const first=start.toISOString().slice(0,10),last=end.toISOString().slice(0,10);
const query='query($from:DateTime!,$to:DateTime!){viewer{login contributionsCollection(from:$from,to:$to){contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}';
const result=JSON.parse(execFileSync('gh',['api','graphql','-f','query='+query,'-f','from='+first+'T00:00:00Z','-f','to='+last+'T23:59:59Z'],{encoding:'utf8',maxBuffer:1000000}));
if(result.errors||!result.data?.viewer)throw Error('GitHub export refused.');const viewer=result.data.viewer,days={};for(const week of viewer.contributionsCollection.contributionCalendar.weeks)for(const day of week.contributionDays)if(day.date>=first&&day.date<=last)days[day.date]=day.contributionCount;
writeFileSync(output,JSON.stringify({format:'hub-github-contributions',user:viewer.login,start:first,end:last,updated:Date.now(),days}),{mode:0o600});console.log('Aggregate GitHub snapshot exported; no token or repository names included.');
