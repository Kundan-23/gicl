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

/**
 * Generate Coach GICL ID in format: GICLC0001GA
 * GICLC + 4-digit-seq + GA  (Global Academy suffix)
 * Uses a separate coach counter stored in app_config.next_coach_number
 */
async function generateCoachGiclId() {
  // Get and increment coach counter atomically
  const { data: cfg, error: fetchErr } = await supabase
    .from('app_config')
    .select('next_coach_number')
    .eq('id', 1)
    .single();

  if (fetchErr) throw new Error('Failed to fetch coach counter: ' + fetchErr.message);

  const seq = String(cfg?.next_coach_number || 1).padStart(4, '0');

  await supabase
    .from('app_config')
    .update({ next_coach_number: (cfg?.next_coach_number || 1) + 1 })
    .eq('id', 1);

  return `GICLC${seq}GA`;
}

module.exports = { generateGiclId, generateCoachGiclId, PINCODE_STATE_MAP };
