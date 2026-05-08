/* ============================================================
   main.js — Atech Multimedia Entertainment
   Loaded by index.html only. Handles:
     - Hero image slider
     - Testimonial slider
     - Order center (cart, invoice generator)
     - Ghana region/area dropdown
     - MoMo / WhatsApp / email order actions
     - AI chat widget (Ama — powered by Anthropic via proxy)
============================================================ */

/* ----------------------------------------------------------
   GHANA AREAS DATA
---------------------------------------------------------- */
const ghanaAreas = {
  'Greater Accra': ['37 Military Hospital','Abeka','Abelemkpe','Ablekuma','Abossey Okai','Accra','Achimota','Adabraka','Adenta','Adjiriganor','Afienya','Agbogbloshie','Alajo','Amasaman','American House','Apenkwa','Airport Residential','Ashaley Botwe','Ashaiman','Ashongman Estates','Asylum Down','Atomic','Avenor','Awudome','Ayi Mensah','Baatsona','Bubuashie','Burma Camp','Cantonments','Chorkor','Circle','Dansoman','Darkuman','Dawhenya','Dome','Dzorwulu','East Airport','East Legon','Fadama','Gbawe','Haatso','Hillside','James Town','Kaneshie','Kasoa','Kasoa Iron City','Kasoa Millennium City','Kasoa Ofaakor','Katamanso','Kokomlemle','Korle Gonno','Kotobabi','Kwabenya','Labone','Lakeside','Lapaz','Lartebiokoshie','Legon','Madina','Makola','Mallam','Mamobi','Mamprobi','Mataheko','McCarthy Hill','New Ashongman','New Town','Nima','North Legon','Nungua','Odorkor','Ofankor','Old Ashongman','Osu','Oyarifa','Oyibi','Pig Farm','Pokuase','Prampram','Ridge','Roman Ridge','Sakumono','Santa Maria','Shiashie','Sowutuom','Spintex','Tabora','Tema','Tema Community 1','Tema Community 2','Tema Community 3','Tema Community 4','Tema Community 5','Tema Community 6','Tema Community 7','Tema Community 8','Tema Community 9','Tema Community 10','Tema Community 11','Tema Community 12','Tema Community 18','Tema Community 19','Tema Community 25','Tesano','Teshie','Trade Fair','Trassaco','Tudu','Weija','West Airport','West Legon'],
  'Ashanti': ['Kumasi','Adum','Asokwa','Suame','Tafo','Bantama','Dichemso','Patasi','Ahodwo','Daban','Atonsu','Santasi','Kwadaso','Ejisu','KNUST','Ayeduase','Bomso','Tech Junction','Sokoban','Abrepo','Manhyia','Mampong','Konongo','Bekwai','Ejura','Obuasi','Fomena','Abuakwa','Atwima','Offinso','Effiduase','Asokore Mampong'],
  'Central': ['Cape Coast','Pedu','Abura','University of Cape Coast','Elmina','Mankessim','Kasoa','Budumburam','Winneba','Swedru','Apam','Dunkwa-on-Offin','Twifo Praso','Agona Nkwanta','Breman Asikuma'],
  'Eastern': ['Koforidua','Effiduase','Jumapo','Akwadum','Oyoko','Suhum','Nsawam','Aburi','Akropong','Akim Oda','Nkawkaw','Mpraeso','Kibi','Somanya','Asamankese','Akosombo','Atimpoku','Mampong-Akuapem'],
  'Western': ['Sekondi','Takoradi','Effia','Kwesimintsim','Apowa','Anaji','Beach Road','Tarkwa','Bogoso','Prestea','Axim','Half Assini','Shama','Agona Nkwanta','Mpohor'],
  'Western North': ['Sefwi Wiawso','Bibiani','Awaso','Juaboso','Bodi','Dadieso','Akontombra'],
  'Volta': ['Ho','Hohoe','Keta','Anloga','Aflao','Kpando','Dzodze','Sogakope','Akatsi','Adaklu'],
  'Oti': ['Dambai','Nkwanta','Kadjebi','Jasikan','Krachi','Chinderi'],
  'Northern': ['Tamale','Sagnarigu','Nyohini','Lamashegu','Kalpohin','Yendi','Savelugu','Walewale','Gushegu','Karaga'],
  'North East': ['Nalerigu','Gambaga','Walewale','Bunkpurugu','Chereponi','Yunyoo'],
  'Savannah': ['Damongo','Bole','Sawla','Salaga','Daboya'],
  'Upper East': ['Bolgatanga','Navrongo','Bawku','Zebilla','Paga','Binduri'],
  'Upper West': ['Wa','Lawra','Tumu','Jirapa','Nadowli','Lambussie'],
  'Bono': ['Sunyani','Fiapre','Penkwase','Berekum','Dormaa','Wenchi','Odumase'],
  'Bono East': ['Techiman','Kintampo','Nkoranza','Atebubu','Prang','Yeji'],
  'Ahafo': ['Goaso','Bechem','Kenyasi','Hwidiem','Duayaw Nkwanta','Mim']
};

