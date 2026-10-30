import * as THREE from 'three';
import './style.css';

const mount = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#17253a');
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(9, 8, 11);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9efff, 0x426047, 2.1));
const sun = new THREE.DirectionalLight(0xfff0d6, 3.1);
sun.position.set(-5, 12, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const world = new THREE.Group(); scene.add(world);
const groundMat = new THREE.MeshStandardMaterial({color:'#75b85e', roughness:1});
const ground = new THREE.Mesh(new THREE.CylinderGeometry(5.2,5.5,0.8,8), groundMat);
ground.position.y=-0.4; ground.receiveShadow=true; ground.castShadow=true; world.add(ground);
const soil = new THREE.Mesh(new THREE.CylinderGeometry(5.22,5.5,0.22,8), new THREE.MeshStandardMaterial({color:'#76533b'}));
soil.position.y=-0.89; soil.castShadow=true; world.add(soil);

function addTree(x,z,scale=1){
  const g=new THREE.Group();
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.17,.8,6),new THREE.MeshStandardMaterial({color:'#805536'}));trunk.position.y=.4;trunk.castShadow=true;g.add(trunk);
  const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.65,1),new THREE.MeshStandardMaterial({color:'#3f965b',roughness:1}));crown.position.y=1.15;crown.scale.set(1,1.05,1);crown.castShadow=true;g.add(crown);
  g.position.set(x,0,z);g.scale.setScalar(scale);world.add(g);return g;
}
function addHouse(x,z){
 const g=new THREE.Group();const wall=new THREE.Mesh(new THREE.BoxGeometry(1.1,.8,.9),new THREE.MeshStandardMaterial({color:'#e9d5a6'}));wall.position.y=.4;wall.castShadow=true;g.add(wall);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(.85,.65,4),new THREE.MeshStandardMaterial({color:'#bd684c'}));roof.position.y=1.12;roof.rotation.y=Math.PI/4;roof.castShadow=true;g.add(roof);g.position.set(x,0,z);world.add(g);return g;
}
function addRock(x,z){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.48,0),new THREE.MeshStandardMaterial({color:'#8d9a91'}));m.position.set(x,.28,z);m.scale.y=.7;m.castShadow=true;world.add(m);return m;}
function addFlower(x,z){const g=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.35,5),new THREE.MeshStandardMaterial({color:'#348d4f'}));stem.position.y=.17;g.add(stem);const bloom=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,1),new THREE.MeshStandardMaterial({color:'#f2a8cb'}));bloom.position.y=.39;g.add(bloom);g.position.set(x,0,z);world.add(g);return g;}
function addTower(x,z){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.34,.43,1.7,6),new THREE.MeshStandardMaterial({color:'#d9c9a5'}));b.position.y=.85;b.castShadow=true;g.add(b);const roof=new THREE.Mesh(new THREE.ConeGeometry(.48,.65,6),new THREE.MeshStandardMaterial({color:'#557d9e'}));roof.position.y=2;g.add(roof);g.position.set(x,0,z);world.add(g);return g;}
function addBridge(x,z){const g=new THREE.Group();const deck=new THREE.Mesh(new THREE.BoxGeometry(1.7,.13,.55),new THREE.MeshStandardMaterial({color:'#9a704b'}));deck.position.y=.12;deck.castShadow=true;g.add(deck);for(let i=-1;i<=1;i++){const rail=new THREE.Mesh(new THREE.BoxGeometry(.08,.35,.08),new THREE.MeshStandardMaterial({color:'#78563a'}));rail.position.set(i*.65,.28,-.23);g.add(rail)}g.position.set(x,0,z);world.add(g);return g;}
const initial=[[-2.8,-1.5],[-3.4,1.2],[-1.2,2.8],[1.9,2.5],[3.1,.7],[2.7,-2],[-.7,-3.1],[.6,1.1]];
initial.forEach(([x,z],i)=>addTree(x,z,.75+(i%3)*.12));
addHouse(-.8,-.8);addHouse(1.3,-1.1);addRock(-2,0);addFlower(2,1.6);addFlower(-1.7,2.2);addTower(.3,2.7);

