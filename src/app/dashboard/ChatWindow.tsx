"use client"

import { useState, useEffect, useRef } from "react"
import io from "socket.io-client"
import styles from "./chat.module.css"

let socket: any

export default function ChatWindow({ friend, currentUserId, onClose }: { friend: any, currentUserId: string, onClose: () => void }) {
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        socketInitializer()
        return () => {
            if (socket) socket.disconnect()
        }
    }, [])

    const socketInitializer = async () => {
        await fetch("/api/socket")
        socket = io()

        socket.on("connect", () => {
            console.log("connected")
            socket.emit("join-room", currentUserId)
        })

        socket.on("receive-message", (msg: any) => {
            if (msg.senderId === friend.id) {
                setMessages((prev) => [...prev, msg])
            }
        })
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const msg = {
            senderId: currentUserId,
            receiverId: friend.id,
            content: input,
            createdAt: new Date(),
        }

        socket.emit("send-message", msg)
        setMessages((prev) => [...prev, msg])
        setInput("")
    }

    return (
        <div className={`${styles.chatBox} glass`}>
            <div className={styles.chatHeader}>
                <span>与 {friend.name} 聊天中</span>
                <button onClick={onClose}>&times;</button>
            </div>

            <div className={styles.messageArea}>
                {messages.map((m, i) => (
                    <div key={i} className={`${styles.message} ${m.senderId === currentUserId ? styles.sent : styles.received}`}>
                        <div className={styles.msgBubble}>{m.content}</div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="输入消息..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">发送</button>
            </form>
        </div>
    )
}