function loadAreas() {
  var region = document.getElementById('custRegion').value;
  var areaSelect = document.getElementById('custArea');
  areaSelect.innerHTML = '<option value="">Select Area / Town</option>';
  if (ghanaAreas[region]) {
    ghanaAreas[region].forEach(function (area) {
      var opt = document.createElement('option');
      opt.value = area;
      opt.textContent = area;
      areaSelect.appendChild(opt);
    });
  }
}

/* ----------------------------------------------------------
   ORDER CENTER — Formspree email
---------------------------------------------------------- */
var FORMSPREE_URL = 'https://formspree.io/f/mojnagzr';

function sendEmailViaFormspree() {
  var customer = document.getElementById('custName').value;
  var phone    = document.getElementById('custPhone').value;
  var delivery = document.getElementById('deliveryMethod').value;
  var btn      = document.getElementById('emailBtn');
  if (!customer || !phone) { alert('Please enter Customer Name and Phone first.'); return; }
  btn.textContent = 'Sending…';
  btn.disabled = true;
  fetch(FORMSPREE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body:    JSON.stringify({ _subject: 'New Atech Order: ' + customer, customer_name: customer, customer_phone: phone, delivery_method: delivery })
  })
    .then(function (r) { alert(r.ok ? 'Order details sent successfully!' : 'Error sending. Check Formspree settings.'); })
    .catch(function ()  { alert('Connection error. Please check your internet.'); })
    .finally(function () { btn.textContent = '📧 EMAIL STAFF'; btn.disabled = false; });
}

function payViaMoMo() {
  alert('📢 ATECH MULTIMEDIA MOMO:\nNetwork: MTN\nNumber: 0243266013\nName: Atech Multimedia\n\nPlease use your name as payment reference.');
}

function sendToWhatsApp() {
  var customer = document.getElementById('custName').value || 'Client';
  var msg = encodeURIComponent('Hello, my name is ' + customer + '. I\'d like to place an order with Atech Multimedia.');
  window.open('https://wa.me/233243266013?text=' + msg, '_blank');
}

/* ----------------------------------------------------------
   ORDER CART
---------------------------------------------------------- */
var orderItems = [];

function addItem() {
  var choice   = document.getElementById('serviceChoice');
  var qtyInput = document.getElementById('serviceQty');
  if (!choice || !choice.value) { alert('Select a service first!'); return; }
  var name     = choice.value;
  var price    = parseFloat(choice.options[choice.selectedIndex].getAttribute('data-price')) || 0;
  var qty      = parseInt(qtyInput.value, 10) || 1;
  orderItems.push({ name: name, qty: qty, unit: price, subtotal: price * qty });
  renderItems();
  updateTotal();
  choice.selectedIndex = 0;
  qtyInput.value = 1;
}

function renderItems() {
  var listDiv = document.getElementById('itemList');
  if (!listDiv) return;
  if (!orderItems.length) {
    listDiv.innerHTML = '<p style="text-align:center;color:#999;">Items will appear here…</p>';
    return;
  }
  /* Build rows with data-remove-index — no inline onclick at all */
  listDiv.innerHTML = orderItems.map(function (item, i) {
    return '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">' +
      '<span>' + item.qty + 'x ' + item.name + '</span>' +
      '<span>₵' + item.subtotal.toLocaleString() +
        ' <button data-remove-index="' + i + '" aria-label="Remove item" ' +
        'style="background:none;border:none;color:red;cursor:pointer;margin-left:10px;font-size:16px;font-weight:bold;line-height:1;padding:0;">&times;</button>' +
      '</span></div>';
  }).join('');
  /* Delegation listener is attached once in initOrderButtons — not here */
}

