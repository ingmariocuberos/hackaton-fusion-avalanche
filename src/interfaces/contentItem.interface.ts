export interface ContentItem {
  title: string;
  items: {
    title: string;
    description: string;
    content: string[];
  }[];
}