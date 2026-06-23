const CONFIG = {
  appVersion: "v15-stars-support",
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
  maxPlayerLevel: 60,
  referralReward: 5000,
  telegramBotUsername: "raccoontap_bot",
  telegramAppShortName: "",
  backendUrl: "https://nmivnzqontadqegdvhdl.supabase.co/functions/v1/register-player",
  starsInvoiceUrl: "https://nmivnzqontadqegdvhdl.supabase.co/functions/v1/create-star-invoice",
  supportStarsAmount: 100,
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taXZuenFvbnRhZHFlZ2R2aGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTg4MzEsImV4cCI6MjA5NzczNDgzMX0.OsEXGOk0rVK0EBq1RRIH20tJgPIJWkZsDb3MqmGs9aA"
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
  activeBoosts: [],
  referrals: {
    code: "",
    invitedBy: "",
    acceptedAt: 0,
    invitedFriends: 0,
    rewardsEarned: 0,
    acceptedRewardClaimed: false,
    backendEnabled: false,
    backendStatus: "local",
    backendError: "",
    telegramId: "",
    serverBalance: 0,
    serverBalanceApplied: 0,
    lastSyncAt: 0
  },
  leaderboard: {
    items: [],
    myRank: null,
    myProfitPerHour: 0,
    status: "idle",
    error: "",
    lastSyncAt: 0
  },
  betaNoticeSeen: false
};

let state = loadState();
let activeCategoryId = "markets";
let toastTimer = null;
let lastRenderSecond = 0;
let backendActionBusy = false;
let lastManualSyncAt = 0;
let betaNoticePending = false;
let supportProjectBusy = false;

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
  betaModal: $("#betaModal"),
  betaModalClose: $("#betaModalClose"),
  resetBtn: $("#resetBtn"),
  supportProjectBtn: $("#supportProjectBtn"),
  supportProjectModal: $("#supportProjectModal"),
  supportProjectClose: $("#supportProjectClose"),
  supportProjectPay: $("#supportProjectPay"),
  offlineModal: $("#offlineModal"),
  offlineText: $("#offlineText"),
  offlineClose: $("#offlineClose"),
  boostDateValue: $("#boostDateValue"),
  referralCodeValue: $("#referralCodeValue"),
  referralInvitedValue: $("#referralInvitedValue"),
  referralEarnedValue: $("#referralEarnedValue"),
  referralLinkValue: $("#referralLinkValue"),
  copyReferralBtn: $("#copyReferralBtn"),
  shareReferralBtn: $("#shareReferralBtn"),
  incomingReferralCard: $("#incomingReferralCard"),
  incomingReferralValue: $("#incomingReferralValue"),
  referralInfoValue: $("#referralInfoValue"),
  leaderboardList: $("#leaderboardList"),
  leaderboardMyProfitValue: $("#leaderboardMyProfitValue"),
  leaderboardMyRankValue: $("#leaderboardMyRankValue"),
  leaderboardInfoValue: $("#leaderboardInfoValue"),
  refreshLeaderboardBtn: $("#refreshLeaderboardBtn"),
  profileAvatarValue: $("#profileAvatarValue"),
  profileNameValue: $("#profileNameValue"),
  profileUsernameValue: $("#profileUsernameValue"),
  profileTelegramIdValue: $("#profileTelegramIdValue"),
  profileBalanceValue: $("#profileBalanceValue"),
  profileProfitValue: $("#profileProfitValue"),
  profileRankValue: $("#profileRankValue"),
  profileInvitedValue: $("#profileInvitedValue"),
  profileRefBonusValue: $("#profileRefBonusValue"),
  profileTotalEarnedValue: $("#profileTotalEarnedValue"),
  profileBusinessLevelsValue: $("#profileBusinessLevelsValue"),
  profileBackendValue: $("#profileBackendValue"),
  refreshProfileBtn: $("#refreshProfileBtn")
};

init();

function init() {
  initTelegramApp();
  ensureReferralState();
  ensureLeaderboardState();
  captureIncomingReferral();

  els.maxEnergyValue.textContent = formatNumber(getMaxEnergy());
  els.energyCapMaxLevelValue.textContent = CONFIG.energyCapacityMaxLevel;
  els.energyRegenValue.textContent = `+${CONFIG.energyRegenPerSecond}/сек`;
  els.boostDateValue.textContent = new Date().toLocaleDateString("ru-RU");

  applyElapsedProgress(true);
  bindNavigation();
  bindTap();
  bindReset();
  bindSupportProjectActions();
  bindEnergyCapacityUpgrade();
  bindReferralActions();
  bindLeaderboardActions();
  bindProfileActions();
  renderCategoryTabs();
  renderBoosts();
  renderAll();
  syncTelegramPlayer();
  setTimeout(showBetaNotice, 300);

  setInterval(gameLoop, 1000);
  setInterval(saveState, 5000);
  setInterval(() => syncTelegramPlayer({ force: true }), 30 * 1000);
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
      activeBoosts: parsed.activeBoosts || [],
      referrals: {
        ...structuredClone(defaultState.referrals),
        ...(parsed.referrals || {})
      },
      leaderboard: {
        ...structuredClone(defaultState.leaderboard),
        ...(parsed.leaderboard || {})
      }
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
  els.betaModalClose?.addEventListener("click", closeBetaNotice);
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
    if (betaNoticePending || !state.betaNoticeSeen) {
      setTimeout(showBetaNotice, 160);
    }
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

    const preservedReferralSync = structuredClone(state.referrals || {});
    const preservedLeaderboardSync = structuredClone(state.leaderboard || {});

    localStorage.removeItem(CONFIG.saveKey);
    state = structuredClone(defaultState);
    state.referrals = {
      ...structuredClone(defaultState.referrals),
      code: preservedReferralSync.code || "",
      invitedFriends: Number(preservedReferralSync.invitedFriends || 0),
      rewardsEarned: Number(preservedReferralSync.rewardsEarned || 0),
      backendEnabled: Boolean(preservedReferralSync.backendEnabled),
      backendStatus: preservedReferralSync.backendStatus || "local",
      telegramId: preservedReferralSync.telegramId || "",
      serverBalance: Number(preservedReferralSync.serverBalance || 0),
      serverBalanceApplied: Number(preservedReferralSync.serverBalanceApplied || 0),
      lastSyncAt: Number(preservedReferralSync.lastSyncAt || 0)
    };
    state.leaderboard = {
      ...structuredClone(defaultState.leaderboard),
      items: Array.isArray(preservedLeaderboardSync.items) ? preservedLeaderboardSync.items : [],
      myRank: preservedLeaderboardSync.myRank || null,
      myProfitPerHour: Number(preservedLeaderboardSync.myProfitPerHour || 0),
      status: preservedLeaderboardSync.status || "idle",
      lastSyncAt: Number(preservedLeaderboardSync.lastSyncAt || 0)
    };
    activeCategoryId = "markets";
    saveState();
    renderAll();
    syncTelegramPlayer({ force: true });
    showToast("Локальный прогресс очищен. Серверные данные снова подтянутся из Supabase.");
  });
}


