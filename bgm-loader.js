
(function(){
var a=document.getElementById('bgm'),d=document.getElementById('bgm-data');
if(!a||!d)return;
function clean(){return d.textContent.split(/\s+/).join('')}
function fb(){if(a.getAttribute('data-fb'))return;a.setAttribute('data-fb','1');a.src='data:audio/mpeg;base64,'+clean()}
a.addEventListener('error',fb);
try{
var s=clean(),n=s.length,out=new Uint8Array(Math.ceil(n*3/4)),o=0,C=1048576,i,j,bin;
for(i=0;i<n;i+=C){bin=atob(s.slice(i,i+C));for(j=0;j<bin.length;j++)out[o++]=bin.charCodeAt(j)}
a.src=URL.createObjectURL(new Blob([out.subarray(0,o)],{type:'audio/mpeg'}));
a.setAttribute('data-src','embedded');
}catch(e){fb()}
})();
