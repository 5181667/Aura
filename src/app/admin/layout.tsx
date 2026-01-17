import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar"
import styles from "./admin.module.css"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        redirect('/dashboard')
    }

    return (
        <div className={styles.adminLayout}>
            <Navbar />
            <main className={styles.adminMain}>
                {children}
            </main>
        </div>
    )
}
