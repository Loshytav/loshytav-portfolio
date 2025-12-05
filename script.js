/* Main interactive behaviors: GSAP scroll, Three.js particle background, contact UX */
document.addEventListener('DOMContentLoaded', function(){

  // lucide icons
  try{ if(window.lucide) lucide.createIcons(); }catch(e){}

  // Mobile button (placeholder)
  document.getElementById('mobileBtn')?.addEventListener('click', ()=> alert('Mobile menu - implement as needed'));

  // Press kit modal
  document.getElementById('pressKitBtn')?.addEventListener('click', ()=> document.getElementById('pressModal').classList.remove('hidden'));
  document.getElementById('closePress')?.addEventListener('click', ()=> document.getElementById('pressModal').classList.add('hidden'));
  document.getElementById('downloadPress')?.addEventListener('click', (e)=> { e.preventDefault(); alert('Press Kit download - add file to repo and update link.'); });

  // Contact form: UX + mailto fallback
  window.handleSubmit = function(e){
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent ✓';
    btn.disabled = true;
    const name = e.target.name?.value || '';
    const email = e.target.email?.value || '';
    const message = e.target.message?.value || '';
    setTimeout(()=>{ btn.textContent='Send Message'; btn.disabled=false; e.target.reset(); }, 2200);
    // mailto fallback
    window.location.href = `mailto:loshytav@gmail.com?subject=Portfolio%20Enquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nFrom: " + name + " - " + email)}`;
  };

  // GSAP animations
  try{
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      gsap.from('.glass-card',{opacity:0,y:30,duration:1,stagger:.12,scrollTrigger:{trigger:'.glass-card',start:'top 85%'}});
      gsap.from('h1',{opacity:0,x:-40,duration:1,delay:.2});
    }
  }catch(e){ console.warn('GSAP not available', e); }

  // Magnetic buttons
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX-rect.left-rect.width/2)/6;
      const dy = (e.clientY-rect.top-rect.height/2)/6;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', ()=> el.style.transform='translate(0,0)');
  });

  // THREE.js background particles
  function initThree(){
    try{
      const canvas = document.getElementById('hero-canvas');
      const renderer = new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
      camera.position.z = 50;
      renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(window.innerWidth,window.innerHeight);
      renderer.setClearColor(0x000000,0);

      const geometry = new THREE.BufferGeometry();
      const count = 1200;
      const positions = new Float32Array(count*3);
      for(let i=0;i<count*3;i++) positions[i] = (Math.random()-0.5)*160;
      geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
      const material = new THREE.PointsMaterial({color:0x00b4d8,size:0.6,transparent:true,opacity:0.9});
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      window.addEventListener('resize', ()=>{ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });

      let t=0;
      function animate(){ t+=0.002; points.rotation.y += 0.0008; renderer.render(scene,camera); requestAnimationFrame(animate); }
      animate();
    }catch(err){ console.warn('Three.js init failed', err); }
  }
  initThree();
});
