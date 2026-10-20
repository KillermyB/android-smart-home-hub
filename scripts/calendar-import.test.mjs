import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const ctx=vm.createContext({Intl,Date});for(const f of ['vendor/ical.js','calendar-import.js'])vm.runInContext(readFileSync(new URL('../dist/'+f,import.meta.url),'utf8'),ctx);
const parse=(lines)=>ctx.HubCalendar.parse(['BEGIN:VCALENDAR','VERSION:2.0',...lines,'END:VCALENDAR'].join('\r\n'),'work','test',new Date('2026-10-21T12:00:00Z'));
const event=(lines)=>['BEGIN:VEVENT','UID:one','SUMMARY:Appointment',...lines,'END:VEVENT'];
test('ICS keeps UTC, IANA floating wall time and DST recurrence correct',()=>{
 let r=parse(event(['DTSTART:20261021T080000Z','DTEND:20261021T090000Z']));assert.equal(r.events[0].start,'10:00');
 r=parse(event(['DTSTART;TZID=Europe/Zurich:20261024T100000','DTEND;TZID=Europe/Zurich:20261024T110000','RRULE:FREQ=DAILY;COUNT=3']));assert.equal(r.events.length,3);assert.ok(r.events.every(e=>e.start==='10:00'));
});
test('ICS expands recurrence exclusions, moved occurrences and cancellations',()=>{
 const r=parse([...event(['DTSTART:20261021T080000Z','DTEND:20261021T090000Z','RRULE:FREQ=DAILY;COUNT=4','EXDATE:20261022T080000Z']),...event(['RECURRENCE-ID:20261023T080000Z','DTSTART:20261023T120000Z','DTEND:20261023T130000Z']),...event(['RECURRENCE-ID:20261024T080000Z','DTSTART:20261024T080000Z','DTEND:20261024T090000Z','STATUS:CANCELLED'])]);
 assert.equal(r.events.length,2);assert.equal(r.events.find(e=>e.date==='2026-10-23').start,'14:00');
});
test('ICS splits all-day exclusive ends and overnight appointments without extra days',()=>{
 let r=parse(event(['DTSTART;VALUE=DATE:20261021','DTEND;VALUE=DATE:20261023']));assert.deepEqual(Array.from(r.events,e=>e.date),['2026-10-21','2026-10-22']);assert.ok(r.events.every(e=>e.allDay));
 r=parse(event(['DTSTART:20261021T213000Z','DTEND:20261021T223000Z']));assert.equal(r.events.length,2);assert.equal(r.events[0].start,'23:30');assert.equal(r.events[1].start,'00:00');assert.equal(r.events[1].end,'00:30');
 assert.throws(()=>ctx.HubCalendar.parse('not a calendar','work','x'),/valide/);
});
