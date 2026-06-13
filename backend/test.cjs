const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('app_config')
    .update({ referral_level1_active: true })
    .eq('id', 1);

  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

test();
