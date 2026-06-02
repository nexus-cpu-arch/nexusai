/*
 * BlazeAI Sales Agent Widget v3.0
 * Nova — Intelligent Receptionist Agent
 */
(function() {
  if (window.__BLAZEAI_LOADED__) return;
  window.__BLAZEAI_LOADED__ = true;

  var scriptTag = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var scriptSrc = scriptTag ? scriptTag.src : '';
  var urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  var WIDGET_ID  = window.__NEXUSAI_WIDGET_ID__ || urlParams.get('widget_id') || 'default';
  var API_BASE   = 'https://6a070c2e1b2d3fb43fda5d79.base44.app/functions';
  var PRIMARY    = '#f97316';
  var sessionId  = 'sess_' + Math.random().toString(36).slice(2, 10);
  var isOpen     = false;
  var isTyping   = false;

  // ---- NOVA'S BRAIN — Full BlazeAI Knowledge Base ----
  var NOVA_CONTEXT = {
    name: "Nova",
    role: "AI Sales Receptionist at BlazeAI",
    company: "BlazeAI",
    tagline: "Your 24/7 AI Sales Agent That Closes Deals While You Sleep",
    what_we_do: "BlazeAI provides businesses with AI-powered sales agents that automatically capture, qualify, and nurture leads from their website — 24/7, with no extra staff needed.",
    how_it_works: [
      "1. You register your business and get a tiny embed code (one line of code)",
      "2. Paste it on your website — takes 2 minutes",
      "3. BlazeAI's AI agent (like me!) starts chatting with every visitor",
      "4. We qualify leads, collect their info, and notify you instantly",
      "5. You close the deals — we handle all the front-desk work"
    ],
    features: [
      "24/7 automated lead capture — never miss a visitor",
      "Smart qualification — filters serious buyers from browsers",
      "Instant lead notifications to your email/WhatsApp",
      "SWOT analysis on every lead's company",
      "Automated follow-up sequences",
      "One-line embed — works on ANY website",
      "Full dashboard to manage all leads",
      "Multi-client support — deploy on multiple websites"
    ],
    pricing: [
      { name: "Starter", price: "UGX 300,000/month", best_for: "Small businesses, solopreneurs, 1 website", includes: ["1 website widget", "Up to 100 leads/month", "Email notifications", "Basic dashboard"] },
      { name: "Growth", price: "UGX 500,000/month", best_for: "Growing businesses, agencies, multiple websites", includes: ["3 website widgets", "Unlimited leads", "WhatsApp + Email alerts", "Full dashboard", "SWOT analysis", "Follow-up automation"] },
      { name: "Enterprise", price: "Custom pricing", best_for: "Large businesses, white-label resellers", includes: ["Unlimited widgets", "Custom AI agent branding", "Priority support", "API access", "Custom integrations"] }
    ],
    contact: { whatsapp: "+256704923640", payment: "MTN/Airtel Mobile Money to +256704923640" },
    results: { uptime: "24/7", deploy_time: "2 minutes", leads_improvement: "3x more leads captured", automation: "100% automated follow-ups" }
  };

  // ---- CONVERSATION STATE ----
  var convState = {
    step: 'greeting',   // greeting > name > phone > business > need > recommend > close
    data: { name: null, phone: null, business: null, need: null }
  };

  // ---- NOVA'S INTELLIGENT REPLY ENGINE ----
  function novaReply(userMsg) {
    var msg = userMsg.toLowerCase().trim();
    var d   = convState.data;

    // ── FAQ detection (answer immediately regardless of step) ──
    if (/price|cost|how much|pricing|plan|ugx|payment/.test(msg)) {
      return pricingAnswer(msg);
    }
    if (/what (is|does|do) nexus|what.*nexusai|tell me about|how (does|do) it work|what.*offer/.test(msg)) {
      return "BlazeAI gives your business a 24/7 AI sales agent that lives on your website 🤖\n\nIt automatically:\n• Chats with every visitor\n• Qualifies serious buyers\n• Collects their contact info\n• Sends you instant notifications\n• Follows up automatically\n\nYou just close the deals — we handle everything else. Want me to find the right plan for your business?";
    }
    if (/how.*deploy|how.*install|how.*set up|embed|code|website/.test(msg)) {
      return "Super easy! 👇\n\n1️⃣ Register your business on our site\n2️⃣ Get a tiny embed code (takes 2 min)\n3️⃣ Paste it before </body> on your website\n4️⃣ That's it — your AI agent goes live immediately!\n\nWorks on ANY website — WordPress, Wix, Squarespace, custom HTML, anything. What's your website built on?";
    }
    if (/contact|reach|talk|human|person|team|support/.test(msg)) {
      return "You can reach our team directly:\n\n📱 WhatsApp: +256 704 923 640\n💳 Mobile Money: MTN/Airtel to +256704923640\n\nOr I can take your details and have someone call you back — which do you prefer?";
    }
    if (/demo|see it|show me|example|test/.test(msg)) {
      return "You're literally talking to one right now! 😄\n\nThis conversation IS the demo — this is exactly what your website visitors will experience with your own branded AI agent.\n\nImpressed? Let me get your details so we can set you up 🚀 What's your name?";
    }
    if (/thank|thanks|okay|ok|great|nice|cool|awesome|perfect|good/.test(msg) && msg.length < 20) {
      if (convState.step === 'close') {
        return "You're all set! 🎉 Our team will reach out to you on WhatsApp shortly. In the meantime, feel free to visit our site or message us at +256 704 923 640. Have a great day! 👋";
      }
      // Continue the flow
    }

    // ── Conversation flow ──
    switch(convState.step) {
      case 'greeting':
        convState.step = 'name';
        return "Welcome! 👋 I'm Nova, BlazeAI's AI sales assistant.\n\nI'm here to help you get your own AI sales agent running on your website — so you never miss a lead again.\n\nFirst things first — what's your name?";

      case 'name':
        d.name = extractName(userMsg);
        convState.step = 'phone';
        return "Nice to meet you, " + d.name + "! 😊\n\nWhat's the best phone number to reach you on? (We'll send updates via WhatsApp)";

      case 'phone':
        d.phone = extractPhone(userMsg) || userMsg.trim();
        convState.step = 'business';
        return "Got it! 📱\n\nWhat's the name of your business, " + (d.name || 'there') + "?";

      case 'business':
        d.business = userMsg.trim();
        convState.step = 'need';
        return "Awesome — " + d.business + " 💼\n\nNow, what's the main challenge you're trying to solve? For example:\n\n• 🔴 Missing leads when I'm offline\n• 🔴 Spending too much time qualifying prospects\n• 🔴 Need more sales without hiring more staff\n• 🔴 Want to automate my follow-ups\n\nWhat resonates most, or describe it in your own words?";

      case 'need':
        d.need = userMsg.trim();
        convState.step = 'recommend';
        var rec = recommendPlan(msg, d);
        // Save to backend
        saveLead(d);
        return rec;

      case 'recommend':
        convState.step = 'close';
        if (/starter|300|start|small|basic/.test(msg)) {
          return "Great choice! 🎯 Starter at UGX 300,000/month is perfect for " + (d.business||'your business') + ".\n\nTo get started:\n📱 WhatsApp us: +256 704 923 640\n💳 Or pay via MTN/Airtel Mobile Money to +256704923640\n\nMention your name (" + (d.name||'your name') + ") and we'll get your widget deployed within 24 hours! 🚀";
        }
        if (/growth|500|grow|scale|multiple/.test(msg)) {
          return "Excellent! 🚀 Growth at UGX 500,000/month gives " + (d.business||'your business') + " everything you need to scale.\n\nTo get started:\n📱 WhatsApp us: +256 704 923 640\n💳 Or pay via MTN/Airtel Mobile Money to +256704923640\n\nMention your name (" + (d.name||'your name') + ") and we'll have you live within 24 hours! 💪";
        }
        if (/enterprise|custom|large|unlimited/.test(msg)) {
          return "Perfect! Let's build something custom for " + (d.business||'your business') + " 🏢\n\nFor Enterprise pricing, reach out directly:\n📱 WhatsApp: +256 704 923 640\n\nMention it's for " + (d.name||'you') + " and our team will put together a custom package. We'll reach out within a few hours!";
        }
        return "Our team will follow up with you on WhatsApp shortly to walk you through the next steps! 🎉\n\nYou can also reach us directly at +256 704 923 640. Is there anything else I can help you with?";

      case 'close':
        return "Our team has everything they need! 🎉 Expect a WhatsApp message at " + (d.phone||'your number') + " very soon.\n\nAnything else I can help you with before you go?";

      default:
        convState.step = 'name';
        return "Let me help you get started! What's your name?";
    }
  }

  function pricingAnswer(msg) {
    if (/starter|300|small|basic|one|single/.test(msg)) {
      return "📦 Starter Plan — UGX 300,000/month\n\nBest for small businesses & solopreneurs:\n✅ 1 website widget\n✅ Up to 100 leads/month\n✅ Email notifications\n✅ Basic dashboard\n\nShall I recommend this for your business?";
    }
    if (/growth|500|grow|scale|multiple|three/.test(msg)) {
      return "📈 Growth Plan — UGX 500,000/month\n\nBest for growing businesses:\n✅ 3 website widgets\n✅ Unlimited leads\n✅ WhatsApp + Email alerts\n✅ Full dashboard\n✅ SWOT analysis on leads\n✅ Automated follow-ups\n\nThis is our most popular plan! Interested?";
    }
    if (/enterprise|custom|large|unlimited|white.?label/.test(msg)) {
      return "🏢 Enterprise Plan — Custom Pricing\n\nBest for large businesses & agencies:\n✅ Unlimited widgets\n✅ Custom AI branding\n✅ Priority support\n✅ API access\n✅ Custom integrations\n\nContact us on WhatsApp for a custom quote: +256 704 923 640";
    }
    return "Here are our plans 💰\n\n📦 Starter — UGX 300,000/mo\n   → 1 widget, 100 leads/mo, email alerts\n\n📈 Growth — UGX 500,000/mo (Most Popular)\n   → 3 widgets, unlimited leads, WhatsApp alerts, SWOT analysis\n\n🏢 Enterprise — Custom\n   → Unlimited everything, white-label option\n\nWhich plan fits your business best?";
  }

  function recommendPlan(msg, d) {
    var needsMultiple = /multiple|several|many|clients|agency|websites/.test(msg + (d.business||'').toLowerCase());
    var isBig = /enterprise|large|corporation|company|staff|team/.test(msg + (d.business||'').toLowerCase());
    var name = d.name || 'you';
    var biz  = d.business || 'your business';

    if (isBig || needsMultiple) {
      return "Based on what you've told me, " + name + ", I'd recommend the 📈 Growth Plan at UGX 500,000/month for " + biz + ".\n\nHere's why it fits perfectly:\n✅ 3 website widgets (for multiple sites/campaigns)\n✅ Unlimited leads — no caps\n✅ WhatsApp alerts so you never miss a hot lead\n✅ Automated follow-ups\n✅ SWOT analysis on every prospect\n\nOr if you want truly unlimited scale, we have Enterprise with custom pricing.\n\nWhich sounds right — Growth or Enterprise?";
    }
    return "Based on what you've shared, " + name + ", the 📦 Starter Plan at UGX 300,000/month looks like a great fit for " + biz + "!\n\nYou get:\n✅ 1 website widget live 24/7\n✅ Up to 100 leads/month\n✅ Email notifications\n✅ Full lead dashboard\n\nAs your business grows, you can always upgrade to Growth (UGX 500,000/mo) for unlimited leads + WhatsApp alerts.\n\nDoes Starter work for you, or would you like to go straight to Growth?";
  }

  function extractName(text) {
    var t = text.trim();
    // Remove common phrases
    t = t.replace(/^(my name is|i am|i'm|call me|it's|its)\s*/i, '');
    // Capitalize first letter of each word
    return t.split(' ').slice(0,3).map(function(w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ') || t;
  }

  function extractPhone(text) {
    var match = text.match(/[\+\d][\d\s\-\(\)]{7,}/);
    return match ? match[0].trim() : null;
  }

  async function saveLead(d) {
    try {
      await fetch(API_BASE + '/captureLeadAndChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widget_id: WIDGET_ID,
          session_id: sessionId,
          visitor_name:  d.name,
          visitor_phone: d.phone,
          visitor_message: 'Business: ' + d.business + ' | Need: ' + d.need,
          current_stage: 'Pitch',
          page_url: window.location.href
        })
      });
    } catch(e) { /* silent */ }
  }

  // ---- STYLES ----
  var style = document.createElement('style');
  style.textContent = `
    #nai-btn {
      position: fixed !important; bottom: 24px !important; right: 24px !important;
      width: 62px !important; height: 62px !important; border-radius: 50% !important;
      background: linear-gradient(135deg,#f97316,#fb923c) !important;
      border: none !important; cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(249,115,22,0.6) !important;
      z-index: 2147483647 !important; display: flex !important;
      align-items: center !important; justify-content: center !important;
      transition: transform 0.2s !important; animation: naiPulse 2.5s infinite !important;
      outline: none !important; padding: 0 !important;
    }
    #nai-btn:hover { transform: scale(1.1) !important; }
    #nai-btn svg { width: 28px !important; height: 28px !important; fill: #fff !important; display: block !important; }
    @keyframes naiPulse {
      0%   { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0.45); }
      70%  { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 16px rgba(249,115,22,0); }
      100% { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0); }
    }
    #nai-box {
      position: fixed !important; bottom: 100px !important; right: 24px !important;
      width: 370px !important; max-height: 540px !important;
      background: #0f0f1a !important; border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 20px !important; box-shadow: 0 24px 64px rgba(0,0,0,0.65) !important;
      z-index: 2147483646 !important; display: none !important; flex-direction: column !important;
      font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif !important;
      overflow: hidden !important; opacity: 0 !important;
      transform: translateY(12px) scale(0.97) !important;
      transition: opacity 0.25s, transform 0.25s !important;
    }
    #nai-box.nai-open { display: flex !important; opacity: 1 !important; transform: translateY(0) scale(1) !important; }
    #nai-head {
      background: linear-gradient(135deg,#f97316,#fb923c) !important;
      padding: 14px 16px !important; display: flex !important;
      align-items: center !important; justify-content: space-between !important; flex-shrink: 0 !important;
    }
    #nai-avatar {
      width: 40px !important; height: 40px !important; border-radius: 50% !important;
      background: rgba(255,255,255,0.25) !important; display: flex !important;
      align-items: center !important; justify-content: center !important;
      font-weight: 900 !important; font-size: 18px !important; color: #fff !important;
      margin-right: 10px !important; flex-shrink: 0 !important;
    }
    #nai-agentname { font-weight: 700 !important; font-size: 14px !important; color: #fff !important; }
    #nai-status { font-size: 11px !important; color: rgba(255,255,255,0.88) !important; margin-top: 2px !important; }
    #nai-close {
      background: none !important; border: none !important; color: rgba(255,255,255,0.8) !important;
      cursor: pointer !important; font-size: 20px !important; padding: 4px 8px !important; line-height:1 !important;
    }
    #nai-msgs {
      flex: 1 !important; overflow-y: auto !important; padding: 14px !important;
      display: flex !important; flex-direction: column !important; gap: 10px !important;
      background: #0f0f1a !important; min-height: 220px !important;
    }
    #nai-msgs::-webkit-scrollbar { width: 3px !important; }
    #nai-msgs::-webkit-scrollbar-thumb { background: #2a2a3a !important; border-radius: 2px !important; }
    .nai-msg {
      max-width: 86% !important; padding: 10px 14px !important; border-radius: 16px !important;
      font-size: 13px !important; line-height: 1.6 !important; word-wrap: break-word !important;
      animation: naiFadeIn 0.22s ease !important; white-space: pre-line !important;
    }
    .nai-msg.bot {
      background: rgba(255,255,255,0.08) !important; color: #e2e8f0 !important;
      border-bottom-left-radius: 4px !important; align-self: flex-start !important;
    }
    .nai-msg.user {
      background: linear-gradient(135deg,#f97316,#fb923c) !important;
      color: #fff !important; border-bottom-right-radius: 4px !important; align-self: flex-end !important;
    }
    @keyframes naiFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .nai-typing {
      display: flex !important; gap: 5px !important; padding: 10px 14px !important;
      background: rgba(255,255,255,0.08) !important; border-radius: 16px !important;
      border-bottom-left-radius: 4px !important; align-self: flex-start !important;
    }
    .nai-typing span {
      width: 7px !important; height: 7px !important;
      background: rgba(255,255,255,0.4) !important; border-radius: 50% !important;
      animation: naiDot 1.4s infinite !important;
    }
    .nai-typing span:nth-child(2){animation-delay:.2s !important}
    .nai-typing span:nth-child(3){animation-delay:.4s !important}
    @keyframes naiDot{0%,60%,100%{opacity:.3;transform:scale(.7)}30%{opacity:1;transform:scale(1)}}
    #nai-form {
      padding: 10px 12px !important; border-top: 1px solid rgba(255,255,255,0.07) !important;
      display: flex !important; gap: 8px !important; background: #0f0f1a !important; flex-shrink: 0 !important;
    }
    #nai-input {
      flex: 1 !important; background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important;
      border-radius: 10px !important; padding: 10px 13px !important; font-size: 13px !important;
      outline: none !important; font-family: inherit !important;
    }
    #nai-input:focus { border-color: #f97316 !important; }
    #nai-input::placeholder { color: rgba(255,255,255,0.28) !important; }
    #nai-send {
      background: linear-gradient(135deg,#f97316,#fb923c) !important;
      border: none !important; border-radius: 10px !important;
      width: 42px !important; height: 42px !important; cursor: pointer !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      flex-shrink: 0 !important; color: #fff !important; font-size: 17px !important;
    }
    #nai-send:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
    #nai-powered {
      text-align: center !important; padding: 6px !important; font-size: 10px !important;
      color: rgba(255,255,255,0.2) !important; background: #0f0f1a !important; flex-shrink: 0 !important;
    }
    #nai-powered a { color: rgba(255,255,255,0.3) !important; text-decoration: none !important; }
    @media(max-width:420px){#nai-box{width:calc(100vw - 20px) !important;right:10px !important;}}
  `;
  document.head.appendChild(style);

  // ---- BUILD UI ----
  var btn = document.createElement('button');
  btn.id = 'nai-btn';
  btn.title = 'Chat with Nova';
  btn.setAttribute('aria-label', 'Chat with Nova');
  setChatIcon();

  var box = document.createElement('div');
  box.id = 'nai-box';
  box.innerHTML =
    '<div id="nai-head">' +
      '<div style="display:flex;align-items:center">' +
        '<div id="nai-avatar">N</div>' +
        '<div><div id="nai-agentname">Nova — AI Sales Agent</div>' +
        '<div id="nai-status">🟢 Online now</div></div>' +
      '</div>' +
      '<button id="nai-close" aria-label="Close">✕</button>' +
    '</div>' +
    '<div id="nai-msgs"></div>' +
    '<div id="nai-form">' +
      '<input id="nai-input" type="text" placeholder="Type a message..." autocomplete="off" maxlength="500"/>' +
      '<button id="nai-send" aria-label="Send">&#10148;</button>' +
    '</div>' +
    '<div id="nai-powered">Powered by <a href="https://blaze256.com" target="_blank" style="color:#f97316;text-decoration:none;font-weight:600">BlazeAI ⚡</a></div>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ---- EVENTS ----
  btn.addEventListener('click', function(){ isOpen ? closeChat() : openChat(); });
  document.getElementById('nai-close').addEventListener('click', closeChat);
  document.getElementById('nai-send').addEventListener('click', sendMessage);
  document.getElementById('nai-input').addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }
  });

  // ---- AUTO-OPEN ----
  setTimeout(openChat, 1200);

  // ---- OPEN / CLOSE ----
  function openChat() {
    isOpen = true;
    box.style.display = 'flex';
    setTimeout(function(){ box.classList.add('nai-open'); }, 10);
    setCloseIcon();
    if (document.getElementById('nai-msgs').children.length === 0) {
      setTimeout(startConversation, 600);
    }
    setTimeout(function(){ var i=document.getElementById('nai-input'); if(i)i.focus(); }, 350);
  }

  function closeChat() {
    isOpen = false;
    box.classList.remove('nai-open');
    setChatIcon();
    setTimeout(function(){ if(!isOpen) box.style.display='none'; }, 260);
  }

  function setChatIcon() {
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  }
  function setCloseIcon() {
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  }

  // ---- CONVERSATION ----
  function startConversation() {
    typeMessage("Hi there! 👋 I'm Nova, BlazeAI's AI sales assistant.\n\nI'm here to help you get your own AI sales agent running on your website — so you never miss a lead again.\n\nFirst things first — what's your name?");
    convState.step = 'name';
  }

  function renderMsg(text, role) {
    var el = document.createElement('div');
    el.className = 'nai-msg ' + role;
    el.textContent = text;
    var c = document.getElementById('nai-msgs');
    if (c) { c.appendChild(el); scrollDown(); }
    return el;
  }

  function typeMessage(text) {
    // Show typing indicator then reveal message
    showTyping();
    var delay = Math.min(800 + text.length * 8, 2200);
    setTimeout(function(){
      removeTyping();
      renderMsg(text, 'bot');
    }, delay);
  }

  function showTyping() {
    removeTyping();
    var t = document.createElement('div');
    t.className = 'nai-typing'; t.id = 'nai-typing-ind';
    t.innerHTML = '<span></span><span></span><span></span>';
    var c = document.getElementById('nai-msgs');
    if (c) { c.appendChild(t); scrollDown(); }
  }
  function removeTyping() {
    var t = document.getElementById('nai-typing-ind');
    if (t) t.remove();
  }
  function scrollDown() {
    var el = document.getElementById('nai-msgs');
    if (el) setTimeout(function(){ el.scrollTop = el.scrollHeight; }, 60);
  }

  async function sendMessage() {
    var input   = document.getElementById('nai-input');
    var sendBtn = document.getElementById('nai-send');
    var text    = input ? input.value.trim() : '';
    if (!text || isTyping) return;

    input.value = '';
    renderMsg(text, 'user');
    isTyping = true;
    if (sendBtn) sendBtn.disabled = true;

    // Get Nova's reply from the local brain (instant, no API latency)
    var reply = novaReply(text);
    typeMessage(reply);

    // Also log to backend asynchronously (fire and forget)
    try {
      fetch(API_BASE + '/captureLeadAndChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widget_id: WIDGET_ID, session_id: sessionId,
          visitor_message: text, current_stage: convState.step,
          page_url: window.location.href
        })
      });
    } catch(e){}

    // Re-enable after typing delay
    var delay = Math.min(800 + reply.length * 8, 2200);
    setTimeout(function(){
      isTyping = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
    }, delay + 100);
  }

})();
