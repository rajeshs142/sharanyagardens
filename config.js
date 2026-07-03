// ── Theme selector ───────────────────────────────────────────
// Options: 'earth' (warm terracotta) | 'green' (forest & water)
const THEME = 'green';

// ─────────────────────────────────────────────────────────────

const CONFIG = {
  THEME,
  // Google Sheets API
  // Restrict this key in Google Cloud Console:
  //   - API restrictions: Google Sheets API only
  //   - Website restrictions: kgsinfraprojects.com/*
  SHEETS_API_KEY: 'YOUR_API_KEY_HERE',
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
  SHEET_RANGE: 'Sheet1!A:C', // plot_number, status, date

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
