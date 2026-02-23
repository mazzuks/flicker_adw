/**
 * TEMPLETERIA SCHEMA V1 CONTRACT
 * Standard definition for first-generation declarative sites.
 */

export type TempleteriaSchemaV1 = {
  schema_version: 1;
  metadata: {
    title: string;
    description: string;
  };
  theme: {
    primaryColor: string;
    font: string;
  };
  pages: {
    id: string;
    title?: string;
    blocks: Array<{
      id?: string;
      type: string;
      props: any;
    }>;
  }[];
};

export function validateSchemaV1(input: any): { ok: boolean; normalized?: TempleteriaSchemaV1; errors?: string[] } {
  const errors: string[] = [];
  
  if (!input) return { ok: false, errors: ['Input is null'] };
  
  // Minimal normalization
  const normalized: TempleteriaSchemaV1 = {
    schema_version: 1,
    metadata: {
      title: input.metadata?.title || 'Novo Site',
      description: input.metadata?.description || ''
    },
    theme: {
      primaryColor: input.theme?.primaryColor || '#2563eb',
      font: input.theme?.font || 'Inter'
    },
    pages: Array.isArray(input.pages) ? input.pages.map((p: any) => ({
      id: p.id || 'home',
      title: p.title || 'Home',
      blocks: Array.isArray(p.blocks) ? p.blocks : []
    })) : [{ id: 'home', title: 'Home', blocks: [] }]
  };

  return { ok: true, normalized };
}