function removeItem(i) {
  orderItems.splice(i, 1);
  renderItems();
  updateTotal();
}

function updateTotal() {
  var total = orderItems.reduce(function (sum, item) { return sum + item.subtotal; }, 0);
  var el = document.getElementById('displayPrice');
  if (el) el.textContent = '₵' + total.toLocaleString();
}

/* ----------------------------------------------------------
   INVOICE GENERATOR (admin only — PIN is client-side;
   move gate to server-side before storing sensitive data)
---------------------------------------------------------- */
function generateInvoice() {
  if (!orderItems.length) { alert('No items to print! Please add items first.'); return; }
  var auth = prompt('🔐 Admin: Enter your staff PIN to print invoice:');
  if (!auth || !auth.trim()) { alert('Access Denied.'); return; }

  var customer    = document.getElementById('custName').value       || 'Valued Client';
  var custPhone   = document.getElementById('custPhone').value      || 'N/A';
  var delivery    = document.getElementById('deliveryMethod').value || 'Pickup';
  var subtotal    = orderItems.reduce(function (s, i) { return s + i.subtotal; }, 0);
  var nhil        = subtotal * 0.025;
  var getFund     = subtotal * 0.025;
  var vat         = subtotal * 0.15;
  var grand       = subtotal + nhil + getFund + vat;
  var deposit     = (grand * 0.7).toFixed(2);
  var balance     = (grand * 0.3).toFixed(2);
  var isPaid      = confirm('OK for PAID RECEIPT / Cancel for UNPAID INVOICE');
  var type        = isPaid ? 'OFFICIAL RECEIPT' : 'OFFICIAL INVOICE';
  var ref         = 'ATECH-' + Math.floor(10000 + Math.random() * 90000);

  var rows = orderItems.map(function (item) {
    return '<tr><td>' + item.name + '</td>' +
      '<td style="text-align:center;">₵ ' + (item.subtotal / item.qty).toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</td>' +
      '<td style="text-align:center;">' + item.qty + '</td>' +
      '<td style="text-align:right;">₵ ' + item.subtotal.toLocaleString() + '</td></tr>';
  }).join('');

  var win = window.open('', '_blank');
  win.document.write('<!DOCTYPE html><html><head><title>' + type + ' - ' + customer + '</title><style>' +
    '@page{size:A4;margin:0}html,body{margin:0;padding:0;width:210mm;font-family:"Segoe UI",Tahoma,sans-serif;background:white}' +
    '.page{width:210mm;min-height:297mm;padding:15mm 20mm;box-sizing:border-box;display:flex;flex-direction:column}' +
    '.wm{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);width:450px;opacity:0.05;z-index:0;pointer-events:none}' +
    '.hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:5px solid #0a2a66;padding-bottom:15px}' +
    '.logo{height:70px}table{width:100%;border-collapse:collapse}' +
    'th{text-align:left;padding:10px;border-bottom:2px solid #333;background:#f8f9fa;font-size:12px}' +
    'td{padding:12px 10px;border-bottom:1px solid #eee;font-size:13px}' +
    '.ftr{margin-top:auto;padding-top:20px}' +
    '.dep{text-align:right;border-right:10px solid #f1c40f;padding:15px 20px;background:#FFFDF0;margin-bottom:30px}' +
    '.sf{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:30px}' +
    '.stamps{display:flex;gap:40px;align-items:flex-end}' +
    '.stamp{text-align:center;width:140px}.stamp img{width:100px;display:block;margin:0 auto}' +
    '.sl{border-top:1.5px solid #333;font-size:10px;font-weight:bold;padding-top:8px;margin-top:5px}' +
    '.tots{width:300px;font-size:14px;font-weight:bold;line-height:1.8}' +
    '.tr{display:flex;justify-content:space-between}' +
    '.gt{border-top:2px solid #0a2a66;margin-top:5px;padding-top:5px;color:#0a2a66;font-size:22px;display:flex;justify-content:space-between}' +
    '.loc{text-align:center;border-top:1px solid #ddd;padding-top:15px;font-size:11px;margin-top:20px}' +
    '</style></head><body>' +
    '<img src="images/logo.png" class="wm">' +
    '<div class="page"><div class="hdr">' +
    '<img src="images/logo.png" class="logo">' +
    '<div><h1 style="margin:0;color:#0a2a66;font-size:26px;">ATECH MULTIMEDIA</h1>' +
    '<p style="margin:0;font-size:9px;font-weight:bold;letter-spacing:2px;">CREATIVE · DIGITAL · ICT SOLUTIONS</p></div></div>' +
    '<div style="display:flex;justify-content:space-between;margin-top:20px;font-size:13px;">' +
    '<div><b style="color:#0a2a66;">BILLED TO:</b><br><span style="font-size:18px;font-weight:900;">' + customer + '</span><br>' +
    '<span>Tel: ' + custPhone + '</span><br><span>REF: ' + ref + '</span></div>' +
    '<div style="text-align:right;"><b style="color:#0a2a66;font-size:20px;">' + type + '</b><br>' +
    '<span>DATE: ' + new Date().toLocaleDateString('en-GB') + '</span><br>' +
    '<span style="background:#eee;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:11px;">DELIVERY: ' + delivery.toUpperCase() + '</span></div></div>' +
    '<div style="flex-grow:1;margin-top:30px;"><table><thead><tr>' +
    '<th>Description</th><th style="text-align:center;">Unit Cost</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Total</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<div class="ftr"><div class="dep">' +
    '<h3 style="margin:0;color:#d35400;">70% COMMITMENT DEPOSIT: ₵ ' + deposit + '</h3>' +
    '<p style="margin:5px 0 0;color:#666;font-weight:bold;">REMAINING BALANCE (30%): ₵ ' + balance + '</p></div>' +
    '<div class="sf"><div class="stamps">' +
    '<div class="stamp"><img src="images/stamp.png" onerror="this.style.visibility=\'hidden\'"><div class="sl">AUTHORISED STAMP</div></div>' +
    '<div class="stamp"><img src="images/signature.png" onerror="this.style.visibility=\'hidden\'"><div class="sl">MANAGER SIGNATURE</div></div>' +
    '</div><div class="tots">' +
    '<div class="tr"><span>SUBTOTAL:</span><span>₵ ' + subtotal.toLocaleString() + '</span></div>' +
    '<div class="tr"><span>NHIL (2.5%):</span><span>₵ ' + nhil.toFixed(2) + '</span></div>' +
    '<div class="tr"><span>GETFUND (2.5%):</span><span>₵ ' + getFund.toFixed(2) + '</span></div>' +
    '<div class="tr"><span>VAT (15%):</span><span>₵ ' + vat.toFixed(2) + '</span></div>' +
    '<div class="tr gt"><span>GRAND TOTAL:</span><span>₵ ' + grand.toLocaleString(undefined, { minimumFractionDigits: 2 }) + '</span></div>' +
    '</div></div>' +
    '<div class="loc"><p><b>PAYMENT:</b> MOMO (MTN): 0243266013 (ATECH MULTIMEDIA)</p>' +
    '<p style="font-weight:900;color:#0a2a66;text-transform:uppercase;margin:5px 0;">"Excellence in Digital &amp; Creative Solutions"</p>' +
    '<p>ACCRA NEW TOWN / SHIASHIE EAST LEGON | 0243266013</p></div>' +
    '</div></div></body></html>');
  win.document.close();
  win.onload = function () { win.print(); win.onafterprint = function () { win.close(); }; };
}

