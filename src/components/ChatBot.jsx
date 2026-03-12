import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatBot() {

    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey! 👋 I'm Sudip's AI assistant. Ask me anything about his work, skills, or availability.",
            sender: 'bot'
        }
    ])

    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)

    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, typing])


    const handleSend = async () => {

        if (!input.trim()) return

        const userMessage = input

        const userMsg = {
            id: Date.now(),
            text: userMessage,
            sender: "user"
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")
        setTyping(true)

        try {

            const res = await fetch("http://127.0.0.1:8000/api/chat/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userMessage
                })
            })

            const data = await res.json()

            setTyping(false)

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: data.reply,
                    sender: "bot"
                }
            ])

        } catch (error) {

            setTyping(false)

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "⚠️ Unable to connect to the assistant. Please try again later.",
                    sender: "bot"
                }
            ])

        }
    }


    return (
        <>
            {/* FAB */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center border-none"
                style={{
                    background: 'linear-gradient(135deg, #00fff2, #b14cff)',
                    boxShadow: '0 8px 32px rgba(0,255,242,0.25)'
                }}
            >
                <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    className="text-xl"
                    style={{ color: '#030014' }}
                >
                    {isOpen ? '✕' : '💬'}
                </motion.span>
            </motion.button>


            {/* CHAT WINDOW */}
            <AnimatePresence>

                {isOpen && (

                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.92 }}
                        transition={{ duration: 0.35 }}
                        className="fixed bottom-24 right-6 z-50 w-[360px]"
                        style={{
                            maxHeight: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                            backdropFilter: 'blur(40px)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >

                        {/* HEADER */}
                        <div className="px-5 py-4 flex items-center gap-3"
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.04)'
                            }}
                        >

                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #00fff2, #b14cff)',
                                    color: '#030014'
                                }}
                            >
                                AI
                            </div>

                            <div>
                                <div className="text-sm font-bold text-white">
                                    Sudip's Assistant
                                </div>

                                <div className="text-[10px] text-green-400">
                                    ● Online
                                </div>
                            </div>

                        </div>


                        {/* MESSAGES */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
                            style={{ maxHeight: '320px' }}
                        >

                            {messages.map(msg => (

                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`max-w-[85%] px-4 py-3 text-[13px] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
                                    style={{
                                        borderRadius: msg.sender === 'user'
                                            ? '18px 18px 4px 18px'
                                            : '18px 18px 18px 4px',

                                        background: msg.sender === 'user'
                                            ? 'linear-gradient(135deg, #00fff2, #4d7cff)'
                                            : 'rgba(255,255,255,0.05)',

                                        color: msg.sender === 'user'
                                            ? '#030014'
                                            : 'white'
                                    }}
                                >
                                    {msg.text}
                                </motion.div>

                            ))}

                            {typing && (
                                <div className="text-xs text-gray-400">
                                    Assistant is typing...
                                </div>
                            )}

                        </div>


                        {/* INPUT */}
                        <div
                            className="p-3 flex gap-2"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                        >

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 input-field"
                            />

                            <motion.button
                                onClick={handleSend}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 rounded-xl border-none font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #00fff2, #b14cff)',
                                    color: '#030014'
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