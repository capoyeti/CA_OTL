export interface Template {
  id: string;
  name: string;
  description?: string;
  sections: TemplateSection[];
  created_at: string;
  updated_at: string;
}

export interface TemplateSection {
  id: string;
  template_id: string;
  content: string;
  order: number;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  default_value?: string;
  required: boolean;
}
