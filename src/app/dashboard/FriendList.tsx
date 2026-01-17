"use client"

import { useState } from "react"
import ChatWindow from "./ChatWindow"
import { formatLastActive, isOnline } from "@/lib/formatLastActive"
import styles from "./dashboard.module.css"

export default function FriendList({ friends, currentUserId }: { friends: any[], currentUserId: string }) {
    const [activeFriend, setActiveFriend] = useState<any | null>(null)

    return (
        <>
            <div className={styles.friendList}>
                {friends?.length === 0 ? (
                    <p className={styles.empty}>暂无好友</p>
                ) : (
                    friends?.map((f) => (
                        <div key={f.id} className={styles.friendItem} onClick={() => setActiveFriend(f)}>
                            <div className={styles.avatar}>
                                {f.name?.[0].toUpperCase()}
                            </div>
                            <div className={styles.friendInfo}>
                                <span className={styles.friendName}>{f.name}</span>
                                <span className={`${styles.statusBadge} ${isOnline(f.lastActiveAt) ? styles.online : ''}`}>
                                    {formatLastActive(f.lastActiveAt)}
                                </span>
                            </div>
                            <button className={styles.chatBtn}>聊天</button>
                        </div>
                    ))
                )}
            </div>

            {activeFriend && (
                <ChatWindow
                    friend={activeFriend}
                    currentUserId={currentUserId}
                    onClose={() => setActiveFriend(null)}
                />
            )}
        </>
    )
}
