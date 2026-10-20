/* iCalendar 2.0 imports, expanded locally with ICAL.js 2.2.1 (MPL-2.0). */
(function(root){
'use strict';
var IC=root.ICAL;
function localParts(date){var p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date),v={};p.forEach(function(x){v[x.type]=x.value;});return {date:v.year+'-'+v.month+'-'+v.day,time:v.hour+':'+v.minute};}
function instant(time){
 if(time.isDate)return new Date(Date.UTC(time.year,time.month-1,time.day));
 if(time.zone&&time.zone.tzid!=='floating')return time.toJSDate();
 return wallTime(time,'Europe/Zurich');
}
function wallTime(time,tz){var target=Date.UTC(time.year,time.month-1,time.day,time.hour,time.minute,time.second),guess=target;
 for(var i=0;i<4;i++){var parts=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)),p={};parts.forEach(function(x){p[x.type]=x.value;});var delta=target-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);guess+=delta;if(!delta)break;}return new Date(guess);}
function parse(text,source,id,now){
 if(typeof text!=='string'||text.length>10000000||!/^BEGIN:VCALENDAR/m.test(text))throw Error('Choisis un fichier iCalendar (.ics) valide.');
 if(!['outlook','google','work'].includes(source))throw Error('Choisis Perso, Myrak ou Travail.');
 var cal;try{cal=new IC.Component(IC.parse(text));}catch(_){throw Error('Ce calendrier est illisible. Aucun import effectué.');}
 var zones=cal.getAllSubcomponents('vtimezone');zones.forEach(function(c){IC.TimezoneService.register(new IC.Timezone(c));});
 try{
 var components=cal.getAllSubcomponents('vevent'),exceptions=components.filter(function(c){return c.hasProperty('recurrence-id');}),events=[],reference=new Date(now||Date.now()),from=reference.getTime()-60*86400000,to=reference.getTime()+365*86400000;
 function add(event,occurrence){var detail=event.getOccurrenceDetails(occurrence),item=detail.item||event,c=item.component;if(String(c.getFirstPropertyValue('status')).toUpperCase()==='CANCELLED')return;
 var start=detail.startDate,end=detail.endDate;if(!start||!end)return;var a=instant(start),b=instant(end);
 // Missing VTIMEZONE definitions: resolve IANA wall times through Intl rather than silently treating them as UTC.
 var tz=c.getFirstProperty('dtstart').getParameter('tzid');if(tz&&start.zone.tzid==='floating'){try{a=wallTime(start,tz);b=wallTime(end,tz);}catch(_){throw Error('Fuseau horaire du calendrier non reconnu.');}}
 if(b.getTime()<=a.getTime())b=new Date(a.getTime()+60000);
 if(b.getTime()<=from||a.getTime()>=to)return;
 var first=start.isDate?start.toString():localParts(a).date,last=end.isDate?end.toString():localParts(new Date(Math.max(a.getTime(),b.getTime()-1))).date;
 if(start.isDate){var lastDate=new Date(last+'T00:00:00Z');lastDate.setUTCDate(lastDate.getUTCDate()-1);last=lastDate.toISOString().slice(0,10);}
 for(var day=first,n=0;day<=last&&n<367;n++){var da=new Date(day+'T12:00:00Z');if(da.getTime()>=from-86400000&&da.getTime()<=to+86400000)events.push({id:id+':'+event.uid+':'+occurrence.toString()+':'+day,title:item.summary||'Sans titre',date:day,start:start.isDate||day!==first?'00:00':localParts(a).time,end:end.isDate||day!==last?'23:59':localParts(b).time,allDay:start.isDate,source:source});da.setUTCDate(da.getUTCDate()+1);day=da.toISOString().slice(0,10);}
 }
 components.filter(function(c){return !c.hasProperty('recurrence-id');}).forEach(function(c){if(!c.hasProperty('dtstart'))return;var uid=c.getFirstPropertyValue('uid'),event=new IC.Event(c,{exceptions:exceptions.filter(function(x){return x.getFirstPropertyValue('uid')===uid;})});if(!event.isRecurring()){add(event,event.startDate);return;}var iterator=event.iterator(),next,count=0;while((next=iterator.next())){if(++count>30000)throw Error('Calendrier trop complexe : limite de récurrences atteinte.');if(instant(next).getTime()>to)break;add(event,next);}});
 var seen=new Set();events=events.filter(function(x){if(seen.has(x.id))return false;seen.add(x.id);return true;});return {name:cal.getFirstPropertyValue('x-wr-calname')||'Calendrier',events:events,updated:Date.now()};
 }finally{zones.forEach(function(c){IC.TimezoneService.remove(c.getFirstPropertyValue('tzid'));});}
}
root.HubCalendar={parse:parse};
}(typeof window==='undefined'?globalThis:window));
