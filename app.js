let id;
let soal=[];
let current=0;
let jawaban=[];

async function login(){

 const nama=
 document.getElementById("nama").value;

 const res = await fetch("/login",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({nama})
 });

 const data = await res.json();

 id=data.id;
 soal=data.soal;

 document.getElementById("loginBox")
 .style.display="none";

 document.getElementById("user")
 .innerText=nama;

 document.documentElement.requestFullscreen();

 renderNav();
 tampilSoal(0);

}

function renderNav(){

 let html="";

 soal.forEach((_,i)=>{

  html+=`
   <button onclick="tampilSoal(${i})"
   id="nav${i}">
    ${i+1}
   </button>
  `;

 });

 document.getElementById("nav")
 .innerHTML=html;

}

function tampilSoal(i){

 current=i;

 document.querySelectorAll(".nav-grid button")
 .forEach(btn=>btn.classList.remove("active"));

 document.getElementById(`nav${i}`)
 .classList.add("active");

 let s=soal[i];

 document.getElementById("nomor")
 .innerText=`Soal ${i+1}`;

 document.getElementById("soal")
 .innerText=s.t;

 let html="";

 s.o.forEach(o=>{

  let selected =
  jawaban[i]===o ? "selected":"";

  html+=`
   <button class="${selected}"
   onclick="pilihJawaban('${o}')">
    ${o}
   </button>
  `;

 });

 document.getElementById("opsi")
 .innerHTML=html;

}

async function pilihJawaban(o){

 jawaban[current]=o;

 await fetch("/jawab",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({
   id,
   index:current,
   jawaban:o
  })
 });

 tampilSoal(current);

}

async function submitUjian(){

 const res = await fetch("/submit",{
  method:"POST",
  headers:{
   "Content-Type":"application/json"
  },
  body:JSON.stringify({id})
 });

 const data = await res.json();

 localStorage.setItem(
  "hasil",
  JSON.stringify(data)
 );

 window.location.href="result.html";

}

let waktu=3600;

setInterval(()=>{

 let menit=Math.floor(waktu/60);
 let detik=waktu%60;

 document.getElementById("timer")
 .innerText=
 `${menit}:${detik<10?'0':''}${detik}`;

 waktu--;

 if(waktu<=0){
  submitUjian();
 }

},1000);

document.addEventListener(
"visibilitychange",()=>{

 if(document.hidden){
  alert(
   "Peringatan: Jangan keluar dari halaman ujian!"
  );
 }

});

document.addEventListener(
"contextmenu",
e=>e.preventDefault()
);