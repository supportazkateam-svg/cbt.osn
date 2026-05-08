const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let users = {};

const bankSoal = [
 {
  t:"Planet terpanas dalam tata surya adalah...",
  o:["Merkurius","Venus","Mars","Jupiter"],
  j:"Venus"
 },
 {
  t:"Rumus luas lingkaran adalah...",
  o:["πr²","2πr","πd","r²"],
  j:"πr²"
 },
 {
  t:"Planet terbesar adalah...",
  o:["Mars","Bumi","Jupiter","Saturnus"],
  j:"Jupiter"
 },
 {
  t:"Satuan gaya adalah...",
  o:["Newton","Joule","Pascal","Watt"],
  j:"Newton"
 }
];

// SHUFFLE SOAL
function shuffle(arr){
 return arr.sort(()=>Math.random()-0.5);
}

// LOGIN
app.post("/login",(req,res)=>{

 const {nama}=req.body;

 const id=Date.now().toString();

 const soal = shuffle([...bankSoal]).map(s=>({
  ...s,
  o:shuffle([...s.o])
 }));

 users[id]={
  nama,
  soal,
  jawaban:[]
 };

 res.json({
  id,
  soal
 });

});

// SIMPAN JAWABAN
app.post("/jawab",(req,res)=>{

 const {id,index,jawaban}=req.body;

 if(users[id]){
  users[id].jawaban[index]=jawaban;
 }

 res.sendStatus(200);

});

// SUBMIT
app.post("/submit",(req,res)=>{

 const {id}=req.body;

 const user=users[id];

 let skor=0;

 user.soal.forEach((s,i)=>{
  if(user.jawaban[i]===s.j){
   skor++;
  }
 });

 const nilai=
 Math.round((skor/user.soal.length)*100);

 res.json({
  nama:user.nama,
  skor,
  nilai
 });

});

app.listen(3000,()=>{
 console.log("CBT Online berjalan di port 3000");
});