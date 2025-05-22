"use client"

import { authClient } from "@/lib/auth"
import { Button } from "./ui/button"

export default function SignOut() {
    return (
        <Button variant={'destructive'} onClick={() => {
            authClient.signOut()
        }}>
            Sign Out
        </Button>
    )
}