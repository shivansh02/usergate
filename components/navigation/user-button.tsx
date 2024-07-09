"use client"
import {Session} from "next-auth"

export const UserButton = ({user}:Session) => {
    return (
        <div>
            <h1>
                {user?.email}
            </h1>
        </div>
    )
}
