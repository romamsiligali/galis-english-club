/* Version 2 lesson bookmarks. No answers, identity, or network needed. */
window.ResumeCodes = (() => {
  const ids = ['footprints','garden','space','bridge','map','library','seed','ending','bell','kite','market','robot','island','museum','rain','letter'];
  function encode(id, step) {
    const n = ids.indexOf(id) + 1;
    if (!n || !Number.isInteger(step) || step < 0 || step > 4) throw new Error('Invalid bookmark');
    const payload = `2${String(n).padStart(2,'0')}${step + 1}`;
    return `${payload}-${String(Number(payload) % 97).padStart(2,'0')}`;
  }
  function decode(input) {
    if (typeof input !== 'string') return null;
    const raw = input.trim().replace(/[\s-]/g,'');
    if (!/^2[0-9]{5}$/.test(raw)) return null;
    const payload = raw.slice(0,4), n = Number(raw.slice(1,3)), step = Number(raw[3]) - 1;
    if (n < 1 || n > ids.length || step < 0 || step > 4 || Number(raw.slice(4)) !== Number(payload) % 97) return null;
    return {id:ids[n-1],step};
  }
  return Object.freeze({encode,decode});
})();
