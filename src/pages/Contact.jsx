import { useState } from "react"
import { motion } from "framer-motion"

const contactInfo = [
{
icon:"📧",
title:"Email",
value:"sudipbera083@gmail.com",
link:"mailto:sudipbera083@gmail.com",
color:"#00fff2"
},
{
icon:"📍",
title:"Location",
value:"India",
link:null,
color:"#b14cff"
},
{
icon:"🔗",
title:"LinkedIn",
value:"linkedin.com/in/sudipbera083",
link:"https://www.linkedin.com/in/sudipbera083/",
color:"#4d7cff"
},
{
icon:"🐙",
title:"GitHub",
value:"github.com/SudipBera083",
link:"https://github.com/SudipBera083",
color:"#ff2d8a"
},
]

export default function Contact(){

const [form,setForm] = useState({
name:"",
email:"",
subject:"",
message:""
})

const [status,setStatus] = useState(null)
const [loading,setLoading] = useState(false)


const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}


const handleSubmit = async (e)=>{
e.preventDefault()

setLoading(true)

try{

const res = await fetch(
"http://127.0.0.1:8000/api/contact/send-message/",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
}
)

const data = await res.json()

if(res.ok){

setStatus("sent")

setForm({
name:"",
email:"",
subject:"",
message:""
})

}else{
setStatus("error")
}

}catch(err){
setStatus("error")
}

setLoading(false)

setTimeout(()=>{
setStatus(null)
},4000)

}


return(

<div className="relative z-10 min-h-screen pt-28">

<div className="section-container">

{/* HEADER */}

<motion.div
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.7}}
className="mb-16"
>

<div className="section-label">
<span className="glow-dot"/>
Contact
</div>

<h1 className="section-title">
<span className="text-gradient">Let's Build</span>{" "}
<span style={{color:"var(--color-text-primary)"}}>
Together
</span>
</h1>

<p className="section-desc">
Have a project idea or collaboration opportunity?
Let's connect and create something impactful.
</p>

</motion.div>


<div className="grid lg:grid-cols-5 gap-12">

{/* CONTACT FORM */}

<motion.div
initial={{opacity:0,x:-40}}
animate={{opacity:1,x:0}}
transition={{duration:0.7}}
className="lg:col-span-3"
>

<form
onSubmit={handleSubmit}
className="glass p-8 md:p-10"
style={{borderRadius:"24px"}}
>

<div className="grid sm:grid-cols-2 gap-5 mb-5">

<div>

<label className="block text-xs font-semibold uppercase mb-2">
Your Name
</label>

<input
type="text"
name="name"
value={form.name}
onChange={handleChange}
placeholder="John Doe"
required
className="input-field"
/>

</div>


<div>

<label className="block text-xs font-semibold uppercase mb-2">
Email
</label>

<input
type="email"
name="email"
value={form.email}
onChange={handleChange}
placeholder="john@company.com"
required
className="input-field"
/>

</div>

</div>


<div className="mb-5">

<label className="block text-xs font-semibold uppercase mb-2">
Subject
</label>

<input
type="text"
name="subject"
value={form.subject}
onChange={handleChange}
placeholder="Project Discussion"
required
className="input-field"
/>

</div>


<div className="mb-8">

<label className="block text-xs font-semibold uppercase mb-2">
Message
</label>

<textarea
name="message"
value={form.message}
onChange={handleChange}
placeholder="Tell me about your project..."
required
rows={6}
className="input-field resize-none"
/>

</div>


<motion.button
type="submit"
whileHover={{scale:1.02,y:-2}}
whileTap={{scale:0.98}}
className="btn-primary w-full justify-center text-base"
style={{padding:"1rem"}}
disabled={loading}
>

{loading ? "Sending..." : "Send Message"}

</motion.button>


{/* SUCCESS MESSAGE */}

{status==="sent" && (

<motion.div
initial={{opacity:0,y:10}}
animate={{opacity:1,y:0}}
className="mt-5 text-center text-sm font-semibold"
style={{color:"#00ff88"}}
>

✅ Message sent successfully. I'll respond within 24 hours.

</motion.div>

)}


{/* ERROR MESSAGE */}

{status==="error" && (

<motion.div
initial={{opacity:0,y:10}}
animate={{opacity:1,y:0}}
className="mt-5 text-center text-sm font-semibold"
style={{color:"#ff4d4f"}}
>

❌ Failed to send message. Please try again later.

</motion.div>

)}

</form>

</motion.div>


{/* CONTACT INFO */}

<motion.div
initial={{opacity:0,x:40}}
animate={{opacity:1,x:0}}
transition={{duration:0.7}}
className="lg:col-span-2 space-y-5"
>

{contactInfo.map((item,i)=>(
<motion.div
key={item.title}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{delay:i*0.1}}
className="glass p-5 flex items-center gap-4"
style={{borderRadius:"18px"}}
>

<div
className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
style={{
background:`${item.color}08`,
border:`1px solid ${item.color}15`
}}
>
{item.icon}
</div>

<div>

<div className="text-xs uppercase text-gray-400">
{item.title}
</div>

{item.link ? (

<a
href={item.link}
target="_blank"
rel="noopener noreferrer"
className="text-sm font-semibold text-white"
>

{item.value}

</a>

):(

<div className="text-sm font-semibold text-white">
{item.value}
</div>

)}

</div>

</motion.div>
))}

</motion.div>

</div>

</div>

</div>

)

}