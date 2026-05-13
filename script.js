/* =====================================================
   PHILIPPINE HUB — script.js
   ===================================================== */

const VALID_USER = "admin";
const VALID_PASS = "1234";

/* ── DOM ── */
const html         = document.documentElement;
const loginPage    = document.getElementById("loginPage");
const hubPage      = document.getElementById("hubPage");
const loginForm    = document.getElementById("loginForm");
const btnLogin     = document.getElementById("btnLogin");
const fEmail       = document.getElementById("fEmail");
const fPass        = document.getElementById("fPass");
const eyeBtn       = document.getElementById("eyeBtn");
const loginSuccess = document.getElementById("loginSuccess");
const themeToggle  = document.getElementById("themeToggle");
const hubThemeBtn  = document.getElementById("hubTheme");
const logoutBtn    = document.getElementById("logoutBtn");

/* ════════════════════════════
   THEME
════════════════════════════ */
function applyTheme(t) {
  html.setAttribute("data-theme", t);
  localStorage.setItem("ph-theme", t);
  if (hubThemeBtn) hubThemeBtn.textContent = t === "dark" ? "☀️" : "🌙";
}
applyTheme(localStorage.getItem("ph-theme") || "dark");
themeToggle.addEventListener("click", () => applyTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark"));
if (hubThemeBtn) hubThemeBtn.addEventListener("click", () => applyTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark"));

/* ════════════════════════════
   SHOW / HIDE PASSWORD
════════════════════════════ */
eyeBtn.addEventListener("click", () => {
  const isPw = fPass.type === "password";
  fPass.type = isPw ? "text" : "password";
  eyeBtn.querySelector(".show-eye").style.display = isPw ? "none"   : "inline";
  eyeBtn.querySelector(".hide-eye").style.display = isPw ? "inline" : "none";
});

/* ════════════════════════════
   FIELD ERRORS
════════════════════════════ */
function showErr(fwId, fgId, msg) {
  const fw = document.getElementById(fwId);
  const fg = document.getElementById(fgId);
  fw.classList.add("has-err");
  fg.classList.add("show-err");
  fg.querySelector(".f-err").textContent = msg;
  fw.classList.remove("shake");
  void fw.offsetWidth;
  fw.classList.add("shake");
  fw.addEventListener("animationend", () => fw.classList.remove("shake"), { once: true });
}
function clearErr(fwId, fgId) {
  document.getElementById(fwId).classList.remove("has-err");
  document.getElementById(fgId).classList.remove("show-err");
}
fEmail.addEventListener("input", () => clearErr("fw-email","fg-email"));
fPass.addEventListener("input",  () => clearErr("fw-pass","fg-pass"));

/* ════════════════════════════
   LOGIN
════════════════════════════ */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = fEmail.value.trim();
  const pass  = fPass.value;
  let bad = false;

  if (!email) { showErr("fw-email","fg-email","Email or username is required."); bad = true; }
  else if (email !== VALID_USER) { showErr("fw-email","fg-email","No account found with this username."); bad = true; }

  if (!pass) { showErr("fw-pass","fg-pass","Password is required."); bad = true; }
  else if (pass !== VALID_PASS) { showErr("fw-pass","fg-pass","Incorrect password. Please try again."); bad = true; }

  if (bad) return;

  btnLogin.classList.add("loading");
  btnLogin.disabled = true;
  await wait(1500);

  btnLogin.classList.remove("loading");
  loginForm.style.transition = "opacity .35s, transform .35s";
  loginForm.style.opacity = "0";
  loginForm.style.transform = "translateY(-10px)";
  await wait(320);
  loginForm.style.display = "none";
  loginSuccess.classList.add("visible");
  await wait(2000);

  loginPage.classList.add("page-fade-out");
  await wait(420);
  loginPage.classList.remove("active");
  loginPage.style.display = "none";

  hubPage.style.display = "flex";
  hubPage.classList.add("active","page-fade-in");
  window.scrollTo(0, 0);
});

