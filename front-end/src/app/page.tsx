"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  ShoppingCart,
  FileText,
  TrendingUp,
  CheckCircle,
  MapPin,
  Mail,
  Phone,
  Building2,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ModeToggle } from "@/app/components/toggleThemeButton";
// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Counter animation component
const AnimatedCounter = ({
  end,
  duration = 2,
}: {
  end: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1
        );
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}%</span>;
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        style={{ y: headerY }}
        className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Building2 className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="font-bold text-xl text-foreground">SisGest</span>
            </motion.div>
            <motion.div
              key={"toggle"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ModeToggle />
            </motion.div>
          </div>
          <motion.nav
            className="hidden md:flex gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {["Inicio", "Problema", "Solución", "Beneficios", "Contacto"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              )
            )}
          </motion.nav>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="inicio"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-muted/50 overflow-hidden"
        >
          <motion.div
            style={{ y: heroY }}
            className="container px-4 md:px-6 mx-auto"
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Badge variant="secondary" className="mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  Las Tunas, Riohacha - La Guajira
                </Badge>
              </motion.div>
              <div className="space-y-2 max-w-4xl">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-foreground"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Sistema de Gestión para
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    {" "}
                    Pequeños Negocios
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Optimiza los procesos administrativos de tu negocio con
                  nuestra solución tecnológica diseñada específicamente para
                  comerciantes del barrio Las Tunas.
                </motion.p>
              </div>
              <motion.div
                className="space-x-4 pt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button size="lg" className="h-12 px-8">
                    <Target className="w-4 h-4 mr-2" />
                    Conocer Más
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 bg-transparent"
                  >
                    Ver Demo
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Problem Statement */}
        <section
          id="problema"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-foreground">
                El Desafío de los Pequeños Negocios
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Los pequeños comerciantes enfrentan múltiples obstáculos en la
                gestión diaria de sus negocios
              </p>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="space-y-4">
                  {[
                    {
                      title: "Procesos Manuales Ineficientes",
                      description:
                        "Gestión de inventarios, facturación y clientes mediante métodos tradicionales que generan errores y pérdida de tiempo.",
                    },
                    {
                      title: "Falta de Herramientas Tecnológicas",
                      description:
                        "Ausencia de sistemas digitales accesibles que se adapten a las necesidades específicas de los pequeños comerciantes.",
                    },
                    {
                      title: "Dificultades en la Toma de Decisiones",
                      description:
                        "Carencia de información organizada y análisis de datos para la planificación estratégica del negocio.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3"
                      variants={staggerItem}
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        viewport={{ once: true }}
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="bg-muted/50 border rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    className="text-4xl font-bold text-destructive"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    99.5%
                  </motion.div>
                  <p className="text-sm text-muted-foreground">
                    de las empresas en Colombia son PYMEs, pero muchas aún
                    operan con métodos tradicionales
                  </p>
                </div>
                <motion.div
                  className="mt-6 space-y-3"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    { label: "Comercio presencial", value: "95.6%" },
                    { label: "Sin contabilidad formal", value: "57.5%" },
                    { label: "Uso de software contable", value: "11.4%" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between"
                      variants={staggerItem}
                    >
                      <span className="text-sm text-foreground">
                        {stat.label}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {stat.value}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section
          id="solucion"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-foreground">
                Nuestra Solución
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Un sistema de gestión integral diseñado específicamente para las
                necesidades de los pequeños negocios
              </p>
            </motion.div>
            <motion.div
              className="grid gap-6 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: ShoppingCart,
                  title: "Gestión de Inventarios",
                  description:
                    "Control automatizado de stock, alertas de productos agotados y seguimiento de movimientos de inventario.",
                },
                {
                  icon: FileText,
                  title: "Facturación Digital",
                  description:
                    "Generación automática de facturas, control de pagos y seguimiento de cuentas por cobrar.",
                },
                {
                  icon: Users,
                  title: "Gestión de Clientes",
                  description:
                    "Base de datos de clientes, historial de compras y herramientas para fidelización.",
                },
              ].map((solution, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow h-full">
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CardHeader>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 2.5 }}
                          transition={{ duration: 0.5 }}
                        >
                          <solution.icon className="h-12 w-12 text-primary mb-4" />
                        </motion.div>
                        <CardTitle className="text-card-foreground">
                          {solution.title}
                        </CardTitle>
                        <CardDescription>
                          {solution.description}
                        </CardDescription>
                      </CardHeader>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="beneficios"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-foreground">
                Beneficios Comprobados
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Resultados reales que transformarán la gestión de tu negocio
              </p>
            </motion.div>
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: TrendingUp,
                  value: 30,
                  label: "Reducción en tiempo de procesamiento",
                  color: "green",
                },
                {
                  icon: Shield,
                  value: 25,
                  label: "Disminución de errores administrativos",
                  color: "blue",
                },
                {
                  icon: BarChart3,
                  value: 40,
                  label: "Mejora en control financiero",
                  color: "purple",
                },
                {
                  icon: Zap,
                  value: 50,
                  label: "Optimización en planificación estratégica",
                  color: "orange",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center space-y-4"
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`mx-auto w-16 h-16 bg-${benefit.color}-500/10 border border-${benefit.color}-500/20 rounded-full flex items-center justify-center`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <benefit.icon
                      className={`h-8 w-8 text-${benefit.color}-600 dark:text-${benefit.color}-400`}
                    />
                  </motion.div>
                  <div>
                    <motion.div
                      className={`text-3xl font-bold text-${benefit.color}-600 dark:text-${benefit.color}-400`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <AnimatedCounter end={benefit.value} />
                    </motion.div>
                    <p className="text-sm text-muted-foreground">
                      {benefit.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features List */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-6"
                variants={fadeInLeft}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-foreground">
                  Características Principales
                </h2>
                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    "Interfaz intuitiva y fácil de usar",
                    "Acceso desde cualquier dispositivo",
                    "Reportes automáticos y análisis de datos",
                    "Seguridad y respaldo de información",
                    "Soporte técnico especializado",
                    "Adaptado a la realidad local",
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      variants={staggerItem}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      </motion.div>
                      <span className="text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                className="bg-card border border-border rounded-lg p-8 shadow-lg"
                variants={fadeInRight}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-card-foreground">
                  Desarrollado por:
                </h3>
                <motion.div
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      name: "Dilan David Torres Martinez",
                      role: "Ingeniero de Sistemas",
                    },
                    {
                      name: "Joenis Joseph Rivadeneira Rodriguez",
                      role: "Ingeniero de Sistemas",
                    },
                  ].map((dev, index) => (
                    <motion.div key={index} variants={staggerItem}>
                      <p className="font-medium text-card-foreground">
                        {dev.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dev.role}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  className="mt-6 pt-6 border-t border-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-card-foreground">
                      Universidad de la Guajira
                    </strong>
                    <br />
                    Facultad de Ingeniería
                    <br />
                    Programa de Ingeniería de Sistemas
                    <br />
                    2024
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  ¿Listo para Transformar tu Negocio?
                </motion.h2>
                <motion.p
                  className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Únete a la revolución digital y optimiza los procesos
                  administrativos de tu negocio hoy mismo.
                </motion.p>
              </div>
              <motion.div
                className="space-x-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button size="lg" variant="secondary" className="h-12 px-8">
                    Solicitar Demo
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  >
                    Más Información
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contacto"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="text-center mb-12"
              variants={fadeInUp}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-foreground">
                Contáctanos
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Estamos aquí para ayudarte a optimizar tu negocio
              </p>
            </motion.div>
            <motion.div
              className="grid gap-6 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: MapPin,
                  title: "Ubicación",
                  content: [
                    "Barrio Las Tunas",
                    "Riohacha, La Guajira",
                    "Colombia",
                  ],
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: ["info@sisgest.com", "soporte@sisgest.com"],
                },
                {
                  icon: Phone,
                  title: "Teléfono",
                  content: ["+57 (5) 123-4567", "WhatsApp: +57 300 123 4567"],
                },
              ].map((contact, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="bg-card border-border h-full">
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CardHeader className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <contact.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                        </motion.div>
                        <CardTitle className="text-card-foreground">
                          {contact.title}
                        </CardTitle>
                        <CardDescription>
                          {contact.content.map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < contact.content.length - 1 && <br />}
                            </span>
                          ))}
                        </CardDescription>
                      </CardHeader>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <motion.footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 SisGest - Sistema de Gestión para Pequeños Negocios. Todos
            los derechos reservados.
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Desarrollado por</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge variant="outline">Universidad de la Guajira</Badge>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
