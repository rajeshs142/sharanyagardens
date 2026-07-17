// ── Theme selector ───────────────────────────────────────────
// Options: 'earth' (warm terracotta) | 'green' (forest & water)
const THEME = 'green';

// ─────────────────────────────────────────────────────────────

const CONFIG = {
  THEME,
  // Google Sheets published-as-CSV URL (no API key needed)
  // File → Share → Publish to web → Sheet1 → CSV
  SHEETS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSKHYyXGMViktJ7iWc0C1JL0wRpK3HvyVCJY-Bm0hAQ66Txnc-c4UqyFF7NOd84H0f23KObMnWWtut7/pub?gid=0&single=true&output=csv',

  // Google Maps
  MAPS_API_KEY: 'YOUR_MAPS_API_KEY_HERE',
  MAP_LAT: 15.768349,
  MAP_LNG: 78.100897,
  MAP_ZOOM: 16,

  // Project info
  PROJECT_NAME: 'Sharanya Gardens',
  COMPANY_NAME: 'KGS Infra Projects',
  TAGLINE: 'Your Dream Plot Awaits',
  TOTAL_PLOTS: 90,
  LOCATION: 'Nandyal, Andhra Pradesh',

  // Contact
  PHONE: '+91 99999 99999',
  EMAIL: 'info@kgsinfraprojects.com',
  ADDRESS: '123, Main Road, Nandyal, Andhra Pradesh - 518501',

  // Plot status colors
  STATUS_COLORS: {
    available: '#6B8F5E',   // sage green
    booked: '#C4622D',      // terracotta
    reserved: '#C49A2D',    // amber
  },

  STATUS_LABELS: {
    available: 'Available',
    booked: 'Booked',
    reserved: 'Reserved',
  },
};
