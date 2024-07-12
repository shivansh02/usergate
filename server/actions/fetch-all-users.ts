"use server"

import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { users } from "../schema"
import { z } from "zod"

const action = createSafeActionClient()

const EmptySchema = z.object({})

export const fetchAllUsers = action(
  EmptySchema,
  async () => {
    try {
      const allUsers = await db.query.users.findMany({})

      return { success: true, data: allUsers }
    } catch (error) {
      console.error("Error fetching users:", error)
      return { success: false, error: "Failed to fetch users" }
    }
  }
)