/* ----------------------------------------------------------
   HERO SLIDER
---------------------------------------------------------- */
function initHeroSlider() {
  var slides    = document.querySelectorAll('.hero-slider .slide');
  var heroDots  = document.querySelectorAll('.hero-slider .dot');
  var heroNext  = document.querySelector('.hero-slider .next');
  var heroPrev  = document.querySelector('.hero-slider .prev');
  var heroIndex = 0;
  if (!slides.length) return;

  function showSlide(n) {
    slides.forEach(function (s, i)   { s.classList.toggle('active', i === n); });
    heroDots.forEach(function (d, i) { d.classList.toggle('active', i === n); });
  }
  if (heroNext) heroNext.addEventListener('click', function () { heroIndex = (heroIndex + 1) % slides.length; showSlide(heroIndex); });
  if (heroPrev) heroPrev.addEventListener('click', function () { heroIndex = (heroIndex - 1 + slides.length) % slides.length; showSlide(heroIndex); });
  heroDots.forEach(function (dot, i) { dot.addEventListener('click', function () { heroIndex = i; showSlide(heroIndex); }); });
  setInterval(function () { heroIndex = (heroIndex + 1) % slides.length; showSlide(heroIndex); }, 5000);
}

/* ----------------------------------------------------------
   TESTIMONIALS SLIDER
---------------------------------------------------------- */
function initTestimonials() {
  var slider  = document.querySelector('.testimonial-slider');
  var cards   = document.querySelectorAll('.testimonial-card');
  var nextBtn = document.querySelector('.testimonial-next');
  var prevBtn = document.querySelector('.testimonial-prev');
  var dots    = document.querySelectorAll('.testimonial-dots .dot');
  var tIndex  = 0;
  if (!cards.length) return;

  function showTestimonial(n) {
    dots.forEach(function (d, i) { d.classList.toggle('active', i === n); });
    if (slider && cards[0]) slider.scrollLeft = (cards[0].offsetWidth + 20) * n;
  }
  if (nextBtn) nextBtn.addEventListener('click', function () { tIndex = (tIndex + 1) % cards.length; showTestimonial(tIndex); });
  if (prevBtn) prevBtn.addEventListener('click', function () { tIndex = (tIndex - 1 + cards.length) % cards.length; showTestimonial(tIndex); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { tIndex = i; showTestimonial(tIndex); }); });
  setInterval(function () { tIndex = (tIndex + 1) % cards.length; showTestimonial(tIndex); }, 6000);
}

