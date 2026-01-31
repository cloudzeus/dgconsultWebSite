"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { handleSignOut } from "./actions"

export function LogoutButton() {
    return (
        <form action={handleSignOut}>
            <Button
                type="submit"
                variant="outline"
                className="w-full justify-start text-gray-700 hover:bg-gray-100"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Αποσύνδεση
            </Button>
        </form>
    )
}
