function parseColor(value) {
  value = value.trim();

  // HEX
  if (value.startsWith('#')) {
    let hex = value.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return { r, g, b, a: 1 };
  }

  // rgb/rgba
  if (value.startsWith('rgb')) {
    const nums = value.match(/[\d.]+/g).map(Number);
    const [r, g, b, a = 1] = nums;
    return { r, g, b, a };
  }

  return null;
}

function rgbToHSL(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60;
  }

  return { h, s, l };
}

function HSLToCSS(h, s, l, a = 1) {
  return a === 1
    ? `hsl(${h}, ${(s*100).toFixed(1)}%, ${(l*100).toFixed(1)}%)`
    : `hsla(${h}, ${(s*100).toFixed(1)}%, ${(l*100).toFixed(1)}%, ${a})`;
}

function animateRainbow() {
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const vars = [];

  for (let i = 0; i < styles.length; i++) {
    const name = styles[i];
    if (!name.startsWith('--')) continue;

    const val = styles.getPropertyValue(name).trim();
    const rgba = parseColor(val);
    if (rgba) {
      const hsl = rgbToHSL(rgba.r, rgba.g, rgba.b);
      vars.push({ name, hsl, alpha: rgba.a });
    }
  }

  let hueOffset = 0;
  function frame() {
    hueOffset = (hueOffset + 0.5) % 360; // скорость анимации
    for (let i = 0; i < vars.length; i++) {
      const v = vars[i];
      const h = (v.hsl.h + hueOffset) % 360;
      root.style.setProperty(v.name, HSLToCSS(h, v.hsl.s, v.hsl.l, v.alpha));
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function startShake(intensity = 2) {
  const elements = document.querySelectorAll('body *');
  const count = elements.length;
  const offsets = new Array(count);

  for (let i = 0; i < count; i++) {
    offsets[i] = Math.random() * 2 * Math.PI;
  }

  let tick = 0;
  function animate() {
    tick += 0.1;
    for (let i = 0; i < count; i++) {
      const el = elements[i];
      const base = offsets[i];
      const dx = Math.sin(tick + base) * intensity;
      const dy = Math.cos(tick + base) * intensity;
      // добавляем "виртуальную" тряску через CSS-переменную
      el.style.setProperty('--shake-transform', `translate(${dx}px, ${dy}px)`);
    }
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

export {
  startShake,
  animateRainbow
}
