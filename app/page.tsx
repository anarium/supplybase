"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Phone,
  Mail,
  Upload,
  CheckCircle,
  Building2,
  Truck,
  Shield,
  Clock,
  Users,
  Menu,
  X,
  MessageCircle,
  FileText,
  Target,
  Zap,
  Globe,
  ChevronDown,
  Search,
  Network,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import { translations, type Language, type TranslationKey } from "@/lib/translations"

export default function SupplyBaseAzerbaijan() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("az")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    urgency: "",
    projectDescription: "",
    additionalComments: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openFaqItems, setOpenFaqItems] = useState<number[]>([])

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage][key] || translations.en[key] || key
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const toggleFaqItem = (index: number) => {
    setOpenFaqItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) newErrors.companyName = `${t("companyName")} ${t("required")}`
    if (!formData.contactPerson.trim()) newErrors.contactPerson = `${t("contactPerson")} ${t("required")}`
    if (!formData.email.trim()) newErrors.email = `${t("emailAddress")} ${t("required")}`
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("invalidEmail")
    if (!formData.phone.trim()) newErrors.phone = `${t("phoneNumber")} ${t("required")}`
    if (!formData.projectDescription.trim())
      newErrors.projectDescription = `${t("projectDescription")} ${t("required")}`

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const submitFormData = new FormData()

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value)
      })

      // Add language
      submitFormData.append("language", currentLanguage)

      // Add files
      files.forEach((file) => {
        submitFormData.append("files", file)
      })

      const response = await fetch("/api/rfq", {
        method: "POST",
        body: submitFormData,
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        // Reset form
        setFormData({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          industry: "",
          urgency: "",
          projectDescription: "",
          additionalComments: "",
        })
        setFiles([])
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        console.error("Failed to submit RFQ:", result.message)
      }
    } catch (error) {
      console.error("Error submitting RFQ:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const openWhatsApp = () => {
    window.open("https://wa.me/994502402230", "_blank")
  }

  const openEmail = () => {
    window.location.href = "mailto:sales@supplybase.az"
  }

  const makeCall = () => {
    window.location.href = "tel:+994502402230"
  }

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add("animate-in")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <Image
                src="/images/sba-logo.webp"
                alt="Supply Base Azerbaijan"
                width={80}
                height={48}
                className="h-12 lg:h-14 w-auto"
              />
              <div className="hidden sm:block whitespace-nowrap">
                <h1 className="text-lg lg:text-xl font-bold text-slate-800 dark:text-white">Supply Base Azerbaijan</h1>
                <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 font-medium">{t("tagline")}</p>
              </div>
            </div>

            {/* Language Switcher & Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
                  <SelectTrigger className="w-20 h-8 text-xs border-slate-300 dark:border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">AZ</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="ru">RU</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => scrollToSection("about")}
                  className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium text-base"
                >
                  {t("about")}
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium text-base"
                >
                  {t("services")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium text-base"
                >
                  {t("faq")}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium text-base"
                >
                  {t("contact")}
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  onClick={() => scrollToSection("contact")}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-base font-medium">050 240 22 30</span>
                </div>
                <Button
                  onClick={() => scrollToSection("rfq")}
                  className="bg-blue-600 hover:bg-blue-700 shadow-sm px-6 py-2 whitespace-nowrap text-base"
                >
                  {t("getQuote")}
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-3 pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Select value={currentLanguage} onValueChange={(value: Language) => setCurrentLanguage(value)}>
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="az">AZ</SelectItem>
                      <SelectItem value="en">EN</SelectItem>
                      <SelectItem value="ru">RU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors w-fit mb-3"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">050 240 22 30</span>
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t("about")}
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t("services")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t("faq")}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t("contact")}
                </button>
                <Button onClick={() => scrollToSection("rfq")} className="bg-blue-600 hover:bg-blue-700 w-fit">
                  {t("getQuote")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-slate-900/90 z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/hero-bg.png')`,
            }}
          ></div>
          {/* Additional overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 z-5"></div>
        </div>

        <div className="container mx-auto relative z-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh]">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
              <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {t("tagline")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t("heroTitle")}
                <span className="text-blue-400 block">{t("heroTitleHighlight")}</span>
                {t("heroTitleEnd")}
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">{t("heroSubtitle")}</p>

              {/* Quick Contact Buttons - Fixed Layout */}
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-md">
                <Button
                  onClick={() => scrollToSection("rfq")}
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-3 py-3 h-auto flex flex-col items-center space-y-1 min-h-[60px]"
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{t("requestQuote")}</span>
                </Button>
                <Button
                  onClick={openEmail}
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-3 py-3 h-auto flex flex-col items-center space-y-1 min-h-[60px]"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{t("emailUs")}</span>
                </Button>
                <Button
                  onClick={makeCall}
                  variant="outline"
                  className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white px-3 py-3 h-auto flex flex-col items-center space-y-1 min-h-[60px]"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{t("callUs")}</span>
                </Button>
                <Button
                  onClick={openWhatsApp}
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-3 py-3 h-auto flex flex-col items-center space-y-1 min-h-[60px]"
                >
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center leading-tight">{t("whatsappUs")}</span>
                </Button>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-x-8 transition-all duration-1000 delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-white/10 dark:bg-slate-800/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 dark:border-slate-700/20">
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100/20 dark:bg-blue-900/30 rounded-2xl p-3 lg:p-4 mb-3">
                        <Building2 className="h-6 lg:h-8 w-6 lg:w-8 text-blue-400 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-white text-xs lg:text-sm">{t("multiIndustry")}</h3>
                      <p className="text-[10px] lg:text-xs text-blue-200">{t("expertise")}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100/20 dark:bg-green-900/30 rounded-2xl p-3 lg:p-4 mb-3">
                        <Truck className="h-6 lg:h-8 w-6 lg:w-8 text-green-400 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-white text-xs lg:text-sm">{t("supplyChain")}</h3>
                      <p className="text-[10px] lg:text-xs text-blue-200">{t("optimization")}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-100/20 dark:bg-purple-900/30 rounded-2xl p-3 lg:p-4 mb-3">
                        <Shield className="h-6 lg:h-8 w-6 lg:w-8 text-purple-400 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-white text-xs lg:text-sm">{t("reliable")}</h3>
                      <p className="text-[10px] lg:text-xs text-blue-200">{t("partnership")}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100/20 dark:bg-orange-900/30 rounded-2xl p-3 lg:p-4 mb-3">
                        <Clock className="h-6 lg:h-8 w-6 lg:w-8 text-orange-400 mx-auto" />
                      </div>
                      <h3 className="font-semibold text-white text-xs lg:text-sm">{t("support24")}</h3>
                      <p className="text-[10px] lg:text-xs text-blue-200">{t("fastResponse")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <Badge className="mb-4 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {t("aboutBadge")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{t("aboutTitle")}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{t("aboutSubtitle")}</p>
          </div>

          {/* Procurement Process Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/procurement-process.png" alt="Procurement Process" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{t("needsAnalysis")}</h3>
                  <p className="text-sm opacity-90">Ehtiyac müəyyənləşdirmə</p>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-200">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/supplier-network.png" alt="Supplier Network" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{t("supplierNetwork")}</h3>
                  <p className="text-sm opacity-90">Təchizatçı şəbəkəsi</p>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-400">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/quality-control.png" alt="Quality Control" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{t("qualityAssurance")}</h3>
                  <p className="text-sm opacity-90">Keyfiyyət nəzarəti</p>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-600">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                <Image src="/images/end-to-end-service.png" alt="End to End Service" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{t("endToEndService")}</h3>
                  <p className="text-sm opacity-90">Tam xidmət</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Target,
                title: t("comprehensiveSolutions"),
                description: t("comprehensiveDesc"),
                color: "blue",
              },
              {
                icon: Users,
                title: t("industryExpertise"),
                description: t("industryExpertiseDesc"),
                color: "green",
              },
              {
                icon: Zap,
                title: t("uninterruptedOps"),
                description: t("uninterruptedOpsDesc"),
                color: "purple",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader className="text-center">
                  <div
                    className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                  >
                    <item.icon className={`h-8 w-8 text-${item.color}-600`} />
                  </div>
                  <CardTitle className="text-slate-800 dark:text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0 translate-x-8 transition-all duration-1000">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6">
                {t("whyChooseTitle")}
              </h3>
              <div className="space-y-4">
                {Array.isArray(t("whyChooseItems"))
                  ? t("whyChooseItems").map((item: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 dark:text-slate-300">{item}</p>
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div className="animate-on-scroll opacity-0 translate-x-8 transition-all duration-1000 delay-300">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-6">{t("commitmentTitle")}</h4>
                <p className="text-blue-100 mb-6">{t("commitmentText")}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-blue-200 text-sm">{t("projectsCompleted")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">99%</div>
                    <div className="text-blue-200 text-sm">{t("clientSatisfaction")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t("servicesBadge")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{t("servicesTitle")}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{t("servicesSubtitle")}</p>
          </div>

          {/* Procurement as a Service Details */}
          <div className="mb-16">

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: Search,
                  title: t("needsAnalysis"),
                  description: t("needsAnalysisDesc"),
                  color: "blue",
                },
                {
                  icon: Network,
                  title: t("supplierNetwork"),
                  description: t("supplierNetworkDesc"),
                  color: "green",
                },
                {
                  icon: ShieldCheck,
                  title: t("qualityAssurance"),
                  description: t("qualityAssuranceDesc"),
                  color: "purple",
                },
                {
                  icon: ArrowRight,
                  title: t("endToEndService"),
                  description: t("endToEndServiceDesc"),
                  color: "orange",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardHeader className="text-center">
                    <div
                      className={`bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}
                    >
                      <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                    </div>
                    <CardTitle className="text-slate-800 dark:text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Industry Services */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: t("constructionSupplies"),
                description: t("constructionDesc"),
                industries: [t("construction"), "Commercial", "Infrastructure"],
                image: "/images/construction-materials.png",
              },
              {
                icon: Truck,
                title: t("oilGasSupplies"),
                description: t("oilGasDesc"),
                industries: ["Upstream", "Downstream", "Petrochemical"],
                image: "/images/oil-gas-equipment.png",
              },
              {
                icon: Shield,
                title: t("safetyCompliance"),
                description: t("safetyDesc"),
                industries: ["HSE", "Quality Control", "Certification"],
                image: "/images/safety-equipment.png",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-3 w-12 h-12 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-slate-800 dark:text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600 dark:text-slate-300 mb-4">
                    {service.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {service.industries.map((industry, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <Badge className="mb-4 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {t("faqBadge")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{t("faqTitle")}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">{t("faqSubtitle")}</p>
          </div>

          <div className="space-y-4">
            {Array.isArray(t("faqItems")) &&
              t("faqItems").map((item: any, index: number) => (
                <Card
                  key={index}
                  className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Collapsible open={openFaqItems.includes(index)} onOpenChange={() => toggleFaqItem(index)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-left text-slate-800 dark:text-white text-lg">
                            {item.question}
                          </CardTitle>
                          <ChevronDown
                            className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${
                              openFaqItems.includes(index) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <Badge className="mb-4 bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
              {t("contactBadge")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{t("contactTitle")}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{t("contactSubtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm cursor-pointer"
              onClick={makeCall}
            >
              <CardHeader>
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">Telefon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-blue-600 mb-2">050 240 22 30</p>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Dərhal yardım üçün bizə zəng edin
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm cursor-pointer"
              style={{ transitionDelay: "200ms" }}
              onClick={openWhatsApp}
            >
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-600 mb-2">050 240 22 30</p>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  WhatsApp söhbəti başladın
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm cursor-pointer"
              style={{ transitionDelay: "400ms" }}
              onClick={openEmail}
            >
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-slate-800 dark:text-white">{t("emailTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-purple-600 mb-2">sales@supplybase.az</p>
                <CardDescription className="text-slate-600 dark:text-slate-300">{t("emailDesc")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RFQ Section */}
      <section id="rfq" className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000">
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {t("rfqBadge")}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">{t("rfqTitle")}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">{t("rfqSubtitle")}</p>
          </div>

          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <p className="text-green-800 dark:text-green-200">{t("successMessage")}</p>
            </div>
          )}

          <Card className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 delay-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("companyName")} *
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={errors.companyName ? "border-red-500" : ""}
                      placeholder={t("companyNamePlaceholder")}
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("contactPerson")} *
                    </label>
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className={errors.contactPerson ? "border-red-500" : ""}
                      placeholder={t("contactPersonPlaceholder")}
                    />
                    {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("emailAddress")} *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-red-500" : ""}
                      placeholder={t("emailPlaceholder")}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("phoneNumber")} *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={errors.phone ? "border-red-500" : ""}
                      placeholder={t("phonePlaceholder")}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("industrySector")}
                    </label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => setFormData({ ...formData, industry: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectIndustry")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">{t("construction")}</SelectItem>
                        <SelectItem value="oil-gas">{t("oilGas")}</SelectItem>
                        <SelectItem value="manufacturing">{t("manufacturing")}</SelectItem>
                        <SelectItem value="industrial">{t("industrial")}</SelectItem>
                        <SelectItem value="commercial">{t("commercial")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t("urgencyLevel")}
                    </label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectUrgency")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">{t("urgent")}</SelectItem>
                        <SelectItem value="standard">{t("standard")}</SelectItem>
                        <SelectItem value="flexible">{t("flexible")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t("projectDescription")} *
                  </label>
                  <Textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className={`min-h-[120px] ${errors.projectDescription ? "border-red-500" : ""}`}
                    placeholder={t("projectDescPlaceholder")}
                  />
                  {errors.projectDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t("fileAttachments")}
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 dark:text-slate-300 mb-2">{t("dragDropFiles")}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("supportedFormats")}</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {t("chooseFiles")}
                    </Button>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded-lg p-3"
                        >
                          <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t("additionalComments")}
                  </label>
                  <Textarea
                    value={formData.additionalComments}
                    onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                    className="min-h-[80px]"
                    placeholder={t("additionalCommentsPlaceholder")}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Göndərilir..." : t("submitQuote")}
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/sba-logo.webp"
                  alt="Supply Base Azerbaijan"
                  width={70}
                  height={42}
                  className="h-11 w-auto"
                />
                <div>
                  <h3 className="text-xl font-bold">Supply Base Azerbaijan</h3>
                  <p className="text-slate-400 text-sm">{t("tagline")}</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4 max-w-md">{t("aboutSubtitle")}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("about")}
                  className="block text-slate-300 hover:text-white transition-colors text-sm"
                >
                  {t("about")}
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="block text-slate-300 hover:text-white transition-colors text-sm"
                >
                  {t("services")}
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="block text-slate-300 hover:text-white transition-colors text-sm"
                >
                  {t("faq")}
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block text-slate-300 hover:text-white transition-colors text-sm"
                >
                  {t("contact")}
                </button>
                <button
                  onClick={() => scrollToSection("rfq")}
                  className="block text-slate-300 hover:text-white transition-colors text-sm"
                >
                  {t("getQuote")}
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("contactInfo")}</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">050 240 22 30</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">sales@supplybase.az</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <button onClick={openWhatsApp} className="text-slate-300 hover:text-white transition-colors text-sm">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} SUPPLY BASE AZERBAIJAN. {t("rightsReserved")}
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
      .animate-on-scroll {
        transition: opacity 1s ease-out, transform 1s ease-out;
      }
      .animate-on-scroll.animate-in {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) !important;
      }
      html {
        scroll-behavior: smooth;
      }
    `}</style>
    </div>
  )
}
