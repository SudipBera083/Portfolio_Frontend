import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import config from "../data/data"

export default function ChatBot(){

const [isOpen,setIsOpen] = useState(false)

const [messages,setMessages] = useState([
{
id:1,
text:"Hey! 👋 I'm Sudip's AI assistant. Ask me anything about his work, skills, or availability.",
sender:"bot"
}
])

const [input,setInput] = useState("")
const [typing,setTyping] = useState(false)

const scrollRef = useRef(null)


useEffect(()=>{

if(scrollRef.current){
scrollRef.current.scrollTop = scrollRef.current.scrollHeight
}

},[messages,typing])



const handleSend = async()=>{

if(!input.trim()) return

const userMessage = input

setMessages(prev=>[
...prev,
{
id:Date.now(),
text:userMessage,
sender:"user"
}
])

setInput("")
setTyping(true)

try{

const res = await fetch(`${config.Base_URL}/api/chat/chat/`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({message:userMessage})
})

if(!res.ok){
throw new Error("Server error")
}

const result = await res.json()

setTyping(false)

setMessages(prev=>[
...prev,
{
id:Date.now()+1,
text:result.reply,
sender:"bot"
}
])

}catch(error){

setTyping(false)

setMessages(prev=>[
...prev,
{
id:Date.now()+1,
text:"⚠️ Unable to connect to the assistant.",
sender:"bot"
}
])

}

}



return(

<>

{/* FLOAT BUTTON */}

<motion.button
onClick={()=>setIsOpen(!isOpen)}
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center"
style={{
width:"56px",
height:"56px",
borderRadius:"16px",
border:"none",
background:"linear-gradient(135deg,#00fff2,#b14cff)",
boxShadow:"0 10px 30px rgba(0,255,242,0.25)",
color:"#030014",
fontSize:"20px",
cursor:"pointer"
}}
>
{isOpen ? "✕" : "💬"}
</motion.button>



{/* CHAT WINDOW */}

<AnimatePresence>

{isOpen && (

<motion.div
initial={{opacity:0,y:20,scale:0.9}}
animate={{opacity:1,y:0,scale:1}}
exit={{opacity:0,y:20,scale:0.9}}
transition={{duration:0.3}}
className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-[380px] z-50"
style={{
maxHeight:"80vh",
display:"flex",
flexDirection:"column",
borderRadius:"22px",
background:"linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))",
backdropFilter:"blur(40px)",
border:"1px solid rgba(255,255,255,0.08)",
boxShadow:"0 30px 80px rgba(0,0,0,0.6)"
}}
>



{/* HEADER */}

<div
className="px-4 py-3 flex items-center gap-3"
style={{
borderBottom:"1px solid rgba(255,255,255,0.06)"
}}
>

<div
style={{
width:"36px",
height:"36px",
borderRadius:"10px",
background:"linear-gradient(135deg,#00fff2,#b14cff)",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"bold",
color:"#030014"
}}
>
AI
</div>

<div>

<div style={{fontSize:"14px",fontWeight:"600",color:"white"}}>
Sudip's Assistant
</div>

<div style={{fontSize:"11px",color:"#00ff88"}}>
● Online
</div>

</div>

</div>



{/* MESSAGES */}

<div
ref={scrollRef}
className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
style={{maxHeight:"60vh"}}
>

{messages.map(msg=>(

<motion.div
key={msg.id}
initial={{opacity:0,y:10}}
animate={{opacity:1,y:0}}
className={`flex ${msg.sender==="user" ? "justify-end" : "justify-start"}`}
>

<div
style={{
maxWidth:"78%",
padding:"12px 16px",
marginLeft:msg.sender==="bot" ? "6px" : "0",
marginRight:msg.sender==="user" ? "6px" : "0",

borderRadius:
msg.sender==="user"
? "18px 18px 6px 18px"
: "18px 18px 18px 6px",

background:
msg.sender==="user"
? "linear-gradient(135deg,#00fff2,#4d7cff)"
: "rgba(255,255,255,0.08)",

color:
msg.sender==="user"
? "#030014"
: "#ffffff",

boxShadow:
msg.sender==="user"
? "0 6px 18px rgba(0,255,242,0.25)"
: "0 4px 14px rgba(0,0,0,0.35)",

backdropFilter:"blur(10px)",

fontSize:"13px",
lineHeight:"1.6",
whiteSpace:"pre-line",
wordBreak:"break-word"
}}
>

{msg.text}

</div>

</motion.div>

))}



{typing && (

<div
style={{
fontSize:"12px",
color:"#aaa",
marginLeft:"10px"
}}
>
Assistant is typing...
</div>

)}

</div>



{/* INPUT AREA */}

<div
className="px-3 py-3 flex items-center gap-2"
style={{
borderTop:"1px solid rgba(255,255,255,0.06)"
}}
>

<input
type="text"
value={input}
onChange={(e)=>setInput(e.target.value)}
onKeyDown={(e)=>e.key==="Enter" && handleSend()}
placeholder="Ask about projects, skills..."
style={{
flex:1,
background:"rgba(255,255,255,0.04)",
border:"1px solid rgba(255,255,255,0.08)",
borderRadius:"14px",
padding:"10px 14px",
fontSize:"14px",
color:"white",
outline:"none"
}}
/>


<motion.button
onClick={handleSend}
whileHover={{scale:1.08}}
whileTap={{scale:0.9}}
style={{
width:"42px",
height:"42px",
borderRadius:"12px",
border:"none",
background:"linear-gradient(135deg,#00fff2,#b14cff)",
color:"#030014",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontWeight:"bold",
cursor:"pointer",
boxShadow:"0 8px 20px rgba(0,255,242,0.25)"
}}
>
➤
</motion.button>

</div>

</motion.div>

)}

</AnimatePresence>

</>

)

}