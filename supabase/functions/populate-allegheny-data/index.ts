import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey)
    const { offset = 0 } = await req.json()
    const batchSize = 500

    const apiResponse = await fetch('https://data.wprdc.org/api/3/action/datastore_search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource_id: '65855e14-549e-4992-b5be-d629afc676fa',
        limit: batchSize,
        offset: offset
      })
    })

    const data = await apiResponse.json()
    const records = data.result?.records || []
    
    if (records.length === 0) {
      return new Response(JSON.stringify({ success: true, count: 0, hasMore: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const properties = records.map((r: any) => ({
      parid: r.PARID || null,
      propertyfraction: r.PROPERTYFRACTION || null,
      propertyaddress: r.PROPERTYADDRESS || null,
      propertycity: r.PROPERTYCITY || null,
      propertystate: r.PROPERTYSTATE || null,
      propertyunit: r.PROPERTYUNIT || null,
      propertyzip: r.PROPERTYZIP || null,
      municode: r.MUNICODE || null,
      munidesc: r.MUNIDESC || null,
      schoolcode: r.SCHOOLCODE || null,
      schooldesc: r.SCHOOLDESC || null,
      legal1: r.LEGAL1 || null,
      legal2: r.LEGAL2 || null,
      legal3: r.LEGAL3 || null,
      neighcode: r.NEIGHCODE || null,
      neighdesc: r.NEIGHDESC || null,
      taxcode: r.TAXCODE || null,
      taxdesc: r.TAXDESC || null,
      taxsubcode: r.TAXSUBCODE || null,
      taxsubcode_desc: r.TAXSUBCODE_DESC || null,
      ownercode: r.OWNERCODE || null,
      ownerdesc: r.OWNERDESC || null,
      class: r.CLASS || null,
      classdesc: r.CLASSDESC || null,
      usecode: r.USECODE || null,
      usedesc: r.USEDESC || null,
      lotarea: r.LOTAREA || null,
      homesteadflag: r.HOMESTEADFLAG || null,
      cleangreen: r.CLEANGREEN || null,
      farmsteadflag: r.FARMSTEADFLAG || null,
      abatementflag: r.ABATEMENTFLAG || null,
      recorddate: r.RECORDDATE || null,
      saledate: r.SALEDATE || null,
      saleprice: r.SALEPRICE || null,
      salecode: r.SALECODE || null,
      saledesc: r.SALEDESC || null,
      deedbook: r.DEEDBOOK || null,
      deedpage: r.DEEDPAGE || null,
      prevsaledate: r.PREVSALEDATE || null,
      prevsaleprice: r.PREVSALEPRICE || null,
      prevsaledate2: r.PREVSALEDATE2 || null,
      prevsaleprice2: r.PREVSALEPRICE2 || null,
      changenoticeaddress1: r.CHANGENOTICEADDRESS1 || null,
      changenoticeaddress2: r.CHANGENOTICEADDRESS2 || null,
      changenoticeaddress3: r.CHANGENOTICEADDRESS3 || null,
      changenoticeaddress4: r.CHANGENOTICEADDRESS4 || null,
      countybuilding: r.COUNTYBUILDING || null,
      countyland: r.COUNTYLAND || null,
      countytotal: r.COUNTYTOTAL || null,
      countyexemptbldg: r.COUNTYEXEMPTBLDG || null,
      localbuilding: r.LOCALBUILDING || null,
      localland: r.LOCALLAND || null,
      localtotal: r.LOCALTOTAL || null,
      fairmarketbuilding: r.FAIRMARKETBUILDING || null,
      fairmarketland: r.FAIRMARKETLAND || null,
      fairmarkettotal: r.FAIRMARKETTOTAL || null,
      style: r.STYLE || null,
      styledesc: r.STYLEDESC || null,
      stories: r.STORIES || null,
      yearblt: r.YEARBLT || null,
      exteriorfinish: r.EXTERIORFINISH || null,
      extfinish_desc: r.EXTFINISH_DESC || null,
      roof: r.ROOF || null,
      roofdesc: r.ROOFDESC || null,
      basement: r.BASEMENT || null,
      basementdesc: r.BASEMENTDESC || null,
      grade: r.GRADE || null,
      gradedesc: r.GRADEDESC || null,
      condition: r.CONDITION || null,
      conditiondesc: r.CONDITIONDESC || null,
      cdu: r.CDU || null,
      cdudesc: r.CDUDESC || null,
      totalrooms: r.TOTALROOMS || null,
      bedrooms: r.BEDROOMS || null,
      fullbaths: r.FULLBATHS || null,
      halfbaths: r.HALFBATHS || null,
      heatingcooling: r.HEATINGCOOLING || null,
      heatingcoolingdesc: r.HEATINGCOOLINGDESC || null,
      fireplaces: r.FIREPLACES || null,
      bsmgarage: r.BSMGARAGE || null,
      finishedlivingarea: r.FINISHEDLIVINGAREA || null,
      cardnumber: r.CARDNUMBER || null,
      alt_id: r.ALT_ID || null,
      taxyear: r.TAXYEAR || null,
      asofdate: r.ASOFDATE || null
    }))

    let totalInserted = 0
    for (let i = 0; i < properties.length; i += 100) {
      const chunk = properties.slice(i, i + 100)
      const { error } = await supabaseClient.from('properties').upsert(chunk, { onConflict: 'parid' })
      if (!error) totalInserted += chunk.length
    }

    return new Response(JSON.stringify({
      success: true,
      count: totalInserted,
      hasMore: records.length === batchSize
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})