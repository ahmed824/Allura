// product data and UI logic
const products = [
  {
    id: 1,
    name: "ماسكرا الورا مضادة للمياه",
    category: "ماسكــــــــــــــــارا",
    categoryIndex: 0,
    originalPrice: 180,
    currentPrice: 140,
    features: [
      { label: "مضادة للمياه", position: "top-left", angle: -25 },
      { label: "سواد فحمي", position: "bottom-right", angle: 25 },
    ],
    image: "assets/images/product-2.png",
    description: "ماسكرا الورا مضادة للمياه",
  },
  {
    id: 2,
    name: "كريم أساس طبيعي",
    category: "كريم أســـــــــــاس",
    categoryIndex: 1,
    originalPrice: 220,
    currentPrice: 180,
    features: [
      { label: "طبيعي 100%", position: "top-left", angle: -30 },
      { label: "مقاوم للماء", position: "middle-right", angle: 0 },
      { label: "تغطية كاملة", position: "bottom-right", angle: 30 },
    ],
    image: "assets/images/product-3.png",
    description: "كريم أساس يمنحك بشرة مثالية طوال اليوم",
  },
  {
    id: 3,
    name: "حمرة شفاه فاخرة",
    category: "حمرة شفــــــــــاه",
    categoryIndex: 2,
    originalPrice: 150,
    currentPrice: 120,
    features: [
      { label: "لون ثابت", position: "top-left", angle: -20 },
      { label: "مرطب", position: "bottom-right", angle: 20 },
    ],
    image: "assets/images/product-4.png",
    description: "حمرة شفاه تمنحك لوناً جذاباً",
  },
  {
    id: 4,
    name: "حمرة خدود طبيعية",
    category: "حمرة خدود",
    categoryIndex: 3,
    originalPrice: 130,
    currentPrice: 100,
    features: [
      { label: "طبيعي", position: "top-left", angle: -25 },
      { label: "مخملي", position: "middle-right", angle: 5 },
      { label: "إشراقة طبيعية", position: "bottom-right", angle: 25 },
    ],
    image: "assets/images/product-5.png",
    description: "حمرة خدود تمنحك إشراقة طبيعية",
  },
  {
    id: 5,
    name: "أيشادو مميز",
    category: "أيشــــــــــــــــادو",
    categoryIndex: 4,
    originalPrice: 200,
    currentPrice: 160,
    features: [
      { label: "ألوان متعددة", position: "top-left", angle: -30 },
      { label: "ثبات طويل", position: "middle-right", angle: 0 },
      { label: "سهل الدمج", position: "bottom-left", angle: 30 },
      { label: "لمعة راقية", position: "bottom-right", angle: 25 },
    ],
    image: "assets/images/product-6.png",
    description: "أيشادو يمنحك إطلالة ساحرة",
  },
];

const categories = products.map((p) => p.category);

