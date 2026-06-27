"use client";

import React from "react";
import { LenisProvider } from "@/components/ui/lenis-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { CommandPalette } from "@/components/layout/command-palette";
import { MarketingNavbar } from "@/components/layout/navbar";
import { HeroBackground3D } from "@/components/landing/hero-background-3d";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustedCompanies } from "@/components/landing/trusted-companies";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { CodingStudioShowcase } from "@/components/landing/coding-studio-showcase";
import { AIWorkflowBuilder } from "@/components/landing/ai-workflow-builder";
import { AgentMarketplace } from "@/components/landing/agent-marketplace";
import { ResumeStudioShowcase } from "@/components/landing/resume-studio-showcase";
import { ChromeExtensionShowcase } from "@/components/landing/chrome-extension-showcase";
import { GitHubAnalyzerShowcase } from "@/components/landing/github-analyzer-showcase";
import { CareerRoadmapTimeline } from "@/components/landing/career-roadmap-timeline";
import { CommunityOpenSource } from "@/components/landing/community-open-source";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQAccordion } from "@/components/landing/faq-accordion";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  return (
    <LenisProvider>
      <div className="relative min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans antialiased">
        {/* Custom Magnetic Mouse Cursor */}
        <CustomCursor />

        {/* Global ⌘K Command Palette Modal */}
        <CommandPalette />

        {/* Unified Glassmorphic Navbar */}
        <MarketingNavbar />

        {/* Hero Section Container with Performant 3D Background */}
        <div className="relative z-10">
          <HeroBackground3D />
          <HeroSection />
        </div>

        {/* Targeted Companies Marquee */}
        <TrustedCompanies />

        {/* Interactive Dashboard Showcase */}
        <DashboardPreview />

        {/* Coding Studio & Playground Showcase */}
        <CodingStudioShowcase />

        {/* Automated Agent Workflow Pipeline */}
        <AIWorkflowBuilder />

        {/* 146 AI Agent Ecosystem Marketplace */}
        <AgentMarketplace />

        {/* ATS Resume Studio Suite */}
        <ResumeStudioShowcase />

        {/* Chrome Extension Browser Mockup */}
        <ChromeExtensionShowcase />

        {/* GitHub Codebase Analyzer */}
        <GitHubAnalyzerShowcase />

        {/* Personalized Career Execution Timeline */}
        <CareerRoadmapTimeline />

        {/* Verified Open Source Architecture */}
        <CommunityOpenSource />

        {/* Pricing Tiers & Billing Switcher */}
        <PricingSection />

        {/* FAQ Accordion */}
        <FAQAccordion />

        {/* High-Conversion CTA Banner */}
        <CTASection />

        {/* Unified Enterprise Sitemap Footer */}
        <Footer />
      </div>
    </LenisProvider>
  );
}
