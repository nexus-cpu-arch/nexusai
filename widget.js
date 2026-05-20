/*
 * NexusAI Sales Agent Widget
 * Hosted at: https://nexusai-dashboard-phoenix.netlify.app/widget.js
 * Usage: <script src="https://nexusai-dashboard-phoenix.netlify.app/widget.js?widget_id=YOUR_ID"></script>
 */
(function() {
  if (window.__NEXUSAI_LOADED__) return;
  window.__NEXUSAI_LOADED__ = true;

  // Get config from script tag or global vars
  var scriptTag = document.currentScript ||
    (function() {
      var scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  var scriptSrc = scriptTag ? scriptTag.src : '';
  var urlParams = new URLSearchParams(scriptSrc.split('?')[1] || '');
  var WIDGET_ID = window.__NEXUSAI_WIDGET_ID__ || urlParams.get('widget_id') || 'default';
  var API_BASE = 'https://nexusai-dashboard-phoenix.netlify.app/.netlify/functions';
  var PRIMARY = '#f97316';
  var AGENT_NAME = 'Nova';
  var sessionId = 'sess_' + Math.random().toString(36).slice(2, 10);
  var messages = [];
  var isOpen = false;
  var isTyping = false;
  var leadCaptured = false;

  // ---- STYLES ----
  var style = document.createElement('style');
  style.textContent = [
    '#nai-btn{position:fixed;bottom:24px;right:24px;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,' + PRIMARY + ',#ec4899);border:none;cursor:pointer;box-shadow:0 4px 24px rgba(249,115,22,0.55);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-size:26px;transition:all 0.25s;animation:naiBounce 2s ease-in-out 1s}',
    '#nai-btn:hover{transform:scale(1.12)}',
    '@keyframes naiBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}',
    '#nai-badge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;background:#ef4444;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;display:none}',
    '#nai-box{position:fixed;bottom:96px;right:24px;width:360px;max-height:540px;background:#0f0f1a;border:1px solid rgba(255,255,255,0.1);border-radius:20px;box-shadow:0 24px 64px rgba(0,0,0,0.6);z-index:2147483646;display:none;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;overflow:hidden;transform:translateY(10px) scale(0.97);opacity:0;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1)}',
    '#nai-box.open{display:flex;transform:translateY(0) scale(1);opacity:1}',
    '#nai-head{background:linear-gradient(135deg,' + PRIMARY + ',#ec4899);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}',
    '#nai-avatar{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;color:#fff;margin-right:10px}',
    '#nai-name{font-weight:700;font-size:14px;color:#fff;line-height:1.2}',
    '#nai-status{font-size:11px;color:rgba(255,255,255,0.8)}',
    '#nai-close{background:none;border:none;color:rgba(255,255,255,0.8);cursor:pointer;font-size:18px;padding:4px;line-height:1}',
    '#nai-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;background:#0f0f1a;min-height:200px}',
    '#nai-msgs::-webkit-scrollbar{width:3px}#nai-msgs::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}',
    '.nai-msg{max-width:84%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55;word-wrap:break-word;animation:naiFadeIn 0.2s ease}',
    '.nai-msg.bot{background:rgba(255,255,255,0.08);color:#e2e8f0;border-bottom-left-radius:3px;align-self:flex-start}',
    '.nai-msg.user{background:linear-gradient(135deg,' + PRIMARY + ',#ec4899);color:#fff;border-bottom-right-radius:3px;align-self:flex-end}',
    '@keyframes naiFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
    '.nai-typing{display:flex;gap:5px;padding:10px 14px;background:rgba(255,255,255,0.08);border-radius:14px;border-bottom-left-radius:3px;align-self:flex-start}',
    '.nai-typing span{width:7px;height:7px;background:rgba(255,255,255,0.35);border-radius:50%;animation:naiDot 1.4s infinite}',
    '.nai-typing span:nth-child(2){animation-delay:0.2s}.nai-typing span:nth-child(3){animation-delay:0.4s}',
    '@keyframes naiDot{0%,60%,100%{opacity:0.3;transform:scale(0.7)}30%{opacity:1;transform:scale(1)}}',
    '#nai-form{padding:10px 12px;border-top:1px solid rgba(255,255,255,0.06);display:flex;gap:8px;background:#0f0f1a;flex-shrink:0}',
    '#nai-input{flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;border-radius:10px;padding:9px 13px;font-size:13px;outline:none;font-family:inherit;resize:none}',
    '#nai-input:focus{border-color:' + PRIMARY + ';background:rgba(255,255,255,0.07)}',
    '#nai-input::placeholder{color:rgba(255,255,255,0.28)}',
    '#nai-send{background:linear-gradient(135deg,' + PRIMARY + ',#ec4899);border:none;border-radius:10px;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;color:#fff}',
    '#nai-send:disabled{opacity:0.4;cursor:not-allowed}',
    '#nai-powered{text-align:center;padding:5px;font-size:10px;color:rgba(255,255,255,0.18);background:#0f0f1a;flex-shrink:0}',
    '#nai-powered a{color:rgba(255,255,255,0.3);text-decoration:none}'
  ].join('');
  document.head.appendChild(style);

  // ---- BUILD WIDGET ----
  var btn = document.createElement('button');
  btn.id = 'nai-btn';
  btn.innerHTML = '💬<span id="nai-badge">1</span>';
  btn.title = 'Chat with us';

  var box = document.createElement('div');
  box.id = 'nai-box';
  box.innerHTML =
    '<div id="nai-head">' +
      '<div style="display:flex;align-items:center">' +
        '<div id="nai-avatar">N</div>' +
        '<div><div id="nai-name">' + AGENT_NAME + '</div><div id="nai-status">🟢 Online — ready to help</div></div>' +
      '</div>' +
      '<button id="nai-close" title="Close">✕</button>' +
    '</div>' +
    '<div id="nai-msgs"></div>' +
    '<div id="nai-form">' +
      '<input id="nai-input" placeholder="Type your message..." autocomplete="off" maxlength="500"/>' +
      '<button id="nai-send">➤</button>' +
    '</div>' +
    '<div id="nai-powered">Powered by <a href="https://nexusai-site-phoenix.netlify.app" target="_blank">NexusAI</a></div>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ---- EVENTS ----
  btn.addEventListener('click', function() {
    toggleChat();
  });

  document.getElementById('nai-close').addEventListener('click', function() {
    closeChat();
  });

  document.getElementById('nai-send').addEventListener('click', sendMessage);
  document.getElementById('nai-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      box.style.display = 'flex';
      setTimeout(function() { box.classList.add('open'); }, 10);
      btn.innerHTML = '✕';
      document.getElementById('nai-badge').style.display = 'none';
      if (messages.length === 0) {
        setTimeout(function() { botGreet(); }, 400);
      }
      setTimeout(function() { document.getElementById('nai-input').focus(); }, 300);
    } else {
      closeChat();
    }
  }

  function closeChat() {
    box.classList.remove('open');
    isOpen = false;
    btn.innerHTML = '💬<span id="nai-badge" style="display:none">1</span>';
    setTimeout(function() { box.style.display = 'none'; }, 250);
  }

  function botGreet() {
    renderMsg('Hi there! 👋 I\'m ' + AGENT_NAME + ', your AI sales assistant. I\'m here to help you find the right solution.', 'bot');
    setTimeout(function() {
      renderMsg('What brings you here today? Are you looking to:', 'bot');
      setTimeout(function() {
        renderMsg('• Learn about our products\n• Get a custom quote\n• Schedule a demo\n• Something else?', 'bot');
      }, 600);
    }, 800);
  }

  function renderMsg(text, role) {
    var el = document.createElement('div');
    el.className = 'nai-msg ' + role;
    el.textContent = text;
    el.style.whiteSpace = 'pre-line';
    document.getElementById('nai-msgs').appendChild(el);
    scrollDown();
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'nai-typing';
    t.id = 'nai-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('nai-msgs').appendChild(t);
    scrollDown();
  }

  function hideTyping() {
    var t = document.getElementById('nai-typing-indicator');
    if (t) t.remove();
  }

  function scrollDown() {
    var el = document.getElementById('nai-msgs');
    setTimeout(function() { el.scrollTop = el.scrollHeight; }, 50);
  }

  async function sendMessage() {
    var input = document.getElementById('nai-input');
    var sendBtn = document.getElementById('nai-send');
    var text = input.value.trim();
    if (!text || isTyping) return;

    input.value = '';
    renderMsg(text, 'user');
    messages.push({ role: 'user', content: text });
    isTyping = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      var resp = await fetch(API_BASE + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widget_id: WIDGET_ID,
          session_id: sessionId,
          message: text,
          history: messages,
          page_url: window.location.href,
          page_title: document.title
        })
      });
      var data = await resp.json();
      hideTyping();
      var reply = (data && data.reply) ? data.reply : 'Thank you! Our team will follow up with you shortly. 😊';
      renderMsg(reply, 'bot');
      messages.push({ role: 'assistant', content: reply });
    } catch(e) {
      hideTyping();
      renderMsg('Thanks for reaching out! Our team will get back to you very soon. 😊', 'bot');
    }

    isTyping = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // Show badge after 3 seconds to attract attention
  setTimeout(function() {
    if (!isOpen) {
      document.getElementById('nai-badge').style.display = 'flex';
    }
  }, 3000);

})();
