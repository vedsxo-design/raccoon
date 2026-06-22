const CONFIG = {
  saveKey: "raccoon_tap_save_v1",
  baseTap: 1,
  baseMaxEnergy: 1000,
  energyRegenPerSecond: 3,
  energyCapacityMaxLevel: 50,
  energyCapacityPerLevel: 150,
  energyCapacityBaseCost: 850,
  energyCapacityCooldownBaseSeconds: 2 * 60,
  energyCapacityCooldownMaxSeconds: 60 * 60,
  maxOfflineSeconds: 60 * 60 * 12,
  businessMaxLevel: 100,
  businessCooldownBaseSeconds: 60,
  businessCooldownMaxSeconds: 6 * 60 * 60,
  boostCooldownSeconds: 24 * 60 * 60,
  maxPlayerLevel: 60
};

const categorySource = [
  {
    id: "markets",
    name: "Markets",
    hint: "магазины, площадки и обменники",
    baseCosts: [120, 420, 1400, 5200, 16000, 52000, 170000, 560000, 1800000, 5900000, 19500000, 65000000],
    names: [
      "Street Market",
      "Snack Corner",
      "Raccoon Mart",
      "Night Bazaar",
      "Coin Kiosk",
      "Delivery Hub",
      "Marketplace App",
      "Trading Floor",
      "Global Market",
      "Exchange Desk",
      "Mega Market",
      "World Market"
    ]
  },
  {
    id: "pr",
    name: "PR&Team",
    hint: "команда, комьюнити и медиа",
    baseCosts: [120000000, 190000000, 320000000, 540000000, 900000000, 1500000000, 2500000000, 4100000000, 6800000000, 11000000000, 18000000000, 30000000000],
    names: [
      "Meme Desk",
      "Sticker Studio",
      "Community Chat",
      "Influencer Squad",
      "Streamer Collab",
      "Social Media Room",
      "Brand Studio",
      "Event Booth",
      "Ambassador Club",
      "Media Agency",
      "PR War Room",
      "Global Campaign"
    ]
  },
  {
    id: "legal",
    name: "Legal",
    hint: "документы, аудит и легальная защита",
    baseCosts: [50000000000, 75000000000, 110000000000, 165000000000, 250000000000, 380000000000, 570000000000, 850000000000, 1250000000000, 1850000000000, 2700000000000, 3900000000000],
    names: [
      "Docs Review",
      "Contract Desk",
      "License Office",
      "Compliance Team",
      "Tax Advisory",
      "Audit Unit",
      "Legal Counsel",
      "Risk Control",
      "Policy Lab",
      "International Desk",
      "Arbitration Team",
      "Regulation Office"
    ]
  },
  {
    id: "special",
    name: "Special Ops",
    hint: "секретные операции роста",
    baseCosts: [5500000000000, 8000000000000, 11500000000000, 16500000000000, 23500000000000, 33500000000000, 47500000000000, 67000000000000, 94000000000000, 132000000000000, 185000000000000, 260000000000000],
    names: [
      "Data Scout",
      "Growth Lab",
      "Secret Drops",
      "Partner Intel",
      "VIP Network",
      "Launch Squad",
      "Security Room",
      "Whale Relations",
      "Space Campaign",
      "Treasury Unit",
      "Elite Terminal",
      "World Expansion"
    ]
  }
];

const categories = categorySource.map((category, categoryIndex) => ({
  ...category,
  businesses: category.names.map((name, index) => {
    const baseCost = category.baseCosts[index];
    const roiHours = 28 + categoryIndex * 18 + index * 3.5;
    return {
      id: `${category.id}_${index + 1}`,
      categoryId: category.id,
      name,
      description: `${category.hint}. Максимальный уровень: ${CONFIG.businessMaxLevel}.`,
      baseCost,
      baseProfit: Math.max(1, Math.floor(baseCost / roiHours)),
      logoSeed: categoryIndex * 20 + index
    };
  })
}));


const playerRanks = [
  { minLevel: 1, name: "Rookie Raccoon" },
  { minLevel: 5, name: "Street Raccoon" },
  { minLevel: 10, name: "Market Hunter" },
  { minLevel: 15, name: "Team Builder" },
  { minLevel: 20, name: "Legal Scout" },
  { minLevel: 25, name: "Raccoon CEO" },
  { minLevel: 30, name: "Special Agent" },
  { minLevel: 40, name: "Crypto Boss" },
  { minLevel: 50, name: "Diamond Raccoon" },
  { minLevel: 60, name: "Legend Raccoon" }
];

