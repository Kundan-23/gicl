const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase
    .from('players')
    .select('id, coach:coaches(id, first_name, last_name, email, gicl_id, phone, whatsapp, profile_photo_url, city, state, experience, expertise, bio)')
    .eq('first_name', 'Kundan')
    .limit(1);

  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

test();