function bindSupportProjectActions() {
  els.supportProjectBtn?.addEventListener("click", openSupportProjectModal);
  els.supportProjectClose?.addEventListener("click", closeSupportProjectModal);
  els.supportProjectPay?.addEventListener("click", paySupportProject);
}

function openSupportProjectModal() {
  if (!els.supportProjectModal) return;
  els.supportProjectModal.classList.remove("hidden");
}

function closeSupportProjectModal() {
  if (!els.supportProjectModal) return;
  els.supportProjectModal.classList.add("hidden");
}

function setSupportPayLoading(isLoading) {
  if (!els.supportProjectPay) return;
  els.supportProjectPay.disabled = Boolean(isLoading);
  els.supportProjectPay.classList.toggle("loading", Boolean(isLoading));
  els.supportProjectPay.textContent = isLoading
    ? "Готовлю оплату..."
    : `Поддержать за ${CONFIG.supportStarsAmount || 100} ⭐`;
}

async function createSupportInvoiceLink() {
  const invoiceUrl = String(CONFIG.starsInvoiceUrl || "").trim();
  if (!invoiceUrl) {
    throw new Error("Stars invoice backend URL is not configured.");
  }

  const initData = getTelegramInitData();
  if (!initData) {
    throw new Error("Открой игру через Telegram Mini App, чтобы поддержать проект через Stars.");
  }

  const headers = {
    "Content-Type": "application/json"
  };

  if (CONFIG.supabaseAnonKey) {
    headers.apikey = CONFIG.supabaseAnonKey;
    headers.Authorization = `Bearer ${CONFIG.supabaseAnonKey}`;
  }

  const response = await fetch(invoiceUrl, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({
      initData,
      appVersion: CONFIG.appVersion,
      amountStars: CONFIG.supportStarsAmount || 100
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.ok || !data?.invoiceLink) {
    throw new Error(data?.error || `Stars invoice response ${response.status}`);
  }

  return data.invoiceLink;
}

async function paySupportProject() {
  if (supportProjectBusy) return;

  const tg = window.Telegram?.WebApp;
  if (!isTelegramMiniAppReady()) {
    showToast("Открой игру через Telegram Mini App, чтобы поддержать проект.");
    return;
  }

  if (!tg?.openInvoice) {
    showToast("Твой Telegram пока не поддерживает оплату invoice внутри Mini App.");
    return;
  }

  supportProjectBusy = true;
  setSupportPayLoading(true);

  try {
    const invoiceLink = await createSupportInvoiceLink();

    tg.openInvoice(invoiceLink, (status) => {
      supportProjectBusy = false;
      setSupportPayLoading(false);

      if (status === "paid") {
        closeSupportProjectModal();
        showToast("Спасибо за поддержку проекта ⭐");
        try {
          tg.HapticFeedback?.notificationOccurred?.("success");
        } catch (_) {}
        return;
      }

      if (status === "cancelled") {
        showToast("Оплата отменена.");
        return;
      }

      if (status === "failed") {
        showToast("Оплата не прошла. Попробуй позже.");
        return;
      }

      showToast("Оплата ожидает подтверждения Telegram.");
    });
  } catch (error) {
    supportProjectBusy = false;
    setSupportPayLoading(false);
    console.warn("Stars support payment failed:", error);
    showToast(String(error?.message || error));
  }
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

  if ($("#screen-referrals").classList.contains("active")) {
    renderReferrals();
  }

  if ($("#screen-leaderboard")?.classList.contains("active")) {
    renderLeaderboard();
  }

  if ($("#screen-profile")?.classList.contains("active")) {
    renderProfile();
  }
}


function initTelegramApp() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  try {
    tg.ready();
    tg.expand();
  } catch (error) {
    console.warn("Telegram WebApp init warning:", error);
  }
}

function ensureReferralState() {
  state.referrals = {
    ...structuredClone(defaultState.referrals),
    ...(state.referrals || {})
  };

  if (!state.referrals.code) {
    state.referrals.code = createReferralCode();
  }

  state.referrals.invitedFriends = Number(state.referrals.invitedFriends || 0);
  state.referrals.rewardsEarned = Number(state.referrals.rewardsEarned || 0);
  state.referrals.serverBalance = Number(state.referrals.serverBalance || 0);
  state.referrals.serverBalanceApplied = Number(state.referrals.serverBalanceApplied || 0);
}

function createReferralCode() {
  const telegramUser = getTelegramUser();
  if (telegramUser?.id) return `ref_${telegramUser.id}`;

  const storedCode = localStorage.getItem("raccoon_referral_code");
  if (storedCode) return storedCode;

  const randomPart = Math.random().toString(36).slice(2, 8);
  const timePart = Date.now().toString(36).slice(-5);
  const code = `local_${timePart}${randomPart}`;
  localStorage.setItem("raccoon_referral_code", code);
  return code;
}

function getTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
}

function getIncomingReferralParam() {
  const tg = window.Telegram?.WebApp;
  const urlParams = new URLSearchParams(window.location.search);
  let rawInitStartParam = "";

  try {
    rawInitStartParam = new URLSearchParams(tg?.initData || "").get("start_param") || "";
  } catch (error) {
    rawInitStartParam = "";
  }

  return tg?.initDataUnsafe?.start_param
    || rawInitStartParam
    || urlParams.get("tgWebAppStartParam")
    || urlParams.get("startapp")
    || urlParams.get("ref")
    || "";
}