const boosts = [
  {
    id: "double",
    name: "Двойной тап",
    multiplier: 2,
    duration: 1 * 60,
    description: "x2 к монетам за каждый тап на 1 минуту. Восстановление — 24 часа."
  },
  {
    id: "mega",
    name: "Мега тап",
    multiplier: 5,
    duration: 1 * 60,
    description: "x5 к монетам за каждый тап на 1 минуту. Восстановление — 24 часа."
  },
  {
    id: "ultra",
    name: "Ультра тап",
    multiplier: 10,
    duration: 1 * 60,
    description: "x10 к монетам за каждый тап на 1 минуту. Восстановление — 24 часа."
  }
];

const defaultState = {
  coins: 0,
  totalEarned: 0,
  totalTaps: 0,
  energy: CONFIG.baseMaxEnergy,
  energyCapacityLevel: 0,
  energyCapacityCooldownEnd: 0,
  lastTick: Date.now(),
  businessLevels: {},
  businessCooldowns: {},
  boostCooldownEnds: {},
  usedBoostDates: {},
  activeBoosts: []
};

let state = loadState();
let activeCategoryId = "markets";
let toastTimer = null;
let lastRenderSecond = 0;

const $ = (selector) => document.querySelector(selector);

const els = {
  coinsValue: $("#coinsValue"),
  tapPowerValue: $("#tapPowerValue"),
  profitHourValue: $("#profitHourValue"),
  playerLevelValue: $("#playerLevelValue"),
  playerRankValue: $("#playerRankValue"),
  levelBonusValue: $("#levelBonusValue"),
  levelBar: $("#levelBar"),
  levelProgressText: $("#levelProgressText"),
  totalTapsValue: $("#totalTapsValue"),
  energyValue: $("#energyValue"),
  maxEnergyValue: $("#maxEnergyValue"),
  energyRegenValue: $("#energyRegenValue"),
  energyBar: $("#energyBar"),
  energyCapLevelValue: $("#energyCapLevelValue"),
  energyCapMaxLevelValue: $("#energyCapMaxLevelValue"),
  energyCapInfoValue: $("#energyCapInfoValue"),
  energyCapBtn: $("#energyCapBtn"),
  tapZone: $("#tapZone"),
  floatingLayer: $("#floatingLayer"),
  categoryTabs: $("#categoryTabs"),
  businessList: $("#businessList"),
  categoryNameValue: $("#categoryNameValue"),
  categoryProfitValue: $("#categoryProfitValue"),
  ownedBusinessesValue: $("#ownedBusinessesValue"),
  boostList: $("#boostList"),
  activeBoosts: $("#activeBoosts"),
  toast: $("#toast"),
  resetBtn: $("#resetBtn"),
  offlineModal: $("#offlineModal"),
  offlineText: $("#offlineText"),
  offlineClose: $("#offlineClose"),
  boostDateValue: $("#boostDateValue")
};

init();

function init() {
  els.maxEnergyValue.textContent = formatNumber(getMaxEnergy());
  els.energyCapMaxLevelValue.textContent = CONFIG.energyCapacityMaxLevel;
  els.energyRegenValue.textContent = `+${CONFIG.energyRegenPerSecond}/сек`;
  els.boostDateValue.textContent = new Date().toLocaleDateString("ru-RU");

  applyElapsedProgress(true);
  bindNavigation();
  bindTap();
  bindReset();
  bindEnergyCapacityUpgrade();
  renderCategoryTabs();
  renderBoosts();
  renderAll();

  setInterval(gameLoop, 1000);
  setInterval(saveState, 5000);
  window.addEventListener("beforeunload", () => {
    applyElapsedProgress(false);
    saveState();
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.saveKey);
    if (!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      totalTaps: Number(parsed.totalTaps || 0),
      energyCapacityLevel: Number(parsed.energyCapacityLevel || 0),
      energyCapacityCooldownEnd: Number(parsed.energyCapacityCooldownEnd || 0),
      businessLevels: parsed.businessLevels || {},
      businessCooldowns: parsed.businessCooldowns || {},
      boostCooldownEnds: migrateBoostCooldowns(parsed),
      usedBoostDates: parsed.usedBoostDates || {},
      activeBoosts: parsed.activeBoosts || []
    };
  } catch (error) {
    console.warn("Не удалось загрузить сохранение:", error);
    return structuredClone(defaultState);
  }
}

