import { useState } from "react";
import { db } from "./firebase";

import {
doc,
getDoc,
collection,
getDocs
}
from "firebase/firestore";

function App(){

const [roll,setRoll]=useState("");
const [student,setStudent]=useState(null);
const [subjects,setSubjects]=useState({});
const [leaderboard,setLeaderboard]=useState([]);

async function searchStudent(){

const studentSnap=
await getDoc(
doc(db,"students",roll)
);

if(!studentSnap.exists()){

alert("Student not found");
return;

}

setStudent(
studentSnap.data()
);

const subSnap=
await getDocs(

collection(
db,
"students",
roll,
"subjects"
)

);

let temp={};

subSnap.forEach(

x=>{

temp[x.id]=x.data();

}

);

setSubjects(temp);

const allStudents=
await getDocs(
collection(
db,
"students"
)
);

let board=[];

allStudents.forEach(

s=>{

const d=s.data();

board.push({

name:d.name,

rank:d.overallRank,

total:d.overallTotal

});

}

);

board.sort(
(a,b)=>
a.rank-b.rank
);

setLeaderboard(
board.slice(0,10)
);

}

return(

<div style={{

minHeight:"100vh",

padding:"25px",

background:"#050505",

color:"white",

fontFamily:"Arial"

}}>

<h1 style={{

textAlign:"center",

fontSize:"42px",

color:"#ff7b00"

}}>

🎓 HBTU ScoreCard

</h1>

<p style={{

textAlign:"center",

color:"#aaa"

}}>

📚 Track • 🏆 Compare • 🚀 Improve

</p>

<div style={{

display:"flex",

justifyContent:"center",

gap:"10px",

marginTop:"20px",

flexWrap:"wrap"

}}>

<input

value={roll}

onChange={

e=>

setRoll(
e.target.value
)

}

placeholder=
"🔎 Enter Roll Number"

style={{

padding:"15px",

width:"300px",

background:"#111",

color:"white",

border:
"1px solid #ff7b00",

borderRadius:"15px"

}}

></input>

<button

onClick={
searchStudent
}

style={{

padding:"15px",

background:"#ff7b00",

border:"none",

borderRadius:"15px",

fontWeight:"bold"

}}

>

🚀 Search

</button>

</div>

{

student && (

<>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(350px,1fr))",

gap:"20px",

marginTop:"30px"

}}>

<div style={{

background:"#111",

padding:"25px",

borderRadius:"22px",

border:
"1px solid #ff7b00",

display:"flex",

flexDirection:"column",

gap:"18px"

}}>

<div>

<h2>

👤 {student.name}

</h2>

<h3>

🏆 Overall Rank

#{student.overallRank}

</h3>

<h3>

📈 Overall Score

{student.overallTotal}/400

</h3>

</div>

<hr style={{

borderColor:
"rgba(255,123,0,0.3)"

}}/>

<div>

<h3>

📚 Subjects :

{

Object.keys(
subjects
).length

}

</h3>

<h3>

🔥 Average :

{

(
student
.overallTotal

/

Object.keys(
subjects
).length

)

.toFixed(1)

}

/100

</h3>

<h3>

🎯 Best Subject :

{

Object.entries(
subjects
)

.sort(

(a,b)=>

b[1].total

-

a[1].total

)

[0]

?.[0]

||

"-"

}

</h3>

<h3>

⭐ Highest Marks :

{

Math.max(

...Object.values(
subjects
)

.map(

x=>

x.total

)

)

}

/100

</h3>

</div>

<hr style={{

borderColor:
"rgba(255,123,0,0.3)"

}}/>

<div>

<h3>

📊 Subject Performance

</h3>

{

Object.entries(
subjects
)

.map(

([sub,data])=>(

<div

key={sub}

style={{

marginBottom:
"14px"

}}

>

<div style={{

display:"flex",

justifyContent:
"space-between"

}}>

<span>

{sub}

</span>

<span>

{data.total}/100

</span>

</div>

<div style={{

width:"100%",

height:"8px",

background:"#222",

borderRadius:"20px",

marginTop:"5px"

}}>

<div style={{

width:

`${data.total}%`,

height:"100%",

background:
"#ff7b00",

borderRadius:
"20px"

}}>

</div>

</div>

</div>

)

)

}

</div>

</div>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(240px,1fr))",

gap:"15px"

}}>

{

Object.entries(
subjects
)

.map(

([sub,data])=>(

<div

key={sub}

style={{

background:"#111",

padding:"18px",

borderRadius:"20px",

border:
"1px solid rgba(255,123,0,0.4)"

}}

>

<h2 style={{

color:"#ff7b00"

}}>

📖 {sub}

</h2>

<hr/>

<div style={{

display:"flex",

justifyContent:
"space-between"

}}>

<span>Mid Sem I</span>

<span>{data.m1}/15</span>

</div>

<div style={{

display:"flex",

justifyContent:
"space-between",

marginTop:"8px"

}}>

<span>Mid Sem II</span>

<span>{data.m2}/15</span>

</div>

<div style={{

display:"flex",

justifyContent:
"space-between",

marginTop:"8px"

}}>

<span>End Sem</span>

<span>{data.end}/50</span>

</div>

<div style={{

display:"flex",

justifyContent:
"space-between",

marginTop:"8px"

}}>

<span>

Internal Assessment

</span>

<span>

{data.ia}/20

</span>

</div>

<hr style={{

marginTop:"12px"

}}/>

<div style={{

display:"flex",

justifyContent:
"space-between"

}}>

<b>

⭐ Total

</b>

<b>

{data.total}/100

</b>

</div>

<div style={{

display:"flex",

justifyContent:
"space-between",

marginTop:"8px"

}}>

<b>

🏆 Rank

</b>

<b>

#{data.rank}

</b>

</div>

</div>

)

)

}

</div>

</div>

<div style={{

marginTop:"35px"

}}>

<h2 style={{

color:"#ff7b00"

}}>

🏅 Top Performers

</h2>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(250px,1fr))",

gap:"12px"

}}>

{

leaderboard.map(

x=>(

<div

key={x.rank}

style={{

background:

x.rank===student.overallRank

?

"#ff7b00"

:

"#111",

padding:"15px",

borderRadius:"15px",

color:

x.rank===student.overallRank

?

"black"

:

"white"

}}

>

🥇 Rank #

{x.rank}

<br/>

{x.name}

<br/>

⭐ {x.total}

</div>

)

)

}

</div>

</div>

</>

)

}

</div>

);

}

export default App;