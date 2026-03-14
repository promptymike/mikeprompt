export type AIModel = {
  id: string;
  name: string;
  provider: string;
  icon: string;
  tier: "free" | "cheap" | "mid" | "premium";
  monthlyPrice: number | null;
  inputPricePerM: number;
  outputPricePerM: number;
  contextWindow: number;
  strengths: string[];
  weaknesses: string[];
  bestFor: string[];
  notGoodFor: string[];
  speedRating: 1 | 2 | 3 | 4 | 5;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  privacyRating: 1 | 2 | 3 | 4 | 5;
  supportsFiles: boolean;
  supportsImages: boolean;
  supportsCode: boolean;
  hasWebSearch: boolean;
};

export const MODELS: AIModel[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    icon: "🟠",
    tier: "mid",
    monthlyPrice: 20,
    inputPricePerM: 3,
    outputPricePerM: 15,
    contextWindow: 200000,
    strengths: [
      "Exceptional reasoning and analysis",
      "Long-form document writing",
      "Following complex multi-step instructions",
      "Privacy — no training on your data",
      "200k context window",
    ],
    weaknesses: [
      "Slower than Haiku",
      "Higher cost per token",
      "No real-time web access by default",
    ],
    bestFor: [
      "Complex analysis and research",
      "Writing long documents or reports",
      "Confidential or sensitive data",
      "Detailed coding projects",
      "Nuanced reasoning tasks",
    ],
    notGoodFor: [
      "Quick one-liner answers",
      "Tasks needing live web data",
    ],
    speedRating: 3,
    qualityRating: 5,
    privacyRating: 5,
    supportsFiles: true,
    supportsImages: true,
    supportsCode: true,
    hasWebSearch: false,
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 3",
    provider: "Anthropic",
    icon: "🟠",
    tier: "cheap",
    monthlyPrice: 20,
    inputPricePerM: 0.25,
    outputPricePerM: 1.25,
    contextWindow: 200000,
    strengths: [
      "Extremely fast responses",
      "Very low cost per token",
      "200k context window",
      "Privacy — no training on your data",
      "Good for high-volume tasks",
    ],
    weaknesses: [
      "Lower quality than Sonnet",
      "Struggles with complex reasoning",
      "Not ideal for nuanced tasks",
    ],
    bestFor: [
      "High-volume API tasks",
      "Fast Q&A and summarization",
      "Chatbots and customer support",
      "Simple classification or extraction",
      "Budget-conscious projects",
    ],
    notGoodFor: [
      "Deep analysis or research",
      "Complex multi-step reasoning",
    ],
    speedRating: 5,
    qualityRating: 3,
    privacyRating: 5,
    supportsFiles: true,
    supportsImages: true,
    supportsCode: true,
    hasWebSearch: false,
  },
  {
    id: "chatgpt-4o",
    name: "ChatGPT 4o",
    provider: "OpenAI",
    icon: "🟢",
    tier: "mid",
    monthlyPrice: 20,
    inputPricePerM: 2.5,
    outputPricePerM: 10,
    contextWindow: 128000,
    strengths: [
      "Excellent creative writing",
      "Strong code generation",
      "Large plugin and tool ecosystem",
      "Multimodal (text, images, voice)",
      "Great for brainstorming",
    ],
    weaknesses: [
      "OpenAI may use chats for training",
      "Shorter context than Claude",
      "Can be verbose",
    ],
    bestFor: [
      "Creative writing and brainstorming",
      "Code generation and debugging",
      "General-purpose Q&A",
      "Using GPT plugins or tools",
      "Multimodal tasks",
    ],
    notGoodFor: [
      "Confidential or sensitive data",
      "Very long document processing",
    ],
    speedRating: 4,
    qualityRating: 5,
    privacyRating: 2,
    supportsFiles: true,
    supportsImages: true,
    supportsCode: true,
    hasWebSearch: true,
  },
  {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    icon: "🔵",
    tier: "mid",
    monthlyPrice: 20,
    inputPricePerM: 1.25,
    outputPricePerM: 5,
    contextWindow: 1000000,
    strengths: [
      "Massive 1M token context window",
      "Google Workspace integration",
      "Multimodal (text, images, video, audio)",
      "Real-time web access via Google Search",
      "Competitive pricing",
    ],
    weaknesses: [
      "Google collects usage data",
      "Can hallucinate with confidence",
      "Inconsistent instruction-following",
    ],
    bestFor: [
      "Processing very long documents",
      "Research with web search",
      "Google Workspace workflows",
      "Video and audio analysis",
      "Multilingual tasks",
    ],
    notGoodFor: [
      "Sensitive or confidential data",
      "Tasks requiring strict accuracy",
    ],
    speedRating: 3,
    qualityRating: 4,
    privacyRating: 2,
    supportsFiles: true,
    supportsImages: true,
    supportsCode: true,
    hasWebSearch: true,
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    provider: "Microsoft",
    icon: "🟣",
    tier: "premium",
    monthlyPrice: 30,
    inputPricePerM: 0,
    outputPricePerM: 0,
    contextWindow: 128000,
    strengths: [
      "Deep Microsoft 365 integration",
      "Works inside Word, Excel, Teams, Outlook",
      "Enterprise data security",
      "Summarizes meetings in Teams",
      "Flat-rate pricing for businesses",
    ],
    weaknesses: [
      "Requires Microsoft 365 subscription",
      "Limited outside Microsoft ecosystem",
      "Higher base cost",
    ],
    bestFor: [
      "Microsoft 365 power users",
      "Summarizing Teams meetings",
      "Drafting emails in Outlook",
      "Excel formula and data tasks",
      "Corporate enterprise workflows",
    ],
    notGoodFor: [
      "Users outside Microsoft ecosystem",
      "Creative or open-ended tasks",
    ],
    speedRating: 3,
    qualityRating: 4,
    privacyRating: 4,
    supportsFiles: true,
    supportsImages: true,
    supportsCode: true,
    hasWebSearch: true,
  },
  {
    id: "perplexity",
    name: "Perplexity Pro",
    provider: "Perplexity AI",
    icon: "⚫",
    tier: "cheap",
    monthlyPrice: 20,
    inputPricePerM: 0,
    outputPricePerM: 0,
    contextWindow: 32000,
    strengths: [
      "Real-time web search with citations",
      "Fact-checking with sources",
      "Current events and news",
      "Transparent sourcing",
      "Affordable flat rate",
    ],
    weaknesses: [
      "Smaller context window",
      "Less capable for generation tasks",
      "Not ideal for long documents",
    ],
    bestFor: [
      "Research with cited sources",
      "Fact-checking claims",
      "Current events and news",
      "Quick web research",
      "Academic reference gathering",
    ],
    notGoodFor: [
      "Long-form content generation",
      "Complex reasoning without web data",
    ],
    speedRating: 5,
    qualityRating: 3,
    privacyRating: 3,
    supportsFiles: false,
    supportsImages: false,
    supportsCode: false,
    hasWebSearch: true,
  },
];
