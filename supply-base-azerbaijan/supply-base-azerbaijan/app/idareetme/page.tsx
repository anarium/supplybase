"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  FileText,
  Code,
  Save,
  Trash2,
  LogOut,
  Lock,
  Key,
  ImageIcon,
  Edit,
  Plus,
  Languages,
  Globe,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"

interface RFQSubmission {
  id: string | number
  company_name: string
  contact_person: string
  email: string
  phone: string
  industry: string
  urgency: string
  project_description: string
  additional_comments: string
  language: string
  submitted_at: string
  files: Array<{
    name: string
    size: number
    type: string
    uploadedAt: string
  }>
}

interface SiteSettings {
  title: string
  favicon: string
  metaDescription: string
  metaKeywords: string
  socialTitle: string
  socialImage: string
  headerSnippet: string
  footerSnippet: string
  analyticsCode: string
  [key: string]: string
}

interface SiteImage {
  id: number
  image_key: string
  image_url: string
  alt_text: string
  uploaded_at: string
}

interface SiteContent {
  id: number
  content_key: string
  language: string
  content_value: string
  updated_at: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("settings")
  const [rfqSubmissions, setRfqSubmissions] = useState<RFQSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<RFQSubmission | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [siteImages, setSiteImages] = useState<SiteImage[]>([])
  const [siteContent, setSiteContent] = useState<SiteContent[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState("az")
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null)
  const [newContentValue, setNewContentValue] = useState("")
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [newImage, setNewImage] = useState({
    imageKey: "",
    imageUrl: "",
    altText: "",
  })
  const [editingImage, setEditingImage] = useState<SiteImage | null>(null)
  const router = useRouter()

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: "Supply Base Azerbaijan - Procurement as a Service",
    favicon: "/favicon.ico",
    metaDescription:
      "Supply Base Azerbaijan provides comprehensive procurement and supply chain solutions for various industries. Professional sourcing, quality assurance, and reliable delivery services.",
    metaKeywords:
      "procurement, supply chain, Azerbaijan, sourcing, industrial supplies, construction materials, oil gas equipment",
    socialTitle: "Supply Base Azerbaijan - Satınalma və Təchizat Xidməti",
    socialImage: "/images/sba-logo.webp",
    headerSnippet: "",
    footerSnippet: "",
    analyticsCode: "",
  })

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/idareetme/login")
      return
    }

    // Verify token with server
    fetch("/api/admin/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true)
          fetchSubmissions()
          fetchSettings()
          fetchImages()
          fetchContent()
        } else {
          localStorage.removeItem("admin_token")
          router.push("/idareetme/login")
        }
      })
      .catch(() => {
        localStorage.removeItem("admin_token")
        router.push("/idareetme/login")
      })
  }, [router])

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      const data = await response.json()
      if (data.success && data.settings) {
        setSiteSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    }
  }

  // Fetch images
  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSiteImages(data.images || [])
      }
    } catch (error) {
      console.error("Error fetching images:", error)
    }
  }

  // Fetch content
  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSiteContent(data.content || [])
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  // Fetch RFQ submissions
  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rfq", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setRfqSubmissions(data.requests || [])
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save site settings
  const saveSiteSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(siteSettings),
      })

      if (response.ok) {
        alert("Parametrlər uğurla saxlanıldı!")
      } else {
        alert("Parametrləri saxlamaq mümkün olmadı")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Parametrləri saxlama xətası")
    } finally {
      setIsLoading(false)
    }
  }

  // Change password
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Yeni parollar uyğun gəlmir")
      return
    }

    if (newPassword.length < 6) {
      alert("Yeni parol ən azı 6 simvol olmalıdır")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert("Parol uğurla dəyişdirildi!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        alert(result.message || "Parol dəyişdirmək mümkün olmadı")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("Parol dəyişdirmə xətası")
    } finally {
      setIsLoading(false)
    }
  }

  // Save image
  const saveImage = async () => {
    if (!newImage.imageKey || !newImage.imageUrl) {
      alert("Şəkil açarı və URL tələb olunur")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("imageKey", newImage.imageKey)
      formData.append("imageUrl", newImage.imageUrl)
      formData.append("altText", newImage.altText || "")

      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        alert("Şəkil uğurla saxlanıldı!")
        setNewImage({ imageKey: "", imageUrl: "", altText: "" })
        setIsImageDialogOpen(false)
        fetchImages()
      } else {
        alert("Şəkili saxlamaq mümkün olmadı")
      }
    } catch (error) {
      console.error("Error saving image:", error)
      alert("Şəkili saxlama xətası")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete image
  const deleteImage = async (imageKey: string) => {
    if (!confirm("Bu şəkili silmək istədiyinizə əminsiniz?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/images/${imageKey}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })

      if (response.ok) {
        alert("Şəkil uğurla silindi!")
        fetchImages()
      } else {
        alert("Şəkili silmək mümkün olmadı")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Şəkili silmə xətası")
    } finally {
      setIsLoading(false)
    }
  }

  // Edit image
  const editImage = (image: SiteImage) => {
    setEditingImage(image)
    setNewImage({
      imageKey: image.image_key,
      imageUrl: image.image_url,
      altText: image.alt_text || "",
    })
    setIsImageDialogOpen(true)
  }

  // Save content
  const saveContent = async () => {
    if (!editingContent) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          contentKey: editingContent.content_key,
          language: editingContent.language,
          contentValue: newContentValue,
        }),
      })

      if (response.ok) {
        alert("Məzmun uğurla saxlanıldı!")
        setIsContentDialogOpen(false)
        fetchContent()
      } else {
        alert("Məzmunu saxlamaq mümkün olmadı")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Məzmunu saxlama xətası")
    } finally {
      setIsLoading(false)
    }
  }

  // Edit content
  const editContent = (content: SiteContent) => {
    setEditingContent(content)
    setNewContentValue(content.content_value)
    setIsContentDialogOpen(true)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/idareetme/login")
  }

  // Delete submission
  const deleteSubmission = async (id: string | number) => {
    if (!confirm("Bu sorğunu silmək istədiyinizə əminsiniz?")) return

    try {
      const response = await fetch(`/api/rfq/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })

      if (response.ok) {
        setRfqSubmissions((prev) => prev.filter((sub) => sub.id !== id))
        setSelectedSubmission(null)
      } else {
        alert("Sorğunu silmək mümkün olmadı")
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
      alert("Sorğunu silmə xətası")
    }
  }

  // Export submissions to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Şirkət Adı",
      "Əlaqə Şəxsi",
      "Email",
      "Telefon",
      "Sənaye",
      "Təcililik",
      "Layihə Təsviri",
      "Əlavə Şərhlər",
      "Dil",
      "Göndərilmə Tarixi",
      "Fayl Sayı",
    ]

    const csvContent = [
      headers.join(","),
      ...rfqSubmissions.map((sub) =>
        [
          sub.id,
          `"${sub.company_name}"`,
          `"${sub.contact_person}"`,
          sub.email,
          sub.phone,
          sub.industry,
          sub.urgency,
          `"${sub.project_description?.replace(/"/g, '""')}"`,
          `"${sub.additional_comments?.replace(/"/g, '""')}"`,
          sub.language,
          sub.submitted_at,
          (sub.files?.length || 0),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rfq-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "standard":
        return "bg-yellow-100 text-yellow-800"
      case "flexible":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter content by language
  const filteredContent = siteContent.filter(content => content.language === selectedLanguage)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Yüklənir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">İdarəetmə Paneli</h1>
            <p className="text-gray-600">Sayt parametrlərini idarə edin və form sorğularını görün</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Çıxış</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Sayt Parametrləri</span>
            </TabsTrigger>
            <TabsTrigger value="snippets" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Kod Parçaları</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Şəkillər</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span>Məzmun</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>RFQ Sorğuları ({rfqSubmissions.length})</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Təhlükəsizlik</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Sayt Parametrləri</span>
                </CardTitle>
                <CardDescription>
                  Saytınızın əsas parametrlərini və meta məlumatlarını konfiqurasiya edin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Sayt Başlığı</Label>
                    <Input
                      id="title"
                      value={siteSettings.title}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Saytınızın başlığı"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input
                      id="favicon"
                      value={siteSettings.favicon}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, favicon: e.target.value }))}
                      placeholder="/favicon.ico"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Təsvir</Label>
                  <Textarea
                    id="metaDescription"
                    value={siteSettings.metaDescription}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Axtarış mühərrikləri üçün saytınızın qısa təsviri"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Açar Sözlər</Label>
                  <Input
                    id="metaKeywords"
                    value={siteSettings.metaKeywords}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, metaKeywords: e.target.value }))}
                    placeholder="açar söz1, açar söz2, açar söz3"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="socialTitle">Sosial Paylaşım Başlığı</Label>
                    <Input
                      id="socialTitle"
                      value={siteSettings.socialTitle}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialTitle: e.target.value }))}
                      placeholder="Sosial mediada paylaşılanda görünəcək başlıq"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialImage">Sosial Paylaşım Şəkli URL</Label>
                    <Input
                      id="socialImage"
                      value={siteSettings.socialImage}
                      onChange={(e) => setSiteSettings((prev) => ({ ...prev, socialImage: e.target.value }))}
                      placeholder="/images/social-share.jpg"
                    />
                  </div>
                </div>

                <Button onClick={saveSiteSettings} disabled={isLoading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saxlanılır..." : "Parametrləri Saxla"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Snippets Tab */}
          <TabsContent value="snippets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Kod Parçaları</span>
                </CardTitle>
                <CardDescription>Saytınıza xüsusi kod parçaları əlavə edin (analitika, izləmə və s.)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headerSnippet">Başlıq Kod Parçası</Label>
                  <Textarea
                    id="headerSnippet"
                    value={siteSettings.headerSnippet}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, headerSnippet: e.target.value }))}
                    placeholder="<head> bölməsinə əlavə ediləcək kod"
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500">Bu kod bütün səhifələrin head bölməsinə əlavə ediləcək</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerSnippet">Alt Hissə Kod Parçası</Label>
                  <Textarea
                    id="footerSnippet"
                    value={siteSettings.footerSnippet}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, footerSnippet: e.target.value }))}
                    placeholder="</body> etiketindən əvvəl əlavə ediləcək kod"
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500">Bu kod body etiketinin bağlanmasından əvvəl əlavə ediləcək</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analyticsCode">Analitika Kodu</Label>
                  <Textarea
                    id="analyticsCode"
                    value={siteSettings.analyticsCode}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, analyticsCode: e.target.value }))}
                    placeholder="Google Analytics, Facebook Pixel və ya digər izləmə kodları"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={saveSiteSettings} disabled={isLoading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saxlanılır..." : "Kod Parçalarını Saxla"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Şəkillər</h2>
                <p className="text-gray-600">Saytda istifadə olunan şəkilləri idarə edin</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={fetchImages} variant="outline" disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenilə
                </Button>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Şəkil
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingImage ? "Şəkili Redaktə Et" : "Yeni Şəkil Əlavə Et"}</DialogTitle>
                      <DialogDescription>
                        Şəkil məlumatlarını daxil edin. Şəkil açarı və URL tələb olunur.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="imageKey">Şəkil Açarı</Label>
                        <Input
                          id="imageKey"
                          value={newImage.imageKey}
                          onChange={(e) => setNewImage({ ...newImage, imageKey: e.target.value })}
                          placeholder="hero-bg"
                          disabled={!!editingImage}
                        />
                        <p className="text-xs text-gray-500">
                          Şəkil açarı unikal olmalıdır və şəkilə istinad etmək üçün istifadə olunur
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Şəkil URL</Label>
                        <Input
                          id="imageUrl"
                          value={newImage.imageUrl}
                          onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                          placeholder="/images/hero-bg.png"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="altText">Alt Mətn</Label>
                        <Input
                          id="altText"
                          value={newImage.altText}
                          onChange={(e) => setNewImage({ ...newImage, altText: e.target.value })}
                          placeholder="Hero Background"
                        />
                      </div>
                      {newImage.imageUrl && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Önizləmə:</p>
                          <div className="relative h-40 w-full border rounded-md overflow-hidden">
                            <Image
                              src={newImage.imageUrl || "/placeholder.svg"}
                              alt={newImage.altText || "Image preview"}
                              fill
                              className="object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                        Ləğv Et
                      </Button>
                      <Button onClick={saveImage} disabled={isLoading}>
                        {isLoading ? "Saxlanılır..." : "Saxla"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {siteImages.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-white rounded-lg border border-gray-200">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Hələ şəkil yoxdur</h3>
                  <p className="text-gray-500 mb-4">Sayta şəkillər əlavə etmək üçün "Yeni Şəkil" düyməsini istifadə edin</p>
                </div>
              ) : (
                siteImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.alt_text || image.image_key}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{image.image_key}</h3>
                          <p className="text-sm text-gray-500 truncate">{image.image_url}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {image.image_url.split('.').pop()?.toUpperCase()}
                        </Badge>
                      </div>
                      {image.alt_text && <p className="text-sm text-gray-600 mb-2">Alt: {image.alt_text}</p>}
                      <p className="text-xs text-gray-500">
                        Yükləndi: {new Date(image.uploaded_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => editImage(image)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Redaktə
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Sil
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Şəkili silmək istədiyinizə əminsiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu əməliyyat geri qaytarıla bilməz. Bu şəkil saytdan silinəcək.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Ləğv Et</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteImage(image.image_key)}>
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Sayt Məzmunu</h2>
                <p className="text-gray-600">Saytın məzmununu müxtəlif dillərdə redaktə edin</p>
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="az">AZ</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="ru">RU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={fetchContent} variant="outline" disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yenilə
                </Button>
              </div>
            </div>

            <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Məzmunu Redaktə Et</DialogTitle>
                  <DialogDescription>
                    {editingContent && (
                      <>
                        Açar: <span className="font-medium">{editingContent.content_key}</span> | 
                        Dil: <span className="font-medium">{editingContent.language.toUpperCase()}</span>
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="contentValue">Məzmun</Label>
                    <Textarea
                      id="contentValue"
                      value={newContentValue}
                      onChange={(e) => setNewContentValue(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsContentDialogOpen(false)}>
                    Ləğv Et
                  </Button>
                  <Button onClick={saveContent} disabled={isLoading}>
                    {isLoading ? "Saxlanılır..." : "Saxla"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="h-5 w-5" />
                  <span>{selectedLanguage.toUpperCase()} Dili Məzmunu</span>
                </CardTitle>
                <CardDescription>
                  Seçilmiş dildə sayt məzmununu redaktə edin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredContent.length === 0 ? (
                  <div className="text-center py-8">
                    <Languages className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bu dildə məzmun tapılmadı</h3>
                    <p className="text-gray-500">Seçilmiş dildə məzmun yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-500 pb-2 border-b">
                      <div className="col-span-3">Açar</div>
                      <div className="col-span-7">Məzmun</div>
                      <div className="col-span-2">Əməliyyatlar</div>
                    </div>
                    {filteredContent.map((content) => (
                      <div key={content.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100">
                        <div className="col-span-3">
                          <div className="font-medium text-gray-900">{content.content_key}</div>
                          <div className="text-xs text-gray-500">
                            Son yenilənmə: {new Date(content.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="col-span-7">
                          <div className="text-sm text-gray-700 line-clamp-2">
                            {content.content_value}
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button variant="outline" size="sm" onClick={() => editContent(content)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Redaktə
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Parol Dəyişdirmə</span>
                </CardTitle>
                <CardDescription>Admin paneli üçün parolunuzu dəyişdirin</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={changePassword} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Cari Parol</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Cari parolunuzu daxil edin"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Yeni Parol</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Yeni parolunuzu daxil edin"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Yeni Parolu Təsdiq Edin</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Yeni parolunuzu təkrar daxil edin"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    <Lock className="h-4 w-4 mr-2" />
                    {isLoading ? "Dəyişdirilir..." : "Parolu Dəyişdir"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RFQ Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">RFQ Sorğuları</h2>
                <p className="text-gray-600">Müştərilərdən gələn təklif sorğularını görün və idarə edin</p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={exportToCSV} variant="outline" disabled={rfqSubmissions.length === 0}>
                  \
