/*
 * NexusAI Sales Agent Widget v2.0
 * Orange bubble — always visible — auto-opens on load
 */
(function() {
  if (window.__NEXUSAI_LOADED__) return;
  window.__NEXUSAI_LOADED__ = true;

  var scriptTag = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var scriptSrc = scriptTag ? scriptTag.src : '';
  var urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  var WIDGET_ID = window.__NEXUSAI_WIDGET_ID__ || urlParams.get('widget_id') || 'default';
  var API_BASE  = 'https://6a070c2e1b2d3fb43fda5d79.base44.app/functions';
  var PRIMARY   = '#f97316';
  var AGENT_NAME = 'Nova';
  var sessionId = 'sess_' + Math.random().toString(36).slice(2, 10);
  var messages  = [];
  var isOpen    = false;
  var isTyping  = false;
  var stage     = 'Greeting';

  /* ---- STYLES ---- */
  var style = document.createElement('style');
  style.textContent = `
    #nai-btn {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 62px !important;
      height: 62px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #f97316, #fb923c) !important;
      border: none !important;
      cursor: pointer !important;
      box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0.4) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
      animation: naiPulse 2.5s infinite !important;
      outline: none !important;
      padding: 0 !important;
    }
    #nai-btn:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 28px rgba(249,115,22,0.75) !important;
    }
    #nai-btn svg {
      width: 30px !important;
      height: 30px !important;
      fill: #ffffff !important;
      display: block !important;
    }
    @keyframes naiPulse {
      0%   { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0.4); }
      70%  { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 14px rgba(249,115,22,0); }
      100% { box-shadow: 0 4px 20px rgba(249,115,22,0.6), 0 0 0 0 rgba(249,115,22,0); }
    }
    #nai-box {
      position: fixed !important;
      bottom: 100px !important;
      right: 24px !important;
      width: 360px !important;
      max-height: 520px !important;
      background: #0f0f1a !important;
      border: 1px solid rgba(255,255,255,0.1) !important;
      border-radius: 20px !important;
      box-shadow: 0 24px 64px rgba(0,0,0,0.6) !important;
      z-index: 2147483646 !important;
      display: none !important;
      flex-direction: column !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif !important;
      overflow: hidden !important;
      transition: opacity 0.25s, transform 0.25s !important;
      opacity: 0 !important;
      transform: translateY(12px) scale(0.97) !important;
    }
    #nai-box.nai-open {
      display: flex !important;
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }
    #nai-head {
      background: linear-gradient(135deg, #f97316, #fb923c) !important;
      padding: 14px 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      flex-shrink: 0 !important;
    }
    #nai-avatar {
      width: 38px !important; height: 38px !important;
      border-radius: 50% !important;
      background: rgba(255,255,255,0.25) !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      font-weight: 900 !important; font-size: 16px !important; color: #fff !important;
      margin-right: 10px !important; flex-shrink: 0 !important;
    }
    #nai-name { font-weight: 700 !important; font-size: 14px !important; color: #fff !important; }
    #nai-status { font-size: 11px !important; color: rgba(255,255,255,0.85) !important; margin-top: 2px !important; }
    #nai-close {
      background: none !important; border: none !important; color: rgba(255,255,255,0.85) !important;
      cursor: pointer !important; font-size: 20px !important; padding: 2px 6px !important; line-height: 1 !important;
    }
    #nai-msgs {
      flex: 1 !important; overflow-y: auto !important;
      padding: 14px !important; display: flex !important; flex-direction: column !important;
      gap: 8px !important; background: #0f0f1a !important; min-height: 180px !important;
    }
    #nai-msgs::-webkit-scrollbar { width: 3px !important; }
    #nai-msgs::-webkit-scrollbar-thumb { background: #333 !important; border-radius: 2px !important; }
    .nai-msg {
      max-width: 85% !important; padding: 10px 13px !important; border-radius: 14px !important;
      font-size: 13px !important; line-height: 1.55 !important; word-wrap: break-word !important;
      animation: naiFadeIn 0.2s ease !important; white-space: pre-line !important;
    }
    .nai-msg.bot {
      background: rgba(255,255,255,0.08) !important; color: #e2e8f0 !important;
      border-bottom-left-radius: 3px !important; align-self: flex-start !important;
    }
    .nai-msg.user {
      background: linear-gradient(135deg, #f97316, #fb923c) !important;
      color: #fff !important; border-bottom-right-radius: 3px !important; align-self: flex-end !important;
    }
    @keyframes naiFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nai-typing {
      display: flex !important; gap: 5px !important; padding: 10px 14px !important;
      background: rgba(255,255,255,0.08) !important; border-radius: 14px !important;
      border-bottom-left-radius: 3px !important; align-self: flex-start !important;
    }
    .nai-typing span {
      width: 7px !important; height: 7px !important;
      background: rgba(255,255,255,0.4) !important; border-radius: 50% !important;
      animation: naiDot 1.4s infinite !important;
    }
    .nai-typing span:nth-child(2) { animation-delay: 0.2s !important; }
    .nai-typing span:nth-child(3) { animation-delay: 0.4s !important; }
    @keyframes naiDot {
      0%,60%,100% { opacity: 0.3; transform: scale(0.7); }
      30% { opacity: 1; transform: scale(1); }
    }
    #nai-form {
      padding: 10px 12px !important; border-top: 1px solid rgba(255,255,255,0.07) !important;
      display: flex !important; gap: 8px !important; background: #0f0f1a !important; flex-shrink: 0 !important;
    }
    #nai-input {
      flex: 1 !important; background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(255,255,255,0.1) !important; color: #fff !important;
      border-radius: 10px !important; padding: 9px 13px !important; font-size: 13px !important;
      outline: none !important; font-family: inherit !important;
    }
    #nai-input:focus { border-color: #f97316 !important; }
    #nai-input::placeholder { color: rgba(255,255,255,0.28) !important; }
    #nai-send {
      background: linear-gradient(135deg, #f97316, #fb923c) !important;
      border: none !important; border-radius: 10px !important;
      width: 40px !important; height: 40px !important; cursor: pointer !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      flex-shrink: 0 !important; color: #fff !important; font-size: 16px !important;
    }
    #nai-send:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
    #nai-powered {
      text-align: center !important; padding: 5px !important;
      font-size: 10px !important; color: rgba(255,255,255,0.2) !important;
      background: #0f0f1a !important; flex-shrink: 0 !important;
    }
    #nai-powered a { color: rgba(255,255,255,0.3) !important; text-decoration: none !important; }
    @media (max-width: 420px) {
      #nai-box { width: calc(100vw - 20px) !important; right: 10px !important; }
    }
  `;
  document.head.appendChild(style);

  /* ---- BUILD BUBBLE BUTTON ---- */
  var btn = document.createElement('button');
  btn.id  = 'nai-btn';
  btn.setAttribute('aria-label', 'Chat with us');
  btn.title = 'Chat with Nova';
  // SVG chat icon
  btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';

  /* ---- BUILD CHAT BOX ---- */
  var box = document.createElement('div');
  box.id = 'nai-box';
  box.innerHTML =
    '<div id="nai-head">' +
      '<div style="display:flex;align-items:center">' +
        '<div id="nai-avatar">N</div>' +
        '<div>' +
          '<div id="nai-name">' + AGENT_NAME + ' — AI Sales Agent</div>' +
          '<div id="nai-status">🟢 Online now</div>' +
        '</div>' +
      '</div>' +
      '<button id="nai-close" aria-label="Close">✕</button>' +
    '</div>' +
    '<div id="nai-msgs"></div>' +
    '<div id="nai-form">' +
      '<input id="nai-input" type="text" placeholder="Type a message..." autocomplete="off" maxlength="500" />' +
      '<button id="nai-send" aria-label="Send">&#10148;</button>' +
    '</div>' +
    '<div id="nai-powered">Powered by <a href="https://nexus-cpu-arch.github.io/nexusai/site/" target="_blank">NexusAI</a></div>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  /* ---- OPEN / CLOSE ---- */
  function openChat() {
    isOpen = true;
    box.style.display = 'flex';
    setTimeout(function() { box.classList.add('nai-open'); }, 10);
    // Swap bubble icon to X
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    if (messages.length === 0) {
      setTimeout(botGreet, 500);
    }
    setTimeout(function() {
      var inp = document.getElementById('nai-input');
      if (inp) inp.focus();
    }, 350);
  }

  function closeChat() {
    isOpen = false;
    box.classList.remove('nai-open');
    // Swap back to chat icon
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
    setTimeout(function() {
      if (!isOpen) box.style.display = 'none';
    }, 260);
  }

  btn.addEventListener('click', function() {
    if (isOpen) closeChat(); else openChat();
  });
  document.getElementById('nai-close').addEventListener('click', closeChat);
  document.getElementById('nai-send').addEventListener('click', sendMessage);
  document.getElementById('nai-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  /* ---- AUTO-OPEN on page load ---- */
  setTimeout(openChat, 1200);

  /* ---- MESSAGES ---- */
  function botGreet() {
    renderMsg('Hi there! 👋 I\'m ' + AGENT_NAME + ', your AI sales assistant. Ready to help you find the right solution!', 'bot');
  }

  function renderMsg(text, role) {
    var el = document.createElement('div');
    el.className = 'nai-msg ' + role;
    el.textContent = text;
    var container = document.getElementById('nai-msgs');
    if (container) { container.appendChild(el); scrollDown(); }
  }

  function showTyping() {
    removeTyping();
    var t = document.createElement('div');
    t.className = 'nai-typing'; t.id = 'nai-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    var c = document.getElementById('nai-msgs');
    if (c) { c.appendChild(t); scrollDown(); }
  }

  function removeTyping() {
    var t = document.getElementById('nai-typing-indicator');
    if (t) t.remove();
  }

  function scrollDown() {
    var el = document.getElementById('nai-msgs');
    if (el) setTimeout(function() { el.scrollTop = el.scrollHeight; }, 50);
  }

  /* ---- SEND ---- */
  async function sendMessage() {
    var input   = document.getElementById('nai-input');
    var sendBtn = document.getElementById('nai-send');
    var text    = input ? input.value.trim() : '';
    if (!text || isTyping) return;

    input.value = '';
    renderMsg(text, 'user');
    messages.push({ role: 'user', content: text });
    isTyping = true;
    if (sendBtn) sendBtn.disabled = true;
    showTyping();

    try {
      var resp = await fetch(API_BASE + '/captureLeadAndChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widget_id:       WIDGET_ID,
          session_id:      sessionId,
          visitor_message: text,
          current_stage:   stage,
          page_url:        window.location.href
        })
      });
      var data = await resp.json();
      removeTyping();
      var reply = (data && data.reply) ? data.reply : 'Thanks for reaching out! Our team will follow up soon. 😊';
      if (data && data.stage) stage = data.stage;
      renderMsg(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });
    } catch(e) {
      removeTyping();
      renderMsg('Thanks for your message! Our team will get back to you shortly. 😊', 'bot');
    }

    isTyping = false;
    if (sendBtn) sendBtn.disabled = false;
    if (input) input.focus();
  }

})();
