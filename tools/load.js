/* Loads the pure physics + world scripts straight out of the built index.html (no DOM needed). */
const fs = require('fs'), path = require('path');
module.exports = function load(file = path.join(__dirname, '..', 'index.html')) {
  const html = fs.readFileSync(file, 'utf8'), grab = marker => {
    const i = html.indexOf(marker); if (i < 0) throw new Error('marker not found: ' + marker);
    return html.slice(html.lastIndexOf('<script>', i) + 8, html.indexOf('</script>', i));
  };
  const box = {}; for (const m of ['/* CLAX physics', '/* CLAX world data']) new Function('globalThis', 'module', 'require', grab(m))(box, undefined, undefined);
  return { P: box.CLAX_PHYS, DB: box.CLAX_WORLD };
};
