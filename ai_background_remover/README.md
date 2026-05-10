# AI Background Remover

A production-ready AI Background Remover web app built with Next.js 16, featuring a user-provided API key approach for unlimited usage.

![bg.remover](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- 🎨 **Dark-themed UI** with monospace font (JetBrains Mono)
- 🔑 **User-provided API keys** - No rate limits, each user uses their own quota
- 🖼️ **Drag & drop** or click to upload images
- 📋 **Paste from clipboard** support
- ✨ **Smooth animations** with Framer Motion
- 📱 **Fully responsive** design
- 🎯 **Real-time processing** with loading states
- 💾 **Download results** as PNG with transparency
- 🔒 **Privacy-focused** - API keys stored locally in browser

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API**: Remove.bg API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A remove.bg API key (free tier: 50 images/month)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai_background_remover
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Getting Your API Key

1. Visit [remove.bg/api](https://www.remove.bg/api)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Paste it in the app's API Key Configuration section

**Free Tier**: 50 images/month per API key

## Usage

1. **Configure API Key**: Paste your remove.bg API key in the configuration section
2. **Upload Image**: Drag & drop or click to browse (PNG, JPG, WEBP up to 25MB)
3. **Remove Background**: Click the "Remove Background" button
4. **Download**: Save the result as PNG with transparent background
5. **Process More**: Click "Remove Another" to process additional images

## Project Structure

```
ai_background_remover/
├── app/
│   ├── api/
│   │   └── remove-bg/
│   │       └── route.ts          # API proxy route
│   ├── components/
│   │   ├── ApiKeyInput.tsx       # API key configuration
│   │   ├── UploadZone.tsx        # Drag & drop upload
│   │   ├── ImagePreview.tsx      # Preview before processing
│   │   ├── ProcessingState.tsx   # Loading state
│   │   ├── ImageComparison.tsx   # Before/after comparison
│   │   ├── ResultActions.tsx     # Download & retry buttons
│   │   └── ErrorState.tsx        # Error handling
│   ├── globals.css               # Global styles & animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── lib/
│   ├── constants.ts              # App constants
│   ├── utils.ts                  # Utility functions
│   └── validations.ts            # File & API key validation
├── types/
│   └── index.ts                  # TypeScript types
└── package.json
```

## Features in Detail

### API Key Management
- Keys stored in browser's localStorage
- Masked display for security
- Easy change/clear functionality
- No server-side storage

### File Validation
- Supported formats: PNG, JPG, WEBP
- Maximum size: 25MB
- Client-side validation before upload

### Error Handling
- Invalid API key detection
- Rate limit notifications
- Network timeout handling
- User-friendly error messages

### Animations
- Page load fade-in effects
- Smooth state transitions
- Pulsing glow on CTA buttons
- Shimmer loading effects
- Blinking cursor animation

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

No environment variables required! Users provide their own API keys via the UI.

## Security Notes

- API keys are stored in browser localStorage only
- Keys are never logged or stored on the server
- The API route acts as a proxy to add the key header
- Users can clear their keys anytime

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Remove.bg](https://www.remove.bg/) for the background removal API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js 16
