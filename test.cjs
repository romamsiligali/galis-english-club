const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'lessons.js'),'utf8'),context);
const lessons=context.window.LESSONS;
assert.equal(lessons.length,16);
assert.equal(new Set(lessons.map(l=>l.id)).size,16);
for(const l of lessons){
 assert.ok(l.text.split(/\s+/).length>=75 && l.text.split(/\s+/).length<=(l.level===1?110:180),l.id+' has a short reading');
 assert.equal(l.questions.length,l.level===1?4:6);
 for(const q of l.questions){assert.equal(q.choices.length,3);assert.ok(q.answer>=0&&q.answer<3);assert.ok(q.hint&&q.why);}
 assert.equal(l.writeSteps.length,3);assert.equal(l.text.split('\n').length,l.level===1?3:4);assert.equal(l.check.length,3);assert.equal(l.words.length,l.level===1?3:4);
 for(const k of ['goal','warm','discuss','write','starter','challenge','exit','model'])assert.ok(l[k],l.id+' '+k);
 assert.ok(!/[\u0600-\u06ff]/.test(JSON.stringify(l)));
}
const js=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
new vm.Script(js);
assert.ok(!/fetch\(|XMLHttpRequest|OPENAI_API_KEY/.test(js));
assert.ok(js.includes('const instructions=['));
assert.ok(js.includes('Open the story / פתחו את הסיפור'));
assert.ok(js.includes('<details open class="story-reference">'));
console.log('PASS: 16 unique lessons, complete question keys, writing supports, no Arabic, valid JS, no API calls.');

vm.runInNewContext(fs.readFileSync(path.join(__dirname,'resume.js'),'utf8'),context);
for(let n=0;n<lessons.length;n++)for(let step=0;step<5;step++){
 const code=context.window.ResumeCodes.encode(lessons[n].id,step);
 const payload=`2${String(n+1).padStart(2,'0')}${step+1}`;
 assert.equal(code,`${payload}-${String(Number(payload)%97).padStart(2,'0')}`);
 assert.equal(context.window.ResumeCodes.decode(code).id,lessons[n].id);
 assert.equal(context.window.ResumeCodes.decode(code).step,step);
}
for(const l of lessons)assert.equal(l.openQuestions.length,2);
console.log('PASS: all 80 resume codes round-trip; original lesson numbering preserved.');