function saveState() {
  state.lastTick = Date.now();
  localStorage.setItem(CONFIG.saveKey, JSON.stringify(state));
}

function gameLoop() {
  applyElapsedProgress(false);

  const nowSecond = Math.floor(Date.now() / 1000);
  if (nowSecond !== lastRenderSecond) {
    lastRenderSecond = nowSecond;
    renderAll();
  }
}

function applyElapsedProgress(showOffline) {
  const now = Date.now();
  const elapsedSecondsRaw = Math.max(0, Math.floor((now - (state.lastTick || now)) / 1000));
  if (elapsedSecondsRaw <= 0) {
    state.lastTick = now;
    cleanExpiredBoosts();
    return;
  }

  const elapsedSeconds = Math.min(elapsedSecondsRaw, CONFIG.maxOfflineSeconds);
  const profitPerHour = getTotalProfitPerHour();
  const passiveEarned = (profitPerHour / 3600) * elapsedSeconds;

  if (passiveEarned > 0) {
    state.coins += passiveEarned;
    state.totalEarned += passiveEarned;
  }

  state.energy = Math.min(
    getMaxEnergy(),
    (state.energy || 0) + CONFIG.energyRegenPerSecond * elapsedSeconds
  );

  state.lastTick = now;
  cleanExpiredBoosts();

  if (showOffline && elapsedSecondsRaw > 15 && passiveEarned >= 1) {
    els.offlineText.textContent = `Пока тебя не было, бизнесы принесли ${formatNumber(passiveEarned)} RCT. Учитывалось максимум 12 часов офлайна, чтобы баланс не ломался.`;
    els.offlineModal.classList.remove("hidden");
  }
}

function cleanExpiredBoosts() {
  const now = Date.now();
  state.activeBoosts = (state.activeBoosts || []).filter((boost) => boost.endsAt > now);

  Object.keys(state.businessCooldowns || {}).forEach((businessId) => {
    if (Number(state.businessCooldowns[businessId]) <= now) {
      delete state.businessCooldowns[businessId];
    }
  });

  Object.keys(state.boostCooldownEnds || {}).forEach((boostId) => {
    if (Number(state.boostCooldownEnds[boostId]) <= now) {
      delete state.boostCooldownEnds[boostId];
    }
  });
}

function bindNavigation() {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const screen = button.dataset.screen;
      document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"));
      document.querySelectorAll(".screen").forEach((section) => section.classList.remove("active"));
      button.classList.add("active");
      $(`#screen-${screen}`).classList.add("active");
      renderAll();
    });
  });

  els.offlineClose.addEventListener("click", () => {
    els.offlineModal.classList.add("hidden");
  });
}

function bindTap() {
  const onTap = (event) => {
    event.preventDefault();
    performTap(event);
  };

  els.tapZone.addEventListener("pointerdown", onTap);
  els.tapZone.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "Enter") onTap(event);
  });
}

function bindReset() {
  els.resetBtn.addEventListener("click", () => {
    const ok = confirm("Точно сбросить весь прогресс Raccoon Tap?");
    if (!ok) return;
    localStorage.removeItem(CONFIG.saveKey);
    state = structuredClone(defaultState);
    activeCategoryId = "markets";
    renderAll();
    showToast("Прогресс сброшен.");
  });
}

function bindEnergyCapacityUpgrade() {
  els.energyCapBtn.addEventListener("click", buyEnergyCapacityUpgrade);
}

function performTap(event) {
  applyElapsedProgress(false);

  if (state.energy < 1) {
    showToast("Энергия закончилась. Подожди немного.");
    return;
  }

  const tapPower = getTapPower();
  state.coins += tapPower;
  state.totalEarned += tapPower;
  state.totalTaps = Number(state.totalTaps || 0) + 1;
  state.energy = Math.max(0, state.energy - 1);

  els.tapZone.classList.add("pressed");
  setTimeout(() => els.tapZone.classList.remove("pressed"), 90);

  const point = getEventPoint(event);
  spawnFloatingText(`+${formatNumber(tapPower)}`, point.x, point.y);
  renderAll();
}

