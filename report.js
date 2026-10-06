/* Read-only evidence report. Legacy records are shown without inventing missing evidence. */
window.EnglishReport = (() => {
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const date=s=>{const d=new Date(s);return s&&!Number.isNaN(d.valueOf())?d.toLocaleString('he-IL'):'לא תועד';};
 function build(records,lessons,group='all'){
  const rows=[];
  for(const [key,r] of Object.entries(records||{})){
   if(!r||typeof r!=='object'||Array.isArray(r))continue;
   const [team,id]=key.split('::');
   if(group!=='all'&&team!==group)continue;
   const lesson=lessons.find(l=>l.id===id);
   if(!lesson)continue;
   const answers=Array.isArray(r.answers)?r.answers:[],checks=Array.isArray(r.checks)?r.checks:[],attempts=Array.isArray(r.attempts)?r.attempts:[];
   // Visiting the story list used to create empty records; they are not activity.
   if(!(r.step||r.done||r.startedAt||r.updatedAt||r.writingSample||r.reflection||answers.some(Number.isInteger)||checks.some(v=>v===true)))continue;
   const sample=typeof r.writingSample==='string'?r.writingSample:'';
   const reflection=typeof r.reflection==='string'?r.reflection:'';
   const questions=lesson.questions.map((q,i)=>({question:q.q,answer:Number.isInteger(answers[i])&&q.choices[answers[i]]!==undefined?q.choices[answers[i]]:'לא נשמרה תשובה',result:Number.isInteger(answers[i])&&q.choices[answers[i]]!==undefined?(answers[i]===q.answer?'נכונה':'אינה נכונה'):'לא ידוע',attempts:Number.isInteger(attempts[i])&&attempts[i]>0?attempts[i]:'לא תועד'}));
   const step=Number.isInteger(r.step)&&r.step>=0&&r.step<=4?r.step:0;
   const status=r.done?(r.evidenceVersion===1?'סומן סיום עם דוגמת כתיבה; נדרשת בדיקת מורה':'סומן סיום בגרסה קודמת; אין אישור לביצוע כתיבה'):'בתהליך';
   rows.push({team,title:lesson.title,step:step+1,status,code:window.ResumeCodes.encode(id,step),questions,sample,reflection,checks:checks.filter(v=>v===true).length,started:date(r.startedAt),updated:date(r.updatedAt),finished:date(r.completedAt)});
  }
  const intro='דוח מהמחשב והדפדפן הנוכחיים בלבד. זמני עבודה שלא נשמרו בעבר אינם ניתנים לשחזור. מספר ניסיונות כולל ניסיונות חוזרים. קוד המשך שומר מיקום בלבד. אין בדיקה אוטומטית של איכות הכתיבה או של המחברת.';
  const html=`<p>${intro}</p><p><strong>נמצאו ${rows.length} רשומות עבודה.</strong></p>`+(rows.length?rows.map(r=>`<section class="report-card"><h2>${escape(r.team)} · ${escape(r.title)}</h2><p>${escape(r.status)} · שלב ${r.step}/5 · קוד מיקום: <bdi>${r.code}</bdi></p><p>תחילת עבודה שתועדה: ${escape(r.started)}<br>עדכון אחרון: ${escape(r.updated)}<br>סיום שתועד: ${escape(r.finished)}</p><table><thead><tr><th>שאלה</th><th>תשובה שנשמרה</th><th>בדיקה וניסיונות</th></tr></thead><tbody>${r.questions.map(q=>`<tr><td dir="ltr">${escape(q.question)}</td><td dir="auto">${escape(q.answer)}</td><td>${q.result}<br>ניסיונות: ${q.attempts}</td></tr>`).join('')}</tbody></table><h3>דוגמה שהוקלדה מהמחברת</h3><blockquote dir="auto">${escape(r.sample||'לא נשמרה דוגמת כתיבה. אין להסיק מכך אם נכתבה עבודה במחברת.')}</blockquote><h3>תשובת הסיכום שהוקלדה</h3><blockquote dir="auto">${escape(r.reflection||'לא הוקלדה תשובת סיכום.')}</blockquote><p>סימוני בדיקה עצמית: ${r.checks}/3 — דיווח התלמיד, לא אישור מורה.</p></section>`).join(''):'<p>לא נמצאה עבודה בדפדפן הזה. פתחו את הדוח במחשב ובדפדפן שבהם התלמיד עבד, באותו קישור בדיוק. הנתונים אינם נשלחים למחשב המורה.</p>');
  const text=[intro,`רשומות: ${rows.length}`,...rows.map(r=>[`${r.team} — ${r.title}`,`${r.status}; שלב ${r.step}; קוד ${r.code}`,`תחילה: ${r.started}; עדכון: ${r.updated}; סיום: ${r.finished}`,...r.questions.map(q=>`${q.question}\nתשובה: ${q.answer}; ${q.result}; ניסיונות: ${q.attempts}`),`דוגמת כתיבה: ${r.sample||'לא נשמרה'}`,`סיכום: ${r.reflection||'לא הוקלד'}`,`בדיקה עצמית: ${r.checks}/3`].join('\n'))].join('\n\n');
  return {html,text,count:rows.length};
 }
 function document(report){return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>דוח עבודה באנגלית</title><style>body{font-family:Arial,sans-serif;max-width:950px;margin:30px auto;padding:20px;line-height:1.7}table{width:100%;border-collapse:collapse;table-layout:fixed;overflow-wrap:anywhere}td,th{border:1px solid #ccc;padding:10px;text-align:right}.report-card{border:1px solid #ccc;padding:20px;margin:20px 0;break-inside:avoid}blockquote{white-space:pre-wrap;background:#f2f5ef;padding:12px}h2{font-size:22px}</style></head><body><h1>דוח עבודה — Gali’s English Club</h1>${report.html}</body></html>`;}
 return Object.freeze({build,document});
})();
