'use client'

import { Turnstile } from 'next-turnstile'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { useVerify } from '@/services/hooks/verify'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Body />
    </Suspense>
  )
}

function Body() {
  const { formik } = useVerify()
  return (
    <main className="flex min-h-screen items-center justify-center ">
      <div className="p-10 rounded-4xl md:w-1/2 max-w-md border border-white/10">
        <div className="mx-auto">
          <h1 className="text-xl font-bold mb-4 text-center">認証を完了してください</h1>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-10">
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                onVerify={(token: string) => {
                  formik.setFieldValue('token', token)
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              認証する
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
