const $=s=>document.querySelector(s);

const SKIES = [
  // 原有（3 色）
  ["群青",     ["#0a1a8c", "#1a34c8", "#6a88f2"]],
  ["夕焼け",   ["#3c4766", "#a96c88", "#f2bb8c"]],
  ["真夜中",   ["#05060f", "#0f1b40", "#2e429a"]],
  ["朝ぼらけ", ["#6a80cc", "#c9b4e8", "#f6e6f2"]],
  ["暁",       ["#0b0f3a", "#4d3aa0", "#c05fae"]],
  ["薄暮",     ["#1d2332", "#2d5568", "#92aab4"]],
  ["快晴の日", ["#0a79b0", "#14aed8", "#a8e4f6"]],

  // 新增（5 色，均匀分布在 0 / 25 / 50 / 75 / 100%）
  ["午後6時",       ["#366696", "#5f84ab", "#a2add1", "#cfc6d9", "#b8a2b9"]],
  ["朝の空気",     ["#94d1eb", "#a1d8f2", "#c1def0", "#d1e5f5", "#dde7f2"]],
  ["暁光",         ["#aa7da3", "#bd86a8", "#e8a8b4", "#f8d5b4", "#fcfad5"]],
  ["東雲",         ["#787fae", "#8992b3", "#d0c0d1", "#ecd9da", "#f3ccc5"]],
  ["マジックアワー", ["#435fab", "#565fab", "#7a60ae", "#c064ad", "#efacb7"]],
];

const P3=window.CSS&&CSS.supports&&CSS.supports("color","color(display-p3 1 0 0)");
const col=(h,a=1)=>{const n=parseInt(h.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return P3?`color(display-p3 ${r/255} ${g/255} ${b/255} / ${a})`:`rgba(${r},${g},${b},${a})`};
let si=0,layer=0;

function setSky(i){
  const [name, c] = SKIES[i % SKIES.length];
  const a = $("#sky" + layer), b = $("#sky" + (1 - layer));
  const pos = c.length === 3
    ? [0, 55, 100]
    : c.map((_, k) => Math.round(k * 100 / (c.length - 1)));
  const stops = c.map((h, k) => `${col(h)} ${pos[k]}%`).join(",");
  a.style.background = `linear-gradient(180deg,${stops})`;
  a.classList.add("on"); b.classList.remove("on"); layer = 1 - layer;
  $("#skyname").textContent = "天色 · " + name;
}

setSky(0);

/* ---- 随机句子 ---- */

const LINES=["生活在别处。","Thank you,AND I LOVE THE WORLD.","正如天体的和谐取决于并不相互接触的行星轨道","我路过你的生命了哦。","话说咱习惯断舍离，由是也不常拍照啦。。","鼎臑盈望，和致芳祇。","Muss es sein?","Ja,es muss sein!","...再聊一会会好吗？"];
let last=-1,tt;
function toast(){
  let k;do{k=Math.floor(Math.random()*LINES.length)}while(k===last);last=k;
  const t=$("#toast");t.textContent=LINES[k];t.classList.add("on");
  clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),3800);
}

/* ---- 相册存储 ---- */
const db=new Promise(r=>{try{const q=indexedDB.open("chilo",1);q.onupgradeneeded=()=>{q.result.createObjectStore("imgs",{keyPath:"id",autoIncrement:true}).createIndex("album","album")};q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}});
const mem=[];let memId=1;
async function run(mode,fn){const d=await db;if(!d)return null;return new Promise(r=>{try{const t=d.transaction("imgs",mode),q=fn(t.objectStore("imgs"));t.oncomplete=()=>r(q&&q.result);t.onerror=()=>r(null)}catch(e){r(null)}})}
async function list(a){const d=await db;if(!d)return mem.filter(x=>x.album===a);return(await run("readonly",s=>s.index("album").getAll(a)))||[]}
async function add(a,blob){if(!(await db)){mem.push({id:memId++,album:a,blob});return}await run("readwrite",s=>s.add({album:a,blob}))}
async function del(id){if(!(await db)){const i=mem.findIndex(x=>x.id===id);if(i>-1)mem.splice(i,1);return}await run("readwrite",s=>s.delete(id))}

