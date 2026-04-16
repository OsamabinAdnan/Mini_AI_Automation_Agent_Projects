# MeetingAI — AI Meeting Notes Processor

Transform raw meeting transcripts into structured action items, decisions, and summaries using AI agents with multi-provider support.

## 🚀 Features

- **Multi-AI Provider Support**: Seamlessly switch between OpenRouter, Qwen, Cohere, and Groq
- **Auto-Fallback System**: Automatically tries alternative providers if one fails
- **File Upload Support**: Process TXT, MD, JSON, CSV, PDF, DOC, and DOCX files
- **Modern Cyberpunk UI**: Sleek glassmorphism design with neon accents
- **Structured Output**: Extracts summaries, action items, decisions, and attendees
- **Priority-Based Action Items**: Categorizes tasks by priority (high/medium/low)
- **Real-time Processing**: Instant results with loading animations

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                            │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐     │
│   │  Paste Text  │    │ Upload File  │    │ Provider Select  │     │
│   │  (textarea)  │    │ (.txt .md    │    │ (auto/manual)    │     │
│   │              │    │  .csv .json  │    │                  │     │
│   │              │    │  .pdf .docx) │    │                  │     │
│   └──────┬───────┘    └──────┬───────┘    └────────┬─────────┘     │
│          │                   │                     │               │
│          │    ┌──────────────┴──────────┐          │               │
│          │    │   File Text Extraction  │          │               │
│          │    │  ┌───────┐  ┌────────┐  │          │               │
│          │    │  │pdfjs- │  │mammoth │  │          │               │
│          │    │  │dist   │  │(Word)  │  │          │               │
│          │    │  └───────┘  └────────┘  │          │               │
│          │    └──────────────┬──────────┘          │               │
│          └──────────────────┬┘                     │               │
│                             ▼                      │               │
│  ┌─────────────────────────────────────────────────┴──────────┐    │
│  │                    NEXT.JS 16 FRONTEND                     │    │
│  │               (React 19 + Tailwind CSS)                    │    │
│  │                  http://localhost:3000                      │    │
│  └──────────────────────────┬────────────────────────────────┘    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                         HTTP REST API
                      (POST /process-notes)
                      (GET  /providers)
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                             ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   FASTAPI BACKEND                         │    │
│  │                 http://localhost:8000                      │    │
│  │                                                           │    │
│  │   ┌─────────────┐    ┌──────────────────────────────┐    │    │
│  │   │  CORS       │    │  Request Handler             │    │    │
│  │   │  Middleware  │───▶│  (Async + Retry Logic)       │    │    │
│  │   └─────────────┘    └──────────────┬───────────────┘    │    │
│  │                                     │                     │    │
│  │                                     ▼                     │    │
│  │   ┌──────────────────────────────────────────────────┐   │    │
│  │   │          MULTI-PROVIDER AGENT SYSTEM              │   │    │
│  │   │            (OpenAI Agents SDK)                    │   │    │
│  │   │                                                   │   │    │
│  │   │   ┌─────────────────────────────────────────┐    │   │    │
│  │   │   │         Auto-Fallback Manager           │    │   │    │
│  │   │   │  (Tries next provider on failure)       │    │   │    │
│  │   │   └────────────────┬────────────────────────┘    │   │    │
│  │   │                    │                              │   │    │
│  │   │        ┌───────────┼───────────┐                 │   │    │
│  │   │        ▼           ▼           ▼           ▼     │   │    │
│  │   │   ┌─────────┐ ┌────────┐ ┌─────────┐ ┌───────┐  │   │    │
│  │   │   │OpenRouter│ │  Qwen  │ │ Cohere  │ │ Groq  │  │   │    │
│  │   │   │(Elephant)│ │(Coder+)│ │(Cmd-A)  │ │(Llama)│  │   │    │
│  │   │   └────┬─────┘ └───┬────┘ └────┬────┘ └───┬───┘  │   │    │
│  │   │        │           │           │          │       │   │    │
│  │   └────────┼───────────┼───────────┼──────────┼──────┘   │    │
│  │            │           │           │          │            │    │
│  └────────────┼───────────┼───────────┼──────────┼───────────┘    │
│               │           │           │          │                │
│                    EXTERNAL AI APIs                               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   STRUCTURED JSON OUTPUT │
                 │                         │
                 │  {                      │
                 │    "summary": "...",     │
                 │    "action_items": [...],│
                 │    "decisions": [...],   │
                 │    "attendees": [...]    │
                 │  }                      │
                 └─────────────────────────┘