/* ----------------------------------------------------------
   ORDER MODAL (separate from quote modal)
---------------------------------------------------------- */
function initOrderModal() {
  var orderModal = document.getElementById('quoteModal');
  var orderBtn   = document.getElementById('quoteBtn');
  var orderClose = document.getElementById('closeModal');
  if (orderBtn && orderModal) {
    orderBtn.addEventListener('click', function () { orderModal.style.display = 'block'; });
  }
  if (orderClose && orderModal) {
    orderClose.addEventListener('click', function () { orderModal.style.display = 'none'; });
  }
}

/* ----------------------------------------------------------
   AI CHAT — Ama (routes through /api/chat proxy)
   The proxy (chat-proxy.js / Cloudflare Worker) holds the
   Anthropic API key securely server-side.
---------------------------------------------------------- */
/* ⚠️  ACTION REQUIRED: Replace the URL below with your Cloudflare Worker URL
   after following the 8-step deployment guide in js/chat-proxy.js
   Example: var CHAT_PROXY_URL = 'https://atech-chat.yourname.workers.dev';
   Until this is set, the AI chat will show a connection error to visitors. */
var CHAT_PROXY_URL = '/api/chat';

var ATECH_SYSTEM = 'You are Ama, the friendly AI assistant for Atech Multimedia Entertainment — a creative multimedia, printing, and ICT company in Accra, Ghana.\n\n' +
  'Help visitors with services, prices, delivery, and ordering. Be warm, concise, and conversational. Use bullet points for lists. Always suggest a next step (call, WhatsApp, or contact page).\n\n' +
  'KEY FACTS:\n' +
  '- Phone/WhatsApp: +233 24 326 6013\n- Email: info@atechmultimedia.com\n' +
  '- Location: Accra New Town / Shiashie East Legon\n' +
  '- Hours: Mon-Fri 8am-6pm, Sat 9am-4pm, WhatsApp daily 8am-9pm\n' +
  '- Payment: MTN MoMo 0243266013. 70% deposit, 30% on delivery.\n\n' +
  'SERVICES & PRICES (GHS):\n' +
  'Design: Logo from ₵200, Brand Identity from ₵1500, Flyers from ₵50, Website from ₵2500\n' +
  'Print: Banners from ₵150, T-shirts ₵45-60/pc, Large Format ₵80/sqft, Business Cards ₵100/pack\n' +
  'Photography: Events from ₵800, Studio from ₵200, Wedding from ₵3500\n' +
  'Video: Production from ₵500, Live Streaming from ₵500, Drone from ₵400\n' +
  'ICT: Laptop Repair from ₵200, CCTV from ₵500, Website from ₵2500\n' +
  'Publishing: Reports from ₵250, Books from ₵100, Magazines from ₵120\n' +
  'Apparel: T-Shirts ₵45-60, Embroidery from ₵100, Souvenirs from ₵100\n\n' +
  'DELIVERY: Pickup FREE, Kasoa ₵30, Accra Central ₵60, Tema ₵80, Kumasi/Takoradi ₵120, Tamale ₵180\n\n' +
  'Greet in Twi occasionally (Akwaaba = Welcome). Keep replies under 150 words unless detail is needed.';

