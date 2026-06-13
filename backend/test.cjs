const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('players')
    .select('id, allocated_coach_id, gicl_id, coach:coaches(id, first_name)')
    .eq('gicl_id', 'GICL00011062026MH')
    .limit(1);

  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

test();
