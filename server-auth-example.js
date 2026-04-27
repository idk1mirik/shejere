const http = require("node:http");

const PORT = Number(process.env.PORT) || 8787;
const ADMIN_CODE = process.env.SHEDJERE_ADMIN_CODE || "change-me-admin";
const VIEWER_CODE = process.env.SHEDJERE_VIEWER_CODE || "change-me-viewer";
const SITE_KEY = process.env.SHEDJERE_SITE_KEY || "";

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, x-site-key",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    });
    response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
    if (request.method === "OPTIONS") {
        sendJson(response, 204, {});
        return;
    }

    if (request.url !== "/api/family-access" || request.method !== "POST") {
        sendJson(response, 404, { error: "Not found" });
        return;
    }

    if (SITE_KEY && request.headers["x-site-key"] !== SITE_KEY) {
        sendJson(response, 403, { error: "Bad site key" });
        return;
    }

    let body = "";
    request.on("data", (chunk) => {
        body += chunk;
        if (body.length > 10_000) request.destroy();
    });

    request.on("end", () => {
        try {
            const payload = JSON.parse(body || "{}");
            const code = String(payload.code || "").trim();

            if (code === ADMIN_CODE) {
                sendJson(response, 200, { mode: "admin" });
                return;
            }

            if (code === VIEWER_CODE) {
                sendJson(response, 200, { mode: "viewer" });
                return;
            }

            sendJson(response, 401, { error: "Invalid code" });
        } catch (error) {
            sendJson(response, 400, { error: "Bad JSON" });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Family auth server listening on http://localhost:${PORT}/api/family-access`);
});