let selected='tree', moves=3, objectCount=12, theme='green';
const utcDay=()=>new Date().toISOString().slice(0,10);
const savedDay=localStorage.getItem('everyone-day');
if(savedDay===utcDay()) moves=Number(localStorage.getItem('everyone-moves') ?? 3);
else {localStorage.setItem('everyone-day',utcDay());localStorage.setItem('everyone-moves','3');}
function updateMoves(){document.querySelector('#moves').textContent=`${moves} / 3`;document.querySelectorAll('.move-dots i').forEach((d,i)=>d.style.opacity=i<moves?'1':'.18');}
updateMoves();
document.querySelectorAll('.tool').forEach(btn=>btn.addEventListener('click',()=>{document.querySelector('.tool.active')?.classList.remove('active');btn.classList.add('active');selected=btn.dataset.tool;}));

const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
renderer.domElement.addEventListener('pointerdown',e=>{
 if(e.target!==renderer.domElement||moves<=0)return;
 const rect=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
 raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObject(ground)[0];if(!hit)return;
 const p=hit.point;if(Math.hypot(p.x,p.z)>4.7)return;
 const makers={tree:()=>addTree(p.x,p.z),house:()=>addHouse(p.x,p.z),tower:()=>addTower(p.x,p.z),rock:()=>addRock(p.x,p.z),flower:()=>addFlower(p.x,p.z),bridge:()=>addBridge(p.x,p.z)};
 makers[selected]();moves--;objectCount++;localStorage.setItem('everyone-moves',String(moves));updateMoves();document.querySelector('#objectCount').textContent=objectCount;
});
let dragging=false,lastX=0,lastY=0,rotation=0,tilt=0;
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;});
window.addEventListener('pointerup',()=>dragging=false);
window.addEventListener('pointermove',e=>{if(!dragging)return;rotation+=(e.clientX-lastX)*.006;tilt=Math.max(-.25,Math.min(.4,tilt+(e.clientY-lastY)*.003));lastX=e.clientX;lastY=e.clientY;world.rotation.y=rotation;camera.position.y=8+tilt*5;camera.lookAt(0,0,0);});
renderer.domElement.addEventListener('wheel',e=>{camera.position.multiplyScalar(e.deltaY>0?1.07:.93);camera.position.clampLength(8,24);camera.lookAt(0,0,0);},{passive:true});
document.querySelector('#zoomIn').onclick=()=>{camera.position.multiplyScalar(.88);camera.lookAt(0,0,0)};
document.querySelector('#zoomOut').onclick=()=>{camera.position.multiplyScalar(1.12);camera.lookAt(0,0,0)};
document.querySelector('#resetView').onclick=()=>{rotation=0;tilt=0;world.rotation.y=0;camera.position.set(9,8,11);camera.lookAt(0,0,0)};

function resize(){const w=mount.clientWidth,h=mount.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
new ResizeObserver(resize).observe(mount);resize();
function animate(){requestAnimationFrame(animate);renderer.render(scene,camera)}animate();

const modal=document.querySelector('#modal');
document.querySelector('#createWorld').onclick=()=>modal.classList.remove('hidden');
document.querySelector('#closeModal').onclick=()=>modal.classList.add('hidden');
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
document.querySelectorAll('.template').forEach(btn=>btn.onclick=()=>{document.querySelector('.template.selected')?.classList.remove('selected');btn.classList.add('selected');theme=btn.dataset.theme;});
document.querySelector('#startWorld').onclick=()=>{
 const name=document.querySelector('#worldName').value.trim()||'New Horizons';
 document.querySelector('.world-heading h2').textContent=name;
 document.querySelector('.scene-label').innerHTML=`<span class="live-pulse"></span> ${name.toUpperCase()} <span class="scene-divider">/</span> WORLD DRAFT`;
 const colors={green:['#75b85e','#76533b'],snow:['#c4e0e5','#7d9aa5'],desert:['#d8ad65','#9c6745']};
 ground.material.color.set(colors[theme][0]);soil.material.color.set(colors[theme][1]);
 modal.classList.add('hidden');
};
