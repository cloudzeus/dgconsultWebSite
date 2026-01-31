export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export interface Sector {
  id: string;
  title: string;
  description: string;
  featuredImage: string | null;
  slug: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  content: string;
  featuredImage: string | null;
  slug: string;
  category: string;
  clientName?: string;
  industry?: string;
  technologies?: string[];
  results?: string;
  challenge?: string;
  solution?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  email: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
