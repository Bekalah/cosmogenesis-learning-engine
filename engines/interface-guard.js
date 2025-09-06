// Validates incoming JSON against minimal interface schema; soft-fail to protect runtime.
export async function validateInterface(payload, schemaUrl="/assets/data/interface.schema.json"){
  try{
    const [schema, AjvMod] = await Promise.all([
      fetch(schemaUrl).then(r=>r.json()),
      import("ajv").catch(async()=>{
        const txt = await fetch("https://cdn.skypack.dev/ajv@8?min").then(r=>r.text());
        return import(`data:text/javascript,${encodeURIComponent(txt)}`);
      })
    ]);
    const ajv = new AjvMod.default({allErrors:true, strict:false});
    const valid = ajv.validate(schema, payload);
    return {valid, errors: ajv.errors||[]};
  }catch(e){ return {valid:false, errors:[{message:e.message}]}; }
}