/* ════════════════════════════
   LOGOUT
════════════════════════════ */
function doLogout() {
  closeAll();
  if (!confirm("Log out of Philippine Hub?")) return;
  hubPage.classList.add("page-fade-out");
  wait(420).then(() => {
    hubPage.classList.remove("active","page-fade-out");
    hubPage.style.display = "none";
    loginForm.style.display = "";
    loginForm.style.opacity = "";
    loginForm.style.transform = "";
    loginSuccess.classList.remove("visible");
    fEmail.value = "";
    fPass.value  = "";
    btnLogin.disabled = false;
    clearErr("fw-email","fg-email");
    clearErr("fw-pass","fg-pass");
    loginPage.style.display = "";
    loginPage.classList.add("active","page-fade-in");
    loginPage.addEventListener("animationend", () => loginPage.classList.remove("page-fade-in"), { once:true });
  });
}
if (logoutBtn) logoutBtn.addEventListener("click", doLogout);

/* ════════════════════════════
   TAB SWITCHING
════════════════════════════ */
const tabViews = {
  home:        document.getElementById("viewHome"),
  watch:       document.getElementById("viewWatch"),
  marketplace: document.getElementById("viewMarketplace"),
  groups:      document.getElementById("viewGroups"),
  gaming:      document.getElementById("viewGaming"),
};

