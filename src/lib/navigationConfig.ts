import { toast } from 'sonner';

export type DestinationStatus = 'implemented' | 'external' | 'coming-soon';

export interface NavItemConfig {
  id: string;
  label: string;
  status: DestinationStatus;
  href?: string;
  description?: string;
  comingSoonDetail?: string;
  external?: boolean;
}

export interface NavGroupConfig {
  id: string;
  title: string;
  purpose?: string;
  items: NavItemConfig[];
}

/**
 * Centralized DevForge Navigation Destinations
 * Classifies all destinations into:
 * - 'implemented': functional internal destinations (Studio, Courses view, Philosophy anchor)
 * - 'external': valid verified external links (GitHub)
 * - 'coming-soon': unfinished destinations that trigger an elegant toast
 */

export const EXPLORE_GROUP: NavGroupConfig = {
  id: 'explore',
  title: 'EXPLORE',
  purpose: 'Discover engineering concepts, technical ideas, projects, and practical experiments.',
  items: [
    {
      id: 'architecture',
      label: 'Architecture',
      status: 'coming-soon',
      comingSoonDetail: 'Interactive visual system topologies & distributed system maps are dropping in Q1 2027.',
    },
    {
      id: 'courses',
      label: 'Courses',
      status: 'implemented',
      description: 'Structured educational tracks from first principles.',
    },
    {
      id: 'studio',
      label: 'Studio',
      status: 'implemented',
      description: 'Practical engineering studio & project workspaces.',
    },
  ],
};

export const LEARN_GROUP: NavGroupConfig = {
  id: 'learn',
  title: 'LEARN',
  purpose: 'Help visitors develop technical understanding and practical skills.',
  items: [
    {
      id: 'courses',
      label: 'Courses',
      status: 'implemented',
      description: 'Structured educational tracks from first principles.',
    },
    {
      id: 'learning-paths',
      label: 'Learning Paths',
      status: 'coming-soon',
      comingSoonDetail: 'Curated first-principles roadmaps for systems engineers are in active development.',
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      status: 'coming-soon',
      comingSoonDetail: 'Deep dive code walkthroughs and hands-on implementation guides. Check back soon.',
    },
    {
      id: 'documentation',
      label: 'Documentation',
      status: 'coming-soon',
      comingSoonDetail: 'DevForge core runtime and invariant specification docs are dropping in v1.0.',
    },
  ],
};

export const ABOUT_GROUP: NavGroupConfig = {
  id: 'about',
  title: 'ABOUT DEVFORGE',
  purpose: 'Explain the thinking, principles, and identity behind DevForge.',
  items: [
    {
      id: 'philosophy',
      label: 'Philosophy',
      status: 'implemented',
      href: '#meet-devforge',
      description: 'Why understanding the pieces matters.',
    },
    {
      id: 'about-devforge',
      label: 'About DevForge',
      status: 'coming-soon',
      comingSoonDetail: 'The story, team, and first-principles vision behind DevForge. Check back soon.',
    },
  ],
};

export const CONNECT_GROUP: NavGroupConfig = {
  id: 'connect',
  title: 'CONNECT',
  purpose: 'Provide access to the wider DevForge ecosystem.',
  items: [
    {
      id: 'github',
      label: 'GitHub',
      status: 'external',
      href: 'https://github.com/Jayasuryajonnadula18/devforge',
      external: true,
    },
    {
      id: 'contact',
      label: 'Contact',
      status: 'implemented',
      description: 'Direct contact with Jaya Surya.',
    },
  ],
};

export const ECOSYSTEM_GROUP: NavGroupConfig = {
  id: 'ecosystem',
  title: 'ECOSYSTEM',
  purpose: 'Provide access to the wider DevForge ecosystem.',
  items: [
    {
      id: 'github',
      label: 'GitHub',
      status: 'external',
      href: 'https://github.com/Jayasuryajonnadula18/devforge',
      external: true,
    },
    {
      id: 'community',
      label: 'Community',
      status: 'coming-soon',
      comingSoonDetail: 'DevForge developer community and study cohorts are launching in v1.0.',
    },
    {
      id: 'contact',
      label: 'Contact',
      status: 'implemented',
      description: 'Direct contact with Jaya Surya.',
    },
  ],
};

export const LEGAL_GROUP: NavGroupConfig = {
  id: 'legal',
  title: 'LEGAL',
  items: [
    {
      id: 'privacy',
      label: 'Privacy Policy',
      status: 'coming-soon',
      comingSoonDetail: 'DevForge is strictly local-first and zero-telemetry. Official terms and licensing documentation are in preparation.',
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      status: 'coming-soon',
      comingSoonDetail: 'DevForge open source and educational usage guidelines are in preparation.',
    },
  ],
};

/**
 * Standard Coming Soon Notification
 * Shows destination's name, "Coming soon", and supporting message.
 * Dismissable automatically and via action.
 */
export function triggerComingSoonToast(destinationName: string, detail?: string) {
  toast.info(`${destinationName} — Coming soon`, {
    description: detail || "We're working on this part of DevForge. Check back soon.",
    duration: 3500,
    action: {
      label: 'Dismiss',
      onClick: () => {},
    },
  });
}
