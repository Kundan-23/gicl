require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
  console.log('\n=== STEP 1: Check referrals table columns ===');
  const { data: testRef, error: refErr } = await sb
    .from('referrals')
    .select('id, referrer_id, referred_id, level, amount_earned')
    .limit(1);
  if (refErr) {
    console.log('referrals table error:', refErr.message);
  } else {
    console.log('referrals table OK, cols: id, referrer_id, referred_id, level, amount_earned');
  }

  console.log('\n=== STEP 2: Find Kundan and Pranav ===');
  const { data: kundan } = await sb
    .from('players')
    .select('id, first_name, last_name, referral_code, referral_balance')
    .ilike('first_name', '%kundan%')
    .single();
  
  const { data: pranav } = await sb
    .from('players')
    .select('id, first_name, last_name, referred_by_id, payment_status')
    .ilike('first_name', '%pranav%')
    .single();

  console.log('Kundan:', kundan?.first_name, kundan?.last_name, '| code:', kundan?.referral_code, '| balance: Rs.' + kundan?.referral_balance);
  console.log('Pranav:', pranav?.first_name, pranav?.last_name, '| paid:', pranav?.payment_status, '| referred_by_id:', pranav?.referred_by_id || 'NULL');

  if (!kundan || !pranav) {
    console.log('ERROR: Could not find one or both players!');
    return;
  }

  console.log('\n=== STEP 3: Set Pranavs referred_by_id to Kundan ===');
  const { error: linkErr } = await sb
    .from('players')
    .update({ referred_by_id: kundan.id })
    .eq('id', pranav.id);
  
  if (linkErr) {
    console.log('ERROR linking:', linkErr.message);
    return;
  }
  console.log('Linked Pranav -> Kundan');

  console.log('\n=== STEP 4: Credit Kundan Rs.50 referral bonus ===');
  const currentBalance = kundan.referral_balance || 0;
  const newBalance = currentBalance + 50;
  const { error: balErr } = await sb
    .from('players')
    .update({ referral_balance: newBalance })
    .eq('id', kundan.id);
  
  if (balErr) {
    console.log('ERROR updating balance:', balErr.message);
  } else {
    console.log('Kundan balance: Rs.' + currentBalance + ' -> Rs.' + newBalance);
  }

  console.log('\n=== STEP 5: Insert referral record ===');
  const { error: refInsertErr } = await sb
    .from('referrals')
    .insert({
      referrer_id:   kundan.id,
      referred_id:   pranav.id,
      level:         1,
      amount_earned: 50,
    });

  if (refInsertErr) {
    console.log('ERROR inserting referral record:', refInsertErr.message);
    // Try without level and amount_earned (old schema)
    const { error: refInsertErr2 } = await sb
      .from('referrals')
      .insert({ referrer_id: kundan.id, referred_id: pranav.id });
    if (refInsertErr2) {
      console.log('ERROR (fallback):', refInsertErr2.message);
    } else {
      console.log('Referral record inserted (basic)');
    }
  } else {
    console.log('Referral record inserted with level=1, amount=Rs.50');
  }

  console.log('\n=== FINAL STATE ===');
  const { data: kUpdated } = await sb.from('players').select('referral_balance').eq('id', kundan.id).single();
  const { data: pUpdated } = await sb.from('players').select('referred_by_id').eq('id', pranav.id).single();
  console.log('Kundan balance now: Rs.' + kUpdated?.referral_balance);
  console.log('Pranav referred_by_id:', pUpdated?.referred_by_id);
  console.log('\nDONE - Kundan should now see Rs.50 in his referral balance.');
}

fix().catch(console.error);
