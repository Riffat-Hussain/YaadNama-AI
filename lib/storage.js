// YaadNama AI — simple client-side persistence layer.
// Everything lives in the browser's localStorage, scoped per profile name.
// This keeps the MVP deployable with zero external database, while still
// giving every feature real, working data underneath it.

const PROFILE_KEY = "yaadnama_profile";

export const CATEGORIES = [
  "Family",
  "Friends",
  "Important Events",
  "Places",
  "Medications",
  "Personal Notes",
  "Important Dates",
  "Favorite Things",
  "Lost Items",
];

export const MOODS = [
  { key: "happy", label: "Happy", emoji: "🙂" },
  { key: "calm", label: "Calm", emoji: "😌" },
  { key: "sad", label: "Sad", emoji: "😔" },
  { key: "confused", label: "Confused", emoji: "😕" },
  { key: "anxious", label: "Anxious", emoji: "😟" },
  { key: "tired", label: "Tired", emoji: "😴" },
];

function safeGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function scopedKey(profileName, suffix) {
  return `yaadnama_${suffix}_${profileName || "guest"}`;
}

// ---- Profile ----

export function getProfile() {
  return safeGet(PROFILE_KEY, null);
}

export function setProfile(name) {
  safeSet(PROFILE_KEY, { name, createdAt: new Date().toISOString() });
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

// ---- Memories ----

export function getMemories(profileName) {
  return safeGet(scopedKey(profileName, "memories"), []);
}

export function addMemory(profileName, memory) {
  const memories = getMemories(profileName);
  const newMemory = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...memory,
  };
  const updated = [newMemory, ...memories];
  safeSet(scopedKey(profileName, "memories"), updated);
  return newMemory;
}

export function deleteMemory(profileName, id) {
  const memories = getMemories(profileName).filter((m) => m.id !== id);
  safeSet(scopedKey(profileName, "memories"), memories);
}

// ---- Moods ----

export function getMoods(profileName) {
  return safeGet(scopedKey(profileName, "moods"), []);
}

export function addMood(profileName, mood, note) {
  const moods = getMoods(profileName);
  const entry = {
    id: crypto.randomUUID(),
    mood,
    note: note || "",
    date: new Date().toISOString(),
  };
  const updated = [entry, ...moods];
  safeSet(scopedKey(profileName, "moods"), updated);
  return entry;
}

// ---- Emergency contacts ----

export function getEmergencyContacts(profileName) {
  return safeGet(scopedKey(profileName, "contacts"), []);
}

export function addEmergencyContact(profileName, contact) {
  const contacts = getEmergencyContacts(profileName);
  const newContact = { id: crypto.randomUUID(), ...contact };
  const updated = [...contacts, newContact];
  safeSet(scopedKey(profileName, "contacts"), updated);
  return newContact;
}

export function deleteEmergencyContact(profileName, id) {
  const updated = getEmergencyContacts(profileName).filter((c) => c.id !== id);
  safeSet(scopedKey(profileName, "contacts"), updated);
}

// ---- Settings (dark mode, high contrast, font size) ----

const SETTINGS_KEY = "yaadnama_settings";

export function getSettings() {
  return safeGet(SETTINGS_KEY, {
    darkMode: false,
    highContrast: false,
    fontScale: "normal", // "normal" | "large" | "xlarge"
  });
}

export function setSettings(settings) {
  safeSet(SETTINGS_KEY, settings);
}

// ---- AI Companion chat history (per profile, kept locally) ----

export function getChatHistory(profileName) {
  return safeGet(scopedKey(profileName, "chat"), []);
}

export function addChatMessage(profileName, message) {
  const history = getChatHistory(profileName);
  const updated = [...history, message];
  safeSet(scopedKey(profileName, "chat"), updated);
  return updated;
}
