export type Project = {
  slug: string;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
};

export const projects: Project[] = [
  {
    slug: "fintech-dashboard",
    title: "FinTech Dashboard",
    category: "Web Application",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tags: ["React", "TypeScript", "D3.js"],
    description:
      "A comprehensive financial visualization tool for high-frequency trading firms.",
  },
  {
    slug: "healthtrack-mobile",
    title: "HealthTrack Mobile",
    category: "iOS & Android",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    tags: ["React Native", "Node.js"],
    description:
      "Patient monitoring application connecting bluetooth vitals sensors to cloud EHR.",
  },
  {
    slug: "ecommerce-scale",
    title: "E-Commerce Scale",
    category: "Cloud Infrastructure",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
    tags: ["AWS", "Docker", "Redis"],
    description:
      "Microservices architecture migration for a retailer handling 100k+ daily transactions.",
  },
  {
    slug: "social-connect",
    title: "Social Connect",
    category: "Social Platform",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    tags: ["Next.js", "Supabase"],
    description:
      "A community platform focused on privacy-first interactions and encrypted messaging.",
  },
  {
    slug: "logistics-ai",
    title: "Logistics AI",
    category: "Enterprise Tool",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    tags: ["Python", "TensorFlow", "React"],
    description:
      "Route optimization engine reducing delivery times by 24% for a national fleet.",
  },
  {
    slug: "crypto-wallet",
    title: "Crypto Wallet",
    category: "Web3",
    image:
      "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800",
    tags: ["Solidity", "Web3.js"],
    description:
      "Non-custodial wallet implementation supporting ERC-20 tokens and NFT collections.",
  },
];

export const posts: Post[] = [
  {
    slug: "react-server-components",
    title: "The Future of React Server Components",
    excerpt:
      "Why we are moving our client projects to Next.js 14 and what it means for performance.",
    date: "Oct 12, 2024",
    readTime: "5 min read",
    category: "Engineering",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    content: `
            <p>React Server Components (RSC) represent a paradigm shift in how we build React applications. By moving the component rendering logic to the server, we can significantly reduce the amount of JavaScript sent to the client.</p>
            <h3>Why it matters</h3>
            <p>Performance is king in the mobile-first world. RSC allows us to directly access backend resources like databases and filesystems without adding abstraction layers or API endpoints for every piece of data.</p>
            <h3>Our Transition</h3>
            <p>At NativeSquare, we've started migrating our core client dashboard projects to Next.js 14 to leverage these capabilities. The results have been promising: a 30% reduction in First Contentful Paint (FCP) and a drastically smaller bundle size.</p>
        `,
  },
  {
    slug: "accessibility-first",
    title: "Designing for Accessibility First",
    excerpt:
      "How inclusive design improves the user experience for everyone, not just those with disabilities.",
    date: "Oct 08, 2024",
    readTime: "4 min read",
    category: "Design",
    image:
      "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&q=80&w=800",
    content: `
            <p>Accessibility (a11y) is often treated as an afterthought or a compliance checkbox. We believe it should be a fundamental constraint of the design process.</p>
            <h3>Contrast and Typography</h3>
            <p>It starts with the basics. Ensuring sufficient color contrast ratios and legible type sizes helps everyone, including users in bright sunlight or those with screen fatigue.</p>
            <h3>Semantic HTML</h3>
            <p>Using the correct HTML tags isn't just about code purity; it ensures that screen readers can navigate the application logically. Buttons should be buttons, not divs with click handlers.</p>
        `,
  },
  {
    slug: "scaling-mobile-apps",
    title: "Scaling Mobile Apps to 1M Users",
    excerpt:
      "Lessons learned from handling rapid growth on a recent fintech project.",
    date: "Sep 28, 2024",
    readTime: "8 min read",
    category: "Case Study",
    image:
      "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800",
    content: `
            <p>Scaling is a good problem to have, but it's a problem nonetheless. When one of our fintech clients hit the viral jackpot, our infrastructure had to keep up.</p>
            <h3>Database Bottlenecks</h3>
            <p>The first thing to break was the database. Read replicas were essential, but we also had to implement aggressive caching strategies using Redis to offload common queries.</p>
            <h3>Load Balancing</h3>
            <p>We transitioned from a simple load balancer to a more sophisticated geo-distributed setup to reduce latency for users across different continents.</p>
        `,
  },
];

