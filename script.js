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

// ===== Page-by-page navigation (no scrolling) =====
const pages = Array.from(document.querySelectorAll(".page"));
const ids = pages.map((p) => p.id);
const labels = { home: "Home", about: "Personal Information", achievements: "Achievements", family: "Family" };
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsEl = document.getElementById("dots");
let cur = 0;

const dots = ids.map((id, i) => {
  const d = document.createElement("button");
  d.className = "dot";
  d.setAttribute("aria-label", labels[id]);
  d.title = labels[id];
  d.addEventListener("click", () => go(i));
  dotsEl.appendChild(d);
  return d;
});

function go(i) {
  cur = Math.max(0, Math.min(pages.length - 1, i));
  pages.forEach((p, idx) => {
    p.classList.toggle("active", idx === cur);
    p.classList.toggle("before", idx < cur);
  });
  pages[cur].scrollTop = 0;
  dots.forEach((d, idx) => d.classList.toggle("on", idx === cur));
  navLinks.querySelectorAll("a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + ids[cur]));
  prevBtn.disabled = cur === 0;
  if (cur === pages.length - 1) {
    nextBtn.innerHTML = "Back to Home &#8635;";
  } else {
    nextBtn.innerHTML = 'Next<span class="nm">: ' + labels[ids[cur + 1]] + "</span> &rarr;";
  }
  navLinks.classList.remove("open");
  try { history.replaceState(null, "", "#" + ids[cur]); } catch (e) {}
}

prevBtn.addEventListener("click", () => go(cur - 1));
nextBtn.addEventListener("click", () => go(cur === pages.length - 1 ? 0 : cur + 1));

// nav links + logo switch pages instead of scrolling
document.querySelectorAll('.nav a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const i = ids.indexOf(a.getAttribute("href").slice(1));
    if (i >= 0) go(i);
  });
});

// keyboard: left / right arrows
document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (document.querySelector(".lightbox.open")) return;
  if (e.key === "ArrowRight") go(Math.min(cur + 1, pages.length - 1));
  if (e.key === "ArrowLeft") go(cur - 1);
});

// open the page named in the link (e.g. ...#about), otherwise Home
window.addEventListener("hashchange", () => {
  const i = ids.indexOf(location.hash.slice(1));
  if (i >= 0 && i !== cur) go(i);
});
const start = ids.indexOf(location.hash.slice(1));
go(start >= 0 ? start : 0);

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

// ===== Achievement photos: blurred backdrop + click to view full size =====
const lb = document.createElement("div");
lb.className = "lightbox";
lb.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><img alt="" /><div class="lb-cap"><h4></h4><p></p></div>';
document.body.appendChild(lb);
const lbImg = lb.querySelector("img");
function closeLightbox() { lb.classList.remove("open"); }

document.querySelectorAll(".ach").forEach((card) => {
  const thumb = card.querySelector(".ach-thumb");
  const img = thumb.querySelector("img");
  if (img) thumb.style.setProperty("--img", 'url("' + img.getAttribute("src") + '")');
  thumb.addEventListener("click", () => {
    const im = thumb.querySelector("img");
    if (!im) return;
    lbImg.src = im.src;
    lbImg.alt = im.alt;
    lb.querySelector("h4").textContent = card.querySelector("h4").textContent;
    lb.querySelector("p").textContent = card.querySelector("p").textContent;
    lb.classList.add("open");
  });
});
lb.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