```

### Data Flow

```
User Input ──▶ Text Extraction ──▶ FastAPI ──▶ AI Agent ──▶ Provider API
                 (if file)          │                         │
                                    │    ◀── Retry/Fallback ──┘
                                    │
                                    ▼
                              JSON Response ──▶ Frontend Rendering
                                                    │
                                              ┌─────┴──────┐
                                              ▼     ▼      ▼
                                          Summary  Action  Decisions
                                                   Items
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Backend**: FastAPI, Python 3.11+
- **AI Integration**: OpenAI Agents SDK
- **File Processing**: pdfjs-dist, mammoth
- **Deployment Ready**: Container-friendly architecture

## 📋 Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- uv (Python package manager)
- API keys for desired AI providers (OpenRouter, Qwen, Cohere, Groq)

## 🏗️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
uv sync
```

3. Create a `.env` file with your API keys:
```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/elephant-alpha
OPENAI_BASE_URL=https://openrouter.ai/api/v1

# Qwen Configuration
QWEN_API_KEY=your_qwen_api_key
QWEN_BASE_URL=https://portal.qwen.ai/v1
QWEN_MODEL=qwen3-coder-plus

# Cohere Configuration
COHERE_API_KEY=your_cohere_api_key
COHERE_BASE_URL=https://api.cohere.ai/v1
COHERE_MODEL=command-a-03-2025

# Groq Configuration
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.1-8b-instant
```

4. Start the backend server:
```bash
uv run uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Processing Meeting Transcripts

1. **Paste Method**: Directly paste your meeting transcript into the text area
2. **File Upload**: Drag and drop or browse to upload supported file types:
   - Text files: `.txt`, `.md`
   - Data files: `.json`, `.csv`
   - Documents: `.pdf`, `.doc`, `.docx`

### Provider Selection

- **Auto (Default)**: Automatically selects the best available provider and falls back if needed
- **Manual Selection**: Choose a specific provider if you want to use a particular model
- **Fallback System**: If your selected provider fails, the system automatically tries others

### Expected Transcript Format

For best results, include:
- **Attendee List**: Names with roles/designations
- **Speaker Identifications**: Name (Role): followed by their statement
- **Action Items**: Tasks with specific owners and deadlines
- **Decisions**: Clear statements about decisions made
- **Timestamps**: Optional but helpful for context

Example:
```
ATTENDEES:
- John Smith (Project Manager)
- Sarah Johnson (Lead Developer)

John (PM): Let's discuss the timeline. Sarah, status on frontend?
Sarah (Lead Dev): Dashboard is 80% complete, will finish by Friday.
John (PM): Decision - extend deadline by 2 days.
Action Item - Sarah: Complete dashboard by Monday (Priority: High)
```

## 🔧 Configuration

### Environment Variables

The backend supports multiple AI providers. You can configure any combination:

- **OpenRouter**: For diverse model options
- **Qwen**: For advanced reasoning capabilities
- **Cohere**: For reliable text processing
- **Groq**: For fast inference with Llama models

At least one provider must be configured for the application to work.

### Frontend Customization

The UI can be customized by modifying:
- `frontend/app/globals.css`: Color themes and animations
- `frontend/app/page.tsx`: Layout and components
- `frontend/app/types.ts`: Data structures

## 🧪 Testing

Sample files are provided in the `testing_files/` directory:
- `meeting_transcript.txt`: Basic meeting transcript
- `meeting_notes.md`: Markdown formatted notes
- `meeting_data.json`: Structured JSON data
- `meeting_action_items.csv`: Tabular action items
- `meeting_transcript_PDF.pdf`: PDF version of transcript
- `meeting_notes_Word.docx`: Word document version

## 🚀 Deployment

### Backend
- Ensure all environment variables are set
- Use a production WSGI server like Gunicorn
- Configure proper CORS settings for your domain

### Frontend
- Build for production: `npm run build`
- Serve the build directory with a web server
- Ensure API endpoints are properly configured

## 🔒 Security

- API keys are stored in environment variables
- CORS is configured for localhost development
- Input validation is performed on both frontend and backend
- File uploads are processed client-side only (text extraction)

## 🐛 Troubleshooting

### Common Issues

1. **Provider not showing**: Restart the backend after adding new API keys
2. **PDF processing fails**: Ensure the PDF worker file is in the public directory
3. **CORS errors**: Verify backend and frontend are on compatible ports
4. **File upload not working**: Check file type restrictions in the UI

### Development Mode
- Use `--reload` flag for hot reloading during development
- Frontend and backend must be started separately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆔 Author

**Osama bin Adnan**

Built with 🤖 using Next.js + OpenAI Agents SDK + FastAPI