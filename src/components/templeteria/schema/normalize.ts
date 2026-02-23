import { TempleteriaSchemaV1, validateSchemaV1 } from './contracts/v1';

/**
 * SCHEMA NORMALIZER
 * Ensures the renderer always receives a valid, versioned structure.
 */

export type NormalizedSchema = TempleteriaSchemaV1;

export function normalizeTempleteriaSchema(input: any): NormalizedSchema {
  // 1. Identify Version
  const version = input?.schema_version || 1;

  switch (version) {
    case 1:
      const validation = validateSchemaV1(input);
      if (validation.ok && validation.normalized) {
        return validation.normalized;
      }
      break;
    default:
      console.warn(`Unsupported schema version: ${version}. Falling back to V1.`);
  }

  // 2. Ultimate Fallback (Emergency Schema)
  return {
    schema_version: 1,
    metadata: { title: 'Erro de Carregamento', description: '' },
    theme: { primaryColor: '#ef4444', font: 'Inter' },
    pages: [{
      id: 'home',
      blocks: [{ 
        type: 'hero', 
        props: { 
          headline: 'Ops! Ocorreu um problema no schema.', 
          content: 'O motor de renderizacao nao conseguiu interpretar os dados deste site.' 
        } 
      }]
    }]
  };
}