function normalizeReferralCode(value) {
  return String(value || "")
    .trim()
    .replace(/^ref[_-]/i, "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 64);
}

function toTelegramStartParam(referralCode) {
  const raw = String(referralCode || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
  if (!raw) return "";
  return /^ref[_-]/i.test(raw) ? raw : `ref_${raw}`;
}

function captureIncomingReferral() {
  const incomingRaw = getIncomingReferralParam();
  const incomingCode = normalizeReferralCode(incomingRaw);
  if (!incomingCode) return;

  const ownCode = normalizeReferralCode(state.referrals.code);
  if (!ownCode || incomingCode === ownCode) return;

  if (!state.referrals.invitedBy) {
    state.referrals.invitedBy = incomingCode;
    state.referrals.acceptedAt = Date.now();
    saveState();
  }
}

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || "";
}

function isTelegramMiniAppReady() {
  return Boolean(getTelegramInitData());
}

function setBackendError(error) {
  const message = String(error?.message || error);
  state.referrals.backendEnabled = false;
  state.referrals.backendStatus = "error";
  state.referrals.backendError = message;
  state.leaderboard = {
    ...structuredClone(defaultState.leaderboard),
    ...(state.leaderboard || {}),
    status: "error",
    error: message
  };
  saveState();
  renderReferralsIfOpen();
  renderLeaderboardIfOpen();
  renderProfileIfOpen();
}

async function callGameBackend(extraBody = {}) {
  ensureReferralState();

  const backendUrl = String(CONFIG.backendUrl || "").trim();
  if (!backendUrl) {
    throw new Error("Backend URL is not configured");
  }

  const initData = getTelegramInitData();
  if (!initData) {
    throw new Error("Открой игру через Telegram Mini App, чтобы синхронизировать профиль.");
  }

  const headers = {
    "Content-Type": "application/json"
  };

  if (CONFIG.supabaseAnonKey) {
    headers.apikey = CONFIG.supabaseAnonKey;
    headers.Authorization = `Bearer ${CONFIG.supabaseAnonKey}`;
  }

  const response = await fetch(backendUrl, {
    method: "POST",
    headers,
    cache: "no-store",
    body: JSON.stringify({
      action: "sync",
      appVersion: CONFIG.appVersion,
      initData,
      startParam: toTelegramStartParam(getIncomingReferralParam()),
      businessLevels: getSanitizedBusinessLevelsForBackend(),
      businessCooldowns: getSanitizedBusinessCooldownsForBackend(),
      totalEarned: Math.floor(Number(state.totalEarned || 0)),
      clientBalance: Math.floor(Number(state.coins || 0)),
      knownServerBalance: Math.floor(Number(state.referrals?.serverBalance || 0)),
      ...extraBody
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.ok) {
    throw new Error(data?.error || `Backend response ${response.status}`);
  }

  return data;
}

async function syncTelegramPlayer(options = {}) {
  ensureReferralState();

  if (!String(CONFIG.backendUrl || "").trim()) {
    state.referrals.backendStatus = "local";
    renderReferralsIfOpen();
    return;
  }

  if (!isTelegramMiniAppReady()) {
    state.referrals.backendEnabled = false;
    state.referrals.backendStatus = "not_telegram";
    state.referrals.backendError = "";
    state.leaderboard = {
      ...structuredClone(defaultState.leaderboard),
      ...(state.leaderboard || {}),
      status: "not_telegram",
      error: ""
    };
    renderReferralsIfOpen();
    renderLeaderboardIfOpen();
    renderProfileIfOpen();
    return;
  }

  const now = Date.now();
  if (!options.force && now - lastManualSyncAt < 2500) {
    return;
  }
  lastManualSyncAt = now;

  state.referrals.backendStatus = "syncing";
  state.referrals.backendError = "";
  state.leaderboard = {
    ...structuredClone(defaultState.leaderboard),
    ...(state.leaderboard || {}),
    status: "syncing",
    error: ""
  };
  renderReferralsIfOpen();
  renderLeaderboardIfOpen();
  renderProfileIfOpen();

  try {
    const data = await callGameBackend({ action: "sync" });
    applyBackendPlayerData(data);
  } catch (error) {
    console.warn("Backend sync failed:", error);
    setBackendError(error);
  }
}

function applyBackendPlayerData(data) {
  const user = data.user || {};
  const backendReferralCode = String(user.referral_code || "").trim();
  const backendTelegramId = user.telegram_id ? String(user.telegram_id) : "";

  state.referrals.backendEnabled = true;
  state.referrals.backendStatus = "connected";
  state.referrals.backendError = "";
  state.referrals.lastSyncAt = Date.now();

  if (backendTelegramId) state.referrals.telegramId = backendTelegramId;
  if (backendReferralCode) state.referrals.code = backendReferralCode;

  state.referrals.invitedFriends = Number(data.invited_count || 0);

  const serverBalance = Math.max(0, Number(user.balance || 0));
  const previousLocalBalance = Math.max(0, Number(state.coins || 0));
  const balanceDelta = serverBalance - previousLocalBalance;

  state.referrals.serverBalance = serverBalance;
  state.referrals.serverBalanceApplied = serverBalance;
  state.referrals.rewardsEarned = Math.max(0, Number(data.referral_rewards_total ?? state.referrals.rewardsEarned ?? 0));

  if (user.business_levels && typeof user.business_levels === "object") {
    state.businessLevels = sanitizeBusinessLevelsFromServer(user.business_levels);
  }

  if (user.business_cooldowns && typeof user.business_cooldowns === "object") {
    state.businessCooldowns = sanitizeBusinessCooldownsFromServer(user.business_cooldowns);
  }

  state.coins = serverBalance;
  state.totalEarned = Math.max(
    Number(state.totalEarned || 0),
    Number(user.total_earned || 0),
    serverBalance
  );

  if (balanceDelta > 0) {
    setTimeout(() => {
      showToast(`Баланс синхронизирован: +${formatNumber(balanceDelta)} RCT.`);
      spawnFloatingText(`+${formatNumber(balanceDelta)}`, window.innerWidth / 2, 160);
    }, 300);
  }

  if (data.referral_reward_given) {
    setTimeout(() => {
      showToast("Приглашение засчитано. Бонус получит пригласивший игрок.");
    }, 450);
  }

  applyBackendLeaderboardData(data);

  saveState();
  renderAll();
}

function renderReferralsIfOpen() {
  if ($("#screen-referrals")?.classList.contains("active")) {
    renderReferrals();
  }
}

function ensureLeaderboardState() {
  state.leaderboard = {
    ...structuredClone(defaultState.leaderboard),
    ...(state.leaderboard || {})
  };

  if (!Array.isArray(state.leaderboard.items)) {
    state.leaderboard.items = [];
  }
}

function bindLeaderboardActions() {
  els.refreshLeaderboardBtn?.addEventListener("click", async () => {
    await syncTelegramPlayer({ force: true });
    renderLeaderboard();
  });
}

function applyBackendLeaderboardData(data) {
  ensureLeaderboardState();

  const items = Array.isArray(data.leaderboard) ? data.leaderboard : [];
  const myRank = data.my_leaderboard_rank ?? null;

  const serverProfitPerHour = Math.max(0, Number(data.user?.profit_per_hour ?? 0));

  state.leaderboard.items = items;
  state.leaderboard.myRank = myRank;
  state.leaderboard.myProfitPerHour = serverProfitPerHour || getTotalProfitPerHour();
  state.leaderboard.status = "connected";
  state.leaderboard.error = "";
  state.leaderboard.lastSyncAt = Date.now();
}

function renderLeaderboardIfOpen() {
  if ($("#screen-leaderboard")?.classList.contains("active")) {
    renderLeaderboard();
  }

  if ($("#screen-profile")?.classList.contains("active")) {
    renderProfile();
  }
}

function bindProfileActions() {
  els.refreshProfileBtn?.addEventListener("click", async () => {
    await syncTelegramPlayer({ force: true });
    renderProfile();
  });
}

function renderProfileIfOpen() {
  if ($("#screen-profile")?.classList.contains("active")) {
    renderProfile();
  }
}

function renderProfile() {
  const telegramUser = getTelegramUser();
  const telegramId = state.referrals?.telegramId || telegramUser?.id || "";
  const username = telegramUser?.username || "";
  const firstName = telegramUser?.first_name || "";
  const displayName = firstName || (username ? `@${username}` : "Raccoon Player");
  const initialsSource = firstName || username || "R";
  const profileInitial = String(initialsSource).trim().slice(0, 1).toUpperCase() || "R";

  if (els.profileAvatarValue) els.profileAvatarValue.textContent = profileInitial;
  if (els.profileNameValue) els.profileNameValue.textContent = displayName;
  if (els.profileUsernameValue) {
    els.profileUsernameValue.textContent = username
      ? `@${username}`
      : state.referrals?.backendStatus === "not_telegram"
        ? "Открой игру через Telegram Mini App"
        : "Telegram username не указан";
  }
  if (els.profileTelegramIdValue) els.profileTelegramIdValue.textContent = telegramId ? String(telegramId) : "—";
  if (els.profileBalanceValue) els.profileBalanceValue.textContent = `${formatNumber(state.coins || 0)} RCT`;
  if (els.profileProfitValue) els.profileProfitValue.textContent = `${formatNumber(state.leaderboard?.myProfitPerHour || getTotalProfitPerHour())}/час`;
  if (els.profileRankValue) els.profileRankValue.textContent = state.leaderboard?.myRank ? `#${state.leaderboard.myRank}` : "—";
  if (els.profileInvitedValue) els.profileInvitedValue.textContent = formatNumber(state.referrals?.invitedFriends || 0);
  if (els.profileRefBonusValue) els.profileRefBonusValue.textContent = `${formatNumber(state.referrals?.rewardsEarned || 0)} RCT`;
  if (els.profileTotalEarnedValue) els.profileTotalEarnedValue.textContent = `${formatNumber(state.totalEarned || 0)} RCT`;
  if (els.profileBusinessLevelsValue) els.profileBusinessLevelsValue.textContent = formatNumber(getOwnedLevels());
  if (els.profileBackendValue) els.profileBackendValue.textContent = getProfileStatusText();
}

function getProfileStatusText() {
  const status = state.referrals?.backendStatus;

  if (status === "connected") {
    const syncedAt = state.referrals.lastSyncAt
      ? new Date(state.referrals.lastSyncAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      : "только что";
    return `Профиль подключён к Supabase. Серверный баланс: ${formatNumber(state.referrals.serverBalance || 0)} RCT. Последняя синхронизация: ${syncedAt}.`;
  }

  if (status === "syncing") {
    return "Синхронизирую профиль с Supabase backend...";
  }

  if (status === "not_telegram") {
    return "Профиль появится после запуска игры внутри Telegram Mini App.";
  }

  if (status === "error") {
    return `Профиль не синхронизирован: ${state.referrals.backendError || "неизвестная ошибка"}.`;
  }

  return "Профиль ожидает подключения к Telegram и Supabase backend.";
}

function renderLeaderboard() {
  ensureLeaderboardState();

  const serverProfit = Math.max(0, Number(state.leaderboard?.myProfitPerHour || 0));
  const profitPerHour = state.leaderboard.status === "connected"
    ? serverProfit
    : getTotalProfitPerHour();

  if (els.leaderboardMyProfitValue) {
    els.leaderboardMyProfitValue.textContent = `${formatNumber(profitPerHour)}/час`;
  }

  if (els.leaderboardMyRankValue) {
    if (state.leaderboard.status === "connected" && state.leaderboard.myRank) {
      els.leaderboardMyRankValue.textContent = `Твоё место: #${state.leaderboard.myRank}.`;
    } else if (state.leaderboard.status === "connected") {
      els.leaderboardMyRankValue.textContent = "Твой ранг пока не попал в топ-100, но игрок уже участвует в рейтинге.";
    } else if (state.leaderboard.status === "error") {
      els.leaderboardMyRankValue.textContent = "Лидерборд пока не загрузился.";
    } else {
      els.leaderboardMyRankValue.textContent = "Рейтинг появится после синхронизации через Telegram.";
    }
  }

  if (els.leaderboardInfoValue) {
    els.leaderboardInfoValue.textContent = getLeaderboardStatusText();
  }

  if (!els.leaderboardList) return;

  const rows = Array.isArray(state.leaderboard.items) ? state.leaderboard.items : [];
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${state.leaderboard.status === "syncing" ? "Загружаю топ игроков..." : "Пока нет игроков в рейтинге."}</div>`;
    return;
  }

  const currentTelegramId = String(state.referrals?.telegramId || "");
  els.leaderboardList.innerHTML = rows.map((item, index) => {
    const rank = Number(item.rank || index + 1);
    const telegramId = String(item.telegram_id || "");
    const name = escapeHtml(getLeaderboardDisplayName(item));
    const profit = formatNumber(item.profit_per_hour || 0);
    const earned = formatNumber(item.total_earned || 0);
    const isMe = Boolean(item.is_me) || (currentTelegramId && telegramId === currentTelegramId);
    const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

    return `
      <div class="leaderboard-row${isMe ? " is-me" : ""}">
        <div class="leaderboard-rank">${medal}</div>
        <div class="leaderboard-player">
          <b>${name}</b>
          <span>${earned} RCT всего</span>
        </div>
        <div class="leaderboard-profit">${profit}<span>/час</span></div>
      </div>`;
  }).join("");
}

function getLeaderboardDisplayName(item) {
  const displayName = String(item.display_name || "").trim();
  if (displayName) return displayName;

  const firstName = String(item.first_name || "").trim();
  if (firstName) return firstName;

  const publicId = String(item.public_id || "").trim();
  if (publicId) return `Игрок #${publicId}`;

  const telegramId = String(item.telegram_id || "");
  return telegramId ? `Игрок #${telegramId.slice(-4)}` : "Raccoon Player";
}

function getLeaderboardStatusText() {
  const status = state.leaderboard?.status;

  if (status === "connected") {
    const syncedAt = state.leaderboard.lastSyncAt
      ? new Date(state.leaderboard.lastSyncAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      : "только что";
    return `Топ-100 обновлён. В рейтинг попадают все игроки, а @username в топе скрыт для приватности. Последняя синхронизация: ${syncedAt}.`;
  }

  if (status === "syncing") {
    return "Обновляю лидерборд через Supabase...";
  }

  if (status === "error") {
    return `Лидерборд не загрузился: ${state.leaderboard.error || "неизвестная ошибка"}. Проверь код register-player и SQL-таблицы.`;
  }

  return "Открой игру через Telegram Mini App, чтобы отправить прибыль в час и попасть в рейтинг.";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function bindReferralActions() {
  els.copyReferralBtn?.addEventListener("click", copyReferralLink);
  els.shareReferralBtn?.addEventListener("click", shareReferralLink);
}

async function copyReferralLink() {
  const link = buildReferralLink();

  try {
    await navigator.clipboard.writeText(link);
    showToast("Реферальная ссылка скопирована.");
  } catch (error) {
    els.referralLinkValue?.select();
    document.execCommand("copy");
    showToast("Ссылка выделена и скопирована.");
  }
}

function shareReferralLink() {
  const link = buildReferralLink();
  const text = "Залетай в Raccoon Tap. За активного приглашённого друга я получу 5 000 RCT.";
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
  window.open(telegramShareUrl, "_blank", "noopener,noreferrer");
}

function buildReferralLink() {
  ensureReferralState();

  const startParam = toTelegramStartParam(state.referrals.code);
  const botUsername = String(CONFIG.telegramBotUsername || "").trim().replace(/^@/, "");
  const appShortName = String(CONFIG.telegramAppShortName || "").trim().replace(/^\//, "");

  if (botUsername && appShortName) {
    return `https://t.me/${botUsername}/${appShortName}?startapp=${encodeURIComponent(startParam)}`;
  }

  if (botUsername) {
    return `https://t.me/${botUsername}?startapp=${encodeURIComponent(startParam)}`;
  }

  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("ref", startParam);
  return url.toString();
}

function renderReferrals() {
  ensureReferralState();

  const link = buildReferralLink();
  if (els.referralCodeValue) els.referralCodeValue.textContent = state.referrals.code;
  if (els.referralInvitedValue) els.referralInvitedValue.textContent = formatNumber(state.referrals.invitedFriends || 0);
  if (els.referralEarnedValue) els.referralEarnedValue.textContent = `${formatNumber(state.referrals.rewardsEarned || 0)} RCT`;
  if (els.referralLinkValue) els.referralLinkValue.value = link;

  if (state.referrals.invitedBy) {
    els.incomingReferralCard?.classList.remove("hidden");
    if (els.incomingReferralValue) els.incomingReferralValue.textContent = `Код пригласившего: ref_${state.referrals.invitedBy}`;
  } else {
    els.incomingReferralCard?.classList.add("hidden");
  }

  if (els.referralInfoValue) {
    els.referralInfoValue.textContent = getReferralStatusText();
  }
}

function getReferralStatusText() {
  const status = state.referrals.backendStatus;

  if (status === "connected") {
    const syncedAt = state.referrals.lastSyncAt
      ? new Date(state.referrals.lastSyncAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
      : "только что";
    return `Backend Supabase подключён. Рефералы считаются по Telegram ID, бонус ${formatNumber(CONFIG.referralReward)} RCT начисляется пригласившему игроку. Последняя синхронизация: ${syncedAt}.`;
  }

  if (status === "syncing") {
    return "Подключаюсь к Supabase backend и проверяю Telegram-пользователя...";
  }

  if (status === "not_telegram") {
    return "Backend прописан, но игра открыта не внутри Telegram Mini App. Реферальная ссылка уже генерируется, а проверка игрока сработает при запуске через Telegram.";
  }

  if (status === "error") {
    return `Backend не ответил или вернул ошибку: ${state.referrals.backendError || "неизвестная ошибка"}. Проверь Secrets, Verify JWT и код функции register-player.`;
  }

  return "Ссылка генерируется через Telegram startapp. Для настоящего начисления 5 000 RCT нужен включённый Supabase backend register-player.";
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
    const telegramReady = isTelegramMiniAppReady();
    const canBuy = telegramReady && !backendActionBusy && state.coins >= nextCost && level < CONFIG.businessMaxLevel && cooldownLeft <= 0;
    const buttonText = level >= CONFIG.businessMaxLevel
      ? "MAX"
      : !telegramReady
        ? "Открой в TG"
        : backendActionBusy
          ? "Синхронизация..."
          : cooldownLeft > 0
            ? `КД ${formatLongTime(cooldownLeft)}`
            : formatNumber(nextCost);

    const card = document.createElement("article");
    card.className = "business-card";
    card.innerHTML = `
      <div class="biz-logo">${businessLogoSvg(business.logoSeed, business.categoryId)}</div>
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

async function buyBusinessLevel(businessId) {
  applyElapsedProgress(false);

  const business = findBusiness(businessId);
  if (!business) return;

  if (!isTelegramMiniAppReady()) {
    showToast("Покупки бизнесов в бете работают только через Telegram Mini App.");
    return;
  }

  if (backendActionBusy) {
    showToast("Подожди, предыдущая покупка ещё синхронизируется.");
    return;
  }

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

  backendActionBusy = true;
  renderBusinesses();

  try {
    const data = await callGameBackend({
      action: "buy_business",
      businessId
    });

    applyBackendPlayerData(data);

    const purchase = data.purchase || {};
    const nextLevel = Number(purchase.level || getBusinessLevel(businessId));
    const cooldownMs = Number(purchase.cooldown_ms || 0);

    showToast(`${business.name} улучшен до ${nextLevel} уровня${cooldownMs > 0 ? `. КД: ${formatLongTime(cooldownMs)}.` : "."}`);
  } catch (error) {
    console.warn("Business purchase failed:", error);
    showToast(String(error?.message || error));
    setBackendError(error);
  } finally {
    backendActionBusy = false;
    renderAll();
  }
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

function getSanitizedBusinessLevelsForBackend() {
  const payload = {};

  categories.forEach((category) => {
    category.businesses.forEach((business) => {
      const level = getBusinessLevel(business.id);
      if (level > 0) {
        payload[business.id] = level;
      }
    });
  });

  return payload;
}

function getSanitizedBusinessCooldownsForBackend() {
  const payload = {};
  const now = Date.now();

  categories.forEach((category) => {
    category.businesses.forEach((business) => {
      const cooldownEnd = Number(state.businessCooldowns?.[business.id] || 0);
      if (Number.isFinite(cooldownEnd) && cooldownEnd > now) {
        payload[business.id] = Math.floor(cooldownEnd);
      }
    });
  });

  return payload;
}

function sanitizeBusinessLevelsFromServer(rawLevels) {
  const levels = {};

  categories.forEach((category) => {
    category.businesses.forEach((business) => {
      const level = Math.max(0, Math.min(CONFIG.businessMaxLevel, Math.floor(Number(rawLevels?.[business.id] || 0))));
      if (level > 0) {
        levels[business.id] = level;
      }
    });
  });

  return levels;
}

function sanitizeBusinessCooldownsFromServer(rawCooldowns) {
  const cooldowns = {};
  const now = Date.now();

  categories.forEach((category) => {
    category.businesses.forEach((business) => {
      const cooldownEnd = Math.floor(Number(rawCooldowns?.[business.id] || 0));
      if (Number.isFinite(cooldownEnd) && cooldownEnd > now) {
        cooldowns[business.id] = cooldownEnd;
      }
    });
  });

  return cooldowns;
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


function showBetaNotice() {
  if (!els.betaModal || state.betaNoticeSeen) return;

  const offlineIsOpen =
    els.offlineModal &&
    !els.offlineModal.classList.contains("hidden");

  if (offlineIsOpen) {
    betaNoticePending = true;
    return;
  }

  betaNoticePending = false;
  els.betaModal.classList.remove("hidden");
}

function closeBetaNotice() {
  if (!els.betaModal) return;
  els.betaModal.classList.add("hidden");
  state.betaNoticeSeen = true;
  saveState();
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
}

function businessLogoSvg(seed, categoryId = "") {
  const type = categoryId || (seed < 20 ? "markets" : seed < 40 ? "pr" : seed < 60 ? "legal" : "special");
  const index = Math.max(0, seed % 20);
  const variant = index % 12;
  const gid = `${type}${seed}`;

  const common = `
    <defs>
      <linearGradient id="bizGold${gid}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffe7a3"/>
        <stop offset="1" stop-color="#f0a735"/>
      </linearGradient>
      <linearGradient id="bizBlue${gid}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#79e0ff"/>
        <stop offset="1" stop-color="#1764d8"/>
      </linearGradient>
      <linearGradient id="bizGreen${gid}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#9df7bd"/>
        <stop offset="1" stop-color="#28b879"/>
      </linearGradient>
      <linearGradient id="bizPink${gid}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#ffb6d0"/>
        <stop offset="1" stop-color="#b96cff"/>
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="18" fill="#101a2d" stroke="url(#bizGold${gid})" stroke-width="2.3"/>
    <circle cx="50" cy="15" r="7" fill="url(#bizGold${gid})"/>
    <path d="M47 15c2-4 5-4 7 0-1 4-6 4-7 0z" fill="#4b2a08" opacity=".75"/>
  `;

  const markets = [
    `<path d="M15 29h34v22H15z" fill="#f3d3a0"/><path d="M13 23h38l-4-8H17z" fill="url(#bizBlue${gid})"/><path d="M14 25h7v7h-7zm7 0h7v7h-7zm7 0h7v7h-7zm7 0h7v7h-7zm7 0h7v7h-7z" fill="#fff3dc"/><rect x="21" y="38" width="9" height="13" rx="2" fill="#17233b"/><circle cx="43" cy="44" r="8" fill="url(#bizGold${gid})"/>`,
    `<rect x="15" y="23" width="34" height="25" rx="6" fill="url(#bizBlue${gid})"/><path d="M20 23c0-10 24-10 24 0" fill="none" stroke="url(#bizGold${gid})" stroke-width="5" stroke-linecap="round"/><circle cx="25" cy="36" r="4" fill="#fff3dc"/><circle cx="39" cy="36" r="4" fill="#fff3dc"/><path d="M24 44h18" stroke="#101a2d" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M16 23h8l4 21h19" stroke="url(#bizGold${gid})" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M26 28h24l-4 14H29z" fill="url(#bizBlue${gid})"/><circle cx="32" cy="50" r="4" fill="#ffe7a3"/><circle cx="45" cy="50" r="4" fill="#ffe7a3"/>`,
    `<path d="M13 30h38l-5 21H18z" fill="#13233d"/><path d="M17 22h30l4 8H13z" fill="url(#bizPink${gid})"/><path d="M22 34h20M22 41h14" stroke="#ffe7a3" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="43" r="8" fill="url(#bizGold${gid})"/>`,
    `<rect x="19" y="16" width="26" height="36" rx="8" fill="url(#bizBlue${gid})"/><rect x="24" y="22" width="16" height="12" rx="3" fill="#dff7ff"/><path d="M23 41h18" stroke="url(#bizGold${gid})" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="48" r="3" fill="#ffe7a3"/>`,
    `<path d="M13 34h27v14H13z" fill="url(#bizBlue${gid})"/><path d="M40 38h9l5 10H40z" fill="#f3d3a0"/><circle cx="22" cy="51" r="5" fill="url(#bizGold${gid})"/><circle cx="45" cy="51" r="5" fill="url(#bizGold${gid})"/><path d="M18 28h17" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/>`,
    `<rect x="17" y="14" width="30" height="40" rx="7" fill="#16243a" stroke="url(#bizGold${gid})" stroke-width="3"/><rect x="22" y="20" width="20" height="22" rx="4" fill="url(#bizBlue${gid})"/><path d="M26 48h12" stroke="#ffe7a3" stroke-width="3" stroke-linecap="round"/><path d="M26 32l5 5 8-11" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<path d="M16 48h34" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/><rect x="19" y="35" width="6" height="13" rx="2" fill="url(#bizBlue${gid})"/><rect x="29" y="27" width="6" height="21" rx="2" fill="url(#bizGreen${gid})"/><rect x="39" y="19" width="6" height="29" rx="2" fill="url(#bizGold${gid})"/><path d="M17 30l12-9 8 5 12-12" stroke="#79e0ff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<circle cx="32" cy="33" r="18" fill="url(#bizBlue${gid})"/><path d="M14 33h36M32 15c8 9 8 27 0 36M32 15c-8 9-8 27 0 36" stroke="#dff7ff" stroke-width="2" fill="none"/><circle cx="44" cy="44" r="8" fill="url(#bizGold${gid})"/>`,
    `<path d="M17 24h30v22H17z" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M22 29h20M22 36h20" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><path d="M23 47l-6 6M47 47l6 6" stroke="#ffe7a3" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M15 25h34v27H15z" fill="#f3d3a0"/><path d="M12 20h40v8H12z" fill="url(#bizGold${gid})"/><rect x="21" y="35" width="7" height="17" fill="#17233b"/><rect x="35" y="35" width="7" height="9" fill="url(#bizBlue${gid})"/><path d="M20 15h24" stroke="#79e0ff" stroke-width="4" stroke-linecap="round"/>`,
    `<circle cx="32" cy="32" r="18" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M20 37l8-9 6 5 10-12" stroke="#79e0ff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44 21v10H34" stroke="#79e0ff" stroke-width="3" fill="none" stroke-linecap="round"/>`
  ];

  const pr = [
    `<path d="M17 39c7-7 23-7 30 0v12H17z" fill="#17233b"/><circle cx="32" cy="31" r="8" fill="url(#bizGold${gid})"/><circle cx="20" cy="36" r="5" fill="url(#bizBlue${gid})"/><circle cx="44" cy="36" r="5" fill="url(#bizBlue${gid})"/>`,
    `<path d="M30 23l18-8v23l-18-6z" fill="#fff1d3"/><path d="M18 24h12v10H18z" fill="url(#bizBlue${gid})"/><path d="M47 18c4 2 6 5 6 9s-2 7-6 9" stroke="url(#bizGold${gid})" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M21 35l5 15" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/>`,
    `<rect x="14" y="18" width="36" height="28" rx="9" fill="url(#bizBlue${gid})"/><path d="M24 46l-5 8 13-8" fill="url(#bizBlue${gid})"/><circle cx="25" cy="32" r="3" fill="#fff"/><circle cx="32" cy="32" r="3" fill="#fff"/><circle cx="39" cy="32" r="3" fill="#fff"/>`,
    `<path d="M18 20h28v32H18z" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M23 29h18M23 36h18M23 43h12" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><circle cx="45" cy="20" r="7" fill="url(#bizPink${gid})"/>`,
    `<rect x="15" y="22" width="34" height="24" rx="7" fill="url(#bizBlue${gid})"/><path d="M20 29h24M20 36h17" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M43 42l7 8" stroke="url(#bizGold${gid})" stroke-width="5" stroke-linecap="round"/><circle cx="43" cy="39" r="7" fill="#ffe7a3"/>`,
    `<path d="M20 45c1-11 8-18 18-18s17 7 18 18" fill="none" stroke="url(#bizGold${gid})" stroke-width="4" stroke-linecap="round"/><rect x="16" y="43" width="10" height="12" rx="4" fill="url(#bizBlue${gid})"/><rect x="50" y="43" width="10" height="12" rx="4" fill="url(#bizBlue${gid})"/><circle cx="38" cy="27" r="7" fill="#ffe7a3"/>`,
    `<path d="M16 22h32v28H16z" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M22 38l6-7 5 4 9-11" stroke="#79e0ff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="46" cy="18" r="6" fill="url(#bizPink${gid})"/>`,
    `<path d="M13 36c9-12 29-12 38 0" stroke="url(#bizGold${gid})" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="21" cy="38" r="6" fill="url(#bizBlue${gid})"/><circle cx="32" cy="30" r="7" fill="#ffe7a3"/><circle cx="43" cy="38" r="6" fill="url(#bizBlue${gid})"/><path d="M18 50h28" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M16 18h32v34H16z" rx="6" fill="url(#bizBlue${gid})"/><path d="M23 26h18M23 33h18M23 40h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M43 43l8 8" stroke="url(#bizGold${gid})" stroke-width="5" stroke-linecap="round"/>`,
    `<circle cx="32" cy="32" r="18" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M21 35c7-9 15-9 22 0M26 27h12" stroke="#79e0ff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="24" cy="22" r="4" fill="url(#bizPink${gid})"/><circle cx="42" cy="42" r="4" fill="url(#bizGreen${gid})"/>`,
    `<path d="M14 40h36v12H14z" fill="#17233b"/><path d="M20 35l7-12 7 12M34 35l7-12 7 12" stroke="url(#bizGold${gid})" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="28" cy="23" r="5" fill="url(#bizBlue${gid})"/><circle cx="42" cy="23" r="5" fill="url(#bizPink${gid})"/>`,
    `<path d="M32 13l8 14 16 3-11 12 2 16-15-7-15 7 2-16L8 30l16-3z" fill="url(#bizGold${gid})"/><path d="M24 35h16M32 27v16" stroke="#17233b" stroke-width="4" stroke-linecap="round"/>`
  ];

  const legal = [
    `<path d="M16 16h27c4 0 7 3 7 7v27H16z" fill="#f3e2c1"/><path d="M22 24h18M22 31h17M22 38h12" stroke="#7b6a55" stroke-width="2" stroke-linecap="round"/><path d="M35 30h18v10c0 9-7 14-9 15-2-1-9-6-9-15z" fill="url(#bizBlue${gid})" stroke="url(#bizGold${gid})" stroke-width="2"/>`,
    `<path d="M32 16v30M20 26h24" stroke="url(#bizGold${gid})" stroke-width="4" stroke-linecap="round"/><path d="M19 27l-8 14h16zM45 27l-8 14h16z" fill="url(#bizBlue${gid})"/><path d="M22 50h20" stroke="#fff1d3" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M18 22h28v26H18z" fill="#f3e2c1" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M23 30h18M23 37h12" stroke="#7b6a55" stroke-width="2" stroke-linecap="round"/><path d="M35 48l12 6M43 40l12 6" stroke="#6d391c" stroke-width="5" stroke-linecap="round"/>`,
    `<path d="M18 18h28v34H18z" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M24 27h16M24 34h16M24 41h10" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><circle cx="45" cy="45" r="8" fill="url(#bizGold${gid})"/>`,
    `<path d="M16 25h32v24H16z" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M22 25v-5c0-8 20-8 20 0v5" stroke="#ffe7a3" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M32 35v7" stroke="#79e0ff" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M18 18h28v34H18z" fill="#f3e2c1"/><path d="M23 25h18M23 32h18M23 39h12" stroke="#7b6a55" stroke-width="2" stroke-linecap="round"/><path d="M42 40l10 10M52 40L42 50" stroke="url(#bizPink${gid})" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M32 14l18 8v13c0 12-9 19-18 23-9-4-18-11-18-23V22z" fill="url(#bizBlue${gid})" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M23 35l6 6 13-15" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    `<path d="M16 20h32v28H16z" fill="#f3e2c1" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M21 29h22M21 36h18" stroke="#7b6a55" stroke-width="2" stroke-linecap="round"/><path d="M47 19l8 8-17 17-8 2 2-8z" fill="url(#bizBlue${gid})"/>`,
    `<path d="M20 14h24v36H20z" fill="#f3e2c1"/><path d="M25 22h14M25 29h14M25 36h10" stroke="#7b6a55" stroke-width="2" stroke-linecap="round"/><circle cx="43" cy="45" r="9" fill="url(#bizGold${gid})"/><path d="M39 45l3 3 6-7" stroke="#17233b" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<path d="M18 47h28" stroke="url(#bizGold${gid})" stroke-width="5" stroke-linecap="round"/><path d="M24 36l14-14 8 8-14 14z" fill="#6d391c"/><path d="M36 20l5-5 8 8-5 5z" fill="url(#bizGold${gid})"/><path d="M18 51h32" stroke="#fff1d3" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M18 17h28v38H18z" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M24 25h16M24 32h16M24 39h16" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><path d="M42 50c5-2 8-6 8-12" stroke="url(#bizGreen${gid})" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    `<path d="M32 14l17 8v13c0 12-8 18-17 22-9-4-17-10-17-22V22z" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M25 32h14M32 25v22" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/><path d="M21 41h22" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/>`
  ];

  const special = [
    `<circle cx="34" cy="34" r="18" fill="none" stroke="#224b83" stroke-width="2"/><circle cx="34" cy="34" r="11" fill="none" stroke="#2c78c8" stroke-width="2"/><path d="M19 48l26-26" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><path d="M20 49c9-1 21-7 30-21" stroke="url(#bizGold${gid})" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    `<path d="M17 42l20-20 10 10-20 20z" fill="url(#bizBlue${gid})"/><path d="M39 18l7-7 7 7-7 7z" fill="url(#bizGold${gid})"/><path d="M21 46l-8 8" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/><circle cx="45" cy="31" r="4" fill="#79e0ff"/>`,
    `<rect x="16" y="20" width="34" height="28" rx="8" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M23 34h18" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="28" r="4" fill="url(#bizGreen${gid})"/><path d="M43 43l8 8" stroke="#ffe7a3" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M14 34c12-18 24-18 36 0-12 18-24 18-36 0z" fill="url(#bizBlue${gid})"/><circle cx="32" cy="34" r="9" fill="#101a2d"/><circle cx="32" cy="34" r="4" fill="#79e0ff"/><path d="M47 19l6-6M51 22l7-2" stroke="url(#bizGold${gid})" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M18 48h28v8H18z" fill="#17233b"/><path d="M24 48l8-30 8 30" fill="url(#bizGold${gid})"/><path d="M17 30c10-12 20-12 30 0" stroke="#79e0ff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="18" r="5" fill="#ffe7a3"/>`,
    `<path d="M32 15l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" fill="url(#bizGold${gid})"/><path d="M24 36h16" stroke="#17233b" stroke-width="4" stroke-linecap="round"/>`,
    `<rect x="17" y="20" width="30" height="34" rx="7" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><rect x="23" y="26" width="18" height="12" rx="3" fill="url(#bizBlue${gid})"/><circle cx="27" cy="46" r="3" fill="#ffe7a3"/><circle cx="37" cy="46" r="3" fill="#79e0ff"/>`,
    `<circle cx="32" cy="32" r="18" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M20 32h24M32 20v24" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="20" r="5" fill="url(#bizPink${gid})"/><circle cx="22" cy="44" r="5" fill="url(#bizGreen${gid})"/>`,
    `<path d="M16 40h32v12H16z" fill="#17233b"/><path d="M23 40l9-22 9 22" fill="url(#bizBlue${gid})"/><path d="M26 48h12" stroke="#ffe7a3" stroke-width="3" stroke-linecap="round"/><path d="M20 25l24 24" stroke="url(#bizGold${gid})" stroke-width="2" stroke-linecap="round"/>`,
    `<path d="M15 25h34v26H15z" fill="#13233d" stroke="url(#bizGold${gid})" stroke-width="3"/><path d="M21 34h22M21 42h16" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><path d="M43 20l8 8-8 8" stroke="url(#bizPink${gid})" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    `<path d="M19 43c0-15 26-15 26 0v9H19z" fill="#17233b" stroke="url(#bizGold${gid})" stroke-width="3"/><circle cx="32" cy="27" r="11" fill="url(#bizBlue${gid})"/><path d="M27 27h10M32 22v10" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    `<path d="M15 35h34l-5 17H20z" fill="#17233b"/><path d="M22 35l10-18 10 18" fill="url(#bizGold${gid})"/><path d="M27 45h10" stroke="#79e0ff" stroke-width="3" stroke-linecap="round"/><circle cx="49" cy="20" r="5" fill="url(#bizPink${gid})"/>`
  ];

  const packs = { markets, pr, legal, special };
  const pack = packs[type] || markets;
  const icon = pack[variant] || pack[0];

  return `<svg viewBox="0 0 64 64" aria-hidden="true">${common}${icon}</svg>`;
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