var chatHistory   = [];
var chatIsWaiting = false;

function addChatMessage(content, sender, isHTML) {
  var chatBody = document.getElementById('chatBody');
  if (!chatBody) return;

  var wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper' + (sender === 'user' ? ' user-wrapper' : '');

  if (sender === 'bot') {
    var avatar = document.createElement('img');
    avatar.src = 'images/logo.png';
    avatar.className = 'bot-avatar';
    avatar.onerror = function () { this.style.display = 'none'; };
    wrapper.appendChild(avatar);
  }

  var bubble = document.createElement('div');
  bubble.className = 'message ' + (sender === 'user' ? 'user-message' : 'bot-message');

  if (content instanceof HTMLElement) {
    bubble.appendChild(content);
  } else if (isHTML) {
    bubble.innerHTML = content;
  } else {
    bubble.innerHTML = content
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- /g, '<br>• ')
      .replace(/\n/g, '<br>');
  }

  wrapper.appendChild(bubble);
  chatBody.appendChild(wrapper);
  setTimeout(function () { chatBody.scrollTop = chatBody.scrollHeight; }, 50);
}

function showTyping() {
  var chatBody = document.getElementById('chatBody');
  if (!chatBody) return;
  var wrapper = document.createElement('div');
  wrapper.className = 'message-wrapper';
  wrapper.id = 'typingIndicator';
  var avatar = document.createElement('img');
  avatar.src = 'images/logo.png';
  avatar.className = 'bot-avatar';
  avatar.onerror = function () { this.style.display = 'none'; };
  var bubble = document.createElement('div');
  bubble.className = 'message bot-message';
  bubble.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  var el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function showChatSuggestions(list) {
  var chatBody = document.getElementById('chatBody');
  if (!chatBody) return;
  var box = document.createElement('div');
  box.className = 'suggestion-box';
  list.forEach(function (s) {
    var btn = document.createElement('button');
    btn.className = 'suggestion-btn';
    btn.textContent = s;
    btn.addEventListener('click', function () { box.remove(); sendChatMessage(s); });
    box.appendChild(btn);
  });
  chatBody.appendChild(box);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendChatMessage(val) {
  if (chatIsWaiting) return;
  var chatInput = document.getElementById('chatInput');
  var sendBtn   = document.getElementById('sendBtn');
  var inputVal  = (val || (chatInput ? chatInput.value : '')).trim();
  if (!inputVal) return;
  if (chatInput) chatInput.value = '';

  addChatMessage(inputVal, 'user');
  chatHistory.push({ role: 'user', content: inputVal });
  chatIsWaiting = true;
  if (sendBtn) { sendBtn.disabled = true; sendBtn.style.opacity = '0.5'; }
  showTyping();

  try {
    var response = await fetch(CHAT_PROXY_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ system: ATECH_SYSTEM, messages: chatHistory })
    });
    var data = await response.json();
    removeTyping();
    var reply = (data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text
      : 'I\'m having trouble right now. Please WhatsApp us: **+233 24 326 6013** 💬';
    chatHistory.push({ role: 'assistant', content: reply });
    addChatMessage(reply, 'bot');

    var lower = reply.toLowerCase();
    if (lower.includes('whatsapp') || lower.includes('contact')) {
      showChatSuggestions(['📞 Call Now', '💬 Open WhatsApp', 'Get a Quote']);
    } else if (lower.includes('₵') || lower.includes('price') || lower.includes('cost')) {
      showChatSuggestions(['Order this service', 'See all services', 'How do I pay?']);
    } else if (lower.includes('deliver') || lower.includes('pickup')) {
      showChatSuggestions(['Accra delivery cost', 'Other regions', 'Self pickup']);
    }
  } catch (err) {
    removeTyping();
    addChatMessage('Connection issue. Please reach us on WhatsApp: **+233 24 326 6013** 💬', 'bot');
  } finally {
    chatIsWaiting = false;
    if (sendBtn) { sendBtn.disabled = false; sendBtn.style.opacity = '1'; }
  }
}