/* ---- 三张卡片（b.style.background 里的三个小数是不透明度，越小越通透） ---- */
const ALBUMS=[
 {k:"bjzc",t:"不解之词",s:"文字·梦呓·记忆",sky:0,p:["images/bjzc-1.png","images/bjzc-2 (1).png","images/bjzc-3.png", "images/bjzc-2 (2).png","images/bjzc-4.png","images/bjzc-5.png","images/bjzc-6.png","images/bjzc-7.png","images/bjzc-8.png","images/bjzc-9.png","images/bjzc-10.png","images/bjzc-11.png","images/bjzc-12.png","images/bjzc-13.png","images/bjzc-14.png","images/bjzc-15.png","images/bjzc-16.png","images/bjzc-17.png","images/bjzc-18.png","images/bjzc-19.png","images/bjzc-20.png","images/bjzc-21.png","images/bjzc-22.png","images/bjzc-23.png","images/bjzc-24.png","images/bjzc-25.png","images/bjzc-26.png","images/bjzc-27.png","images/bjzc-28.png","images/bjzc-29.png","images/bjzc-30.png","images/bjzc-31.png","images/bjzc-32.png","images/bjzc-33.png","images/bjzc-34.png","images/bjzc-35.jpg","images/bjzc-36.jpg","images/bjzc-37.jpg"]},
 {k:"dqhs",t:"丹青幻身",s:"涂鸦·盗作·增补",sky:1,p:["images/dqhs-1.jpg","images/dqhs-2.jpg","images/dqhs-3.jpg","images/dqhs-4.jpg","images/dqhs-5.jpg","images/dqhs-6.jpg","images/dqhs-7.jpg","images/dqhs-8.jpg","images/dqhs-9.jpg","images/dqhs-10.jpg","images/dqhs-11.jpg","images/dqhs-12.jpg","images/dqhs-13.jpg","images/dqhs-14.jpg","images/dqhs-15.jpg","images/dqhs-16.jpg","images/dqhs-17.jpg","images/dqhs-18.jpg","images/dqhs-19.png","images/dqhs-20.jpg","images/dqhs-21.jpg","images/dqhs-22.jpg","images/dqhs-23.jpg","images/dqhs-24.jpg","images/dqhs-25.jpg"]},
 {k:"che",t:"Che vuoi?",s:"连结·统合·编织",sky:4,p:["images/che-1.jpg","images/che-2.jpg","images/che-3.jpg","images/che-4.jpg","images/che-5.jpg","images/che-6.jpg","images/che-7.jpg","images/che-8.jpg","images/che-9.jpg","images/che-10.jpg","images/che-11.jpg","images/che-12.jpg","images/che-13.jpg","images/che-14.jpg","images/che-15.jpg","images/che-16.jpg"]},
];
const cards=$("#cards");
ALBUMS.forEach(a=>{
  const b=document.createElement("button");b.className="card";
  const c=SKIES[a.sky][1];
  b.style.background=`linear-gradient(180deg,${col(c[0],.42)} 0%,${col(c[1],.4)} 55%,${col(c[2],.5)} 100%)`;
  b.innerHTML=`<div class="meta"><b>${a.t}</b><span>${a.s}</span></div>`;
  b.onclick=()=>openAlbum(a);cards.appendChild(b);
});

/* ---- 相册查看器 ---- */
let cur=null,items=[],idx=0,url=null;
async function load(){items=[...cur.p.map(src=>({src})),...await list(cur.k)]}
async function openAlbum(a){cur=a;await load();renderGrid();idx=0;$("#vtitle").textContent=a.t;$("#viewer").classList.add("on");draw();$("#vclose").focus()}
function draw(){
  if(url){URL.revokeObjectURL(url);url=null}
  const body=$("#vbody"),has=items.length>0;
  $("#vcount").textContent=has?`${idx+1} / ${items.length}`:"";
  $("#vprev").style.visibility=$("#vnext").style.visibility=has?"":"hidden";
  $("#vdel").style.display=has&&items[idx].id!==undefined?"":"none";
  if(!has){body.innerHTML='<div class="empty">这里还是空的<br>点右上角“添加图片”开始收藏</div>';return}
  const it=items[idx];let src=it.src;
  if(!src){url=URL.createObjectURL(it.blob);src=url}
  body.innerHTML=`<img src="${src}" alt="${cur.t} ${idx+1}">`;
}
const go=d=>{if(!items.length)return;idx=(idx+d+items.length)%items.length;draw()};
$("#vprev").onclick=()=>go(-1);$("#vnext").onclick=()=>go(1);
$("#vclose").onclick=()=>$("#viewer").classList.remove("on");
$("#file").onchange=async e=>{for(const f of e.target.files)await add(cur.k,f);e.target.value="";await load();idx=items.length-1;draw()};
$("#vdel").onclick=async()=>{const it=items[idx];if(!it||it.id===undefined)return;await del(it.id);await load();idx=Math.min(idx,items.length-1);draw()};

