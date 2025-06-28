'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Icons } from '@/components/ui/icons'
import { Carousel } from '@/components/ui/carousel'
import { CardsParallax, iCardItem } from '@/components/ui/scroll-cards'

const inspoItems: iCardItem[] = [
  {
    title: "A new masterpiece",
    description: "Personalized pet art to make you smile",
    tag: "art",
    src: "/inspo1.png",
    link: "#",
    color: "white",
    textColor: "black",
  },
  {
    title: "Timeless memories",
    description: "Capture your pet's personality forever",
    src: "/inspo2.png",
    tag: "classic",
    link: "#",
    color: "white",
    textColor: "black",
  },
  {
    title: "AI-powered creativity",
    description: "Re-imagine your furry friend with a touch of magic",
    src: "/inspo3.png",
    tag: "ai",
    link: "#",
    color: "white",
    textColor: "black",
  },
  {
    title: "The perfect gift",
    description: "A unique present for any pet lover",
    src: "/inspo4.png",
    tag: "gift",
    link: "#",
    color: "white",
    textColor: "black",
  },
  {
    title: "Stunning portraits",
    description: "Transform your favorite photos into works of art",
    src: "/inspo5.png",
    tag: "portrait",
    link: "#",
    color: "white",
    textColor: "black",
  },
  {
    title: "For the love of pets",
    description: "Celebrate your companion with Haikoo",
    src: "/inspo6.png",
    tag: "love",
    link: "#",
    color: "white",
    textColor: "black",
  },
];

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Icons.spinner className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  const slideData = [
    {
      title: "Your pet re-imagined with Gen-AI",
      button: "Get Started",
      src: "/hero1.png",
    },
    {
      title: "A new master-piece every day",
      button: "Get Started",
      src: "/hero2.png",
    },
    {
      title: "Waiting to make you smile",
      button: "Get Started",
      src: "/hero3.png",
    },
    {
      title: "Haikoo - personalized pet art",
      button: "Get Started",
      src: "/hero4.png",
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center pt-16">
        <Carousel slides={slideData} onLoginClick={() => {}}/>
      </section>

      {/* Inspo Gallery Section */}
      <section id="inspiration">
        <div className="w-full max-w-6xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Get Inspired</h2>
          <CardsParallax items={inspoItems} />
        </div>
      </section>
    </main>
  )
}
