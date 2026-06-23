const CONFIG = {
  appVersion: "v12-beta-safe",
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
  }
};

let state = loadState();
let activeCategoryId = "markets";
let toastTimer = null;
let lastRenderSecond = 0;
let backendActionBusy = false;
let lastManualSyncAt = 0;

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
  bindEnergyCapacityUpgrade();
  bindReferralActions();
  bindLeaderboardActions();
  bindProfileActions();
  renderCategoryTabs();
  renderBoosts();
  renderAll();
  syncTelegramPlayer();

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
