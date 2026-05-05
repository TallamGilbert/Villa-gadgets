import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Villa Gadgets API" });
  });

  // Mock M-Pesa STK Push Endpoint
  app.post("/api/payments/stk-push", (req, res) => {
    const { phoneNumber, amount } = req.body;
    console.log(`Simulating STK Push for ${phoneNumber} - Amount ${amount}`);
    
    // Simulate successful request to Daraja
    setTimeout(() => {
      res.json({
        ResponseCode: "0",
        ResponseDescription: "Success. Request accepted for processing",
        MerchantRequestID: Math.random().toString(36).substr(2, 9).toUpperCase(),
        CheckoutRequestID: `ws_CO_${Math.random().toString(36).substr(2, 6)}`,
        CustomerMessage: "Success. Request accepted for processing"
      });
    }, 1000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Villa Gadgets running on http://localhost:${PORT}`);
  });
}

startServer();
