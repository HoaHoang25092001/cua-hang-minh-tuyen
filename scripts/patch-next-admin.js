// scripts/patch-next-admin.js
// next-admin v8 declares "@premieroctet/next-admin/schema" in package.json exports
// but dist/schema.cjs and dist/schema.mjs are missing from the published package.
// This script regenerates them from prisma/json-schema/json-schema.json.
//
// Run via:  node scripts/patch-next-admin.js
// Called automatically from:  npm run db:generate  AND  postinstall (if schema exists)
"use strict";
const fs = require("fs");
const path = require("path");

const schemaJsonPath = path.resolve(__dirname, "../prisma/json-schema/json-schema.json");
const outDir = path.resolve(
  __dirname,
  "../node_modules/@premieroctet/next-admin/dist"
);

if (!fs.existsSync(schemaJsonPath)) {
  console.log(
    "[patch-next-admin] prisma/json-schema/json-schema.json not found — skipping. Run `npm run db:generate` first."
  );
  process.exit(0);
}

// ── Enrich schema with __nextadmin metadata ──────────────────────────────────
// next-admin relies on __nextadmin.type / __nextadmin.kind for type coercion
// (e.g. converting form strings to Int/Float/Boolean/DateTime before calling
// Prisma). prisma-json-schema-generator does NOT add these annotations, so we
// add them here based on the standard JSON Schema types.
function enrichWithNextAdmin(schema) {
  const definitions = schema.definitions || {};
  for (const [, model] of Object.entries(definitions)) {
    if (model.enum) continue; // skip enum definitions
    const properties = model.properties || {};
    for (const [propName, prop] of Object.entries(properties)) {
      if (!prop || typeof prop !== "object" || prop.__nextadmin) continue;
      const rawType = Array.isArray(prop.type)
        ? prop.type.find((t) => t !== "null")
        : prop.type;
      // id is the Prisma primary key; createdAt/updatedAt are auto-managed
      const isPrimaryKey = propName === "id";
      const isDisabled = isPrimaryKey || propName === "createdAt" || propName === "updatedAt";

      // ── Scalar fields ──────────────────────────────────────────────────────
      if (rawType === "integer") {
        prop.__nextadmin = { type: "Int", kind: "scalar", primaryKey: isPrimaryKey, disabled: isDisabled };
      } else if (rawType === "number") {
        prop.__nextadmin = { type: "Float", kind: "scalar", primaryKey: isPrimaryKey, disabled: isDisabled };
      } else if (rawType === "boolean") {
        prop.__nextadmin = { type: "Boolean", kind: "scalar", primaryKey: isPrimaryKey, disabled: isDisabled };
      } else if (rawType === "string" && prop.format === "date-time") {
        prop.__nextadmin = { type: "DateTime", kind: "scalar", primaryKey: isPrimaryKey, disabled: isDisabled };
      } else if (rawType === "string") {
        prop.__nextadmin = { type: "String", kind: "scalar", primaryKey: isPrimaryKey, disabled: isDisabled };
      }

      // ── Required single relation: { "$ref": "#/definitions/Model" } ────────
      if (!prop.__nextadmin && prop.$ref && typeof prop.$ref === "string") {
        const relModel = prop.$ref.replace("#/definitions/", "");
        prop.__nextadmin = {
          type: relModel,
          kind: "object",
          isList: false,
          relation: { fromField: propName + "Id", toField: "id" },
        };
      }

      // ── Optional single relation: { "anyOf": [{ "$ref": "..." }, { "type": "null" }] } ──
      // Normalize to plain $ref shape so fillRelationInSchema can delete $ref cleanly.
      if (!prop.__nextadmin && Array.isArray(prop.anyOf)) {
        const refItem = prop.anyOf.find((a) => a && a.$ref);
        if (refItem) {
          const relModel = refItem.$ref.replace("#/definitions/", "");
          // Replace anyOf with $ref so next-admin can handle it identically to required relations
          delete prop.anyOf;
          prop.$ref = refItem.$ref;
          prop.__nextadmin = {
            type: relModel,
            kind: "object",
            isList: false,
            relation: { fromField: propName + "Id", toField: "id" },
          };
        }
      }

      // ── One-to-many array relation: { "type": "array", "items": { "$ref": "..." } } ──
      if (!prop.__nextadmin && rawType === "array" && prop.items && prop.items.$ref) {
        const relModel = prop.items.$ref.replace("#/definitions/", "");
        prop.__nextadmin = { type: relModel, kind: "object", isList: true };
      }
    }
  }
  return schema;
}

const rawSchema = require(schemaJsonPath);
enrichWithNextAdmin(rawSchema);
const schemaJson = JSON.stringify(rawSchema);

const cjs = `'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const schema = ${schemaJson};
exports.default = schema;
module.exports = exports;
`;

const mjs = `const schema = ${schemaJson};
export default schema;
`;

fs.writeFileSync(path.join(outDir, "schema.cjs"), cjs, "utf8");
fs.writeFileSync(path.join(outDir, "schema.mjs"), mjs, "utf8");
console.log("[patch-next-admin] dist/schema.cjs + schema.mjs patched successfully.");

// ── Patch next-themes for React 19 compatibility ────────────────────────────
// React 19 throws "Encountered a script tag while rendering React component"
// when a <script> element is rendered inside a client component during hydration.
// Fix: make the ScriptTag component return null on the client so the script
// only appears in the SSR HTML (where the browser executes it before hydration).
const nextThemesDirs = [
  // root-level (used when override is active)
  path.resolve(__dirname, "../node_modules/next-themes/dist"),
  // nested (used when override is inactive)
  path.resolve(__dirname, "../node_modules/@premieroctet/next-admin/node_modules/next-themes/dist"),
];

const SCRIPT_COMPONENT_ORIGINAL = "storageKey:i,attribute:s,enableSystem:u,enableColorScheme:m,defaultTheme:a,value:l,themes:h,nonce:d,scriptProps:w})=>{let p=";
const SCRIPT_COMPONENT_PATCHED  = "storageKey:i,attribute:s,enableSystem:u,enableColorScheme:m,defaultTheme:a,value:l,themes:h,nonce:d,scriptProps:w})=>{if(typeof window!==\"undefined\")return null;let p=";

// CJS version uses different variable names but same structure
const SCRIPT_COMPONENT_ORIGINAL_CJS = "slice(1,-1);return t.createElement(\"script\"";
const SCRIPT_COMPONENT_PATCHED_CJS  = "slice(1,-1);if(typeof window!==\"undefined\")return null;return t.createElement(\"script\"";

for (const dir of nextThemesDirs) {
  for (const file of ["index.mjs", "index.js"]) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, "utf8");
    const isEsm = file.endsWith(".mjs");
    const original = isEsm ? SCRIPT_COMPONENT_ORIGINAL : SCRIPT_COMPONENT_ORIGINAL_CJS;
    const patched  = isEsm ? SCRIPT_COMPONENT_PATCHED  : SCRIPT_COMPONENT_PATCHED_CJS;
    if (content.includes(patched)) {
      console.log(`[patch-next-admin] next-themes ${file} already patched — skipping.`);
      continue;
    }
    if (!content.includes(original)) {
      console.log(`[patch-next-admin] next-themes ${file}: target string not found (version mismatch?) — skipping.`);
      continue;
    }
    content = content.replace(original, patched);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`[patch-next-admin] next-themes ${file} patched for React 19 compatibility.`);
  }
}

