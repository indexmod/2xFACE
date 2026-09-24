'use strict';
(function(){
const defaults={background:'#000000',light:3.5,thickness:.052,fill:'#ffffff',edge:'#ffffff',holeSize:1,holes:[[-.57,.59],[.57,.59],[0,-.62]],speed:.16};
const state=Object.assign({},defaults,JSON.parse(localStorage.getItem('2xface-settings')||'{}'));
const canvas=document.getElementById('model'),renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);camera.position.z=6.9;const root=new THREE.Group();scene.add(root);
let key=new THREE.DirectionalLight(state.fill,state.light);key.position.set(4,6,5);scene.add(key);scene.add(new THREE.AmbientLight(0xffffff,.65));
const outline=new THREE.Shape();outline.absarc(0,0,1.5,0,Math.PI*2,false);const radii=[.31,.31,.38];state.holes.forEach((p,i)=>{const h=new THREE.Path();h.absarc(p[0],p[1],radii[i]*state.holeSize,0,Math.PI*2,true);outline.holes.push(h)});
const geo=new THREE.ExtrudeGeometry(outline,{depth:state.thickness,steps:1,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:2,curveSegments:96});geo.translate(0,0,-state.thickness/2);
const mat=new THREE.MeshStandardMaterial({color:state.fill,roughness:.48,metalness:0,side:THREE.DoubleSide});const a=new THREE.Mesh(geo,mat),b=new THREE.Mesh(geo,mat);b.rotation.y=Math.PI/2;root.add(a,b);scene.background=new THREE.Color(state.background);
let pitch=.19,yaw=.57,drag=false,x=0,y=0,last=performance.now();function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();canvas.onpointerdown=e=>{drag=true;x=e.clientX;y=e.clientY;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(!drag)return;yaw+=(e.clientX-x)*.006;pitch=Math.max(-1.35,Math.min(1.35,pitch+(e.clientY-y)*.006));x=e.clientX;y=e.clientY};canvas.onpointerup=()=>drag=false;canvas.onwheel=e=>{e.preventDefault();camera.position.z=Math.max(4.5,Math.min(11,camera.position.z+e.deltaY*.006))};function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(!drag)yaw+=state.speed*dt;root.rotation.set(pitch,yaw,0,'YXZ');renderer.render(scene,camera)}requestAnimationFrame(animate);
})();
