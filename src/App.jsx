import { useState } from "react";
import { motion } from "framer-motion";

import { db } from "./firebase";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "firebase/firestore";

function App() {

  const [roll, setRoll] = useState("");
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchStudent() {

    setLoading(true);

    const studentSnap =
      await getDoc(
        doc(db, "students", roll)
      );

    if (!studentSnap.exists()) {

      alert("Student not found");

      setLoading(false);

      return;

    }

    setStudent(studentSnap.data());

    const subSnap =
      await getDocs(
        collection(
          db,
          "students",
          roll,
          "subjects"
        )
      );

    let temp = {};

    subSnap.forEach(x => {

      temp[x.id] = x.data();

    });

    setSubjects(temp);

    const all =
      await getDocs(
        collection(
          db,
          "students"
        )
      );

    let board = [];

    all.forEach(s => {

      const d = s.data();

      board.push({

        name: d.name,

        rank: d.overallRank,

        total: d.overallTotal

      });

    });

    board.sort(
      (a, b) =>
        a.rank - b.rank
    );

    setLeaderboard(
      board.slice(0, 10)
    );

    setLoading(false);

  }

  return (

<div style={{

minHeight:"100vh",

background:
"linear-gradient(180deg,#050505,#0b0907,#12100d)",

padding:"20px",

color:"white",

fontFamily:
"'Poppins',sans-serif"

}}>

<motion.div

initial={{
opacity:0,
y:-20
}}

animate={{
opacity:1,
y:0
}}

style={{

maxWidth:"1250px",

margin:"auto",

background:
"rgba(18,18,18,.78)",

backdropFilter:
"blur(14px)",

padding:
"clamp(28px,5vw,50px)",

borderRadius:"34px",

border:
"1px solid rgba(255,179,71,.08)",

boxShadow:
"0 0 50px rgba(255,140,40,.08)",

overflow:"hidden"

}}

>

<h1 style={{

fontSize:
"clamp(34px,7vw,60px)",

fontWeight:"800",

lineHeight:"1.3",

margin:"0 0 16px 0",

letterSpacing:"-.5px",

textShadow:
"0 0 25px rgba(255,179,71,.15)",

background:
"linear-gradient(90deg,#ffffff,#ffb347,#ff8c42)",

WebkitBackgroundClip:
"text",

WebkitTextFillColor:
"transparent"

}}>

🎓 HBTU ScoreCard

</h1>

<p style={{

color:"#9b9b9b",

fontWeight:"500",

fontSize:"15px",

letterSpacing:".3px",

marginBottom:"28px"

}}>

📚 Academic Dashboard • 🏆 Rank Tracker • 🚀 Insights

</p>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(240px,1fr))",

gap:"14px"

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

padding:"18px",

background:"#111",

border:
"1px solid rgba(255,179,71,.12)",

borderRadius:"20px",

color:"white",

outline:"none",

fontSize:"15px",

fontFamily:
"'Poppins',sans-serif"

}}

></input>

<motion.button

whileHover={{
y:-2
}}

whileTap={{
scale:.98
}}

onClick={
searchStudent
}

style={{

padding:"18px",

background:
"linear-gradient(135deg,#ff8c42,#ffb347)",

border:"none",

borderRadius:"20px",

fontWeight:"700",

fontSize:"15px",

cursor:"pointer",

color:"#111",

fontFamily:
"'Poppins',sans-serif"

}}

>

{

loading

?

"🔄 Searching"

:

"🚀 Search"

}

</motion.button>

</div>

</motion.div>

