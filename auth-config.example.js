window.SHEDJERE_AUTH = {
    endpoint: "http://localhost:8787/api/family-access",
    siteKey: "optional-public-key",
    timeoutMs: 8000
};

/*
Expected POST body:
{ code: "your-access-code", requestedMode: "admin" | "viewer" }

Expected JSON response:
{ mode: "admin" }
or
{ mode: "viewer" }

You can start from server-auth-example.js and replace the codes with environment variables.
*/
