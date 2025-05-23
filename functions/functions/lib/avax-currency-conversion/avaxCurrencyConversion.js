"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.avaxCurrencyConversion = void 0;
const https_1 = require("firebase-functions/v2/https");
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.avaxCurrencyConversion = (0, https_1.onRequest)(async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        const apiKey = process.env.CMC_API_KEY;
        const baseUrl = process.env.CONVERSION_BASE_URL;
        if (!apiKey) {
            res.status(500).json({ error: "API Key not configured" });
            return;
        }
        if (!baseUrl) {
            res.status(500).json({ error: "Base URL not configured" });
            return;
        }
        const response = await (0, node_fetch_1.default)(baseUrl, {
            headers: {
                "X-CMC_PRO_API_KEY": apiKey,
                Accept: "application/json",
            },
        });
        if (!response.ok) {
            res.status(response.status).json({ error: "Failed to fetch from CoinMarketCap" });
            return;
        }
        const data = await response.json();
        const price = (_e = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.AVAX) === null || _b === void 0 ? void 0 : _b.quote) === null || _c === void 0 ? void 0 : _c.COP) === null || _d === void 0 ? void 0 : _d.price) !== null && _e !== void 0 ? _e : null;
        res.json({ price });
    }
    catch (err) {
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});
//# sourceMappingURL=avaxCurrencyConversion.js.map