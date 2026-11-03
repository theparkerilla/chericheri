/* Cheri Cheri · ajustes de paridad con Da Maria
   1) Pasa el selector ES/EN del header al menú desplegable.
   2) Ajusta los títulos: arrancan con el tamaño del template y, si alguna
      palabra no entra en su columna, se achican lo justo para que entre. */
(function(){
  // 1) ES/EN al menú
  function moveLang(){
    var sw=document.querySelector('header.top .lang'), hd=document.querySelector('nav.main .hd');
    if(sw&&hd){var x=hd.querySelector('.x');hd.insertBefore(sw,x||null);}
  }

  // 2) Ajuste de títulos
  var els=[].slice.call(document.querySelectorAll('.sheet h1, .sheet h2, .sheet h3')).filter(function(h){return !h.closest('.ticker, .gal')});
  function overflows(h){
    var cs=getComputedStyle(h), cw=h.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    // si el contenedor se estira con el título, medimos contra el borde interno de la hoja
    var sh=h.closest('.sheet');
    if(sh){var sr=sh.getBoundingClientRect(), ss=getComputedStyle(sh), hr=h.getBoundingClientRect();
      var lim=sr.right-parseFloat(ss.paddingRight)-hr.left-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
      var box=h.closest('.redbox');if(box){var br=box.getBoundingClientRect(),bs=getComputedStyle(box);lim=Math.min(lim,br.right-parseFloat(bs.paddingRight)-hr.left)}
      cw=Math.min(cw,lim);}
    var ws=h.querySelectorAll('.w');
    if(ws.length){var m=0;for(var i=0;i<ws.length;i++)m=Math.max(m,ws[i].offsetWidth);return m>cw+1;}
    return h.scrollWidth>Math.min(h.clientWidth,cw)+1;
  }
  function fit(){
    els.forEach(function(h){
      h.style.removeProperty('font-size');
      var fs=parseFloat(getComputedStyle(h).fontSize), n=0;
      while(overflows(h)&&fs>18&&n<80){fs*=.97;h.style.setProperty('font-size',fs.toFixed(1)+'px','important');n++;}
    });
  }
  function run(){moveLang();fit();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  var t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,120)});
})();
