const grid=document.querySelector('#project-grid');
const dialog=document.querySelector('#project-dialog');
const modalMedia=document.querySelector('#dialog-media');
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let currentProject=null,currentMedia=0;
const categoryNames={character:'PERSONAJES',programming:'PROGRAMACIÓN CREATIVA','3d':'MODELADO 3D',illustration:'ILUSTRACIÓN',photo:'FOTOGRAFÍA'};
function previewMarkup(project){
 if(project.empty)return '<div class="card-placeholder"><span>ESPACIO RESERVADO</span></div>';
 const first=project.media[0];
 if(first[0]==='video')return `<video class="card-video" muted loop playsinline preload="metadata"><source src="${first[1]}" type="video/mp4"></video><span class="play-badge" aria-hidden="true">▶</span>`;
 return `<img loading="lazy" src="${first[1]}" alt="${esc(first[2])}">`;
}
function renderProjects(filter='all'){
 const projects=portfolioProjects.filter(project=>filter==='all'||project.category===filter);
 grid.innerHTML=projects.map(project=>{const index=portfolioProjects.indexOf(project);return `<article class="project-card ${project.empty?'empty-project':''}" data-category="${project.category}">${project.empty?`<div class="project-preview">${previewMarkup(project)}<span class="category-badge">${project.label}</span></div><div class="project-caption"><h3>${project.title}</h3><p>Espacio reservado</p></div>`:`<button class="project-open" type="button" data-project="${index}" aria-label="Abrir ${esc(project.title)}"><span class="project-preview">${previewMarkup(project)}<span class="category-badge">${project.label}</span><span class="card-arrow">↗</span></span><span class="project-caption"><span><strong>${project.title}</strong></span></span></button>`}</article>`}).join('');
 grid.querySelectorAll('.card-video').forEach(video=>video.play().catch(()=>{}));
}
function fitDialogImage(img){
 const bounds=modalMedia.getBoundingClientRect();
 const maxWidth=Math.max(120,bounds.width-24);
 const maxHeight=Math.max(120,bounds.height-24);
 img.style.width='auto';img.style.height='auto';
 img.style.maxWidth=`${maxWidth}px`;img.style.maxHeight=`${maxHeight}px`;
 img.style.objectFit='contain';img.style.display='block';
}
function showMedia(){
 const project=currentProject;const item=project.media[currentMedia];modalMedia.innerHTML='';
 if(item[0]==='image'){const img=document.createElement('img');img.src=item[1];img.alt=item[2];modalMedia.append(img);img.addEventListener('load',()=>fitDialogImage(img),{once:true});requestAnimationFrame(()=>fitDialogImage(img))}
 else if(item[0]==='video'){const video=document.createElement('video');video.controls=true;video.autoplay=true;video.playsInline=true;video.src=item[1];video.setAttribute('aria-label',item[2]);modalMedia.append(video);video.play().catch(()=>{})}
 else {const link=document.createElement('a');link.className='unsupported-file';link.href=item[1];link.textContent=`Abrir o descargar ${item[2]} ↗`;link.target='_blank';link.rel='noopener';modalMedia.append(link)}
 document.querySelector('#media-count').textContent=`${currentMedia+1} / ${project.media.length}`;
 document.querySelector('.dialog-arrow.previous').disabled=currentMedia===0;
 document.querySelector('.dialog-arrow.next').disabled=currentMedia===project.media.length-1;
}
function openProject(index){
 currentProject=portfolioProjects[index];currentMedia=0;
 document.querySelector('#dialog-category').textContent=categoryNames[currentProject.category]||'';
 document.querySelector('#dialog-title').textContent=currentProject.title;
 document.querySelector('#dialog-description').textContent=currentProject.description;
 const tags=document.querySelector('#program-tags');
 tags.innerHTML=currentProject.programs.length?currentProject.programs.map(program=>`<span>${esc(program)}</span>`).join(''):'<span class="program-pending">Programas por añadir</span>';
 dialog.showModal();document.body.classList.add('modal-open');showMedia();
}
function closeDialog(){const video=modalMedia.querySelector('video');if(video)video.pause();dialog.close();document.body.classList.remove('modal-open')}
grid.addEventListener('click',event=>{const button=event.target.closest('[data-project]');if(button)openProject(Number(button.dataset.project))});
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-button').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');renderProjects(button.dataset.filter)}));
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
document.querySelector('.dialog-arrow.previous').addEventListener('click',()=>{if(currentMedia>0){currentMedia--;showMedia()}});
document.querySelector('.dialog-arrow.next').addEventListener('click',()=>{if(currentMedia<currentProject.media.length-1){currentMedia++;showMedia()}});
dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
document.addEventListener('keydown',event=>{if(!dialog.open)return;if(event.key==='ArrowLeft'&&currentMedia>0){currentMedia--;showMedia()}if(event.key==='ArrowRight'&&currentMedia<currentProject.media.length-1){currentMedia++;showMedia()}});
window.addEventListener('resize',()=>{if(dialog.open){const img=modalMedia.querySelector('img');if(img)fitDialogImage(img)}});
const siteHeader=document.querySelector('.site-header');const syncSiteHeader=()=>{siteHeader.classList.add('is-visible');siteHeader.inert=false};window.addEventListener('scroll',syncSiteHeader,{passive:true});syncSiteHeader();
const menuButton=document.querySelector('.menu-toggle');const nav=document.querySelector('.site-nav');menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('nav-open',!expanded)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('nav-open');menuButton.setAttribute('aria-expanded','false')}));
const copyEmailButton=document.querySelector('[data-copy-email]');
copyEmailButton.addEventListener('click',async()=>{const feedback=document.querySelector('.copy-feedback');try{await navigator.clipboard.writeText(copyEmailButton.dataset.copyEmail);feedback.textContent='¡Correo copiado!';copyEmailButton.textContent='Copiado'}catch{feedback.textContent='Selecciona el correo para copiarlo'}window.setTimeout(()=>{feedback.textContent='';copyEmailButton.textContent='Copiar correo'},2200)});
renderProjects();
