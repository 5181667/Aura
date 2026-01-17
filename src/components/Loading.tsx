"use client"

import { motion } from 'framer-motion'
import styles from './Loading.module.css'

export default function Loading({ fullScreen = false }: { fullScreen?: boolean }) {
    if (fullScreen) {
        return (
            <div className={styles.fullscreenOverlay}>
                <LoadingSpinner />
            </div>
        )
    }

    return <LoadingSpinner />
}

function LoadingSpinner() {
    return (
        <div className={styles.spinner}>
            <motion.div
                className={styles.circle}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className={styles.circle}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                }}
            />
            <motion.div
                className={styles.circle}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6
                }}
            />
        </div>
    )
}
