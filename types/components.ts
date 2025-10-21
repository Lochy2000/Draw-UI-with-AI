// Component types for the website builder

export type ComponentType =
  | 'header'
  | 'hero'
  | 'text'
  | 'button'
  | 'image'
  | 'container'
  | 'navbar'
  | 'footer'
  | 'form'
  | 'input'
  | 'textarea'
  | 'grid'
  | 'card'
  | 'section';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link';
export type ContainerVariant = 'full' | 'container' | 'narrow';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  children?: BaseComponent[];
  styles?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    [key: string]: string | undefined;
  };
}

export interface HeaderComponent extends BaseComponent {
  type: 'header';
  text: string;
  variant: TextVariant;
}

export interface HeroComponent extends BaseComponent {
  type: 'hero';
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
  variant: TextVariant;
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  text: string;
  variant: ButtonVariant;
  link?: string;
  onClick?: string; // JavaScript code
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface ContainerComponent extends BaseComponent {
  type: 'container';
  variant: ContainerVariant;
  layout?: 'flex' | 'grid';
  children: BaseComponent[];
}

export interface NavbarComponent extends BaseComponent {
  type: 'navbar';
  logo?: string;
  links: { text: string; href: string }[];
}

export interface FooterComponent extends BaseComponent {
  type: 'footer';
  content: string;
  links?: { text: string; href: string }[];
}

export interface FormComponent extends BaseComponent {
  type: 'form';
  fields: FormField[];
  submitText: string;
  action?: string;
}

export interface InputComponent extends BaseComponent {
  type: 'input';
  label: string;
  placeholder?: string;
  inputType: 'text' | 'email' | 'password' | 'number' | 'tel';
  required?: boolean;
}

export interface TextareaComponent extends BaseComponent {
  type: 'textarea';
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export interface GridComponent extends BaseComponent {
  type: 'grid';
  columns: number;
  gap?: string;
  children: BaseComponent[];
}

export interface CardComponent extends BaseComponent {
  type: 'card';
  title?: string;
  content: string;
  image?: string;
  link?: string;
}

export interface SectionComponent extends BaseComponent {
  type: 'section';
  title?: string;
  children: BaseComponent[];
}

export type WebsiteComponent =
  | HeaderComponent
  | HeroComponent
  | TextComponent
  | ButtonComponent
  | ImageComponent
  | ContainerComponent
  | NavbarComponent
  | FooterComponent
  | FormComponent
  | InputComponent
  | TextareaComponent
  | GridComponent
  | CardComponent
  | SectionComponent;

export interface FormField {
  type: 'input' | 'textarea' | 'select' | 'checkbox';
  label: string;
  name: string;
  required?: boolean;
  options?: string[]; // for select
}

// AI Analysis types
export interface SketchAnalysis {
  layout: LayoutAnalysis;
  components: ComponentSuggestion[];
  hierarchy: string; // Description of visual hierarchy
  colorScheme?: string[];
}

export interface LayoutAnalysis {
  type: 'single-column' | 'two-column' | 'grid' | 'complex';
  sections: {
    type: string;
    bounds: { x: number; y: number; width: number; height: number };
    description: string;
  }[];
  gridColumns?: number;
}

export interface ComponentSuggestion {
  suggestedType: ComponentType;
  confidence: number; // 0-1
  bounds: { x: number; y: number; width: number; height: number };
  properties: Partial<WebsiteComponent>;
  reasoning: string; // Why this component was suggested
  alternatives?: ComponentType[]; // Other possible interpretations
}

export interface AIAgent {
  name: string;
  analyze: (input: any) => Promise<any>;
}
