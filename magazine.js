(function () {
'use strict';
var titles=['Cover','Contents','About me','What is EKSTAZ?','Automobiles','Art','Artistic expression','Different perspectives','Perseverance','Finding order','You and your ego','Mindwise','Daniel Arsham','Jordan Peterson','Chaos and order','Philosophy','Back cover'];
var image=document.getElementById('magazine-page'), select=document.getElementById('page-select'), previous=document.getElementById('previous'), next=document.getElementById('next'), zoom=document.getElementById('zoom'), frame=document.getElementById('page-frame'), error=document.getElementById('page-error'), page=1;
titles.forEach(function(title,i){var option=document.createElement('option');option.value=i+1;option.textContent=(i+1)+' / 17 · '+title;select.appendChild(option);});
function render(){
var requested=Number(new URLSearchParams(location.search).get('page'));
page=Number.isInteger(requested)&&requested>=1&&requested<=titles.length?requested:1;
var padded=String(page).padStart(2,'0');error.hidden=true;
image.srcset='assets/publications/page-'+padded+'-sm.webp 840w, assets/publications/page-'+padded+'.webp 1680w';
image.src='assets/publications/page-'+padded+'.webp';image.alt='EKSTAZ magazine, December 2021 — page '+page+', '+titles[page-1];
select.value=page;previous.disabled=page===1;next.disabled=page===titles.length;
document.getElementById('page-status').textContent='Page '+page+' of 17 — '+titles[page-1];frame.scrollLeft=0;frame.scrollTop=0;
}
function go(value){if(value<1||value>titles.length)return;var url=new URL(location.href);url.searchParams.set('page',value);history.pushState(null,'',url);render();}
select.addEventListener('change',function(){go(Number(select.value));});previous.addEventListener('click',function(){go(page-1);});next.addEventListener('click',function(){go(page+1);});
zoom.addEventListener('click',function(){var zoomed=frame.classList.toggle('zoomed');zoom.setAttribute('aria-pressed',String(zoomed));zoom.textContent=zoomed?'Fit':'Zoom';image.sizes=zoomed?'1520px':'(min-width: 900px) 760px, 100vw';});
image.addEventListener('error',function(){error.hidden=false;});image.addEventListener('load',function(){error.hidden=true;});
document.addEventListener('keydown',function(event){if(event.target.closest('select, input, textarea, button, a'))return;if(event.key==='ArrowLeft'){event.preventDefault();go(page-1);}if(event.key==='ArrowRight'){event.preventDefault();go(page+1);}});
window.addEventListener('popstate',render);render();document.querySelector('.reader-controls').hidden=false;
})();
