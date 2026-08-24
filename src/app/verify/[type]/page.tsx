interface Params {
  type: 'success' | 'error'
}

interface Props {
  params: Promise<Params>
}
export default async function Page({ params }: Props) {
  const { type } = await params
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="p-10 rounded-4xl md:w-1/2 max-w-md border border-white/10">
        <div className="mx-auto">
          <h1 className="text-xl font-bold mb-4 text-center">
            {type === 'success' ? '認証に成功しました' : 'エラーが発生しました'}
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            {type === 'success'
              ? 'この画面を閉じて構いません'
              : '認証処理中にエラーが発生しました。'}
          </p>
        </div>
      </div>
    </main>
  )
}
