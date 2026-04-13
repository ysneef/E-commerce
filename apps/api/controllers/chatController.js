import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import { productModel } from "../models/productModel.js";
import SupportArticle from "../models/supportArticleModel.js";
import { callGroq, isGroqAvailable } from "../services/ollamaService.js";

const knownBrands = ["Nike", "Adidas", "Puma", "New Balance", "Reebok", "Skechers", "Asics"];

const knownCategories = {
  men: "Men",
  man: "Men",
  male: "Men",
  women: "Women",
  woman: "Women",
  female: "Women",
  kids: "Kids",
  kid: "Kids",
  child: "Kids",
  children: "Kids",
};

let openAiClientPromise;

const getOpenAiClient = async () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openAiClientPromise) {
    openAiClientPromise = import("openai")
      .then(({ default: OpenAI }) => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))
      .catch((error) => {
        console.warn("[CHATBOT] OpenAI SDK unavailable:", error.message);
        return null;
      });
  }

  return openAiClientPromise;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatProducts = (products) =>
  products
    .map(
      (product, index) =>
        `${index + 1}. ${product.name} (${product.brand}) - ${product.category} - $${product.price.toFixed(2)}`
    )
    .join("\n\n");

const formatArticles = (articles) =>
  articles.map((article, index) => `${index + 1}. ${article.title}: ${article.content}`).join("\n\n");

const ensureSupportArticles = async () => {
  const count = await SupportArticle.countDocuments();
  if (count > 0) return;

  await SupportArticle.insertMany([
    {
      title: "Order Tracking",
      content:
        "Once your order ships, you will receive a tracking number by email. Standard delivery usually takes 3-7 business days. If you need express shipping or want to update delivery details, just ask.",
      tags: ["order", "shipping", "tracking", "delivery"],
      category: "support",
    },
    {
      title: "Returns & Refunds",
      content:
        "We offer easy returns within 14 days of delivery. Returned items must be unworn and in original packaging. Refunds are issued to your original payment method once the return is received.",
      tags: ["return", "refund", "exchange", "policy"],
      category: "support",
    },
    {
      title: "Size & Fit Help",
      content:
        "Different brands fit differently. Let me know if you want help choosing the right size based on your preferred brand or shoe type.",
      tags: ["size", "fit", "shoe size", "brand"],
      category: "support",
    },
  ]);
};

const extractSearchTerms = (message) =>
  Array.from(
    new Set(
      message
        .toLowerCase()
        .split(/[^a-z0-9]+/gi)
        .filter((token) => token.length > 2)
        .slice(0, 10)
    )
  );

const detectBrand = (message) => {
  const lower = ` ${message.toLowerCase()} `;
  const sortedBrands = [...knownBrands].sort((a, b) => b.length - a.length);
  return sortedBrands.find((brand) => new RegExp(`\\b${escapeRegex(brand.toLowerCase())}\\b`).test(lower));
};

const detectCategory = (message) => {
  const lower = ` ${message.toLowerCase()} `;
  const sortedKeys = Object.keys(knownCategories).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (new RegExp(`\\b${escapeRegex(key)}\\b`).test(lower)) {
      return knownCategories[key];
    }
  }
  return null;
};

const PRODUCT_SEARCH_STOP_WORDS = new Set([
  "for",
  "the",
  "and",
  "with",
  "about",
  "please",
  "show",
  "find",
  "want",
  "need",
  "how",
  "many",
  "left",
  "remaining",
  "size",
  "sizes",
  "stock",
  "available",
  "inventory",
  "pairs",
  "pair",
]);

const filterSearchTerms = (message) =>
  extractSearchTerms(message).filter((term) => !PRODUCT_SEARCH_STOP_WORDS.has(term));

const isInventoryQuery = (message) =>
  /(?:how many|remaining|left|stock|available|inventory).*(?:size|sizes|pairs?)/i.test(message) ||
  /(?:size|sizes|stock|inventory).*(?:how many|left|available|remaining)/i.test(message);

const buildProductInventoryReply = (product) => {
  const sizes = product.sizes?.length
    ? product.sizes.map((item) => `${item.size}: ${item.quantity} left`).join("\n")
    : "We do not have size stock information for this product.";

  return [
    `Here is the stock for ${product.name}:`,
    sizes,
    "If you want, ask for a specific size or click the product card to view details.",
  ].join("\n");
};

