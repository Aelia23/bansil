// ===== Loader =====
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 900);
});

// ===== Mobile menu =====
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ===== Typing effect =====
const words = ["Student", "Freediver", "Aspiring Web Developer", "Gamer", "Researcher", "Problem Solver"];
const typedEl = document.getElementById("typed");
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  typedEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; setTimeout(type, 110); }
  else if (!deleting) { deleting = true; setTimeout(type, 1400); }
  else if (c > 0) { c--; setTimeout(type, 55); }
  else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 300); }
}
type();

// ===== Flippable ID badge (click / tap / Enter / Space) =====
const badge = document.getElementById("badge");
function flipBadge() {
  const on = badge.classList.toggle("flipped");
  badge.setAttribute("aria-pressed", on ? "true" : "false");
}
badge.addEventListener("click", flipBadge);
badge.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flipBadge(); }
});

// ===== Skills notes =====
const skillNote = document.getElementById("skillNote");
document.querySelectorAll("#skills button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#skills button").forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    skillNote.textContent = btn.dataset.note;
  });
});

// ===== Quick facts (edit these!) =====
const facts = [
  "Add your first fun fact here.",
  "Add your second fun fact here.",
  "Add your third fun fact here.",
  "Add your fourth fun fact here.",
];
let fi = -1;
document.getElementById("fact").addEventListener("click", () => {
  fi = (fi + 1) % facts.length;
  document.getElementById("factText").textContent = facts[fi];
  document.getElementById("factCount").textContent = `${fi + 1} / ${facts.length}`;
});

// ===== Certificate filter =====
document.querySelectorAll("#filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#filters button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll("#cards .card").forEach((card) => {
      card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f);
    });
  });
});

// ===== Scroll reveal =====
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Active nav link, "Next" link, back-to-top =====
const order = ["home", "about", "education", "certificates", "family"];
const labels = { home: "Home", about: "About Me", education: "Educational Attainment", certificates: "Certificates", family: "Family" };
const nextLink = document.getElementById("nextLink");
const toTop = document.getElementById("toTop");

function onScroll() {
  let current = "home";
  order.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
  });
  navLinks.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
  const i = order.indexOf(current);
  const next = order[(i + 1) % order.length];
  nextLink.textContent = `Next: ${labels[next]} →`;
  nextLink.setAttribute("href", "#" + next);
  toTop.classList.toggle("show", window.scrollY > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Dark mode (Spider-Man red + black) =====
const themeBtn = document.getElementById("themeBtn");
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
let savedTheme = "light";
try { savedTheme = localStorage.getItem("theme") || "light"; } catch (e) {}
applyTheme(savedTheme);
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});