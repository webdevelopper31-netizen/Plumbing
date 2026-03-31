import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/chat", async (req, res) => {
    try {
      // Securely access the API key on the server
      const openRouterApiKey = process.env.OPENROUTER_API_KEY;
      
      if (!openRouterApiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured on server" });
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://cascadeplumbing.demo',
          'X-Title': 'Cascade Plumbing Demo'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: req.body.messages,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Pipe the streaming response directly to the client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();

    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
