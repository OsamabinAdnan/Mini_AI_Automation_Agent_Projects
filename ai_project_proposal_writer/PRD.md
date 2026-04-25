# 🤖 AI Freelance Proposal Writer - Cyberpunk Edition

# 🤖 AI Freelance Proposal Writer - Cyberpunk Edition
## Complete Product Requirements Document (PRD)

---

**Version:** 3.0.0  
**Last Updated:** 2024  
**Status:** Ready for Development  
**Tech Stack Cost:** $0 (100% Free Tier)  
**Estimated Timeline:** 4 Weeks

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Design System](#design-system)
4. [Three.js + Framer Motion + GSAP Integration](#threejs--framer-motion--gsap-integration)
5. [OpenAI Agent SDK with Free Providers](#openai-agent-sdk-with-free-providers)
6. [Database Schema](#database-schema)
7. [API Specifications](#api-specifications)
8. [Frontend Components](#frontend-components)
9. [Animation System](#animation-system)
10. [Deployment Guide](#deployment-guide)
11. [Environment Variables](#environment-variables)
12. [Development Phases](#development-phases)
13. [Testing Strategy](#testing-strategy)
14. [Success Metrics](#success-metrics)

---

## 1. Project Overview

### 1.1 Product Vision
Build an immersive, cyberpunk-themed web application that uses **OpenAI Agent SDK** (with free third-party LLM providers) to generate personalized freelance job proposals. The application features a **3D interactive background** (Three.js) with **smooth animations** (Framer Motion + GSAP) for a premium user experience.

### 1.2 Target Users
- Freelancers on Upwork, Fiverr, Toptal, and Freelancer.com
- Job seekers writing cover letters
- Agencies bidding on projects
- Non-native English writers needing proposal assistance

### 1.3 Core Value Proposition
| **Pain Point** | **Solution** | **Time Saved** |
|:---|:---|:---|
| Writer's block | AI generates first draft instantly | 10 minutes |
| Generic proposals | Extracts specific JD skills | High quality |
| Inconsistent quality | Standardized proven structure | Reliable output |
| Time consuming | 3-second generation | 90% faster |

---

## 2. Technical Architecture

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ USER BROWSER │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ VERCEL (FRONTEND)                                               │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ Next.js      │ │ Three.js     │ │ Shadcn UI    │              │
│ │ App Router   │ │ (3D Scene)   │ │ Components   │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
│ ┌──────────────┐ ┌──────────────┐                               │
│ │Framer Motion │ │ GSAP         │                               │
│ │ (React Anim) │ │ (Complex FX) │                               │
│ └──────────────┘ └──────────────┘                               │
│                                                                 │
│ Domain: https://proposal-writer.vercel.app                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTPS (REST API)
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ HUGGING FACE SPACES (BACKEND)                                   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ FastAPI      │ │ Uvicorn      │ │ LiteLLM      │              │
│ │ Routes       │ │ Server       │ │ Adapter      │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
│ ┌──────────────┐                                                │
│ │OpenAI Agent  │                                                │
│ │ SDK          │                                                │
│ └──────────────┘                                                │
│                                                                 │
│ Domain: https://hf.space/proposal-writer-backend                │
└─────┬──────────────────────┬────────────────────────────────────┘
      │                      │
      ▼                      ▼
┌─────────────┐    ┌─────────────────────────────────┐
│ SUPABASE    │    │ FREE LLM PROVIDERS              │
│ (Database)  │    │ (via LiteLLM + OpenAI SDK)      │
├─────────────┤    ├─────────────────────────────────┤
│ PostgreSQL  │    │ • Groq (Llama 3 70B) - Fastest  │
│ Auth (JWT)  │    │ • Together.ai (Llama 3) - High Q│
│ Row Level   │    │ • Google Gemini - Multimodal    │
│ Security    │    │ • DeepSeek - Long context       │
└─────────────┘    └─────────────────────────────────┘
```


### 2.2 Animation Tech Stack Breakdown

| **Library** | **Purpose** | **Use Cases** |
|:---|:---|:---|
| **Three.js** | 3D background visuals | Particle systems, neon grids, light trails |
| **Framer Motion** | React-based animations | Page transitions, hover effects, gesture animations |
| **GSAP** | Complex timeline animations | Scanning line effects, typewriter sequences, parallax |

### 2.3 Folder Structure (Complete)

```
ai_project_proposal_writer/
│
├── frontend/ # Deploys to VERCEL
│ ├── app/
│ │ ├── layout.tsx # Root layout + Three.js container
│ │ ├── page.tsx # Landing page
│ │ ├── dashboard/
│ │ │ ├── page.tsx # Main proposal generator
│ │ │ └── saved/
│ │ │ └── page.tsx # Saved proposals list
│ │ ├── api/
│ │ │ └── proxy/
│ │ │ └── route.ts # Proxy to backend
│ │ └── globals.css # Tailwind + cyberpunk theme
│ │
│ ├── components/
│ │ ├── three/
│ │ │ ├── ThreeScene.tsx # Main Three.js container
│ │ │ ├── ParticleSystem.tsx # Floating neon particles
│ │ │ ├── CyberpunkGrid.tsx # 3D grid floor
│ │ │ └── LightTrails.tsx # Mouse-following light trails
│ │ ├── animations/
│ │ │ ├── PageTransition.tsx # Framer Motion page wrapper
│ │ │ ├── TypewriterText.tsx # GSAP typewriter effect
│ │ │ ├── ScanningLine.tsx # GSAP continuous scan
│ │ │ └── CyberHoverCard.tsx # Framer Motion hover effects
│ │ ├── ui/
│ │ │ ├── CyberButton.tsx # Neon glowing button (Framer)
│ │ │ ├── TerminalInput.tsx # JD input with cursor (GSAP)
│ │ │ ├── ProposalCard.tsx # Saved proposal display (Framer)
│ │ │ └── ToneSelector.tsx # 3-option toggle (Framer)
│ │ └── layout/
│ │ ├── Header.tsx # Cyberpunk navigation
│ │ └── GridBackground.tsx # CSS grid overlay
│ │
│ ├── lib/
│ │ ├── supabase.ts # Supabase client
│ │ ├── api.ts # Backend API calls
│ │ └── utils.ts # Helpers
│ │
│ ├── hooks/
│ │ ├── useProposal.ts # Generate proposal mutation
│ │ ├── useGSAPAnimation.ts # GSAP animation hook
│ │ └── useSavedProposals.ts # Fetch saved proposals
│ │
│ ├── types/
│ │ └── index.ts # TypeScript interfaces
│ │
│ ├── tailwind.config.js # Cyberpunk theme config
│ ├── next.config.js # Next.js configuration
│ └── package.json
│
├── backend/ # Deploys to HUGGING FACE
│ ├── main.py # FastAPI entry point
│ ├── requirements.txt # Python dependencies
│ ├── Dockerfile # Container config
│ ├── config.py # Environment loader
│ │
│ ├── routes/
│ │ ├── init.py
│ │ ├── generate.py # POST /api/generate
│ │ ├── proposals.py # CRUD for proposals
│ │ └── auth.py # Auth validation
│ │
│ ├── agents/
│ │ ├── init.py
│ │ └── proposal_agent.py # OpenAI Agent + LiteLLM
│ │
│ ├── models/
│ │ ├── init.py
│ │ └── schemas.py # Pydantic models
│ │
│ └── middleware/
│ └── cors.py # CORS configuration
│
└── supabase/ # LOCAL ONLY - NOT DEPLOYED
└── migrations/
├── 001_initial_schema.sql
└── 002_row_level_security.sql
```


---

## 3. Design System

### 3.1 Color Palette: Cyberpunk Neon

| **Color Name** | **Hex** | **RGB** | **Usage** |
|:---|:---|:---|:---|
| Deep Void | #0A0A0F | (10,10,15) | Main background |
| Dark Grid | #0F0F1A | (15,15,26) | Card backgrounds |
| Neon Cyan | #00FFE0 | (0,255,224) | Primary buttons, links |
| Neon Pink | #FF007F | (255,0,127) | Hover states, accents |
| Neon Purple | #9D00FF | (157,0,255) | Borders, active |
| Electric Yellow | #FFE600 | (255,230,0) | Warnings, highlights |
| Matrix Green | #00FF41 | (0,255,65) | Success, AI status |
| Text Primary | #E0E0E0 | (224,224,224) | Main text |
| Text Dim | #888888 | (136,136,136) | Secondary text |

### 3.2 Typography

```css
/* Tailwind configuration */
fontFamily: {
  'jet-mono': ['JetBrains Mono', 'monospace'],
  'mono': ['JetBrains Mono', 'monospace'],
}

fontSize: {
  'xs': '0.75rem',    /* 12px */
  'sm': '0.875rem',   /* 14px */
  'base': '1rem',     /* 16px */
  'lg': '1.125rem',   /* 18px */
  'xl': '1.25rem',    /* 20px */
  '2xl': '1.5rem',    /* 24px */
  '3xl': '2rem',      /* 32px */
}
```

## 4. Three.js + Framer Motion + GSAP Integration

### 4.1 Dependencies

```json
{
  "three": "^0.128.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0",
  "@react-three/postprocessing": "^2.15.0",
  "framer-motion": "^10.16.0",
  "gsap": "^3.12.0",
  "@gsap/react": "^2.1.0"
}
```

### 4.2 Three.js Scene with Framer Motion Integration

```tsx
// frontend/components/three/ThreeScene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Grid, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Custom component: Floating Neon Particles
function ParticleSystem() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 800;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 50;
    positions[i*3+1] = (Math.random() - 0.5) * 30;
    positions[i*3+2] = (Math.random() - 0.5) * 30 - 20;
  }
  
  // GSAP animation for particles
  useGSAP(() => {
    if (particlesRef.current) {
      gsap.to(particlesRef.current.rotation, {
        y: Math.PI * 2,
        duration: 60,
        repeat: -1,
        ease: "none"
      });
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00FFE0"
        size={0.1}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Main Scene Component with Framer Motion integration
export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  // Framer Motion scroll-based opacity
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  
  // GSAP initial animation
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "power2.inOut" }
      );
    }
  }, []);
  
  return (
    <motion.div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#0A0A0F' }}
      >
        <Suspense fallback={null}>
          {/* Ambient Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#FF007F" />
          <pointLight position={[-10, 5, -5]} intensity={0.3} color="#00FFE0" />
          
          {/* Cyberpunk Grid Floor */}
          <Grid
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#00FFE0"
            sectionSize={3}
            sectionThickness={1.5}
            sectionColor="#FF007F"
            fadeDistance={25}
            fadeStrength={1.5}
            followCamera={false}
          />
          
          {/* Floating Particles */}
          <ParticleSystem />
          
          {/* Stars Background */}
          <Stars
            radius={100}
            depth={50}
            count={1500}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          
          {/* Neon Post-Processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.SCREEN}
            />
            <ChromaticAberration
              offset={[0.002, 0.002]}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
          
          {/* Auto-rotating camera */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
```

### 4.3 Framer Motion Page Transitions

```tsx
// frontend/components/animations/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // Cyberpunk easing curve
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

const childVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10"
      >
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered container for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: { opacity: 0, y: -30 }
};

export const neonPulse = {
  animate: {
    textShadow: [
      "0 0 0px rgba(0, 255, 224, 0)",
      "0 0 10px rgba(0, 255, 224, 0.8)",
      "0 0 20px rgba(0, 255, 224, 0.5)",
      "0 0 0px rgba(0, 255, 224, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

### 4.4 GSAP Complex Animations

```tsx
// frontend/components/animations/TypewriterText.tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, onComplete, className = '', speed = 0.03 }: TypewriterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (textRef.current && text) {
      // Clear and setup
      textRef.current.innerHTML = '';
      const chars = text.split('');
      
      // Create timeline
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
          // Add blinking cursor effect
          gsap.to('.cursor-blink', {
            opacity: 0,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
          });
        }
      });
      
      // Animate each character
      chars.forEach((char, i) => {
        tl.to(textRef.current, {
          duration: speed,
          onUpdate: function() {
            if (textRef.current) {
              textRef.current.innerHTML = text.substring(0, Math.floor(this.progress() * (i + 1)));
            }
          },
          ease: "none"
        }, i * speed);
      });
    }
  }, [text]);
  
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div ref={textRef} className="font-mono text-neon-cyan" />
      <span className="cursor-blink inline-block w-0.5 h-5 bg-neon-cyan ml-1" />
    </div>
  );
}

// Scanning line animation (GSAP)
export function ScanningLine() {
  const lineRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (lineRef.current) {
      gsap.to(lineRef.current, {
        y: '100%',
        duration: 3,
        repeat: -1,
        ease: "none",
        modifiers: {
          y: gsap.utils.unitize(y => parseFloat(y) % 100)
        }
      });
    }
  });
  
  return (
    <div 
      ref={lineRef}
      className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent pointer-events-none"
      style={{ y: '-100%' }}
    />
  );
}

// Cyber hover card with GSAP + Framer
export function CyberHoverCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  
  const onMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
```

### 4.5 Performance Optimization

```tsx
// frontend/app/layout.tsx
import dynamic from 'next/dynamic';
import { PageTransition } from '@/components/animations/PageTransition';

// Lazy load Three.js to prevent SSR issues
const ThreeScene = dynamic(
  () => import('@/components/three/ThreeScene'),
  {
    ssr: false,
    loading: () => (
      <motion.div 
        className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0A0A0F] to-[#1A0A2E]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    )
  }
);

// Mobile detection for performance
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|Android/i.test(navigator.userAgent);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    setIsMobile(isMobileDevice());
    // Detect low-end devices by checking memory or cores
    const memory = (navigator as any).deviceMemory;
    setIsLowEnd(memory && memory < 4);
  }, []);
  
  const shouldShow3D = !isMobile && !isLowEnd;
  
  return (
    <html lang="en">
      <body className="font-jet-mono">
        {shouldShow3D ? <ThreeScene /> : (
          <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0A0A0F] to-[#1A0A2E]" />
        )}
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
```

## 5. OpenAI Agent SDK with Free Providers

### 5.1 Why OpenAI Agent SDK + LiteLLM?

| **Component** | **Purpose** | **Benefit** |
| --- | --- | --- |
| **OpenAI Agents SDK** | Agent orchestration, tool calling, multi-step reasoning | Production-ready agent framework |
| **LiteLLM** | Unified interface for 100+ LLM providers | Use ANY free model with same code |
| **Free Providers** | Actual LLM inference | $0 cost |

### 5.2 Supported Free Providers

| **Provider** | **Model** | **Free Tier Limits** | **Best For** |
| --- | --- | --- | --- |
| **Groq** | Llama 3 70B | 30 req/min, 14,400/day | Fastest generation (<1s) |
| **[Together.ai](https://together.ai/)** | Llama 3 70B, Mixtral | 5 req/min, unlimited | High quality output |
| **Google Gemini** | Gemini 1.5 Flash | 60 req/min | Long context, multimodal |
| **DeepSeek** | DeepSeek V2 | 10 req/min | Long documents |
| **Mistral AI** | Mistral 7B | 1 req/sec | Good balance |

### 5.3 Backend Dependencies

```txt
# backend/requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
supabase==2.5.1
litellm==1.0.0
openai-agents==0.1.0
python-dotenv==1.0.0
httpx==0.25.0
```

### 5.4 OpenAI Agent SDK with third party API Keys Provider Example Code

```python
# backend/agents/proposal_agent.py
# Keep in mind that this is an example code and can be used as a reference to build your own agent. Plus we will use different agents in same agent code so if one agent is failed or not available then it will automatically switch to the next agent in order to eliminate the response failure rate or API rate limit. We are using OpenAI Agent SDK to build this agent.

import os
from dotenv import load_dotenv
from agents import (
    Agent, 
    Runner, 
    OpenAIChatCompletionsModel,
    function_tool,
    set_default_openai_client,
    )
from openai import AsyncOpenAI
from rich import print

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise Exception("Please set the GEMINI_API_KEY environment variable")

BASE_URL= os.getenv("BASE_URL")
if not BASE_URL:
    raise Exception("Please set the BASE_URL environment variable")

# 🌐 Initialize the AsyncOpenAI-compatible client with Gemini details
external_client: AsyncOpenAI = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url=BASE_URL,
)

# 🧠 Model Initialization
model: OpenAIChatCompletionsModel = OpenAIChatCompletionsModel(
    model="gemini-2.5-flash",        # ⚡ Fast Gemini model
    openai_client=external_client
)

# 🛠️ Define tools (functions wrapped for tool calling)
@function_tool
def multiply(a: int, b: int) -> int:
    """Exact multiplication (use this instead of guessing math)."""
    multiplying = a * b
    return f"The product of {a} and {b} is {multiplying}."

@function_tool
def sum(a: int, b: int) -> int:
    """Exact addition (use this instead of guessing math)."""
    adding = a + b
    return f"The sum of {a} and {b} is {adding}."

# 🤖 Create agent and register tools
proposal_agent: Agent = Agent(
    name="Assistant",  # 🧑‍🏫 Agent's identity
    instructions=(
        """
        You are an expert freelance proposal writer with a proven 90% success rate on Upwork and Toptal.
        Your task: Generate a personalized, high-converting proposal from a job description.
        Follow this EXACT structure:
            1. **HOOK (1 sentence)**: Reference a specific detail from the job description. Show you actually read it. Never use "I'm interested in your job post".
            2. **SKILLS MATCH (2-3 sentences)**: 
            "From your description, I see you need {Skill A}, {Skill B}, and {Skill C}. I've successfully delivered..."
            3. **RELEVANT EXPERIENCE (2 sentences)**:
            Use the placeholder [YOUR EXPERIENCE HERE] - the user will fill this.
            4. **VALUE PROPOSITION (2 sentences)**:
            Focus on business outcomes, not technical features. "This means you'll get..."
            5. **CALL TO ACTION (1 sentence)**:
            Suggest a low-friction next step (15-min discovery call, quick sample, or portfolio review).
        RULES:
        - Maximum 180 words
        - No generic phrases: "hardworking", "passionate", "detail-oriented"
        - Active voice only
        - Match the client's language style from their job description
        - End with a specific, easy-to-accept next step
        GENERATE ONLY THE PROPOSAL. NO EXPLANATIONS OR COMMENTS.
        """
    ),
    model=model,
    tools=[multiply, sum],  # 🛠️ Register tools here
)

# 🧪 Run the agent with a prompt (tool calling expected)
prompt = "what is 19 + 23 * 2?"
result = Runner.run_sync(
    proposal_agent, 
    prompt
)

# 📤 Print the final result from the agent
print("\n🤖 CALLING AGENT\n")
print(result.final_output)
```

### 5.5 FastAPI Route with Provider Selection

```python
# backend/routes/generate.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from backend.agents.proposal_agent import generate_proposal
from backend.models.schemas import GenerateRequest, GenerateResponse
from typing import Optional
import asyncio

router = APIRouter(prefix="/api/generate", tags=["generate"])

# Rate limiting (simple in-memory)
rate_limits = {}

def check_rate_limit(ip: str) -> bool:
    """Check if IP has exceeded free tier limits (10 requests per day)"""
    import time
    today = time.strftime("%Y-%m-%d")
    key = f"{ip}:{today}"
    
    if key not in rate_limits:
        rate_limits[key] = 0
    
    if rate_limits[key] >= 10:
        return False
    
    rate_limits[key] += 1
    return True

@router.post("/", response_model=GenerateResponse)
async def generate_proposal_endpoint(
    request: GenerateRequest,
    background_tasks: BackgroundTasks,
    client_ip: str = None  # Extract from request in production
):
    """
    Generate a proposal from job description.
    
    Free tier: 10 requests per day per IP.
    Supports multiple free LLM providers via LiteLLM.
    """
    # Rate limiting
    if not check_rate_limit(client_ip or "anonymous"):
        raise HTTPException(
            status_code=429,
            detail="Daily limit reached (10 proposals). Try again tomorrow."
        )
    
    # Validate input
    if len(request.job_description) < 50:
        raise HTTPException(
            status_code=400,
            detail="Job description must be at least 50 characters"
        )
    
    if len(request.job_description) > 10000:
        raise HTTPException(
            status_code=400,
            detail="Job description too long (max 10,000 characters)"
        )
    
    try:
        # Generate with timeout
        proposal, metadata = await asyncio.wait_for(
            generate_proposal(
                job_description=request.job_description,
                tone=request.tone,
                provider=request.provider
            ),
            timeout=25.0  # 25 second timeout
        )
        
        # Clean up proposal (remove placeholders if still there)
        proposal = proposal.replace("[YOUR EXPERIENCE HERE]", "___[EDIT: Add your relevant experience here]___")
        
        return GenerateResponse(
            success=True,
            proposal=proposal,
            metadata=metadata
        )
        
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=504,
            detail="AI generation timed out. Try again or select a faster provider."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
```

### 5.6 Request/Response Schemas

```python
# backend/models/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class GenerateRequest(BaseModel):
    job_description: str = Field(..., min_length=50, max_length=10000)
    tone: Literal["professional", "friendly", "direct"] = "professional"
    provider: Optional[Literal["fast", "quality", "balanced", "long_context"]] = "balanced"
    user_id: Optional[str] = None

class GenerateResponse(BaseModel):
    success: bool
    proposal: str
    metadata: dict = Field(..., example={
        "provider": "balanced",
        "model": "gemini/gemini-1.5-flash",
        "tone": "professional",
        "word_count": 156,
        "timestamp": "2024-01-25T10:30:00"
    })

class ProposalSaveRequest(BaseModel):
    job_description: str
    generated_proposal: str
    tone: str
    provider_used: Optional[str] = None
    is_favorite: Optional[bool] = False

class ProposalResponse(BaseModel):
    id: str
    generated_text: str
    tone: str
    is_favorite: bool
    provider_used: Optional[str] = None
    created_at: datetime
    job_description: Optional[str] = None
```

## 6. Database Schema

### 6.1 Supabase Setup (One-Time Only)

```sql
-- ============================================
-- 001_initial_schema.sql
-- Run this in Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_used INT DEFAULT 0,
  credits_limit INT DEFAULT 10,  -- Free tier: 10 proposals/day
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job descriptions table
CREATE TABLE job_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  extracted_skills TEXT[],
  word_count INT,
  provider_used TEXT,  -- Which LLM provider was used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals table
CREATE TABLE proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
  generated_text TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('professional', 'friendly', 'direct')),
  word_count INT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_is_favorite ON proposals(is_favorite);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- ============================================
-- 002_row_level_security.sql
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own job descriptions"
  ON job_descriptions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own proposals"
  ON proposals FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 7. API Specifications

### 7.1 Endpoints Overview

| **Method** | **Endpoint** | **Purpose** | **Auth** |
| --- | --- | --- | --- |
| POST | `/api/generate` | Generate proposal with provider selection | Optional |
| POST | `/api/proposals/save` | Save proposal | Yes |
| GET | `/api/proposals/list` | Get saved proposals | Yes |
| GET | `/api/providers` | List available free providers | No  |
| DELETE | `/api/proposals/{id}` | Delete proposal | Yes |

### 7.2 Provider Info Endpoint

``` python
# backend/routes/providers.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/providers", tags=["providers"])

@router.get("/")
async def list_providers():
    """List all available free LLM providers"""
    return {
        "providers": [
            {
                "id": "fast",
                "name": "Groq (Llama 3 70B)",
                "description": "Fastest generation, great for quick drafts",
                "free_tier": "30 requests/minute",
                "avg_latency_ms": 800
            },
            {
                "id": "quality",
                "name": "Together.ai (Llama 3 70B)",
                "description": "Highest quality proposals",
                "free_tier": "5 requests/minute",
                "avg_latency_ms": 2500
            },
            {
                "id": "balanced",
                "name": "Google Gemini 1.5 Flash",
                "description": "Good balance of speed and quality",
                "free_tier": "60 requests/minute",
                "avg_latency_ms": 1500
            },
            {
                "id": "long_context",
                "name": "DeepSeek V2",
                "description": "Best for long job descriptions",
                "free_tier": "10 requests/minute",
                "avg_latency_ms": 2000
            }
        ]
    }
```

## 8. Frontend Components

### 8.1 CyberButton with Framer Motion

```tsx
// frontend/components/ui/CyberButton.tsx
'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CyberButtonProps extends MotionProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CyberButton({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...motionProps
}: CyberButtonProps) {
  const variants = {
    primary: 'border-neon-cyan text-neon-cyan hover:shadow-neon-cyan',
    secondary: 'border-neon-pink text-neon-pink hover:shadow-neon-pink',
    danger: 'border-electric-yellow text-electric-yellow hover:shadow-electric-yellow'
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 },
    disabled: { opacity: 0.5, scale: 1 }
  };
  
  return (
    <motion.button
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "disabled"}
      whileTap={!disabled && !loading ? "tap" : "disabled"}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative px-6 py-3 font-mono text-sm uppercase tracking-wider
        border-2 bg-transparent backdrop-blur-sm
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...motionProps}
    >
      {loading ? (
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>GENERATING...</span>
        </motion.div>
      ) : children}
      
      {/* Neon glow overlay */}
      <motion.div 
        className="absolute inset-0 opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-current blur-xl opacity-20" />
      </motion.div>
    </motion.button>
  );
}
```

### 8.2 Provider Selector Component

```tsx
// frontend/components/ui/ProviderSelector.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, Sparkles, Scale, FileText } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  description: string;
  avg_latency_ms: number;
}

const providerIcons = {
  fast: Zap,
  quality: Sparkles,
  balanced: Scale,
  long_context: FileText
};

export function ProviderSelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (provider: string) => void;
}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => setProviders(data.providers));
  }, []);
  
  const selectedProvider = providers.find(p => p.id === value);
  const Icon = providerIcons[value as keyof typeof providerIcons] || Zap;
  
  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-dark-grid border border-neon-purple rounded-none text-sm font-mono"
        whileHover={{ borderColor: '#00FFE0' }}
      >
        <Icon className="w-4 h-4 text-neon-cyan" />
        <span>{selectedProvider?.name || 'Select Provider'}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-80 bg-dark-grid border border-neon-purple z-50"
          >
            {providers.map((provider) => {
              const ProviderIcon = providerIcons[provider.id as keyof typeof providerIcons] || Zap;
              return (
                <motion.button
                  key={provider.id}
                  onClick={() => {
                    onChange(provider.id);
                    setIsOpen(false);
                  }}
                  className="w-full p-3 text-left hover:bg-neon-purple/20 transition-colors border-b border-neon-purple/30 last:border-none"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ProviderIcon className="w-4 h-4 text-neon-cyan" />
                    <span className="font-mono text-sm">{provider.name}</span>
                    <span className="text-xs text-text-dim ml-auto">
                      {provider.avg_latency_ms}ms
                    </span>
                  </div>
                  <p className="text-xs text-text-dim">{provider.description}</p>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

## 9. Animation System

### 9.1 GSAP Hook for Complex Animations

```tsx
// frontend/hooks/useGSAPAnimation.ts
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimation() {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const ctx = gsap.context(() => {
      // Parallax scroll effect
      gsap.to('.parallax-element', {
        y: (i, el) => -window.innerHeight * 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      
      // Stagger fade in for list items
      gsap.fromTo('.stagger-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.stagger-container',
            start: 'top 80%'
          }
        }
      );
      
      // Neon glow pulse on hover
      document.querySelectorAll('.glow-on-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(el, {
            boxShadow: '0 0 20px rgba(0, 255, 224, 0.6)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        
        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.in'
          });
        });
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);
  
  return containerRef;
}
```

### 9.2 Full Page Animation Integration

```tsx
// frontend/app/dashboard/page.tsx
'use client';

import { motion, stagger } from 'framer-motion';
import { CyberButton } from '@/components/ui/CyberButton';
import { TerminalInput } from '@/components/ui/TerminalInput';
import { ProviderSelector } from '@/components/ui/ProviderSelector';
import { TypewriterText } from '@/components/animations/TypewriterText';
import { ScanningLine } from '@/components/animations/ScanningLine';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export default function DashboardPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [provider, setProvider] = useState('balanced');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  
  const animationRef = useGSAPAnimation();
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedProposal('');
    
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription, tone, provider })
    });
    
    const data = await response.json();
    setGeneratedProposal(data.proposal);
    setIsGenerating(false);
  };
  
  return (
    <motion.main 
      ref={animationRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 min-h-screen p-8"
    >
      {/* Scanning line overlay during generation */}
      {isGenerating && <ScanningLine />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-mono text-neon-cyan tracking-wider">
            PROPOSAL_GENERATOR.exe
          </h1>
          <p className="text-text-dim mt-2">Paste job description → AI generates proposal</p>
        </motion.div>
        
        {/* Input Section */}
        <motion.div variants={itemVariants} className="mb-6">
          <TerminalInput
            value={jobDescription}
            onChange={setJobDescription}
            placeholder="> PASTE JOB DESCRIPTION HERE..."
            className="w-full"
          />
        </motion.div>
        
        {/* Controls */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap gap-4 mb-8 justify-between items-center"
        >
          <div className="flex gap-2">
            {['professional', 'friendly', 'direct'].map((t) => (
              <motion.button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 font-mono text-sm uppercase tracking-wider border
                  ${tone === t 
                    ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' 
                    : 'border-gray-700 text-text-dim hover:border-neon-purple'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t}
              </motion.button>
            ))}
          </div>
          
          <ProviderSelector value={provider} onChange={setProvider} />
        </motion.div>
        
        {/* Generate Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <CyberButton
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!jobDescription || jobDescription.length < 50}
            className="w-full"
            variant="primary"
          >
            GENERATE PROPOSAL
          </CyberButton>
        </motion.div>
        
        {/* Output Section */}
        {(generatedProposal || isGenerating) && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-neon-cyan bg-dark-grid/50 backdrop-blur-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-neon-cyan font-mono text-sm tracking-wider">
                OUTPUT_{provider.toUpperCase()}
              </h2>
              <motion.button
                onClick={() => navigator.clipboard.writeText(generatedProposal)}
                className="text-text-dim hover:text-neon-cyan text-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                [COPY]
              </motion.button>
            </div>
            
            {isGenerating ? (
              <div className="h-64 flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-neon-cyan font-mono"
                >
                  GENERATING PROPOSAL...
                </motion.div>
              </div>
            ) : (
              <TypewriterText 
                text={generatedProposal}
                speed={0.02}
                className="text-text-primary whitespace-pre-wrap"
              />
            )}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}
```

## 10. Deployment Guide

### 10.1 Environment Variables Setup

```bash
# Hugging Face Secrets (Backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
GROQ_API_KEY=gsk_your_groq_key
TOGETHER_API_KEY=your_together_key
GEMINI_API_KEY=your_gemini_key
DEEPSEEK_API_KEY=your_deepseek_key
LLM_PROVIDER=balanced  # default provider

# Vercel Environment Variables (Frontend)
NEXT_PUBLIC_BACKEND_URL=https://your-space.hf.space
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 10.2 Quick Deploy Commands

```bash
# 1. Deploy Backend to Hugging Face
cd backend
git init
git add .
git commit -m "Deploy backend with OpenAI Agent SDK"
git remote add space https://huggingface.co/spaces/YOUR_USERNAME/proposal-backend
git push -f space main

# 2. Deploy Frontend to Vercel
cd ../frontend
vercel --prod

# 3. Verify deployment
curl https://YOUR_USERNAME-proposal-backend.hf.space/health
```

## 11. Success Metrics

| **Metric** | **Target** | **Measurement** |
| --- | --- | --- |
| Generation time (fast provider) | < 1s | Custom timing |
| Generation time (balanced) | < 2s | Custom timing |
| Framer Motion FPS | 60fps | Chrome DevTools |
| GSAP timeline smoothness | No jank | Performance monitor |
| Three.js frame rate | 60fps | Stats.js |
| User satisfaction | > 4/5 stars | Feedback form |

---

## 12. Version History

| **Version** | **Date** | **Changes** |
| --- | --- | --- |
| 1.0.0 | 2024-01-15 | Initial PRD |
| 2.0.0 | 2024-01-20 | Added Three.js |
| 3.0.0 | 2024-01-25 | Added Framer Motion + GSAP, OpenAI Agent SDK with free providers |

---

**End of PRD**

*For questions or clarifications, please create an issue in the project repository.*