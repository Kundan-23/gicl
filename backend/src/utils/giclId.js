const supabase = require('../config/supabase');

// Map first digit of pincode → Indian state abbreviation
const PINCODE_STATE_MAP = {
  '1': 'DL',  // Delhi
  '2': 'RJ',  // Rajasthan
  '3': 'GJ',  // Gujarat
  '4': 'MH',  // Maharashtra
  '5': 'AP',  // Andhra Pradesh / Telangana
  '6': 'TN',  // Tamil Nadu / Kerala
  '7': 'WB',  // West Bengal
  '8': 'MP',  // Madhya Pradesh
  '9': 'UP',  // Uttar Pradesh
};

/**
 * Generate GICL ID in format: GICL00001062026MH
 * GICL + 5-digit-seq + 2-digit-month + 4-digit-year + 2-char-state
 * Uses atomic DB increment to prevent duplicate sequence numbers.
 *
 * @param {string} zipCode - Player/Coach pincode
 * @returns {Promise<{ giclId: string, registrationNumber: number }>}
 */
async function generateGiclId(zipCode) {
  // Atomic increment via Supabase RPC to prevent race conditions
  const { data, error } = await supabase.rpc('increment_registration_number');

  if (error) throw new Error('Failed to generate registration number: ' + error.message);

  const seq   = String(data).padStart(5, '0');
  const now   = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year  = String(now.getFullYear());
  const state = PINCODE_STATE_MAP[String(zipCode || '400001')[0]] || 'IN';

  const giclId = `GICL${seq}${month}${year}${state}`;
  return { giclId, registrationNumber: data };
}

module.exports = { generateGiclId, PINCODE_STATE_MAP };
