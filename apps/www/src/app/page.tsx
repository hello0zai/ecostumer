'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  BarChart,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const plans = [
    {
      name: 'Básico',
      price: isAnnual ? 29 : 39,
      features: [
        'Gerenciamento de até 100 clientes',
        'Relatórios básicos',
        'Suporte por e-mail',
        'Integração com 1 plataforma',
      ],
    },
    {
      name: 'Pro',
      price: isAnnual ? 59 : 79,
      features: [
        'Gerenciamento ilimitado de clientes',
        'Relatórios avançados e personalizados',
        'Suporte prioritário 24/7',
        'Integração com múltiplas plataformas',
        'Automação de processos de vendas',
        'Análise preditiva de clientes',
      ],
    },
  ]

  const benefits = [
    {
      icon: <BarChart className="h-6 w-6" />,
      title: 'Aumente suas vendas',
      description:
        'Gerencie seus clientes de forma eficiente e aumente suas conversões.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Melhore o relacionamento',
      description:
        'Mantenha um histórico detalhado de interações para um atendimento personalizado.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Economize tempo',
      description:
        'Automatize tarefas repetitivas e foque no que realmente importa.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Tome decisões inteligentes',
      description:
        'Utilize relatórios avançados para tomar decisões baseadas em dados.',
    },
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'CEO, TechStart',
      content:
        'O ecustomer revolucionou a forma como gerenciamos nossos clientes. Nunca foi tão fácil acompanhar cada interação e aumentar nossas vendas.',
    },
    {
      name: 'João Santos',
      role: 'Gerente de Vendas, MegaShop',
      content:
        'Desde que implementamos o ecustomer, nossa equipe de vendas aumentou a produtividade em 30%. É uma ferramenta indispensável para nós.',
    },
    {
      name: 'Ana Oliveira',
      role: 'Proprietária, Boutique Elegance',
      content:
        'Como pequena empresária, o ecustomer me ajudou a organizar meus clientes e melhorar significativamente o atendimento. Recomendo!',
    },
  ]

  const faqs = [
    {
      question: 'Como o ecustomer pode ajudar minha empresa?',
      answer:
        'O ecustomer oferece uma solução completa para gerenciamento de clientes e vendas, permitindo que você organize informações, acompanhe interações, automatize processos e tome decisões baseadas em dados. Isso resulta em melhor relacionamento com clientes, aumento de vendas e economia de tempo.',
    },
    {
      question: 'O ecustomer é adequado para pequenas empresas?',
      answer:
        'Sim! O ecustomer foi projetado para atender às necessidades de empresas de todos os tamanhos. Oferecemos planos flexíveis que se adaptam ao seu negócio, seja ele pequeno, médio ou grande.',
    },
    {
      question: 'Posso experimentar o ecustomer antes de comprar?',
      answer:
        'Claro! Oferecemos um período de teste gratuito de 14 dias para que você possa experimentar todas as funcionalidades do ecustomer e ver como ele pode beneficiar seu negócio.',
    },
    {
      question: 'Como funciona o suporte ao cliente?',
      answer:
        'Oferecemos suporte por e-mail para todos os clientes. Os assinantes do plano Pro têm acesso a suporte prioritário 24/7 por chat e telefone.',
    },
  ]

  const integrations = [
    { name: 'Salesforce', logo: '/placeholder.svg?height=40&width=120' },
    { name: 'HubSpot', logo: '/placeholder.svg?height=40&width=120' },
    { name: 'Mailchimp', logo: '/placeholder.svg?height=40&width=120' },
    { name: 'Slack', logo: '/placeholder.svg?height=40&width=120' },
    { name: 'Zapier', logo: '/placeholder.svg?height=40&width=120' },
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-3xl font-bold text-transparent"
        >
          ecustomer
        </motion.h1>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="mb-16 flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:w-1/2 lg:text-left"
          >
            <h2 className="mb-6 bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-5xl font-bold text-transparent">
              Simplifique o Gerenciamento de Clientes e Vendas
            </h2>
            <p className="mb-8 text-xl text-zinc-600">
              Uma solução intuitiva e poderosa para pequenas e médias empresas
              impulsionarem seus negócios
            </p>
            <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
              Comece gratuitamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="absolute left-0 top-0 h-48 w-64 overflow-hidden rounded-lg bg-zinc-100 shadow-lg"
              >
                <div className="p-4">
                  <div className="mb-2 h-4 w-full rounded bg-zinc-300"></div>
                  <div className="h-4 w-3/4 rounded bg-zinc-300"></div>
                </div>
              </motion.div>
              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: 0.5,
                }}
                className="absolute left-20 top-20 h-48 w-64 overflow-hidden rounded-lg bg-zinc-200 shadow-lg"
              >
                <div className="p-4">
                  <div className="mb-2 h-4 w-full rounded bg-zinc-300"></div>
                  <div className="h-4 w-1/2 rounded bg-zinc-300"></div>
                </div>
              </motion.div>
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: 1,
                }}
                className="absolute left-40 top-40 h-48 w-64 overflow-hidden rounded-lg bg-zinc-300 shadow-lg"
              >
                <div className="p-4">
                  <div className="mb-2 h-4 w-full rounded bg-zinc-400"></div>
                  <div className="h-4 w-2/3 rounded bg-zinc-400"></div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <StatisticsSection />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-none bg-zinc-50">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 flex items-center justify-center space-x-4"
        >
          <span
            className={cn(
              'transition-colors duration-200',
              isAnnual ? 'text-zinc-500' : 'text-zinc-900',
            )}
          >
            Mensal
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-zinc-600"
          />
          <span
            className={cn(
              'transition-colors duration-200',
              isAnnual ? 'text-zinc-900' : 'text-zinc-500',
            )}
          >
            Anual{' '}
            <span className="font-semibold text-green-500">
              (20% de desconto)
            </span>
          </span>
        </motion.div>

        <div className="mx-auto mb-16 grid max-w-4xl gap-8 md:grid-cols-2">
          <AnimatePresence>
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
                    plan.name === 'Pro'
                      ? 'border-zinc-500 bg-gradient-to-br from-zinc-100 to-zinc-200'
                      : 'bg-white',
                  )}
                >
                  {plan.name === 'Pro' && (
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-zinc-600 to-zinc-800 px-4 py-1 text-sm font-semibold text-white">
                      Recomendado
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                      {plan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6 bg-gradient-to-r from-zinc-600 to-zinc-900 bg-clip-text text-5xl font-bold text-transparent">
                      R${plan.price}
                      <span className="text-base font-normal text-zinc-600">
                        /mês
                      </span>
                    </div>
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button className="w-full bg-zinc-800 text-white hover:bg-zinc-700">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="mb-8 text-center text-3xl font-bold">
            O que nossos clientes dizem
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none bg-zinc-50">
                <CardContent className="pt-6">
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="mr-3 h-10 w-10 rounded-full bg-zinc-300"></div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-zinc-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="mb-8 text-center text-3xl font-bold">
            Perguntas Frequentes
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-none bg-zinc-50">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                >
                  <CardTitle className="flex items-center justify-between text-xl">
                    {faq.question}
                    {openFAQ === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </CardTitle>
                </CardHeader>
                {openFAQ === index && (
                  <CardContent>
                    <p>{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="mb-8 text-center text-3xl font-bold">Integrações</h3>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="flex h-20 w-40 items-center justify-center rounded-lg bg-zinc-100 p-4"
              >
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="container mx-auto p-8 text-center text-zinc-600">
        <p>© 2024 ecustomer. Todos os direitos reservados.</p>
        <div className="mt-4 space-x-4">
          <a
            href="#"
            className="transition-colors duration-200 hover:text-zinc-900"
          >
            Termos de Serviço
          </a>
          <a
            href="#"
            className="transition-colors duration-200 hover:text-zinc-900"
          >
            Política de Privacidade
          </a>
          <a
            href="#"
            className="transition-colors duration-200 hover:text-zinc-900"
          >
            Contato
          </a>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 py-4 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm">Pronto para impulsionar seu negócio?</p>
          <Button className="bg-white text-zinc-800 hover:bg-zinc-100">
            Comece agora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatisticsSection() {
  const stats = [
    { value: 5000, label: 'Clientes Satisfeitos' },
    { value: 1000000, label: 'Vendas Gerenciadas' },
    { value: 500, label: 'Horas Economizadas' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-16 rounded-lg bg-zinc-100 p-8"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat, index) => (
          <AnimatedStat key={index} value={stat.value} label={stat.label} />
        ))}
      </div>
    </motion.div>
  )
}

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      // const start = 0
      const end = value
      const duration = 2000
      let startTimestamp: number | null = null

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }

      window.requestAnimationFrame(step)
    }
  }, [isInView, value])

  return (
    <div ref={ref} className="text-center">
      <div className="mb-2 text-4xl font-bold">{count.toLocaleString()}</div>
      <div className="text-zinc-600">{label}</div>
    </div>
  )
}
