"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// 既存のformSchemaを更新
const formSchema = z.object({
  genre: z.string().min(1, {
    message: "募集ジャンルを入力してください",
  }),
  character: z.string().min(1, {
    message: "キャラクターを入力してください",
  }),
  date: z.date({
    required_error: "日程を選択してください",
  }),
  location: z.string({
    required_error: "場所を選択してください",
  }),
  recruitTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "少なくとも1つ選択してください",
  }),
  otherType: z.string().optional(),
  noteOptions: z.array(z.string()).optional(),
  customNotes: z.string().optional(),
})

const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
]

const recruitOptions = [
  { id: "cosplayer", label: "レイヤー" },
  { id: "photographer", label: "カメラマン" },
  { id: "assistant", label: "アシスタント" },
]

// 条件のオプションを追加
const noteOptions = [
  { id: "adults-only", label: "18歳以上の方" },
  { id: "adults-only2", label: "20歳以上の方" },
  { id: "onna", label: "女性の方" },
  { id: "otoko", label: "男性の方" },
  { id: "camera", label: "一眼レフ、ミラーレスカメラを所持してる方" },
  { id: "data-delivery", label: "データを1週間以内に送ってくれる方" },
  { id: "data-delivery2", label: "データを1ヶ月以内に送ってくれる方" },
  { id: "line", label: "LINEでやり取り可能な方" },
  { id: "dm", label: "DMでやり取り可能な方" },
  { id: "snsOK", label: "撮影データをSNSにあげてもいい方" },
  { id: "transportation", label: "交通費はご自身で負担できる方" },
  { id: "cancel", label: "緊急な事態が発生した場合以外ではドタキャンしない方" },
  { id: "contact", label: "音信不通にならない方" },
  { id: "pinto", label: "ピントが合わせられる方" },
  { id: "sakuhin", label: "作品の知識がある方" },
]

export function CosplayRecruitmentForm() {
  const [generatedText, setGeneratedText] = useState("")
  const [copied, setCopied] = useState(false)

  // フォーム初期値を更新
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: "",
      character: "",
      recruitTypes: [],
      noteOptions: [],
      customNotes: "",
    },
  })

  const watchRecruitTypes = form.watch("recruitTypes")
  const showOtherInput = watchRecruitTypes.includes("other")

  // onSubmit関数を更新
  function onSubmit(values: z.infer<typeof formSchema>) {
    // 募集する人の属性を整形
    let recruitTypesText = values.recruitTypes
      .filter((type) => type !== "other")
      .map((type) => {
        switch (type) {
          case "cosplayer":
            return "レイヤー"
          case "photographer":
            return "カメラマン"
          case "assistant":
            return "アシスタント"
          default:
            return type
        }
      })
      .join("、")

    if (showOtherInput && values.otherType) {
      recruitTypesText += recruitTypesText ? `、${values.otherType}` : values.otherType
    }

    // 日付をフォーマット
    const formattedDate = format(values.date, "yyyy年MM月dd日(E)", { locale: ja })

    // 条件を整形
    let notesText = ""

    // チェックボックスで選択された条件
    if (values.noteOptions && values.noteOptions.length > 0) {
      const selectedNotes = values.noteOptions
        .map((optionId) => {
          const option = noteOptions.find((opt) => opt.id === optionId)
          return option ? `・${option.label}` : ""
        })
        .filter(Boolean)

      notesText = selectedNotes.join("\n")
    }

    // カスタム条件があれば追加
    if (values.customNotes && values.customNotes.trim()) {
      notesText += notesText ? `\n・${values.customNotes}` : values.customNotes
    }

    // 募集文を生成
    const text = `【コスプレ合わせ募集】

■ジャンル：${values.genre}
■キャラクター：${values.character}
■日程：${formattedDate}
■場所：${values.location}
■募集：${recruitTypesText}
${notesText ? `■条件：\n${notesText}` : ""}

興味のある方はお気軽にお問い合わせください`

    setGeneratedText(text)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>募集ジャンル</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：鬼滅の刃、呪術廻戦、オリジナル など" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="character"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>キャラクター</FormLabel>
                  <FormControl>
                    <Textarea placeholder="例：炭治郎（募集中）、禰󠄀豆子（hogeさん）など" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日程</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日(E)", { locale: ja })
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ja}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>場所</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="都道府県を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prefectures.map((prefecture) => (
                        <SelectItem key={prefecture} value={prefecture}>
                          {prefecture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruitTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>募集する人の属性</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {recruitOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="recruitTypes"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(field.value?.filter((value) => value !== option.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  {showOtherInput && (
                    <FormField
                      control={form.control}
                      name="otherType"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormControl>
                            <Input placeholder="その他の属性を入力" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noteOptions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>条件</FormLabel>
                  </div>
                  <div className="grid gap-2 mb-4">
                    {noteOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="noteOptions"
                        render={({ field }) => {
                          return (
                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), option.id])
                                      : field.onChange(field.value?.filter((value) => value !== option.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormField
                    control={form.control}
                    name="customNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>追加の条件</FormLabel>
                        <FormControl>
                          <Textarea placeholder="その他の条件があれば入力してください" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              募集文を生成
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">生成された募集文</h2>
        <Card className="relative">
          <CardContent className="p-6">
            {generatedText ? (
              <>
                <pre className="whitespace-pre-wrap font-sans text-sm">{generatedText}</pre>
                <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">コピー</span>
                </Button>
                {copied && (
                  <div className="absolute top-2 right-12 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    コピーしました
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-center py-10">フォームに入力して募集文を生成してください</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
