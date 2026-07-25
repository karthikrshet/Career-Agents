// apps/web/src/components/seo/json-ld.tsx
// Server component — renders JSON-LD structured data for AI discoverability

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://career-os.vercel.app';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Career OS',
  url: baseUrl,
  logo: `${baseUrl}/icons/icon-192.png`,
  description: 'AI-powered career intelligence platform with 146 specialized agents',
  foundingDate: '2024',
  sameAs: [
    'https://github.com/karthikrshet/Career-Agents',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'technical support',
    url: 'https://github.com/karthikrshet/Career-Agents/issues',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Career OS',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: baseUrl,
  description: 'Career OS is an AI-powered career intelligence platform with 146 specialized agents for resume analysis, GitHub portfolio auditing, LinkedIn optimization, interview preparation, and job tracking.',
  featureList: [
    'AI Resume ATS Analysis',
    'GitHub Portfolio Auditing',
    'LinkedIn Profile Optimization',
    'AI Mock Interview Practice',
    'Job Application Tracker',
    '146 Specialized Career AI Agents',
    'Model Context Protocol (MCP) Integration',
    'Plugin Marketplace',
    'Career Copilot Chat',
    'Multi-Provider AI Router (OpenAI, Claude, Gemini, Groq, Ollama, etc.)',
  ],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: {
    '@type': 'Person',
    name: 'Karthik R Shet',
    url: 'https://github.com/karthikrshet',
  },
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/karthikrshet/Career-Agents',
  programmingLanguage: ['TypeScript', 'JavaScript', 'Python'],
  softwareVersion: '2.5.0',
  releaseNotes: `${baseUrl}/credits`,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Career OS',
  url: baseUrl,
  description: 'AI-powered career intelligence platform with 146 specialized agents',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/copilot?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Career OS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Career OS is an AI-powered career intelligence platform featuring 146 specialized career agents that help engineers optimize their resume, GitHub portfolio, LinkedIn profile, and interview performance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which AI providers does Career OS support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Career OS supports OpenAI, Anthropic Claude, Google Gemini, Groq, OpenRouter, Ollama, LM Studio, Azure OpenAI, DeepSeek, Together AI, Mistral, Cohere, and xAI Grok.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Career OS open source?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Career OS is fully open source under the MIT license. The agent registry, division schemas, and validation pipeline are all available at github.com/karthikrshet/Career-Agents.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is MCP in Career OS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCP stands for Model Context Protocol. Career OS exposes all 146 career agents as MCP tools, letting Cursor, Claude Desktop, VS Code, and other compatible AI clients connect directly to the agent registry.',
      },
    },
  ],
};

export function JsonLd() {
  const schemas = [organizationSchema, softwareSchema, websiteSchema, faqSchema];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
