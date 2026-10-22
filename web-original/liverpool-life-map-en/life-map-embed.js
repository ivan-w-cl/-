/* Same-origin bridge for the two lifestyle-test result maps.
   Uses the original illustrated map and ranking engine; no duplicated homes. */
(() => {
  'use strict';
  if(new URL(location.href).searchParams.get('lifeMap')!=='1' || !window.HomeMatch)return;
  document.body.classList.add('life-map-embedded');
  welcome.hidden=true;
  const api=window.HomeMatch,ns='http://www.w3.org/2000/svg';
  const labelLayer=mk('g',{id:'lifeMapLabels'},over);
  const allModeClass='life-map-all-homes';
  const setAllMode=on=>document.body.classList.toggle(allModeClass,on);
  let labelBounds=[];
  const recommendations=()=>api.getSnapshot().picks.map(pick=>({pick,home:HOMES.find(home=>home.id===pick.id)})).filter(entry=>entry.home);
  function drawLabels(){
    labelLayer.textContent='';labelBounds=[];
    const entries=recommendations(),occupied=[];
    entries.forEach(({pick,home},index)=>{
      const width=Math.max(150,Math.min(244,pick.name.length*7.4+42)),height=34;
      let x=home.p[0]+28,y=home.p[1]-49;
      // Three small labels are staggered instead of covering adjacent homes.
      for(let attempt=0;attempt<12;attempt++){
        const overlaps=occupied.some(box=>x<box.x+box.w+10 && x+width>box.x-10 && y<box.y+box.h+10 && y+height>box.y-10);
        if(!overlaps)break;
        y+=height+12;
      }
      x=Math.max(12,Math.min(OUTW-width-12,x));
      const box={x,y,w:width,h:height};occupied.push(box);labelBounds.push(box);
      const group=mk('g',{class:'life-map-pin',tabindex:'0',role:'button','aria-label':`Pick ${index+1}, map number ${pick.n}: ${pick.name} — open home details`},labelLayer);
      mk('path',{d:`M${home.p[0]} ${home.p[1]} L${x+8} ${y+height/2}`,fill:'none',stroke:'#ad543a','stroke-width':2,'stroke-dasharray':'4 4'},group);
      mk('rect',{x,y,width,height,rx:11,fill:index===0?'#d56c4b':'#fffaf0',stroke:'#633c2b','stroke-width':2},group);
      mk('circle',{cx:x+17,cy:y+17,r:10,fill:index===0?'#fffaf0':'#d56c4b'},group);
      mk('text',{x:x+17,y:y+22,'text-anchor':'middle','font-size':14,'font-weight':800,style:`fill:${index===0?'#9b482e':'#fffaf0'}`},group).textContent=String(pick.n);
      mk('text',{x:x+33,y:y+22,'font-size':14,'font-weight':700,style:`fill:${index===0?'#fffaf0':'#633c2b'}`},group).textContent=pick.name.length>27?pick.name.slice(0,26)+'…':pick.name;
      group.addEventListener('click',event=>{event.stopPropagation();api.selectHome(pick.id);});
      group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();api.selectHome(pick.id);}});
    });
  }
  function cropBounds(){
    const points=[P(53.4035,-2.9868),...recommendations().flatMap(({home})=>[home.a,home.p]),...labelBounds.flatMap(box=>[[box.x,box.y],[box.x+box.w,box.y+box.h]])];
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
    const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
    let width=Math.max(760,Math.max(...xs)-Math.min(...xs)+200),height=Math.max(570,Math.max(...ys)-Math.min(...ys)+200);
    const aspect=1140/970;
    if(width/height<aspect)width=height*aspect;else height=width/aspect;
    return {x:Math.max(0,Math.min(OUTW-width,cx-width/2)),y:Math.max(0,Math.min(OUTH-height,cy-height/2)),width,height};
  }
  const styleProperties=['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','stroke-dashoffset','opacity','fill-opacity','stroke-opacity','paint-order','font-size','font-weight','font-style','text-anchor','letter-spacing','dominant-baseline','visibility','display','transform','transform-box','transform-origin'];
  function copyStyled(source){
    if(['script','foreignobject','image'].includes(source.localName?.toLowerCase()))return null;
    if(['movers','hmLayer'].includes(source.id))return null;
    const clone=source.cloneNode(false),style=getComputedStyle(source);
    for(const property of styleProperties){
      let value=style.getPropertyValue(property);
      // Browser-computed paint URLs may be absolute; make the embedded defs local.
      value=value.replace(/url\(["']?[^)"']*#([^)'"\s]+)["']?\)/g,'url(#$1)');
      if(value)clone.style.setProperty(property,value);
    }
    clone.style.setProperty('font-family','"Segoe Print", "Comic Sans MS", "PingFang SC", sans-serif');
    clone.style.setProperty('animation','none');clone.style.setProperty('transition','none');
    if(source.classList.contains('drop')||source.classList.contains('in')||source.classList.contains('badge')){
      clone.style.setProperty('transform','none');clone.style.setProperty('opacity','1');
    }
    // Export shows geographic labels independent of the last panned viewport.
    if(source.classList.contains('map-label-muted'))clone.style.setProperty('visibility','visible');
    for(const attribute of [...clone.attributes]){
      if(attribute.name.startsWith('on') || ['tabindex','role','aria-label','aria-hidden'].includes(attribute.name))clone.removeAttribute(attribute.name);
      if((attribute.name==='href'||attribute.name==='xlink:href')&&!attribute.value.startsWith('#'))clone.removeAttribute(attribute.name);
    }
    for(const child of source.childNodes){
      if(child.nodeType===1){const copied=copyStyled(child);if(copied)clone.appendChild(copied);}
      else if(child.nodeType===3)clone.appendChild(child.cloneNode(false));
    }
    return clone;
  }
  function exportSVG(){
    // Download remains the student's recommendation poster, even if they are
    // browsing all homes. Restore the live browse view in the same task.
    const wasAll=document.body.classList.contains(allModeClass);setAllMode(false);
    try{
      const bounds=cropBounds(),svg=document.createElementNS(ns,'svg');
      svg.setAttribute('xmlns',ns);svg.setAttribute('width','1140');svg.setAttribute('height','970');
      svg.setAttribute('viewBox',`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
      const background=mk('rect',{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height,fill:'#f1e4c3'},svg);
      background.setAttribute('aria-hidden','true');
      for(const source of [base,over])for(const child of source.children){const copied=copyStyled(child);if(copied)svg.appendChild(copied);}
      return {svg:new XMLSerializer().serializeToString(svg),width:1140,height:970};
    }finally{setAllMode(wasAll);}
  }
  window.addEventListener('lifemapchange',drawLabels);
  const subjectPanel=document.getElementById('subjectPanel');
  const childModals=['contactWrap','cmpWrap'].map(id=>document.getElementById(id)).filter(Boolean);
  const overlayObserver=new MutationObserver(()=>{
    const detail={cardOpen:!card.hidden,subjectOpen:!!subjectPanel && !subjectPanel.hidden,modalOpen:childModals.some(modal=>!modal.hidden)};
    detail.open=detail.cardOpen || detail.subjectOpen || detail.modalOpen;
    window.dispatchEvent(new CustomEvent('lifemapoverlay',{detail}));
  });
  overlayObserver.observe(card,{attributes:true,attributeFilter:['hidden']});
  if(subjectPanel)overlayObserver.observe(subjectPanel,{attributes:true,attributeFilter:['hidden']});
  childModals.forEach(modal=>overlayObserver.observe(modal,{attributes:true,attributeFilter:['hidden']}));
  function compareRecommended(){
    // Resolve current recommendations inside the map. Callers cannot inject
    // an arbitrary home list, or accidentally reuse a previous comparison.
    const picks=api.getSnapshot().picks,ids=[...new Set(picks.map(pick=>pick.id))];
    if(ids.length<2 || ids.length>3 || ids.length!==picks.length || ids.some(id=>!HOMES.some(home=>home.id===id)))return false;
    hide();closeSheets();compare.clear();ids.forEach(id=>compare.add(id));
    syncCompare();openCompare();return true;
  }
  function fitRecommended(viewport){
    setAllMode(false);hide();closeSheets();drawLabels();
    if(!api.getSnapshot().picks.length)return false;
    const extraPoints=labelBounds.flatMap(box=>[[box.x,box.y],[box.x+box.w,box.y+box.h]]);
    return api.fitRecommendations({viewport,extraPoints});
  }
  function showAll(viewport){
    const wasAll=document.body.classList.contains(allModeClass);
    hide();closeSheets();setAllMode(true);
    const fitted=api.fitAllHomes({viewport});
    if(!fitted){setAllMode(wasAll);return false;}
    return {...fitted,count:HOMES.length};
  }
  function selectAny(id){
    const home=HOMES.find(home=>home.id===id);if(!home)return false;
    hide();closeSheets();bringIntoView(home);show(home,true);return true;
  }
  window.LifeMapBridge=Object.freeze({
    ready:true,
    apply:input=>{const applied=api.applyAnswers(input);if(applied)setAllMode(false);return applied;},
    getSnapshot:()=>api.getSnapshot(),
    select:id=>api.selectHome(id),
    compare:compareRecommended,
    fit:fitRecommended,
    showAll,
    showRecommendations:fitRecommended,
    getAllHomes:()=>HOMES.map(({id,n,name})=>({id,n,name})),
    selectAny,
    exportSVG
  });
  window.dispatchEvent(new Event('lifemapready'));
})();
