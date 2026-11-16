const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const toast = document.getElementById("toast");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

document.getElementById("askAssistant").addEventListener("click", () => {
  showToast("The AI learning assistant will be enabled when the secure AI service is connected.");
});

document.querySelectorAll('a[href="#dashboard"]').forEach(link => {
  link.addEventListener("click", () => {
    if (link.textContent.toLowerCase().includes("get started")) {
      showToast("Student registration and sign-in will be connected in the next development stage.");
    }
  });
});