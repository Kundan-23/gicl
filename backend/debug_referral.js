require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debug() {
  const { data: players } = await sb
    .from('players')
    .select('id, first_name, last_name, email, referral_code, referred_by_id, referral_balance, payment_status, gicl_id')
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('\n=== ALL PLAYERS ===');
  players?.forEach(p => {
    const refProblem = !p.referred_by_id && p.first_name ? ' <-- NO REFERRER SET' : '';
    console.log('[' + p.gicl_id + '] ' + p.first_name + ' ' + p.last_name);
    console.log('  referral_code:  ' + p.referral_code);
    console.log('  referred_by_id: ' + (p.referred_by_id || 'NULL' + refProblem));
    console.log('  referral_bal:   Rs.' + p.referral_balance);
    console.log('  payment:        ' + p.payment_status);
    console.log('');
  });

  // Find Kundan with GICL-4753
  const kundan = players?.find(p => p.referral_code === 'GICL-4753');
  if (kundan) {
    console.log('=== KUNDAN (referrer) ID: ' + kundan.id + ' ===');
    const { data: referred } = await sb
      .from('players')
      .select('first_name, last_name, referred_by_id, payment_status')
      .eq('referred_by_id', kundan.id);
    console.log('Players referred by Kundan: ' + (referred?.length || 0));
    referred?.forEach(r => console.log(' - ' + r.first_name + ' ' + r.last_name + ' | paid: ' + r.payment_status));
  }

  // Check referral_transactions
  const { data: txns, error: txnErr } = await sb
    .from('referral_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (txnErr) {
    console.log('\nreferral_transactions error: ' + txnErr.message);
  } else {
    console.log('\n=== REFERRAL TRANSACTIONS (' + (txns?.length || 0) + ' rows) ===');
    if (!txns?.length) console.log('EMPTY -- no transactions recorded!');
    txns?.forEach(t => console.log(JSON.stringify(t)));
  }

  // Check payment_orders for Pranav
  const pranav = players?.find(p => p.first_name && p.first_name.toLowerCase().includes('pranav'));
  if (pranav) {
    console.log('\n=== PRANAV: ' + pranav.first_name + ' ===');
    console.log('  referred_by_id: ' + (pranav.referred_by_id || 'NULL -- referral was NEVER SAVED'));
    console.log('  payment_status: ' + pranav.payment_status);
  }
}
debug().catch(console.error);
