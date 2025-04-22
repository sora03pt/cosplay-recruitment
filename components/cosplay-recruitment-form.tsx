"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { CalendarIcon, Copy, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// メンバー情報のスキーマ
const memberSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
})

// バリデーションを解除したformSchema
const formSchema = z.object({
  genre: z.string().optional(),
  character: z.string().optional(),
  dateType: z.enum(["specific", "month", "undecided"]).optional(),
  specificDate: z.date().optional(),
  month: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  recruitTypes: z.array(z.string()).optional(),
  otherType: z.string().optional(),
  noteOptions: z.array(z.string()).optional(),
  customNotes: z.string().optional(),
  members: z.array(memberSchema).optional(),
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

// メンバーを削除
const recruitOptions = [
  { id: "cosplayer", label: "レイヤー" },
  { id: "photographer", label: "カメラマン" },
  { id: "assistant", label: "アシスタント" },
  { id: "other", label: "その他" },
]

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

// 月の選択肢
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

// 時間の選択肢
const hours = [
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
  "02:30",
  "03:00",
  "03:30",
  "04:00",
  "04:30",
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "未定",
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
      dateType: "specific",
      startTime: "",
      endTime: "",
      recruitTypes: [],
      noteOptions: [],
      customNotes: "",
      members: [
        { name: "", role: "" },
        { name: "", role: "" },
        { name: "", role: "" },
      ],
    },
  })

  // メンバーフィールドの配列管理
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  })

  const watchRecruitTypes = form.watch("recruitTypes") || []
  const watchDateType = form.watch("dateType")
  const showOtherInput = watchRecruitTypes.includes("other")
  const showCharacterInput = watchRecruitTypes.includes("cosplayer")

  // onSubmit関数を更新
  function onSubmit(values: z.infer<typeof formSchema>) {
    // 募集する人の属性を整形
    let recruitTypesText = (values.recruitTypes || [])
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

    // 日付と時間帯を整形
    let dateText = ""
    if (values.dateType === "specific" && values.specificDate) {
      dateText = format(values.specificDate, "yyyy年MM月dd日(E)", { locale: ja })
    } else if (values.dateType === "month" && values.month) {
      dateText = `${values.month}`
    } else if (values.dateType === "undecided") {
      dateText = "未定"
    }

    // 時間帯を追加
    if (values.startTime && values.startTime !== "未定") {
      if (values.endTime && values.endTime !== "未定") {
        dateText += ` ${values.startTime}～${values.endTime}`
      } else {
        dateText += ` ${values.startTime}～`
      }
    } else if (values.endTime && values.endTime !== "未定") {
      dateText += ` ～${values.endTime}`
    }

    // 条件を整形
    let notesText = ""

    // チェックボックスで選択された条件
    if (values.noteOptions && values.noteOptions.length > 0) {
      const selectedNotes = values.noteOptions
        .map((optionId) => {
          const option = noteOptions.find((opt) => opt.id === optionId)
          return option ? option.label : ""
        })
        .filter(Boolean)

      notesText = selectedNotes.join("\n")
    }

    // カスタム条件があれば追加
    if (values.customNotes && values.customNotes.trim()) {
      notesText += notesText ? `\n${values.customNotes}` : values.customNotes
    }

    // メンバー情報を整形
    let membersText = ""
    if (values.members && values.members.length > 0) {
      const validMembers = values.members.filter((member) => member.name || member.role)
      if (validMembers.length > 0) {
        membersText = validMembers
          .map((member, index) => {
            const nameText = member.name ? member.name : ""
            const roleText = member.role ? `（${member.role}）` : ""
            return `${index + 1}. ${nameText}${roleText}`
          })
          .join("\n")
      }
    }

    // 募集文を生成
    const text = `【コスプレ合わせ募集】

${values.genre ? `■ジャンル：${values.genre}` : ""}
${recruitTypesText ? `■募集する人の属性：${recruitTypesText}` : ""}
${showCharacterInput && values.character ? `■募集キャラ：${values.character}` : ""}
${dateText ? `■日程：${dateText}` : ""}
${values.location ? `■場所：${values.location}` : ""}
${membersText ? `■メンバー：\n${membersText}` : ""}
${notesText ? `■条件：\n${notesText}` : ""}`

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
                                    const currentValue = field.value || []
                                    return checked
                                      ? field.onChange([...currentValue, option.id])
                                      : field.onChange(currentValue.filter((value) => value !== option.id))
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
                            <Input placeholder="その他の内容" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* レイヤーが選択されている場合のみ募集キャラを表示 */}
            {showCharacterInput && (
              <FormField
                control={form.control}
                name="character"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>募集キャラ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="例：竈門炭治郎、五条悟、オリジナル など" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 日程タイプの選択 */}
            <FormField
              control={form.control}
              name="dateType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>日程タイプ</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="specific" />
                        </FormControl>
                        <FormLabel className="font-normal">日付指定</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="month" />
                        </FormControl>
                        <FormLabel className="font-normal">月のみ指定</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="undecided" />
                        </FormControl>
                        <FormLabel className="font-normal">未定</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 日付選択（日程タイプが「日付指定」の場合） */}
            {watchDateType === "specific" && (
              <FormField
                control={form.control}
                name="specificDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>日付</FormLabel>
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
            )}

            {/* 月選択（日程タイプが「月のみ指定」の場合） */}
            {watchDateType === "month" && (
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="月を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 開始時刻と終了時刻の選択 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時刻</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="開始時刻を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
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
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了時刻</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="終了時刻を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            {/* メンバーセクション */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <FormLabel className="text-base">メンバー</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", role: "" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  メンバーを追加
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2 border p-3 rounded-md">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>名前</FormLabel>
                            <FormControl>
                              <Input placeholder="名前を入力" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`members.${index}.role`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>役割</FormLabel>
                            <FormControl>
                              <Input placeholder="例：キャラクター名、カメラマン、アシスタントなど" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mb-1 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="noteOptions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>条件</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
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
                                    const currentValue = field.value || []
                                    return checked
                                      ? field.onChange([...currentValue, option.id])
                                      : field.onChange(currentValue.filter((value) => value !== option.id))
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
