import {createClient} from '@supabase/supabase-js'

const DBurl = import.meta.env.VITE_DBURL
const DBkey = import.meta.env.VITE_DBKEY
const DB = createClient(DBurl , DBkey)
export default DB;