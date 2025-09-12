import content from '@/content/home.en.json'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Zap, Cpu, Monitor, Smartphone, Trophy } from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import the client-side components to avoid SSR issues
const VolumeRenderer = dynamic(() => import('@/components/volume-renderer').then(mod => ({ default: mod.VolumeRenderer })), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-lg overflow-hidden border border-border bg-black/40 flex items-center justify-center">
      <p className="text-white/60">Loading 3D renderer...</p>
    </div>
  )
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary neon-glow" />
              <h1 className="text-2xl font-bold neon-text">Volume Shader Benchmark</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <section className="text-center py-16 mb-12">
            <h2 className="text-5xl font-bold mb-6 text-white neon-text">{content.hero.h1}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {content.hero.subtitle}
            </p>
            <Button size="lg" className="neon-glow">
              {content.hero.cta}
            </Button>
          </section>

          <Separator className="my-16" />

          {/* Benchmark Demo Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <VolumeRenderer />
            </div>
          </section>

          <Separator className="my-16" />

          {/* Content Sections */}
          {content.sections.map((section, index) => (
            <section key={section.id} className="mb-16">
              <div className="max-w-4xl mx-auto">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-3xl">{section.h2}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.paragraphs?.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                    
                    {section.bullets && (
                      <div className="grid gap-4 md:grid-cols-2">
                        {section.bullets.map((bullet, bIndex) => (
                          <div key={bIndex} className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {section.faq && (
                      <Accordion type="single" collapsible className="w-full">
                        {section.faq.map((faq, fIndex) => (
                          <AccordionItem key={fIndex} value={`item-${fIndex}`}>
                            <AccordionTrigger className="text-left">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                    
                    {section.cta && (
                      <div className="pt-4">
                        <Button size="lg" className="neon-glow">
                          {section.cta}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          ))}

          {/* Features Overview */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 neon-text">Platform & Technology</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="glass-card text-center">
                  <CardHeader>
                    <Monitor className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Desktop</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      WebGL 2.0 powered benchmarking for desktop browsers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card text-center">
                  <CardHeader>
                    <Smartphone className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Test GPU performance on Android and iOS devices
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card text-center">
                  <CardHeader>
                    <Cpu className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle>Advanced</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      SDF ray marching with Mandelbulb fractal rendering
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}