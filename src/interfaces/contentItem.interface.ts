export interface ContentItem {
  title: string;
  items: {
    title: string;
    description: string;
    content: string[];
  }[];
}

export interface Subcategory {
  title: string;
  description: string;
  content: string[];
}

export interface Category {
  title: string;
  items: Subcategory[];
}

export interface Incentive {
  label: string;
  value: string;
}