addEventListener("keydown",e=>{if(!$("#viewer").classList.contains("on"))return;if(e.key==="Escape")$("#vclose").click();if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1)});
let x0=null;const st=$(".stage");
st.addEventListener("touchstart",e=>x0=e.touches[0].clientX,{passive:true});
st.addEventListener("touchend",e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)go(d<0?1:-1);x0=null});

/* ---- 星屑：缓慢漂移、闪烁，偶尔划过一道流星 ---- */
(function(){
  const cv=$("#stars"),g=cv.getContext("2d"),still=matchMedia("(prefers-reduced-motion:reduce)").matches,dpr=Math.min(devicePixelRatio||1,2);
  let W=0,H=0,S=[],M=null;
  function init(){
    if(W===innerWidth&&Math.abs(H-innerHeight)<150)return;
    W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
    S=Array.from({length:Math.round(W*H/4500)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()<.04?1.7:Math.random()*.9+.3,p:Math.random()*6.28,s:Math.random()*.0015+.0006,v:Math.random()*.012+.003}));
    if(still)frame(0);
  }
  function frame(t){
    g.clearRect(0,0,W,H);
    for(const s of S){
      if(!still){s.x+=s.v;s.y-=s.v*.4;if(s.x>W)s.x=0;if(s.y<0)s.y=H}
      g.globalAlpha=.3+.7*(.5+.5*Math.sin(t*s.s+s.p));
      g.fillStyle="#fff";g.shadowColor="#cfe0ff";g.shadowBlur=s.r>1.5?12:0;
      g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();
    }
    g.shadowBlur=0;
    if(!still){
      if(!M&&Math.random()<.0022)M={x:W*(.15+Math.random()*.5),y:H*Math.random()*.3,vx:3.4,vy:.6,l:0,pts:[]};
      if(M){
        M.l++;M.vy+=.045;M.x+=M.vx;M.y+=M.vy;M.pts.push([M.x,M.y]);if(M.pts.length>26)M.pts.shift();
        const life=Math.sin(Math.min(M.l/90,1)*Math.PI);
        g.lineCap="round";g.strokeStyle="#fff";g.lineWidth=1.4;
        for(let i=1;i<M.pts.length;i++){g.globalAlpha=(i/M.pts.length)*life*.9;g.beginPath();g.moveTo(...M.pts[i-1]);g.lineTo(...M.pts[i]);g.stroke()}
        if(M.l>90||M.x>W+40||M.y>H+40)M=null;
      }
      requestAnimationFrame(frame);
    }
    g.globalAlpha=1;
  }
  init();addEventListener("resize",init);
  if(!still)requestAnimationFrame(frame);
})();

/* ---- 按钮 ---- */
$("#hello").onclick=()=>{toast();cards.classList.add("show");setSky(++si)};
const moonSection = document.getElementById("moon-section");
const moonStage = document.getElementById("moon-stage");
const moonZoom = document.getElementById("moon-zoom");

// 往下滚时，月亮随滚动进度渐显、上浮、放大
function updateMoon(){
  const r = moonSection.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight * 0.9), 0), 1);
  moonStage.style.opacity = p;
  moonStage.style.transform = `translateY(${(1 - p) * 80}px) scale(${0.85 + 0.15 * p})`;
}
window.addEventListener("scroll", updateMoon, {passive:true, capture:true});
window.addEventListener("resize", updateMoon);
updateMoon();

// 点月亮：p1 放大淡出，p2 渐入
document.getElementById("moon1").addEventListener("click", () => {
  moonSection.classList.add("zoom");
  setTimeout(() => {
    moonZoom.classList.add("show");
    document.body.style.overflow = "hidden";
  }, 600);
});

