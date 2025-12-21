import { defineConfig } from 'vite'
import 'dotenv/config'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'dev-ai-chat-proxy',
      configureServer(server) {
        // Only enable in development
        if (process.env.NODE_ENV === 'production') return;

        server.middlewares.use('/api/chat', (req, res, next) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              const message = parsed.message || '';

              const apiKey = process.env.GROQ_API_KEY;
              if (!apiKey) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ response: 'AI not configured. Set GROQ_API_KEY in .env for live responses.' }));
                return;
              }

              // URL detection and simple scrape in dev
              const urlRegex = /(https?:\/\/[^\s)]+)\/?/ig;
              const urls = [...String(message).matchAll(urlRegex)].map(m => m[1]);
              let scrapedContext = '';
              if (urls.length > 0) {
                const targetUrl = urls[0];
                try {
                  const controller = new AbortController();
                  const timeout = setTimeout(() => controller.abort(), 8000);
                  const pageRes = await fetch(targetUrl, { signal: controller.signal, headers: { 'User-Agent': 'RaidBotDev/1.0' } });
                  clearTimeout(timeout);
                  if (pageRes.ok) {
                    const html = await pageRes.text();
                    scrapedContext = html
                      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
                      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                      .replace(/<\/(p|div|h\d|li|br|section|article)>/gi, '\n')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim();
                    if (scrapedContext.length > 8000) scrapedContext = scrapedContext.slice(0, 8000);
                  }
                } catch (_) {}
              }

              const messages = [
                { role: 'system', content: 'You are RaidBot, an assistant for a developer portfolio. Write short paragraphs with blank lines, clean hyphen bullets, no **bold**, and keep responses concise and helpful.' },
                { role: 'system', content: 'OWNER: Obaniwa Michael. ROLE: Full-Stack Developer (React Native, Flutter, modern web). If asked who owns this site, answer: Obaniwa Michael.' },
                scrapedContext ? { role: 'system', content: `Webpage context (truncated):\n${scrapedContext}` } : null,
                { role: 'user', content: message }
              ].filter(Boolean);

              const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                  messages,
                  temperature: 1,
                  max_tokens: 512,
                  top_p: 1,
                  stream: false
                })
              });

              const data = await groqRes.json();
              if (!groqRes.ok || data.error) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ response: 'AI service error in dev. Please try again shortly.' }));
                return;
              }

              const ai = data.choices?.[0]?.message?.content || 'Hello!';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ response: ai }));
            } catch (e) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ response: 'AI dev proxy failed. Using placeholder.' }));
            }
          });
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser', // Use terser for better minification
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
        skills: 'skills.html',
        about: 'about.html'
      },
      output: {
        manualChunks: {
          three: ['three'], // Split Three.js into separate chunk
          vendor: ['pdfjs-dist'] // Split vendor dependencies
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable compression
    reportCompressedSize: true
  },
  preview: {
    port: 4173
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false
  }
})
