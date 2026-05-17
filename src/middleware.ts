import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Protect Admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        
        // Fetch role from public.profiles
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profileError || profile?.role?.toLowerCase() !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 2. Protect Business Dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check subscription expiry — skip for admin users
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, subscription_status, expiry_date')
            .eq('id', user.id)
            .single()

        // Only check expiry for non-admin business accounts
        if (profile && profile.role?.toLowerCase() !== 'admin') {
            const isExpired = profile.expiry_date ? new Date(profile.expiry_date) < new Date() : false
            const isBlocked = profile.subscription_status?.toLowerCase() === 'blocked'
            const isPendingOrExpired = isBlocked || isExpired

            if (isPendingOrExpired) {
                // Avoid infinite redirect loop if already on /dashboard or on upgrade pages
                const isDashboardRoot = request.nextUrl.pathname === '/dashboard'
                const isUpgradePage = request.nextUrl.pathname.includes('/upgrade')

                if (!isDashboardRoot && !isUpgradePage) {
                    return NextResponse.redirect(new URL('/dashboard?expired=true', request.url))
                }
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
