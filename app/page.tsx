import { CosplayRecruitmentForm } from "@/components/cosplay-recruitment-form"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">コスプレあわせ募集文章作成ツール</h1>
      <p className="text-center mb-8 text-muted-foreground">
        以下のフォームに記入して合わせ募集文を自動生成します。<br />
        生成された文章は、TwitterやLINEなどで簡単にシェアOKです。<br />
        ぜひご活用ください！
      </p>
      <CosplayRecruitmentForm />
    </div>
  )
}
