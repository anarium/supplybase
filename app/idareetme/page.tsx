"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import {
  Settings,
  FileText,
  Code,
  Save,
  Eye,
  User,
  Mail,
  Phone,
  Building,
  Clock,
  Download,
  Trash2,
  LogOut,
  Lock,
  Key,
} from "lucide-react"

interface RFQSubmission {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  industry: string
  urgency: string
  projectDescription: string
  additionalComments: string
  language: string
  submittedAt: string
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/idareetme/login")
  }

  // Delete submission
  const deleteSubmission = async (id: string) => {
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
          `"${sub.companyName}"`,
          `"${sub.contactPerson}"`,
          sub.email,
          sub.phone,
          sub.industry,
          sub.urgency,
          `"${sub.projectDescription.replace(/"/g, '""')}"`,
          `"${sub.additionalComments.replace(/"/g, '""')}"`,
          sub.language,
          sub.submittedAt,
          sub.files.length,
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Sayt Parametrləri</span>
            </TabsTrigger>
            <TabsTrigger value="snippets" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Kod Parçaları</span>
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
                  <Download className="h-4 w-4 mr-2" />
                  CSV İxrac Et
                </Button>
                <Button onClick={fetchSubmissions} disabled={isLoading}>
                  {isLoading ? "Yüklənir..." : "Yenilə"}
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Submissions List */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Bütün Sorğular</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto">
                      {rfqSubmissions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Hələ sorğu yoxdur</p>
                        </div>
                      ) : (
                        rfqSubmissions.map((submission) => (
                          <div
                            key={submission.id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                              selectedSubmission?.id === submission.id ? "bg-blue-50 border-blue-200" : ""
                            }`}
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-sm truncate">{submission.companyName}</h4>
                              <Badge className={`text-xs ${getUrgencyColor(submission.urgency)}`}>
                                {submission.urgency}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{submission.contactPerson}</p>
                            <p className="text-xs text-gray-500">{formatDate(submission.submittedAt)}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submission Details */}
              <div className="lg:col-span-2">
                {selectedSubmission ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Building className="h-5 w-5" />
                            <span>{selectedSubmission.companyName}</span>
                          </CardTitle>
                          <CardDescription>
                            {formatDate(selectedSubmission.submittedAt)} tarixində göndərildi
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getUrgencyColor(selectedSubmission.urgency)}>
                            {selectedSubmission.urgency}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSubmission(selectedSubmission.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Contact Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Əlaqə Şəxsi:</span>
                            <span className="text-sm">{selectedSubmission.contactPerson}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Email:</span>
                            <a
                              href={`mailto:${selectedSubmission.email}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {selectedSubmission.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Telefon:</span>
                            <a
                              href={`tel:${selectedSubmission.phone}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {selectedSubmission.phone}
                            </a>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Sənaye:</span>
                            <span className="text-sm">{selectedSubmission.industry || "Göstərilməyib"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Təcililik:</span>
                            <Badge className={`text-xs ${getUrgencyColor(selectedSubmission.urgency)}`}>
                              {selectedSubmission.urgency}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Dil:</span>
                            <span className="text-sm uppercase">{selectedSubmission.language}</span>
                          </div>
                        </div>
                      </div>

                      {/* Project Description */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Layihə Təsviri</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{selectedSubmission.projectDescription}</p>
                        </div>
                      </div>

                      {/* Additional Comments */}
                      {selectedSubmission.additionalComments && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Əlavə Şərhlər</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{selectedSubmission.additionalComments}</p>
                          </div>
                        </div>
                      )}

                      {/* Files */}
                      {selectedSubmission.files.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Əlavə Edilmiş Fayllar ({selectedSubmission.files.length})</h4>
                          <div className="space-y-2">
                            {selectedSubmission.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {file.type.split("/")[1]?.toUpperCase()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center text-gray-500">
                        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Təfərrüatları görmək üçün sorğu seçin</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
