"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const result = await response.json()

      if (result.success) {
        // Store auth token in localStorage
        localStorage.setItem("admin_token", result.token)
        router.push("/idareetme")
      } else {
        setError("Yanlış parol")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Giriş xətası")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/sba-logo.webp"
              alt="Supply Base Azerbaijan"
              width={80}
              height={48}
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Admin Girişi</span>
          </CardTitle>
          <CardDescription>İdarəetmə panelinə daxil olmaq üçün parolunuzu daxil edin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin parolunu daxil edin"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Giriş edilir..." : "Daxil ol"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