function getEventPoint(event) {
  if (event.touches && event.touches[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  if (event.clientX && event.clientY) {
    return { x: event.clientX, y: event.clientY };
  }
  const rect = els.tapZone.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function spawnFloatingText(text, x, y) {
  const el = document.createElement("div");
  el.className = "float-coin";
  el.textContent = text;
  el.style.left = `${x - 18 + Math.random() * 36}px`;
  el.style.top = `${y - 18}px`;
  els.floatingLayer.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

function renderAll() {
  cleanExpiredBoosts();

  els.coinsValue.textContent = formatNumber(state.coins);
  els.tapPowerValue.textContent = `+${formatNumber(getTapPower())}`;
  els.profitHourValue.textContent = `${formatNumber(getTotalProfitPerHour())}/час`;
  const maxEnergy = getMaxEnergy();
  els.maxEnergyValue.textContent = formatNumber(maxEnergy);
  els.energyValue.textContent = formatNumber(Math.floor(state.energy));
  els.energyBar.style.width = `${Math.max(0, Math.min(100, (state.energy / maxEnergy) * 100))}%`;
  els.ownedBusinessesValue.textContent = formatNumber(getOwnedLevels());
  renderPlayerLevel();
  renderEnergyCapacityUpgrade();

  renderActiveBoosts();

  if ($("#screen-businesses").classList.contains("active")) {
    renderBusinesses();
  }

  if ($("#screen-boosts").classList.contains("active")) {
    renderBoosts();
  }
}

function renderCategoryTabs() {
  els.categoryTabs.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `category-btn${category.id === activeCategoryId ? " active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      activeCategoryId = category.id;
      renderCategoryTabs();
      renderBusinesses();
    });
    els.categoryTabs.appendChild(button);
  });
}


function renderEnergyCapacityUpgrade() {
  const level = getEnergyCapacityLevel();
  const cooldownLeft = getEnergyCapacityCooldownLeft();
  const cost = getEnergyCapacityUpgradeCost();
  const maxed = level >= CONFIG.energyCapacityMaxLevel;
  const canBuy = !maxed && cooldownLeft <= 0 && state.coins >= cost;

  els.energyCapLevelValue.textContent = level;
  els.energyCapInfoValue.textContent = maxed
    ? `Максимальная ёмкость: ${formatNumber(getMaxEnergy())}`
    : `Следующий уровень: +${CONFIG.energyCapacityPerLevel} энергии · цена ${formatNumber(cost)}${cooldownLeft > 0 ? ` · КД ${formatLongTime(cooldownLeft)}` : ""}`;

  els.energyCapBtn.disabled = !canBuy;
  els.energyCapBtn.textContent = maxed
    ? "MAX"
    : cooldownLeft > 0
      ? `КД ${formatLongTime(cooldownLeft)}`
      : `+${CONFIG.energyCapacityPerLevel}`;
}

function buyEnergyCapacityUpgrade() {
  applyElapsedProgress(false);

  const level = getEnergyCapacityLevel();
  if (level >= CONFIG.energyCapacityMaxLevel) {
    showToast("Ёмкость энергии уже максимальная.");
    return;
  }

  const cooldownLeft = getEnergyCapacityCooldownLeft();
  if (cooldownLeft > 0) {
    showToast(`Ёмкость можно улучшить через ${formatLongTime(cooldownLeft)}.`);
    return;
  }

  const cost = getEnergyCapacityUpgradeCost();
  if (state.coins < cost) {
    showToast(`Не хватает ${formatNumber(cost - state.coins)} RCT.`);
    return;
  }

  const oldMaxEnergy = getMaxEnergy();
  const nextLevel = level + 1;
  const cooldownSeconds = getEnergyCapacityCooldownSeconds(nextLevel);

  state.coins -= cost;
  state.energyCapacityLevel = nextLevel;
  state.energyCapacityCooldownEnd = Date.now() + cooldownSeconds * 1000;
  state.energy = Math.min(getMaxEnergy(), state.energy + (getMaxEnergy() - oldMaxEnergy));

  saveState();
  renderAll();
  showToast(`Ёмкость энергии улучшена до ${nextLevel} уровня. КД: ${formatLongTime(cooldownSeconds * 1000)}.`);
}

function getEnergyCapacityLevel() {
  return Math.max(0, Math.min(CONFIG.energyCapacityMaxLevel, Number(state.energyCapacityLevel || 0)));
}

function getMaxEnergy() {
  return CONFIG.baseMaxEnergy + getEnergyCapacityLevel() * CONFIG.energyCapacityPerLevel;
}

function getEnergyCapacityUpgradeCost() {
  const level = getEnergyCapacityLevel();
  if (level >= CONFIG.energyCapacityMaxLevel) return Infinity;

  const cost = CONFIG.energyCapacityBaseCost
    * Math.pow(1.32, level)
    * (1 + Math.pow(level, 1.25) * 0.045);

  return Math.ceil(cost);
}

function getEnergyCapacityCooldownLeft() {
  return Math.max(0, Number(state.energyCapacityCooldownEnd || 0) - Date.now());
}

function getEnergyCapacityCooldownSeconds(nextLevel) {
  const seconds = CONFIG.energyCapacityCooldownBaseSeconds + Math.pow(nextLevel, 1.35) * 18;
  return Math.ceil(Math.min(CONFIG.energyCapacityCooldownMaxSeconds, seconds));
}

function renderBusinesses() {
  const category = categories.find((item) => item.id === activeCategoryId) || categories[0];
  els.categoryNameValue.textContent = category.name;
  els.categoryProfitValue.textContent = `${formatNumber(getCategoryProfitPerHour(category.id))}/час`;
  els.businessList.innerHTML = "";

  category.businesses.forEach((business) => {
    const level = getBusinessLevel(business.id);
    const nextCost = getBusinessNextCost(business);
    const currentProfit = getBusinessProfitPerHour(business, level);
    const nextProfit = getBusinessProfitPerHour(business, level + 1);
    const profitGain = Math.max(0, nextProfit - currentProfit);
    const paybackHours = profitGain > 0 ? nextCost / profitGain : Infinity;
    const cooldownLeft = getBusinessCooldownLeft(business.id);
    const canBuy = state.coins >= nextCost && level < CONFIG.businessMaxLevel && cooldownLeft <= 0;
    const buttonText = level >= CONFIG.businessMaxLevel
      ? "MAX"
      : cooldownLeft > 0
        ? `КД ${formatLongTime(cooldownLeft)}`
        : formatNumber(nextCost);

    const card = document.createElement("article");
    card.className = "business-card";
    card.innerHTML = `
      <div class="biz-logo">${businessLogoSvg(business.logoSeed)}</div>
      <div class="business-main">
        <div class="business-top">
          <div>
            <div class="business-name">${business.name}</div>
            <div class="business-tier">${getBusinessTier(level)}</div>
          </div>
          <div class="business-level">ур. ${level}/${CONFIG.businessMaxLevel}</div>
        </div>
        <div class="business-desc">${business.description}</div>
        <div class="business-numbers">
          <div>
            <span>Сейчас</span>
            <b>${formatNumber(currentProfit)}/час</b>
          </div>
          <div>
            <span>После апгрейда</span>
            <b>${level >= CONFIG.businessMaxLevel ? "MAX" : `${formatNumber(nextProfit)}/час`}</b>
          </div>
          <div>
            <span>Цена улучшения</span>
            <b>${level >= CONFIG.businessMaxLevel ? "MAX" : formatNumber(nextCost)}</b>
          </div>
          <div>
            <span>Окупаемость</span>
            <b>${level >= CONFIG.businessMaxLevel ? "MAX" : formatPayback(paybackHours)}</b>
          </div>
          <div>
            <span>КД улучшения</span>
            <b>${cooldownLeft > 0 ? formatLongTime(cooldownLeft) : "готово"}</b>
          </div>
          <div>
            <span>Рост дохода</span>
            <b>${level >= CONFIG.businessMaxLevel ? "MAX" : `+${formatNumber(profitGain)}/час`}</b>
          </div>
        </div>
        <div class="card-actions">
          <div class="mini-progress" title="Прогресс уровня">
            <div style="width:${(level / CONFIG.businessMaxLevel) * 100}%"></div>
          </div>
          <button class="buy-btn" data-business="${business.id}" ${canBuy ? "" : "disabled"}>
            ${buttonText}
          </button>
        </div>
      </div>
    `;

    card.querySelector(".buy-btn").addEventListener("click", () => buyBusinessLevel(business.id));
    els.businessList.appendChild(card);
  });
}

function buyBusinessLevel(businessId) {
  applyElapsedProgress(false);

  const business = findBusiness(businessId);
  if (!business) return;

  const level = getBusinessLevel(businessId);
  if (level >= CONFIG.businessMaxLevel) {
    showToast("Этот бизнес уже на максимальном уровне.");
    return;
  }

  const cooldownLeft = getBusinessCooldownLeft(businessId);
  if (cooldownLeft > 0) {
    showToast(`Улучшение будет доступно через ${formatLongTime(cooldownLeft)}.`);
    return;
  }

  const cost = getBusinessNextCost(business);
  if (state.coins < cost) {
    showToast(`Не хватает ${formatNumber(cost - state.coins)} RCT.`);
    return;
  }

  const nextLevel = level + 1;
  const cooldownSeconds = getBusinessCooldownSeconds(business, nextLevel);

  state.coins -= cost;
  state.businessLevels[businessId] = nextLevel;
  state.businessCooldowns[businessId] = Date.now() + cooldownSeconds * 1000;

  saveState();
  renderAll();
  showToast(`${business.name} улучшен до ${nextLevel} уровня. КД: ${formatLongTime(cooldownSeconds * 1000)}.`);
}

function renderBoosts() {
  els.boostList.innerHTML = "";

  boosts.forEach((boost, index) => {
    const active = getActiveBoost(boost.id);
    const cooldownLeft = getBoostCooldownLeft(boost.id);
    const disabled = Boolean(active) || cooldownLeft > 0;
    const actionText = active
      ? `Активен ${formatLongTime(active.endsAt - Date.now())}`
      : cooldownLeft > 0
        ? `КД ${formatLongTime(cooldownLeft)}`
        : "Активировать";

    const card = document.createElement("article");
    card.className = "boost-card";
    card.innerHTML = `
      <div class="boost-logo">${boostLogoSvg(index)}</div>
      <div>
        <div class="boost-name">${boost.name}</div>
        <div class="boost-desc">${boost.description}</div>
        <div class="boost-meta">
          <span class="meta-chip">Множитель x${boost.multiplier}</span>
          <span class="meta-chip">Длительность: ${formatDuration(boost.duration)}</span>
          <span class="meta-chip">${cooldownLeft > 0 ? `КД: ${formatLongTime(cooldownLeft)}` : "Готов"}</span>
        </div>
        <button class="boost-btn" data-boost="${boost.id}" ${disabled ? "disabled" : ""}>${actionText}</button>
      </div>
    `;
    card.querySelector(".boost-btn").addEventListener("click", () => activateBoost(boost.id));
    els.boostList.appendChild(card);
  });
}

function activateBoost(boostId) {
  const boost = boosts.find((item) => item.id === boostId);
  if (!boost) return;

  if (getActiveBoost(boostId)) {
    showToast("Этот буст уже активен.");
    return;
  }

  const cooldownLeft = getBoostCooldownLeft(boostId);
  if (cooldownLeft > 0) {
    showToast(`Буст восстановится через ${formatLongTime(cooldownLeft)}.`);
    return;
  }

  state.activeBoosts.push({
    id: boost.id,
    endsAt: Date.now() + boost.duration * 1000
  });
  state.boostCooldownEnds[boost.id] = Date.now() + CONFIG.boostCooldownSeconds * 1000;
  state.usedBoostDates[boost.id] = getDateKey();
  saveState();
  renderAll();
  showToast(`${boost.name} активирован.`);
}

function renderActiveBoosts() {
  const active = (state.activeBoosts || [])
    .map((item) => {
      const boost = boosts.find((b) => b.id === item.id);
      if (!boost) return "";
      return `<div class="active-boost">${boost.name}: ${formatTimeLeft(item.endsAt)}</div>`;
    })
    .join("");

  els.activeBoosts.innerHTML = active || "";
}

function getTapPower() {
  const multiplier = (state.activeBoosts || []).reduce((total, activeBoost) => {
    const boost = boosts.find((item) => item.id === activeBoost.id);
    return total * (boost ? boost.multiplier : 1);
  }, 1);

  return (CONFIG.baseTap + getPlayerTapBonus()) * multiplier;
}

function getOwnedLevels() {
  return Object.values(state.businessLevels || {}).reduce((sum, level) => sum + level, 0);
}

function getTotalProfitPerHour() {
  return categories.reduce((sum, category) => {
    return sum + getCategoryProfitPerHour(category.id);
  }, 0);
}

function getCategoryProfitPerHour(categoryId) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category) return 0;
  return category.businesses.reduce((sum, business) => {
    return sum + getBusinessProfitPerHour(business, getBusinessLevel(business.id));
  }, 0);
}

function getBusinessLevel(businessId) {
  return Math.max(0, Math.min(CONFIG.businessMaxLevel, Number(state.businessLevels[businessId] || 0)));
}

function getBusinessProfitPerHour(business, level) {
  if (level <= 0) return 0;

  const linearPart = level;
  const masteryPart = Math.pow(level, 1.2) * 0.55;
  const milestoneBonus = Math.floor(level / 20) * 0.09;
  const levelCurve = (linearPart + masteryPart) * (1 + milestoneBonus);

  return Math.floor(business.baseProfit * levelCurve);
}

function getBusinessNextCost(business) {
  const level = getBusinessLevel(business.id);
  if (level >= CONFIG.businessMaxLevel) return Infinity;

  const category = categories.find((item) => item.id === business.categoryId);
  const categoryIndex = Math.max(0, categories.findIndex((item) => item.id === business.categoryId));
  const growth = 1.13 + categoryIndex * 0.012;
  const antiGrindMultiplier = 1 + level * 0.055 + Math.pow(level, 1.42) * 0.024;
  const lateGameWall = level >= 45 ? 1 + Math.pow(level - 44, 1.28) * 0.025 : 1;
  const cost = business.baseCost * Math.pow(growth, level) * antiGrindMultiplier * lateGameWall;
  return Math.ceil(cost);
}

function getBusinessCooldownLeft(businessId) {
  return Math.max(0, Number(state.businessCooldowns?.[businessId] || 0) - Date.now());
}

function getBusinessCooldownSeconds(business, nextLevel) {
  const categoryIndex = Math.max(0, categories.findIndex((item) => item.id === business.categoryId));
  const seconds = CONFIG.businessCooldownBaseSeconds
    + categoryIndex * 90
    + Math.pow(nextLevel, 1.42) * 10;

  return Math.ceil(Math.min(CONFIG.businessCooldownMaxSeconds, seconds));
}


function renderPlayerLevel() {
  const info = getPlayerLevelInfo();

  els.playerLevelValue.textContent = info.level;
  els.playerRankValue.textContent = info.rank;
  els.levelBonusValue.textContent = `+${getPlayerTapBonus()} к тапу`;
  els.levelProgressText.textContent = info.level >= CONFIG.maxPlayerLevel
    ? `${formatNumber(state.totalEarned)} XP · MAX`
    : `${formatNumber(info.currentXp)} / ${formatNumber(info.neededXp)} XP`;
  els.levelBar.style.width = `${Math.max(0, Math.min(100, info.progress * 100))}%`;
  els.totalTapsValue.textContent = formatNumber(state.totalTaps || 0);
}

function getPlayerLevelInfo() {
  const totalXp = Math.floor(Number(state.totalEarned || 0));
  let level = 1;

  for (let current = 2; current <= CONFIG.maxPlayerLevel; current++) {
    if (totalXp >= getLevelThreshold(current)) {
      level = current;
    } else {
      break;
    }
  }

  const currentThreshold = getLevelThreshold(level);
  const nextThreshold = getLevelThreshold(level + 1);
  const neededXp = Math.max(1, nextThreshold - currentThreshold);
  const currentXp = Math.max(0, totalXp - currentThreshold);
  const progress = level >= CONFIG.maxPlayerLevel ? 1 : currentXp / neededXp;

  return {
    level,
    rank: getPlayerRank(level),
    currentXp,
    neededXp,
    progress
  };
}

function getLevelThreshold(level) {
  if (level <= 1) return 0;

  return Math.floor(
    240
    * Math.pow(level - 1, 2.12)
    * Math.pow(1.315, level - 2)
  );
}

function getPlayerRank(level) {
  return playerRanks
    .filter((rank) => level >= rank.minLevel)
    .at(-1)?.name || playerRanks[0].name;
}

function getPlayerTapBonus() {
  const level = getPlayerLevelInfo().level;
  return Math.min(8, Math.floor((level - 1) / 8));
}

function getBusinessTier(level) {
  if (level >= 100) return "Legendary";
  if (level >= 75) return "Epic";
  if (level >= 50) return "Rare";
  if (level >= 25) return "Uncommon";
  return "Common";
}

function formatPayback(hours) {
  if (!Number.isFinite(hours)) return "—";
  if (hours < 1) return `${Math.ceil(hours * 60)}м`;
  if (hours < 24) return `${hours.toFixed(hours >= 10 ? 0 : 1)}ч`;
  return `${(hours / 24).toFixed(hours >= 240 ? 0 : 1)}д`;
}

function findBusiness(businessId) {
  for (const category of categories) {
    const business = category.businesses.find((item) => item.id === businessId);
    if (business) return business;
  }
  return null;
}

function getBoostCooldownLeft(boostId) {
  return Math.max(0, Number(state.boostCooldownEnds?.[boostId] || 0) - Date.now());
}

function migrateBoostCooldowns(parsed) {
  if (parsed?.boostCooldownEnds) return parsed.boostCooldownEnds;

  const cooldowns = {};
  const today = getDateKey();
  Object.entries(parsed?.usedBoostDates || {}).forEach(([boostId, dateKey]) => {
    if (dateKey === today) {
      cooldowns[boostId] = Date.now() + CONFIG.boostCooldownSeconds * 1000;
    }
  });

  return cooldowns;
}

function getActiveBoost(boostId) {
  return (state.activeBoosts || []).find((item) => item.id === boostId && item.endsAt > Date.now());
}

function getDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNumber(value) {
  const number = Math.floor(Number(value) || 0);
  const abs = Math.abs(number);

  if (abs >= 1_000_000_000_000_000) return `${trimNumber(number / 1_000_000_000_000_000)}Qa`;
  if (abs >= 1_000_000_000_000) return `${trimNumber(number / 1_000_000_000_000)}T`;
  if (abs >= 1_000_000_000) return `${trimNumber(number / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `${trimNumber(number / 1_000_000)}M`;
  if (abs >= 1_000) return `${trimNumber(number / 1_000)}K`;

  return String(number);
}

function trimNumber(value) {
  return value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} мин`;
}

function formatTimeLeft(endTimestamp) {
  const total = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatLongTime(milliseconds) {
  const total = Math.max(0, Math.ceil(milliseconds / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) {
    return `${hours}ч ${String(minutes).padStart(2, "0")}м`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function businessLogoSvg(seed) {
  const palettes = [
    ["#ffd886", "#f0a735", "#38230b"],
    ["#79e0ff", "#5c8dff", "#07182b"],
    ["#80f2a6", "#35b978", "#062013"],
    ["#ff9fbb", "#c56bff", "#24051f"],
    ["#d9e1ea", "#7d8793", "#151922"]
  ];

  const palette = palettes[seed % palettes.length];
  const shape = seed % 5;
  const rotate = (seed * 29) % 360;

  if (shape === 0) {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="14" width="48" height="38" rx="12" fill="${palette[0]}"/>
        <path d="M16 28h32M20 40h24" stroke="${palette[2]}" stroke-width="6" stroke-linecap="round"/>
        <path d="M22 14c1-8 19-8 20 0" fill="none" stroke="${palette[1]}" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
  }

  if (shape === 1) {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="25" fill="${palette[0]}"/>
        <path d="M20 39 30 24l8 11 7-7 5 11" fill="none" stroke="${palette[2]}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="24" cy="22" r="4" fill="${palette[1]}"/>
      </svg>`;
  }

  if (shape === 2) {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 6 56 20v24L32 58 8 44V20z" fill="${palette[0]}"/>
        <path d="M20 24h24M20 34h24M20 44h16" stroke="${palette[2]}" stroke-width="5" stroke-linecap="round"/>
        <path d="M47 15v16" stroke="${palette[1]}" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
  }

  if (shape === 3) {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="10" y="10" width="44" height="44" rx="18" fill="${palette[0]}" transform="rotate(${rotate} 32 32)"/>
        <path d="M21 37c7 7 17 7 24 0M22 25h20" stroke="${palette[2]}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="45" cy="22" r="5" fill="${palette[1]}"/>
      </svg>`;
  }

  return `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 48 23 14h18l11 34z" fill="${palette[0]}"/>
      <path d="M24 48V30h16v18" fill="${palette[1]}"/>
      <path d="M20 48h28M28 22h8" stroke="${palette[2]}" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
}

function boostLogoSvg(index) {
  const variants = [
    ["#ffd886", "#f0a735", "#271a06"],
    ["#79e0ff", "#4e7bff", "#06152d"],
    ["#ff9fbb", "#c56bff", "#260522"]
  ];
  const p = variants[index % variants.length];

  return `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M34 4 12 36h16l-4 24 28-36H36z" fill="${p[0]}"/>
      <path d="M34 4 26 32h14L24 60l28-36H36z" fill="${p[1]}" opacity=".9"/>
      <path d="M34 4 12 36h16l-4 24 28-36H36z" fill="none" stroke="${p[2]}" stroke-width="4" stroke-linejoin="round"/>
    </svg>`;
}
