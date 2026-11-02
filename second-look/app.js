(() => {
'use strict';
const steps=[...document.querySelectorAll('[data-step]')],progress=[...document.querySelectorAll('.progress button')];
const outside=document.getElementById('outside'),inside=document.getElementById('inside'),error=document.getElementById('form-error'),status=document.getElementById('save-status');
let detail='',imageBlob=null,imageUrl=null;
function valid(){return !!(outside.value.trim()||inside.value.trim());}
function show(index,push=true){
 if(index<0||index>3)return;
 if(index===3&&!valid())index=2;
 steps.forEach((s,i)=>{s.hidden=i!==index;s.classList.toggle('entering',i===index);});
 progress.forEach((b,i)=>{b.classList.toggle('complete',i<index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');if(i===3)b.disabled=!valid();});
 const first=detail==='Something else'?'Something else caught your eye first.':detail?'You noticed '+detail.toLowerCase()+' first.':'';
 const nb=document.getElementById('noticed-bridge');nb.hidden=!first;nb.textContent=first?first+' See what you notice first in one moment of today.':'';
 const nr=document.getElementById('noticed-result');nr.hidden=!first;nr.textContent=first;
 const noticed=document.getElementById('noticed');noticed.hidden=!detail;noticed.textContent=detail==='Something else'?'Something else caught your eye.':detail?'First noticed: '+detail.toLowerCase()+'.':'';
 if(index===3){const o=outside.value.trim(),i=inside.value.trim();document.getElementById('outside-result').textContent=o;document.getElementById('inside-result').textContent=i;['outside-label','outside-result'].forEach(id=>document.getElementById(id).hidden=!o);['inside-label','inside-result'].forEach(id=>document.getElementById(id).hidden=!i);document.getElementById('result-rule').hidden=!(o&&i);}
 if(push)history.pushState({secondLook:index},'','#'+['look','reading','moment','keep'][index]);
 window.scrollTo({top:0,behavior:'instant'});steps[index].querySelector('h1').focus({preventScroll:true});
}
history.replaceState({secondLook:0},'','#look');
window.addEventListener('popstate',e=>show(Number.isInteger(e.state?.secondLook)?e.state.secondLook:0,false));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.go))));
document.querySelectorAll('[data-detail]').forEach(b=>b.addEventListener('click',()=>{detail=b.dataset.detail;show(1);}));
const dialog=document.getElementById('art-dialog');
document.querySelectorAll('.art-open').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));
document.getElementById('close-art').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const exampleToggle=document.getElementById('example-toggle');
exampleToggle.addEventListener('click',()=>{const ex=document.getElementById('example');ex.hidden=!ex.hidden;exampleToggle.setAttribute('aria-expanded',String(!ex.hidden));exampleToggle.textContent=ex.hidden?'Need a way in?':'Hide';});
function resetImage(){if(imageUrl)URL.revokeObjectURL(imageUrl);imageBlob=imageUrl=null;document.getElementById('saved-preview').hidden=true;status.textContent='';progress[3].disabled=!valid();error.hidden=true;}
outside.addEventListener('input',resetImage);inside.addEventListener('input',resetImage);
document.getElementById('use-example').addEventListener('click',()=>{outside.value='A quiet bus ride';inside.value='The first bit of silence I had all day.';resetImage();outside.focus();});
document.getElementById('moment-form').addEventListener('submit',e=>{e.preventDefault();if(!valid()){error.textContent='Write a few words in at least one line, or open “Need a way in?” below.';error.hidden=false;(outside.value.trim()?inside:outside).focus();return;}error.hidden=true;show(3);});
function wrap(ctx,text,maxWidth){const lines=[];for(const paragraph of text.split(/\n/)){let line='';for(const word of paragraph.split(/\s+/)){const trial=line?line+' '+word:word;if(ctx.measureText(trial).width<=maxWidth){line=trial;continue;}if(line){lines.push(line);line='';}for(const char of Array.from(word)){if(ctx.measureText(line+char).width>maxWidth&&line){lines.push(line);line='';}line+=char;}}lines.push(line);}return lines;}
async function makeImage(){
 if(imageBlob)return imageBlob;
 const o=outside.value.trim(),i=inside.value.trim();
 const canvas=document.createElement('canvas');canvas.width=1080;let ctx=canvas.getContext('2d');ctx.font='72px Georgia, serif';
 const first=o?wrap(ctx,o,860):[],second=i?wrap(ctx,i,860):[];
 const blocks=(o?1:0)+(i?1:0);
 canvas.height=Math.max(900,330+blocks*190+(first.length+second.length)*90+(blocks===2?60:0)+(detail?60:0)+170);ctx=canvas.getContext('2d');ctx.fillStyle='#050505';ctx.fillRect(0,0,1080,canvas.height);
 const logo=document.querySelector('.logo');if(logo.complete&&logo.naturalWidth)ctx.drawImage(logo,110,80,190,190*logo.naturalHeight/logo.naturalWidth);
 let y=270;
 function draw(lines,text){const rtl=/^[\s\u200e\u200f]*[\u0590-\u08ff]/u.test(text);ctx.direction=rtl?'rtl':'ltr';ctx.textAlign=rtl?'right':'left';for(const line of lines){ctx.fillText(line,rtl?970:110,y);y+=90;}ctx.direction='ltr';ctx.textAlign='left';}
 function block(label,lines,text){ctx.font='28px monospace';ctx.fillStyle='#f5f2ee';ctx.fillText(label,110,y);y+=95;ctx.font='72px Georgia, serif';draw(lines,text);}
 if(o)block('From the outside',first,o);
 if(o&&i){y+=30;ctx.fillStyle='#e10600';ctx.fillRect(110,y,860,2);y+=95;}
 if(i)block('Up close',second,i);
 ctx.font='25px monospace';ctx.fillStyle='#c1bdb8';if(detail){ctx.fillText(detail==='Something else'?'In Falling, something else caught my eye first.':'In Falling, I noticed '+detail.toLowerCase()+' first.',110,canvas.height-150);}ctx.fillText('A second look. Words chosen by you.',110,canvas.height-100);
 imageBlob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not create image')),'image/png'));return imageBlob;
}
document.getElementById('save').addEventListener('click',async()=>{
 const b=document.getElementById('save');b.disabled=true;status.textContent='Preparing your image…';
 try{const blob=await makeImage();if(!imageUrl)imageUrl=URL.createObjectURL(blob);document.getElementById('saved-image').src=imageUrl;document.getElementById('download').href=imageUrl;document.getElementById('saved-preview').hidden=false;const file=new File([blob],'EKSTAZ-my-second-look.png',{type:'image/png'});document.getElementById('share').hidden=!(navigator.canShare&&navigator.canShare({files:[file]}));status.textContent='Your image is ready below. Save it whenever you like.';document.getElementById('saved-preview').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
 catch(err){status.textContent='The image could not be created. Your words are still here; try again or take a screenshot.';}
 finally{b.disabled=false;}
});
document.getElementById('share').addEventListener('click',async()=>{try{const blob=await makeImage();await navigator.share({files:[new File([blob],'EKSTAZ-my-second-look.png',{type:'image/png'})]});}catch(err){if(err.name!=='AbortError')status.textContent='Sharing is unavailable here. You can download or touch and hold the image instead.';}});
})();
