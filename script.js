// Replace with the actual Render URL from your dashboard
const BACKEND_URL = "https://newb-dl9k.onrender.com";

document.getElementById("questionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const subject = document.getElementById("subject").value;
  const chapter = document.getElementById("chapter").value;
  const question = document.getElementById("question").value;

  try {
    const res = await fetch(`${BACKEND_URL}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, chapter, question }),
    });

    const data = await res.json();
    document.getElementById("response").innerText = data.answer || "No answer.";
  } catch (err) {
    console.error(err);
    document.getElementById("response").innerText =
      "Error contacting server. Please try again.";
  }
});

