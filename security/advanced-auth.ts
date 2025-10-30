"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import crypto from "crypto"
import { rateLimit } from "./rate-limiter"
import { auditLog } from "./audit-logger"
import { encryptSensitiveData, decryptSensitiveData } from "./encryption"

interface SecurityContext {
  user_id: string
  session_id: string
  ip_address: string
  user_agent: string
  security_clearance: number
  mfa_verified: boolean
  last_activity: Date
}

interface LoginAttempt {
  email: string
  ip_address: string
  user_agent: string
  success: boolean
  timestamp: Date
  failure_reason?: string
}

// Advanced rate limiting for authentication
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  keyGenerator: (ip: string, email?: string) => `auth:${ip}:${email || "unknown"}`,
})

// Generate secure session token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Hash password with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex")
}

// Generate MFA secret
function generateMFASecret(): string {
  return crypto.randomBytes(20).toString("base32")
}

// Advanced sign in with security features
export async function advancedSignIn(
  prevState: any,
  formData: FormData,
  clientInfo: { ip: string; userAgent: string },
) {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  const mfaCode = formData.get("mfa_code")?.toString()

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Check rate limiting
  const rateLimitResult = await authRateLimit(clientInfo.ip, email)
  if (!rateLimitResult.success) {
    await auditLog({
      event_type: "rate_limit_exceeded",
      user_email: email,
      ip_address: clientInfo.ip,
      details: { attempts: rateLimitResult.attempts },
      risk_score: 80,
    })
    return { error: "Too many login attempts. Please try again later." }
  }

  const supabase = createClient()

  try {
    // Attempt authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Log failed attempt
      await logLoginAttempt({
        email,
        ip_address: clientInfo.ip,
        user_agent: clientInfo.userAgent,
        success: false,
        timestamp: new Date(),
        failure_reason: authError.message,
      })

      await auditLog({
        event_type: "failed_login",
        user_email: email,
        ip_address: clientInfo.ip,
        details: { error: authError.message },
        risk_score: 60,
      })

      return { error: authError.message }
    }

    // Check if user exists in our security profiles
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single()

    if (profileError || !userProfile) {
      // Create security profile for new user
      await supabase.from("user_profiles").insert({
        user_id: authData.user.id,
        role: "user",
        security_clearance: 1,
        last_login: new Date().toISOString(),
      })
    } else {
      // Update last login and reset failed attempts
      await supabase
        .from("user_profiles")
        .update({
          last_login: new Date().toISOString(),
          failed_login_attempts: 0,
          account_locked: false,
        })
        .eq("user_id", authData.user.id)
    }

    // Check for MFA requirement
    if (userProfile?.security_clearance && userProfile.security_clearance > 2) {
      if (!mfaCode) {
        return {
          requireMFA: true,
          message: "Multi-factor authentication required",
          tempToken: generateSecureToken(),
        }
      }

      // Verify MFA code (simplified - in production, use proper TOTP verification)
      const isValidMFA = await verifyMFACode(authData.user.id, mfaCode)
      if (!isValidMFA) {
        await auditLog({
          event_type: "mfa_failure",
          user_id: authData.user.id,
          ip_address: clientInfo.ip,
          details: { provided_code: mfaCode },
          risk_score: 70,
        })
        return { error: "Invalid MFA code" }
      }
    }

    // Create secure session
    const sessionId = generateSecureToken()
    const securityContext: SecurityContext = {
      user_id: authData.user.id,
      session_id: sessionId,
      ip_address: clientInfo.ip,
      user_agent: clientInfo.userAgent,
      security_clearance: userProfile?.security_clearance || 1,
      mfa_verified: !!mfaCode,
      last_activity: new Date(),
    }

    // Store encrypted session data
    const encryptedSession = encryptSensitiveData(JSON.stringify(securityContext))
    cookies().set("security_session", encryptedSession, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 8 * 60 * 60, // 8 hours
    })

    // Log successful login
    await logLoginAttempt({
      email,
      ip_address: clientInfo.ip,
      user_agent: clientInfo.userAgent,
      success: true,
      timestamp: new Date(),
    })

    await auditLog({
      event_type: "successful_login",
      user_id: authData.user.id,
      ip_address: clientInfo.ip,
      details: {
        mfa_used: !!mfaCode,
        security_clearance: userProfile?.security_clearance || 1,
      },
      risk_score: 10,
    })

    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Advanced sign in error:", error)
    await auditLog({
      event_type: "login_system_error",
      user_email: email,
      ip_address: clientInfo.ip,
      details: { error: error instanceof Error ? error.message : "Unknown error" },
      risk_score: 50,
    })
    return { error: "Authentication system error. Please try again." }
  }
}

// Verify MFA code
async function verifyMFACode(userId: string, code: string): Promise<boolean> {
  // In production, implement proper TOTP verification
  // For demo purposes, accept any 6-digit code
  return /^\d{6}$/.test(code)
}

// Log login attempts for security monitoring
async function logLoginAttempt(attempt: LoginAttempt) {
  const supabase = createClient()

  await supabase.from("security_events").insert({
    event_type: attempt.success ? "login" : "failed_login",
    source_ip: attempt.ip_address,
    details: {
      email: attempt.email,
      user_agent: attempt.user_agent,
      success: attempt.success,
      failure_reason: attempt.failure_reason,
    },
    risk_score: attempt.success ? 10 : 60,
  })
}

// Get current security context
export async function getSecurityContext(): Promise<SecurityContext | null> {
  try {
    const sessionCookie = cookies().get("security_session")
    if (!sessionCookie) return null

    const decryptedSession = decryptSensitiveData(sessionCookie.value)
    return JSON.parse(decryptedSession) as SecurityContext
  } catch (error) {
    console.error("Error getting security context:", error)
    return null
  }
}

// Advanced sign out with security cleanup
export async function advancedSignOut() {
  const securityContext = await getSecurityContext()
  const supabase = createClient()

  if (securityContext) {
    await auditLog({
      event_type: "logout",
      user_id: securityContext.user_id,
      ip_address: securityContext.ip_address,
      details: { session_duration: Date.now() - securityContext.last_activity.getTime() },
      risk_score: 5,
    })
  }

  // Clear security session
  cookies().delete("security_session")

  // Sign out from Supabase
  await supabase.auth.signOut()

  redirect("/auth/login")
}

// Check access permissions
export async function checkAccess(requiredClearance: number): Promise<boolean> {
  const context = await getSecurityContext()
  if (!context) return false

  return context.security_clearance >= requiredClearance
}
