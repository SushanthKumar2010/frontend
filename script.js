/*********************************************************
 * CHAT CONFIG (your existing chat logic – unchanged)
 *********************************************************/

// Backend URL (Render)
const backendBaseUrl = "https://new-try-zfki.onrender.com";

// DOM elements (chat UI)
const classLevelSelect = document.getElementById("classLevel");
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const questionInput = document.getElementById("questionInput");
const sendBtn = document.getElementById("sendBtn");
const chatWindow = document.getElementById("chatWindow");

// Optional form
const questionForm = document.getElementById("questionForm");
const responseDiv = document.getElementById("response");

// Chapter list
const CHAPTERS = {
  Maths: [
    "Commercial Mathematics",
    "Algebra",
    "Geometry",
    "Mensuration",
    "Trigonometry"
  ],
  Physics: [
    "Force, Work, Power and Energy",
    "Light",
    "Sound",
    "Electricity and Magnetism",
    "Heat",
    "Modern Physics"
  ],
};

function populateChapters() {
  if (!subjectSelect || !chapterSelect) return;
  const subject = subjectSelect.value;
  chapterSelect.innerHTML = "";
  CHAPTERS[subject]?.forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
}

if (subjectSelect) {
  subjectSelect.addEventListener("change", populateChapters);
  populateChapters();
}

function appendMessage(role, text, meta) {
  if (!chatWindow) return;

  const row = document.createElement("div");
  row.classList.add("message-row", role);

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");

  if (role === "bot" && meta) {
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("meta-text");
    metaDiv.textContent = `${meta.class_level} • ${meta.subject} • ${meta.chapter}`;
    bubble.appendChild(metaDiv);
  }

  const p = document.createElement("div");
  p.innerText = text;
  bubble.appendChild(p);

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendQuestion() {
  if (!questionInput) return;

  const question = questionInput.value.trim();
  if (!question) return;

  appendMessage("user", question);

  questionInput.value = "";
  questionInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking...";

  try {
    const response = await fetch(`${backendBaseUrl}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        class_level: classLevelSelect?.value,
        subject: subjectSelect?.value,
        chapter: chapterSelect?.value,
        question
      })
    });

    const data = await response.json();
    if (!response.ok) {
      appendMessage("bot", `Error: ${data.detail || "Something went wrong"}`);
    } else {
      appendMessage("bot", data.answer, data.meta);
    }
  } catch (err) {
    console.error(err);
    appendMessage("bot", "Network error. Please try again.");
  } finally {
    questionInput.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = "Ask";
    questionInput.focus();
  }
}

if (sendBtn) {
  sendBtn.addEventListener("click", sendQuestion);
}

if (questionInput) {
  questionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  });
}

if (questionForm) {
  questionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendQuestion();
  });
}

/*********************************************************
 * SUPABASE LOGIN (PRODUCTION SAFE)
 *********************************************************/

// Supabase config
const SUPABASE_URL = "https://ctquajydjitfjhqvezfz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0cXVhanlkaml0ZmpocXZlemZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjA1MzQsImV4cCI6MjA4MzE5NjUzNH0.3cenuqB4XffJdRQisJQhq7PS9_ybXDN7ExbsKfXx9gU";

// Create client
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Login function
async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    alert("Login inputs not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert("❌ Wrong email or password");
    return;
  }

  alert("✅ Login successful");
  // window.location.href = "dashboard.html";
}



