'use client'

import { type FormikProps, useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import useSWRMutation from 'swr/mutation'
import * as yup from 'yup'

interface UseVerify {
  formik: FormikProps<FormValues>
}

interface FormValues {
  token: string
}

export function useVerify(): UseVerify {
  const router = useRouter()
  const verify = async (url: string, { arg }: { arg: FormValues }) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: arg.token }),
    })
    if (!response.ok) {
      throw new Error(`Verification failed: ${response.status}`)
    }
    return response.json()
  }

  const { trigger } = useSWRMutation('/api/verify', verify)

  const formik = useFormik<FormValues>({
    initialValues: {
      token: '',
    },
    validationSchema: yup.object({
      token: yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        await trigger(values)
        router.push('verify/success')
      } catch (error) {
        router.push('verify/error')
      }
    },
  })

  return { formik }
}
