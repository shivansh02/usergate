"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { newVerification } from "@/server/actions/tokens"
import { useCallback, useEffect, useState } from "react"
import { AuthCard } from "./auth-card"
import { FormSuccess } from "./form-success"
import { FormError } from "./form-error"

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token")
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleVerification = useCallback(() => {
    if (success || error) return
    if (!token) {
      setError("No token found")
      return
    }
    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error)
      }
      if (data.success) {
        setSuccess(data.success)
        router.push("/auth/login")
      }
    })
  }, [])

  useEffect(() => {
    handleVerification()
  }, [])

  return (
    <div className="flex flex-row dark">
    <div className="h-screen w-1/2 bg-secondary flex items-start justify-start text-left p-4">
      <h1 className="text-xl font-bold text-foreground">Usergate</h1>

    </div>
    <div className="w-1/2 bg-primary">
    <AuthCard
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      cardTitle="Verify your account"
    >
      <div className="flex items-center flex-col w-full justify-center">
        <p>{!success && !error ? "Verifying email..." : null}</p>
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthCard>
    </div>
    </div>
  )
}