/* Layout helpers contain no account data. Times are wall-clock minutes in Zurich. */
(function(root){'use strict';
function minutes(value){var m=/^(\d{2}):(\d{2})$/.exec(value||'');return m?Math.max(0,Math.min(1440,Number(m[1])*60+Number(m[2]))):0;}
function layout(events,from,to){var rows=events.filter(function(e){return !e.allDay&&minutes(e.start)<to&&Math.max(minutes(e.start)+1,minutes(e.end))>from;}).map(function(e){var start=Math.max(from,minutes(e.start)),end=Math.min(to,Math.max(start+1,minutes(e.end)));return {event:e,start:start,end:end,visualEnd:Math.min(to,Math.max(end,start+44)),lane:0,lanes:1};}).filter(function(r){return r.start<to&&r.end>from;}).sort(function(a,b){return a.start-b.start||b.end-a.end;});
var group=[],until=-1;function finish(){var occupied=[];group.forEach(function(r){var lane=occupied.findIndex(function(end){return end<=r.start;});if(lane<0)lane=occupied.length;r.lane=lane;occupied[lane]=r.visualEnd;});group.forEach(function(r){r.lanes=occupied.length;});group=[];}
rows.forEach(function(r){if(r.start>=until){finish();until=-1;}group.push(r);until=Math.max(until,r.visualEnd);});finish();return rows;}
function shift(date,view,direction){var d=new Date(date+'T12:00:00Z');if(view==='month'){d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+direction);}else d.setUTCDate(d.getUTCDate()+direction*(view==='week'?7:view==='three'?3:1));return d.toISOString().slice(0,10);}
root.HubAgenda={minutes:minutes,layout:layout,shift:shift};
}(typeof window==='undefined'?globalThis:window));