// 点 p2：返回
moonZoom.addEventListener("click", () => {
  moonZoom.classList.remove("show");
  moonSection.classList.remove("zoom");
  document.body.style.overflow = "";
});
const fallIO = new IntersectionObserver(es => {
  es.forEach(e => e.target.classList.toggle("in", e.isIntersecting));
}, {threshold:.6, rootMargin:"0px 0px -8% 0px"});
document.querySelectorAll("#fall .fl, #fall .drop i").forEach(el => fallIO.observe(el));
const ring = document.getElementById("moon-ring");
new IntersectionObserver(es => {
  ring.classList.toggle("in", es[0].isIntersecting);
}, {threshold:.3}).observe(ring);
/* ---- 缩略图网格 + 点按放大 ---- */
const vgrid = document.createElement("div");
vgrid.id = "vgrid";
document.querySelector("#viewer .vbar").after(vgrid);

const vlight = document.createElement("div");
vlight.id = "vlight";
vlight.innerHTML = "<img alt=''>";
document.body.append(vlight);
const vimg = vlight.querySelector("img");

const made = [];            // 自己创建的 blob 地址，重画时释放
let vUrls = [], vThumbs = [], lightI = 0;

function srcOf(it){
  if (it.src) return it.src;
  if (it.url) return it.url;
  if (it.blob){ const u = URL.createObjectURL(it.blob); made.push(u); return u; }
  return "";
}

function renderGrid(){
  made.splice(0).forEach(u => URL.revokeObjectURL(u));
  vgrid.innerHTML = "";
  vgrid.scrollTop = 0;
  vUrls = items.map(srcOf);
  vThumbs = [];
  if (!vUrls.length){
    vgrid.innerHTML = '<p class="vempty">暂无内容</p >';
    return;
  }
  vUrls.forEach((u, i) => {
    const b = document.createElement("button");
    b.className = "vthumb";
    b.setAttribute("aria-label", "图片 " + (i + 1));
    const im = document.createElement("img");
    im.src = u; im.alt = ""; im.loading = "lazy"; im.decoding = "async";
    b.append(im);
    b.onclick = () => openLight(i);
    vgrid.append(b);
    vThumbs.push(im);
  });
}

// 把大图的位置/大小变换成缩略图的样子（用于放大、缩回动画）
function thumbTransform(i){
  const t = vThumbs[i].getBoundingClientRect();
  const f = vimg.getBoundingClientRect();
  const s = t.width / f.width;
  const dx = t.left + t.width / 2 - (f.left + f.width / 2);
  const dy = t.top + t.height / 2 - (f.top + f.height / 2);
  return `translate(${dx}px,${dy}px) scale(${s})`;
}

async function openLight(i){
  lightI = i;
  vimg.style.transition = "none";
  vimg.style.transform = "none";
  vimg.src = vUrls[i];
  try { await vimg.decode(); } catch(e){}
  vlight.classList.add("on");
  vimg.style.transform = thumbTransform(i);
  void vimg.offsetWidth;
  vimg.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
  vimg.style.transform = "none";
}

function closeLight(){
  if (!vlight.classList.contains("on")) return;
  vimg.style.transition = "transform .4s cubic-bezier(.4,0,.2,1)";
  const th = vThumbs[lightI];
  if (th) {
    th.scrollIntoView({block:"nearest"});
    vimg.style.transform = thumbTransform(lightI);
  }
  vlight.classList.remove("on");
}

function stepLight(d){
  const n = vUrls.length;
  if (n < 2) return;
  lightI = (lightI + d + n) % n;
  vimg.style.transition = "none";
  vimg.style.transform = "none";
  vimg.src = vUrls[lightI];
}