const stripInventoryTerms = (message) =>
  message
    .replace(
      /(?:how many|remaining|left|stock|available|inventory|pairs|pair|size|sizes|for|the|and|with|about|please|show|find|want|need)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

const buildAllTermsRegex = (terms) => {
  const pattern = terms.map((term) => `(?=.*${escapeRegex(term)})`).join("");
  return new RegExp(`${pattern}.*`, "i");
};

const getProductForInquiry = async (message) => {
  const cleaned = stripInventoryTerms(message);
  if (!cleaned) return null;

  const exact = await getExactProductMatches(cleaned);
  if (exact.length) return exact[0];

  const matching = await getMatchingProducts(cleaned);
  return matching[0] || null;
};

const getExactProductMatches = async (message) => {
  const phrase = message.trim();
  if (!phrase) return [];

  const brand = detectBrand(message);
  const category = detectCategory(message);
  const exactRegex = new RegExp(escapeRegex(phrase), "i");
  const exactFilter = { name: exactRegex };
  if (brand) exactFilter.brand = brand;
  if (category) exactFilter.category = category;

  const exactMatches = await productModel.findAll(exactFilter);
  if (exactMatches.length) return exactMatches;

  const searchTerms = filterSearchTerms(message);
  if (!searchTerms.length) return [];

  const allTermsRegex = buildAllTermsRegex(searchTerms);
  const partialFilter = { name: allTermsRegex };
  if (brand) partialFilter.brand = brand;
  if (category) partialFilter.category = category;

  const partialMatches = await productModel.findAll(partialFilter);
  if (partialMatches.length) return partialMatches.slice(0, 4);

  const extendedQuery = {
    $or: [{ description: allTermsRegex }, { name: allTermsRegex }],
  };
  if (brand) extendedQuery.brand = brand;
  if (category) extendedQuery.category = category;

  const extendedMatches = await productModel.findAll(extendedQuery);
  if (extendedMatches.length) return extendedMatches.slice(0, 4);

  if (category) return getProductsByCategory(message);
  if (brand) return getProductsByBrand(message);

  return [];
};

const getProductsByBrand = async (message) => {
  const brand = detectBrand(message);
  if (!brand) return [];

  const products = await productModel.findAll({ brand });
  return products.slice(0, 5);
};

const getProductsByCategory = async (message) => {
  const category = detectCategory(message);
  if (!category) return [];

  const brand = detectBrand(message);
  const filter = { category };
  if (brand) filter.brand = brand;

  const products = await productModel.findAll(filter);
  if (products.length) return products.slice(0, 5);

  if (brand) return getProductsByBrand(message);
  return [];
};

const getMatchingProducts = async (message) => {
  const categoryMatches = await getProductsByCategory(message);
  if (categoryMatches.length) return categoryMatches;

  const brandMatches = await getProductsByBrand(message);
  if (brandMatches.length) return brandMatches;

  const brand = detectBrand(message);
  const category = detectCategory(message);
  const searchTerms = filterSearchTerms(message);
  if (!searchTerms.length) return [];

  const allTermsRegex = buildAllTermsRegex(searchTerms);
  const query = {
    $or: [
      { name: allTermsRegex },
      { description: allTermsRegex },
      { brand: allTermsRegex },
      { category: allTermsRegex },
    ],
  };
  if (brand) query.brand = brand;
  if (category) query.category = category;

  const products = await productModel.findAll(query);
  return products.slice(0, 5);
};

const getSupportArticles = async (message) => {
  await ensureSupportArticles();
  const searchTerms = extractSearchTerms(message);
  if (!searchTerms.length) return [];

  const regex = new RegExp(searchTerms.join("|"), "i");
  return SupportArticle.find({
    $or: [{ title: regex }, { content: regex }, { tags: regex }],
  }).limit(5);
};

const getConversationHistory = async (userId, limit = 6) => {
  const conditions = userId ? { userId } : {};
  const chats = await Chat.find(conditions).sort({ createdAt: -1 }).limit(limit).lean();

  return chats.reverse().map((chat) => ({
    role: chat.role === "bot" ? "assistant" : "user",
    content: chat.text,
  }));
};

const createPromptMessages = (history, articles, products, question) => {
  const systemMessage = {
    role: "system",
    content: `You are a Shoes Store Assistant chatbot. Your job is to help customers find the perfect shoes.

IMPORTANT RULES:
1. ONLY recommend shoes from the product list provided below. Never make up products.
2. If no matching products are provided, use support information to help.
3. Be concise and helpful - answer in 2-3 sentences max unless asked for details.
4. Always mention the price and key features of recommended shoes.
5. If customer asks about sizes, genders, or styles - ONLY suggest from provided products.
6. Never suggest products outside the provided catalog.

Your store sells premium shoes across multiple brands.`,
  };

  const contextParts = [];
  if (articles.length) {
    contextParts.push(`SUPPORT INFO:\n${formatArticles(articles)}`);
  }
  if (products.length) {
    contextParts.push(`MATCHING PRODUCTS IN STORE:\n${formatProducts(products)}\n\nRECOMMEND ONLY FROM THESE PRODUCTS ABOVE.`);
  }

  const contextMessage = {
    role: "system",
    content: contextParts.length
      ? contextParts.join("\n\n")
      : "No matching products found. Try asking about a different brand, size, or category.",
  };

  return [systemMessage, contextMessage, ...history, { role: "user", content: question }];
};

const buildProductDetailReply = (product) => {
  const sizes = product.sizes?.map((item) => item.size).join(", ") || "available sizes";
  const discount = product.discountPercent
    ? `It is currently ${product.discountPercent}% off, now $${product.discountPrice || product.price}.`
    : product.discountPrice && product.discountPrice < product.price
      ? `It is available for $${product.discountPrice}, down from $${product.price}.`
      : `The price is $${product.price}.`;

  const rating = product.rating ? `${product.rating}/5 customer rating.` : "";
  const sentences = product.description
    ? product.description.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean)
    : [];
  const shortDescription = sentences.length ? sentences.slice(0, 2).join(" ") : "A high-quality shoe from our collection.";

  return [
    `I found the ${product.name} for you.`,
    shortDescription,
    `Category: ${product.category}. Brand: ${product.brand}.`,
    `Sizes available: ${sizes}.`,
    `${discount}${rating ? ` ${rating}` : ""}`,
    "Tap the product card below for details.",
  ]
    .filter(Boolean)
    .join(" \n");
};