function handleQuickReply(text) {
  if (text === '📞 Call Now')      { window.location.href = 'tel:+233243266013'; return; }
  if (text === '💬 Open WhatsApp') { window.open('https://wa.me/233243266013?text=Hello%20Atech%2C%20I%20need%20help.', '_blank'); return; }
  sendChatMessage(text);
}

/* ----------------------------------------------------------
   CHAT WIDGET INIT
---------------------------------------------------------- */
function initChat() {
  var chatToggle = document.getElementById('chatToggle');
  var chatWidget = document.getElementById('chatWidget');
  var closeChat  = document.getElementById('closeChat');
  var sendBtn    = document.getElementById('sendBtn');
  var chatInput  = document.getElementById('chatInput');

  if (chatToggle && chatWidget) {
    chatToggle.addEventListener('click', function () { chatWidget.classList.toggle('active'); });
  }
  if (closeChat && chatWidget) {
    closeChat.addEventListener('click', function () { chatWidget.classList.remove('active'); });
  }
  if (sendBtn)   sendBtn.addEventListener('click', function () { sendChatMessage(); });
  if (chatInput) chatInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') sendChatMessage(); });

  // Expose globally for inline onclick in welcome buttons
  window.sendMsg      = sendChatMessage;
  window.quickReply   = handleQuickReply;
  window.addMessage   = addChatMessage;
  window.showSuggestions = showChatSuggestions;
}

/* ----------------------------------------------------------
   BOOT — run everything on DOMContentLoaded
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initHeroSlider();
  initTestimonials();
  initOrderModal();
  initOrderButtons();
  initImageErrors();
  initChat();
  initChatWelcomeButtons();
});

/* ----------------------------------------------------------
   ORDER MODAL — wire up buttons that had inline onclick
   (called after DOM ready, inside initOrderModal)
---------------------------------------------------------- */
function initOrderButtons() {
  var btnMomo     = document.getElementById('btnMomo');
  var btnWhatsapp = document.getElementById('btnWhatsapp');
  var emailBtn    = document.getElementById('emailBtn');
  var btnAddItem  = document.getElementById('btnAddItem');
  var btnInvoice  = document.getElementById('btnInvoice');
  var regionSel   = document.getElementById('custRegion');
  var orderLogo   = document.getElementById('orderLogo');

  if (btnMomo)     btnMomo.addEventListener('click', payViaMoMo);
  if (btnWhatsapp) btnWhatsapp.addEventListener('click', sendToWhatsApp);
  if (emailBtn)    emailBtn.addEventListener('click', sendEmailViaFormspree);
  if (btnAddItem)  btnAddItem.addEventListener('click', addItem);
  if (btnInvoice)  btnInvoice.addEventListener('click', generateInvoice);
  if (regionSel)   regionSel.addEventListener('change', loadAreas);

  // Logo hover effect
  if (orderLogo) {
    orderLogo.addEventListener('mouseover', function () { this.style.transform = 'scale(1.05)'; });
    orderLogo.addEventListener('mouseout',  function () { this.style.transform = 'scale(1)'; });
    orderLogo.addEventListener('error',     function () { this.style.display = 'none'; });
  }

  /* Remove-item delegation — single listener on the list container,
     set up once here so it is never duplicated on re-render */
  var itemListDiv = document.getElementById('itemList');
  if (itemListDiv) {
    itemListDiv.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-index]');
      if (btn) {
        removeItem(parseInt(btn.getAttribute('data-remove-index'), 10));
      }
    });
  }
}

/* ----------------------------------------------------------
   IMAGE ERROR HANDLERS (replaces onerror attributes)
   Hides broken images gracefully without inline JS.
---------------------------------------------------------- */
function initImageErrors() {
  // Chat header + welcome logo
  document.querySelectorAll('.chat-header-logo, .chat-welcome-logo, .bot-avatar').forEach(function (img) {
    img.addEventListener('error', function () { this.style.display = 'none'; });
  });
}

/* ----------------------------------------------------------
   CHAT WELCOME BUTTONS — data-chat-msg delegation
   Replaces inline onclick="window.sendMsg(...)" on buttons
   inside the initial chat welcome message.
---------------------------------------------------------- */
function initChatWelcomeButtons() {
  var chatBody = document.getElementById('chatBody');
  if (!chatBody) return;
  chatBody.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-chat-msg]');
    if (btn) {
      var msg = btn.getAttribute('data-chat-msg');
      if (msg) sendChatMessage(msg);
    }
  });
}