// DOM refs
const categoriesWrap = document.getElementById("categories");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productOldPrice = document.getElementById("productOldPrice");
const featuresLayer = document.getElementById("featuresLayer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

// helper to map position -> tailwind classes (absolute)
function getFeaturePosition(position) {
  const isSmallScreen = window.innerWidth < 768; // Tailwind breakpoint: md

  const positions = {
    "top-left": isSmallScreen ? "top-24 -right-4" : "top-40 -right-28",
    "top-right": isSmallScreen ? "top-8 -left-4" : "top-8 -left-28",
    "middle-left": isSmallScreen
      ? "top-1/2 -translate-y-1/2 -right-4"
      : "top-1/2 -translate-y-1/2 -right-28",
    "middle-right": isSmallScreen
      ? "top-1/2 -translate-y-1/2 -left-4"
      : "top-1/2 -translate-y-1/2 -left-8",
    "bottom-left": isSmallScreen ? "bottom-8 -right-4" : "bottom-8 -right-28",
    "bottom-right": isSmallScreen ? "bottom-20 -left-4" : "bottom-24 -left-28",
  };

  return positions[position] || "top-8 right-0";
}

// render categories
function renderCategories() {
  categoriesWrap.innerHTML = "";
  categories.forEach((cat, idx) => {
    const div = document.createElement("div");
    div.className = `cursor-pointer text-[22px] sm:text-[26px] md:text-[32px] 
transition-all duration-300 hover:scale-105 w-fit text-[#202020] 
mx-auto md:ml-auto  md:mr-0
${currentIndex === idx ? "cat-active opacity-100" : "opacity-50"}`;

    div.innerHTML = `<div class="pb-3"><span class=" font-bold text-right block transition-all duration-300">${cat}</span></div>`;
    div.addEventListener("click", () => {
      currentIndex = idx;
      updateUI();
    });
    categoriesWrap.appendChild(div);
  });
}

// render feature badges inside featuresLayer
function renderFeatures(product) {
  featuresLayer.innerHTML = "";
  product.features.forEach((feature, i) => {
    const container = document.createElement("div");
    const pos = getFeaturePosition(feature.position);
    container.className = `absolute ${pos}`;
    container.style.animationDelay = `${i * 0.12}s`;
    // assemble inner structure
    const isLeft = feature.position.includes("left");
    // wrapper to control row direction (RTL)
    const row = document.createElement("div");
    row.className = `flex items-center gap-2 ${
      isLeft ? "flex-row-reverse" : ""
    }`;

    const badge = document.createElement("div");
    badge.className = "feature-badge";
    badge.style.borderColor = "var(--primary)";
    badge.style.animationDelay = `${i * 0.12}s`;
    badge.innerHTML = `<span class="text-[30px] font-medium whitespace-nowrap text-black">${feature.label}</span>`;

    const lineWrap = document.createElement("div");
    lineWrap.className = "relative";
    const line = document.createElement("div");
    line.className = "feature-line h-[2px]";
    line.style.backgroundColor = "var(--primary)";
    line.style.width = "48px";
    // line.style.transform = `rotate(${feature.angle}deg)`;
    line.style.transformOrigin = isLeft ? "right center" : "left center";
    line.style.animationDelay = `${i * 0.12 + 0.2}s`;
    const dotContainer = document.createElement("div");
    dotContainer.className = `feature-dot-container absolute ${
      isLeft ? "-left-2" : "-right-2"
    } top-1/2 w-6 h-6 -translate-y-1/2 pointer-events-none`;
    dotContainer.style.animationDelay = `${i * 0.12 + 0.5}s`;
    // Outer Border Circle
    const outerCircle = document.createElement("div");
    outerCircle.className = "absolute inset-0 border-2 rounded-full";
    outerCircle.style.borderColor = "var(--primary)";
    // Inner Filled Dot - centered in outerCircle via dotContainer
    const innerDot = document.createElement("div");
    innerDot.className =
      "absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2";
    innerDot.style.backgroundColor = "#30422D";

    dotContainer.appendChild(outerCircle);
    dotContainer.appendChild(innerDot);

    lineWrap.appendChild(line);
    lineWrap.appendChild(dotContainer);

    row.appendChild(badge);
    row.appendChild(lineWrap);
    container.appendChild(row);
    featuresLayer.appendChild(container);
  });
}

// update product main UI
function updateUI() {
  const p = products[currentIndex];
  productImage.src = p.image;
  productImage.alt = p.name;
  productTitle.textContent = p.name;
  productCategory.textContent = p.category;
  productPrice.textContent = `${p.currentPrice} ر.س`;
  productOldPrice.textContent = `${p.originalPrice} ر.س`;
  renderFeatures(p);
  renderCategories();
}

// prev / next handlers
function prevProduct() {
  currentIndex = (currentIndex - 1 + products.length) % products.length;
  updateUI();
}
function nextProduct() {
  currentIndex = (currentIndex + 1) % products.length;
  updateUI();
}

// attach events
prevBtn.addEventListener("click", prevProduct);
nextBtn.addEventListener("click", nextProduct);

// keyboard left/right support (arrow keys)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevProduct();
  }
  if (e.key === "ArrowRight") {
    nextProduct();
  }
});

// initial render
updateUI();