const generateRagReply = async (history, articles, products, question) => {
  if (isGroqAvailable()) {
    const messages = createPromptMessages(history, articles, products, question);
    try {
      const reply = await callGroq(messages);
      if (reply) return reply;
    } catch (error) {
      console.error("[CHATBOT] Groq error:", error.message);
    }
  }

  const openAiClient = await getOpenAiClient();
  if (!openAiClient) {
    return null;
  }

  const messages = createPromptMessages(history, articles, products, question);
  try {
    const response = await openAiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 400,
    });

    return response?.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    if (error?.status === 429) {
      console.warn("[CHATBOT] OpenAI rate limit:", error.message);
    } else if (error?.status === 401 || error?.code === "invalid_api_key") {
      console.warn("[CHATBOT] OpenAI auth error.");
    } else if (error?.error?.error?.code === "insufficient_quota") {
      console.warn("[CHATBOT] OpenAI quota exceeded.");
    } else {
      console.error("[CHATBOT] OpenAI error:", error.message || error);
    }
    return null;
  }
};

const fallbackReply = (products, articles) => {
  if (products.length === 1) {
    return buildProductDetailReply(products[0]);
  }
  if (products.length) {
    return `I found several shoes that match your request. Here are the top matches from our store:\n\n${formatProducts(products)}\n\nIf you want, click a product card to view details, or ask me for another brand, category, or size.`;
  }
  if (articles.length) {
    return `I couldn't find matching products, but here's what I found in our support content for your question:\n\n${formatArticles(articles)}\n\nIf you'd like, ask me for product recommendations too.`;
  }
  return 'I\'m here to help. Tell me more about the shoe style, brand, size, or support request you have. For example: "show me Nike women shoes" or "I need kids running shoes."';
};

const createChatRecord = async (chat) => {
  try {
    return await Chat.create(chat);
  } catch (error) {
    console.error("Chat save error:", error);
    return null;
  }
};

const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, userId } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, message: "Message is required" });
  }

  const normalized = message.trim();
  await createChatRecord({ role: "user", text: normalized, userId });

  const [history, supportArticles] = await Promise.all([
    getConversationHistory(userId),
    getSupportArticles(normalized),
  ]);

  const inventoryRequest = isInventoryQuery(normalized);
  const inventoryProduct = inventoryRequest ? await getProductForInquiry(normalized) : null;

  const exactProducts = await getExactProductMatches(normalized);
  const categoryProducts = exactProducts.length === 0 ? await getProductsByCategory(normalized) : [];
  const products = exactProducts.length
    ? exactProducts
    : categoryProducts.length
      ? categoryProducts
      : await getMatchingProducts(normalized);

  let reply = null;
  let replySource = "unknown";

  if (inventoryProduct) {
    reply = buildProductInventoryReply(inventoryProduct);
    replySource = "INVENTORY_QUERY";
  } else if (exactProducts.length === 1) {
    reply = buildProductDetailReply(exactProducts[0]);
    replySource = "EXACT_MATCH";
  } else {
    reply = await generateRagReply(history, supportArticles, products, normalized);
    if (reply) {
      replySource = products.length ? `AI_WITH_PRODUCTS (${products.length} products)` : "AI_NO_PRODUCTS";
    } else {
      reply = fallbackReply(products, supportArticles);
      replySource = "AI_FAILED_FALLBACK";
    }
  }

  if (!reply) {
    reply = fallbackReply(products, supportArticles);
    replySource = "FINAL_FALLBACK";
  }

  const botRecord = await createChatRecord({
    role: "bot",
    text: reply,
    userId,
    meta: {
      suggestedProductCount: products.length,
      supportArticleCount: supportArticles.length,
      replySource,
    },
  });

  return res.status(200).json({
    success: true,
    reply,
    suggestedProducts: products.map((product) => ({
      id: product._id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
    })),
    supportArticles: supportArticles.map((article) => ({
      id: article._id,
      title: article.title,
      content: article.content,
    })),
    chatId: botRecord?._id,
  });
});

export { sendChatMessage };