function switchTab(tabName) {
  closeAll();
  // Update nav tab buttons
  document.querySelectorAll(".hn-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  // Show/hide views
  Object.entries(tabViews).forEach(([key, el]) => {
    if (!el) return;
    if (key === tabName) {
      el.style.display = (key === "home") ? "grid" : "block";
      el.classList.add("active");
      // restart animation
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    } else {
      el.style.display = "none";
      el.classList.remove("active");
    }
  });
}

// Wire up nav tab buttons
document.querySelectorAll(".hn-tab").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// Sidebar items
document.querySelectorAll(".hub-left .hs-item").forEach(item => {
  item.addEventListener("click", function() {
    document.querySelectorAll(".hub-left .hs-item").forEach(i => i.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ════════════════════════════
   DROPDOWN PANELS
════════════════════════════ */
function closeAll() {
  document.querySelectorAll(".dropdown-panel").forEach(p => p.classList.remove("open"));
  document.querySelectorAll(".post-menu").forEach(m => m.classList.remove("open"));
  document.getElementById("emojiPicker").classList.remove("open");
}

function toggleNotifPanel() {
  const p = document.getElementById("notifPanel");
  const wasOpen = p.classList.contains("open");
  closeAll();
  if (!wasOpen) {
    p.classList.add("open");
    // Clear badge
    const badge = document.getElementById("notifBadge");
    if (badge) badge.style.display = "none";
  }
}
function toggleMsgPanel() {
  const p = document.getElementById("msgPanel");
  const wasOpen = p.classList.contains("open");
  closeAll();
  if (!wasOpen) {
    p.classList.add("open");
    const badge = document.getElementById("msgBadge");
    if (badge) badge.style.display = "none";
  }
}
function toggleProfileMenu() {
  const p = document.getElementById("profilePanel");
  const wasOpen = p.classList.contains("open");
  closeAll();
  if (!wasOpen) p.classList.add("open");
}

// Close on outside click
document.addEventListener("click", (e) => {
  const insidePanel = e.target.closest(".dropdown-panel");
  const insideIcon  = e.target.closest(".hn-icon, .hn-av");
  const insidePostMenu = e.target.closest(".post-menu, .post-more-btn");
  const insideEmoji = e.target.closest(".emoji-picker, .cmt-iw span");
  if (!insidePanel && !insideIcon && !insidePostMenu && !insideEmoji) closeAll();
});

/* ════════════════════════════
   POST MENUS
════════════════════════════ */
function togglePostMenu(btn) {
  const menu = btn.nextElementSibling;
  const wasOpen = menu.classList.contains("open");
  closeAll();
  if (!wasOpen) menu.classList.add("open");
}

/* ════════════════════════════
   LIKE TOGGLE
════════════════════════════ */
function toggleLike(id, btn) {
  if (btn.classList.contains("liked")) {
    btn.classList.remove("liked");
    btn.textContent = "👍 Like";
  } else {
    btn.classList.add("liked");
    btn.textContent = "👍 Liked";
    btn.style.transform = "scale(1.22)";
    setTimeout(() => btn.style.transform = "", 220);
  }
}

/* ════════════════════════════
   SHARE
════════════════════════════ */
function sharePost(btn) {
  btn.textContent = "✓ Shared!";
  btn.style.color = "var(--success)";
  setTimeout(() => { btn.textContent = "↗️ Share"; btn.style.color = ""; }, 2000);
}

/* ════════════════════════════
   COMMENTS
════════════════════════════ */
function focusCmt(id) {
  const el = document.getElementById(id);
  if (el) { el.focus(); el.scrollIntoView({ behavior:"smooth", block:"center" }); }
}

function postCmt(e, areaId) {
  if (e.key !== "Enter") return;
  const txt = e.target.value.trim();
  if (!txt) return;
  const area = document.getElementById(areaId);
  const div  = document.createElement("div");
  div.className = "cmt-item";
  div.style.animation = "fadeIn .3s ease both";
  div.innerHTML = `
    <div class="cmt-av">A</div>
    <div class="cmt-bub"><b>Admin User</b><br/>${esc(txt)}</div>`;
  area.appendChild(div);
  e.target.value = "";
}

/* ════════════════════════════
   EMOJI PICKER
════════════════════════════ */
let activeEmojiInput = null;

function addEmoji(inputId) {
  activeEmojiInput = inputId;
  const input = document.getElementById(inputId);
  const picker = document.getElementById("emojiPicker");
  const rect = input.closest(".cmt-iw").getBoundingClientRect();
  picker.style.left = rect.left + "px";
  picker.style.top  = (rect.top - 170 + window.scrollY) + "px";
  const wasOpen = picker.classList.contains("open");
  closeAll();
  if (!wasOpen) picker.classList.add("open");
}

function pickEmoji(emoji) {
  if (activeEmojiInput) {
    const input = document.getElementById(activeEmojiInput);
    if (input) input.value += emoji;
  }
  document.getElementById("emojiPicker").classList.remove("open");
}

/* ════════════════════════════
   COMPOSER
════════════════════════════ */
function openComposer(type) {
  const prompts = {
    video:   "🎥 Start a live video caption:",
    photo:   "🖼️ Describe your photo/video:",
    feeling: "😊 What are you feeling?",
    default: "What's on your mind, Admin?",
  };
  const txt = prompt(prompts[type] || prompts.default);
  if (!txt || !txt.trim()) return;

  const emojis = { video:"🎥", photo:"🖼️", feeling:"😊", default:"✍️" };
  const tag = emojis[type] || emojis.default;

  const feed = document.querySelector(".hub-feed");
  const card = document.createElement("div");
  card.className = "post";
  card.innerHTML = `
    <div class="post-hdr">
      <div class="post-av" style="background:linear-gradient(135deg,#0038A8,#CE1126)">A</div>
      <div class="post-info">
        <div class="post-nm">Admin User <span class="ptag">${tag} Just now</span></div>
        <div class="post-ts">⏱ Just now · 🌍</div>
      </div>
      <button class="post-more-btn" onclick="togglePostMenu(this)">⋯</button>
      <div class="post-menu">
        <div class="pm-item" onclick="this.closest('.post').remove()">🗑️ Delete post</div>
        <div class="pm-item">✏️ Edit post</div>
      </div>
    </div>
    <div class="post-body" style="font-size:18px;font-weight:600;padding:14px 20px 18px">${esc(txt)}</div>
    <div class="post-react-bar"><span>0 reactions</span><span>0 comments</span></div>
    <div class="post-acts">
      <button class="pab" onclick="toggleLike(null,this)">👍 Like</button>
      <button class="pab">💬 Comment</button>
      <button class="pab" onclick="sharePost(this)">↗️ Share</button>
    </div>`;
  document.querySelector(".composer").insertAdjacentElement("afterend", card);
  card.scrollIntoView({ behavior:"smooth", block:"start" });
}

/* ════════════════════════════
   CHAT
════════════════════════════ */
let currentChat = null;
const chatMessages = {}; // store messages per contact

const starterMsgs = {
  "Maria Santos":  ["Kumusta ka na Admin? 😊", "Maganda dito sa Intramuros ha!"],
  "Ruel Bautista": ["Subukan mo yung recipe ko!", "Guaranteed masarap 🍲"],
  "Kuya Mark":     ["Padala ko na yung kanta 🎸", "Salamat sa support mo!"],
  "Lola Nena":     ["Kumain ka na ba anak? 😊"],
  "Ana Villanueva":["Anong tingin mo sa quote ni Rizal?"],
  "Bro Dante":     ["Oi pare! Laro tayo bukas?", "ML ka ba o FF?"],
};

function openChat(name, gradient, initial) {
  currentChat = name;
  if (!chatMessages[name]) {
    chatMessages[name] = (starterMsgs[name] || ["Hoy! 👋"]).map(t => ({ from:"them", text:t }));
  }

  document.getElementById("chatAv").style.background = gradient;
  document.getElementById("chatAv").textContent = initial;
  document.getElementById("chatName").textContent = name;

  const msgs = document.getElementById("chatMsgs");
  msgs.innerHTML = "";
  chatMessages[name].forEach(m => appendChatBubble(m.text, m.from));

  document.getElementById("chatWindow").classList.add("open");
  document.getElementById("msgPanel").classList.remove("open");
  msgs.scrollTop = msgs.scrollHeight;
  document.getElementById("chatInput").focus();
}

function appendChatBubble(text, from) {
  const msgs = document.getElementById("chatMsgs");
  const div  = document.createElement("div");
  div.className = `chat-bubble ${from}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendChatMsg(e) {
  if (e.key && e.key !== "Enter") return;
  const input = document.getElementById("chatInput");
  const txt   = input.value.trim();
  if (!txt || !currentChat) return;

  chatMessages[currentChat].push({ from:"me", text:txt });
  appendChatBubble(txt, "me");
  input.value = "";

  // Auto-reply after 1s
  const replies = [
    "Oo naman! 😊", "Sus, ikaw talaga 😂", "Maganda yan!", "Sige sige!",
    "Ayos!", "Haha oo nga!", "🇵🇭❤️", "Salamat ha!", "Oo pre!"
  ];
  setTimeout(() => {
    const reply = replies[Math.floor(Math.random() * replies.length)];
    chatMessages[currentChat].push({ from:"them", text:reply });
    appendChatBubble(reply, "them");
  }, 900 + Math.random() * 600);
}

function closeChat() {
  document.getElementById("chatWindow").classList.remove("open");
  currentChat = null;
}

/* ════════════════════════════
   STORY VIEWER
════════════════════════════ */
function viewStory(name, av, text) {
  document.getElementById("smAv").textContent   = av;
  document.getElementById("smName").textContent = name;
  document.getElementById("smText").textContent = text;
  document.getElementById("storyModal").classList.add("open");
}

/* ════════════════════════════
   REACTORS MODAL
════════════════════════════ */
function showReactors() {
  document.getElementById("reactModal").classList.add("open");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}

/* ════════════════════════════
   WATCH TAB
════════════════════════════ */
function playVideo(card, title, creator) {
  const thumb = card.querySelector(".vc-thumb");
  thumb.innerHTML = `
    <div style="width:100%;height:100%;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
      <div style="font-size:48px">▶️</div>
      <div style="color:#fff;font-size:14px;font-weight:600;text-align:center;padding:0 12px">${esc(title)}</div>
      <div style="color:rgba(255,255,255,.6);font-size:12px">${esc(creator)} • Playing...</div>
    </div>`;
}

/* ════════════════════════════
   MARKETPLACE
════════════════════════════ */
function buyItem(card, name, price) {
  if (confirm(`Buy "${name}" for ${price}?\n\nThis will send a purchase request to the seller.`)) {
    const btn = document.createElement("div");
    btn.style.cssText = "position:absolute;inset:0;background:rgba(0,56,168,.85);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800;border-radius:10px;animation:fadeIn .3s ease";
    btn.textContent = "✓ Request Sent!";
    card.style.position = "relative";
    card.appendChild(btn);
    setTimeout(() => btn.remove(), 2500);
  }
}

document.querySelectorAll(".mkt-cat").forEach(cat => {
  cat.addEventListener("click", function() {
    document.querySelectorAll(".mkt-cat").forEach(c => c.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ════════════════════════════
   GROUPS
════════════════════════════ */
function joinGroup(btn) {
  btn.textContent = "✓ Joined";
  btn.classList.add("joined");
  btn.onclick = null;
}
function openGroup(name) {
  alert(`Opening group: ${name}\n\nThis would navigate to the group page.`);
}

/* ════════════════════════════
   GAMING
════════════════════════════ */
function playGame(name) {
  alert(`Launching ${name}…\n\nThis would open the game in the Hub gaming platform.`);
}

/* ════════════════════════════
   SEARCH
════════════════════════════ */
function handleSearch(e) {
  if (e.key !== "Enter") return;
  const q = e.target.value.trim();
  if (!q) return;
  alert(`🔍 Searching for: "${q}"\n\nSearch results would appear here.`);
  e.target.value = "";
}

/* ════════════════════════════
   UTILITIES
════════════════════════════ */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function esc(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}