vlight.addEventListener("click", closeLight);
document.addEventListener("keydown", e => {
  if (!vlight.classList.contains("on")) return;
  if (e.key === "Escape") closeLight();
  if (e.key === "ArrowRight") stepLight(1);
  if (e.key === "ArrowLeft") stepLight(-1);
});
let sx = null;
vlight.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, {passive:true});
vlight.addEventListener("touchend", e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  sx = null;
  if (Math.abs(dx) > 50){ stepLight(dx < 0 ? 1 : -1); e.preventDefault(); }
}, {passive:false});
;(() => {
  const filmEl = document.getElementById("film");
  const filmTrack = document.getElementById("film-track");
  const filmSec = document.getElementById("film-section");
   const FILM = [
    { thumb: "images/film-1.jpg", full: "images/film-1.jpg" },
    { thumb: "images/film-2.jpg", full: "images/film-2.jpg" },
    { thumb: "images/film-3.jpg", full: "images/film-3.jpg" },
    { thumb: "images/film-4.jpg", full: "images/film-4.jpg" },
    { thumb: "images/film-5.jpg", full: "images/film-5.jpg" },
    { thumb: "images/film-6.jpg", full: "images/film-6.jpg" },
    { thumb: "images/film-7.jpg", full: "images/film-7.jpg" },
    { thumb: "images/film-8.jpg", full: "images/film-8.jpg" },
    { thumb: "images/film-9.jpg", full: "images/film-9.jpg" },
    { thumb: "images/film-10.jpg", full: "images/film-10.jpg" },
  ];
  const srcs = FILM.map(f => f.full);
  const thumbSrcs = FILM.map(f => f.thumb);

  if (!srcs.length){ filmSec.style.display = "none"; return; }

  const thumbs = [];
  srcs.forEach((src, i) => {
    const n = i + 1;
    const f = document.createElement("button");
    f.className = "fframe";
    f.setAttribute("aria-label", "第 " + n + " 张");
    f.innerHTML =
      `<i class="fb t"><b>${n}</b><u>506-8 FILM</u></i>` +
      `<span class="fm"><span class="fw"><img alt="" loading="lazy" decoding="async"></span></span>` +
      `<i class="fb b"><b>${n}</b><u>${n}A</u></i>`;
    const im = f.querySelector("img");
    im.src = thumbSrcs[i];
    f.onclick = () => { if (!dragged) openFilm(i); };
    filmTrack.append(f);
    thumbs.push(im);
  });
  const fill = document.createElement("div");
  fill.className = "ffill";
  fill.innerHTML = '<i class="fb t"></i><span class="fm"></span><i class="fb b"></i>';
  filmTrack.append(fill);

  // 滚到视野里时浮现
  new IntersectionObserver(es => {
    filmSec.classList.toggle("in", es[0].isIntersecting);
  }, {threshold:.15}).observe(filmSec);

  // 鼠标按住拖动（手机上直接用手指滑）
  let dragging = false, dragged = false, startX = 0, startL = 0;
  filmEl.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse") return;
    dragging = true; dragged = false;
    startX = e.clientX; startL = filmEl.scrollLeft;
    filmEl.classList.add("grab");
  });
  window.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) dragged = true;
    filmEl.scrollLeft = startL - dx;
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    filmEl.classList.remove("grab");
    setTimeout(() => { dragged = false; }, 0);
  });

  // 点开大图：从被点的那一格放大
  const box = document.createElement("div");
  box.id = "flight";
  box.innerHTML = "< img alt=''>";
  document.body.append(box);
  const big = box.querySelector("img");
  let cur = 0, swipeX = null;

  function toThumb(i){
    const t = thumbs[i].getBoundingClientRect();
    const f = big.getBoundingClientRect();
    const s = t.width / f.width;
    const dx = t.left + t.width / 2 - (f.left + f.width / 2);
    const dy = t.top + t.height / 2 - (f.top + f.height / 2);
    return `translate(${dx}px,${dy}px) scale(${s})`;
  }
  async function openFilm(i){
    cur = i;
    big.style.transition = "none";
    big.style.transform = "none";
    big.src = srcs[i];
    try { await big.decode(); } catch(e){}
    box.classList.add("on");
    big.style.transform = toThumb(i);
    void big.offsetWidth;
    big.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
    big.style.transform = "none";
  }
  function closeFilm(){
    if (!box.classList.contains("on")) return;
    thumbs[cur].scrollIntoView({inline:"center", block:"nearest"});
    big.style.transition = "transform .4s cubic-bezier(.4,0,.2,1)";
    big.style.transform = toThumb(cur);
    box.classList.remove("on");
  }
  function step(d){
    cur = (cur + d + srcs.length) % srcs.length;
    big.style.transition = "none";
    big.style.transform = "none";
    big.src = srcs[cur];
  }
  box.addEventListener("click", closeFilm);
  document.addEventListener("keydown", e => {
    if (!box.classList.contains("on")) return;
    if (e.key === "Escape") closeFilm();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  box.addEventListener("touchstart", e => { swipeX = e.touches[0].clientX; }, {passive:true});
  box.addEventListener("touchend", e => {
    if (swipeX === null) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 50){ step(dx < 0 ? 1 : -1); e.preventDefault(); }
  }, {passive:false});
})();