{

student && (

<>

<div style={{

maxWidth:"1250px",

margin:"26px auto",

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(320px,1fr))",

gap:"20px"

}}>

<motion.div

whileHover={{
y:-3
}}

style={{

background:
"linear-gradient(145deg,#111111,#1b1b1b)",

padding:"30px",

borderRadius:"30px",

border:
"1px solid rgba(255,179,71,.05)",

cursor:"pointer"

}}

>

<h2 style={{

fontSize:"30px",

fontWeight:"700",

marginBottom:"10px"

}}>

👤 {student.name}

</h2>

<div style={{

display:"flex",

gap:"10px",

flexWrap:"wrap",

marginTop:"18px"

}}>

<Chip>🏆 Rank #{student.overallRank}</Chip>

<Chip>📈 {student.overallTotal}/400</Chip>

<Chip>

📚 {

Object.keys(
subjects
).length

}

<span> Subjects</span>

</Chip>

</div>

<h3 style={{

marginTop:"30px",

fontWeight:"600"

}}>

📊 Performance

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

marginTop:"18px"

}}

>

<Row
l={sub}
v={`${data.total}/100`}
/>

<div style={{

height:"10px",

background:"#222",

borderRadius:"20px",

marginTop:"8px"

}}>

<motion.div

initial={{
width:0
}}

animate={{
width:
`${data.total}%`
}}

transition={{
duration:1
}}

style={{

height:"100%",

background:
"linear-gradient(90deg,#ff8c42,#ffb347)",

borderRadius:"20px"

}}

>

</motion.div>

</div>

</div>

)

)

}

</motion.div>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(240px,1fr))",

gap:"18px"

}}>

{

Object.entries(
subjects
)

.map(

([sub,data])=>(

<motion.div

key={sub}

whileHover={{
y:-3
}}

style={{

background:
"linear-gradient(145deg,#111111,#1b1b1b)",

padding:"24px",

borderRadius:"26px",

border:
"1px solid rgba(255,179,71,.05)",

cursor:"pointer"

}}

>

<h2 style={{

color:"#ffb347",

fontWeight:"700",

fontSize:"24px"

}}>

📖 {sub}

</h2>

<hr style={{
borderColor:"#222"
}}/>

<Row l="📝 Mid Sem I" v={`${data.m1}/15`} />

<Row l="📝 Mid Sem II" v={`${data.m2}/15`} />

<Row l="📚 End Sem" v={`${data.end}/50`} />

<Row l="🏫 IA" v={`${data.ia}/20`} />

<hr style={{
borderColor:"#222"
}}/>

<Row l="⭐ Total" v={`${data.total}/100`} />

<Row l="🏆 Rank" v={`#${data.rank}`} />

</motion.div>

)

)

}

</div>

</div>

<div style={{

maxWidth:"1250px",

margin:"42px auto"

}}>

<h2 style={{

fontWeight:"700",

marginBottom:"18px"

}}>

🏅 Top Performers

</h2>

<div style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",

gap:"14px"

}}>

{

leaderboard.map(
x=>(

<motion.div

key={x.rank}

whileHover={{
y:-3
}}

style={{

background:

x.rank===student.overallRank

?

"linear-gradient(135deg,#ff8c42,#ffb347)"

:

"linear-gradient(145deg,#111111,#1b1b1b)",

padding:"20px",

borderRadius:"22px",

cursor:"pointer",

color:

x.rank===student.overallRank

?

"#111"

:

"white"

}}

>

🥇 Rank #{x.rank}

<br/>

👤 {x.name}

<br/>

⭐ {x.total}

</motion.div>

)

)

}

</div>

</div>

<div style={{

textAlign:"center",

padding:"34px",

color:"#777",

fontSize:"14px"

}}>

⚡ Built with React + Firebase

<br/>

🧑‍💻 @itsdivyanshuno

</div>

</>

)

}

</div>

);

}

function Chip({children}){

return(

<div style={{

background:"#1c1c1c",

padding:"10px 15px",

borderRadius:"14px",

border:
"1px solid rgba(255,179,71,.08)",

fontWeight:"600",

fontSize:"14px",

letterSpacing:".2px"

}}>

{children}

</div>

);

}

function Row({l,v}){

return(

<div style={{

display:"flex",

justifyContent:
"space-between",

marginBottom:"12px"

}}>

<span style={{

fontWeight:"500",

color:"#d0d0d0"

}}>

{l}

</span>

<span style={{

fontWeight:"600",

color:"#fff"

}}>

{v}

</span>

</div>

);

}

export default App;
