/*
 * Data for the skeleton examples. Each value has a matching sample: data of the same shape that the
 * skeleton is measured from before the real value arrives. Samples only need representative
 * lengths; their text is never shown.
 */

interface Profile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  avatar: string;
}

const profile: Profile = {
  avatar:
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
  bio: "Designs interfaces for tools that agents and people share. Previously built editors and design systems.",
  handle: "@maya",
  name: "Maya Okafor",
  role: "Design engineer",
};

const sampleProfile: Profile = {
  avatar: "",
  bio: "A two-line biography of roughly the same length as the real one, so the skeleton wraps alike.",
  handle: "@handle",
  name: "Full Name",
  role: "Role title",
};

interface Article {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readingTime: string;
  tags: string[];
}

const article: Article = {
  author: "Maya Okafor",
  date: "Nov 12",
  excerpt:
    "A skeleton that guesses the layout moves the page twice: once when it appears and again when the content replaces it. Measuring the content itself removes both.",
  readingTime: "6 min read",
  tags: ["Design systems", "Loading"],
  title: "Loading states that do not move",
};

const sampleArticle: Article = {
  author: "Author Name",
  date: "Mon 00",
  excerpt:
    "An excerpt of about the same length as a real one, so the skeleton has the same number of lines as the text that replaces it in this card.",
  readingTime: "0 min read",
  tags: ["Tag one", "Tag"],
  title: "A title of typical length",
};

const paragraphs = [
  "Skeletons are measured from the content they stand in for. While data loads, the content is rendered from a sample and laid out unseen, then drawn as one bar for each line of text and one block for each image or control.",
  "Because the skeleton has the content’s exact size, the reveal moves nothing. Lines wrap where the real lines will wrap, headings keep their height, and controls keep their shape.",
];

const sampleParagraphs = [
  "A paragraph of sample text that is about as long as the first real paragraph, so it wraps onto the same number of lines at this width and the skeleton takes the same space as the text.",
  "A second paragraph of sample text, a little shorter than the first, standing in for the real one while it loads.",
];

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  avatar: string;
}

const members: Member[] = [
  {
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "maya@example.com",
    id: "1",
    name: "Maya Okafor",
    role: "Owner",
  },
  {
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "leo@example.com",
    id: "2",
    name: "Leo Brandt",
    role: "Admin",
  },
  {
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop",
    email: "sana@example.com",
    id: "3",
    name: "Sana Rahimi",
    role: "Member",
  },
];

const sampleMembers: Member[] = members.map((member, index) => ({
  ...member,
  avatar: "",
  email: "name@example.com",
  id: `sample-${index}`,
  name: "Member Name",
}));

interface Preferences {
  displayName: string;
  email: string;
  language: string;
  weeklyDigest: boolean;
  mentions: boolean;
}

const preferences: Preferences = {
  displayName: "Maya Okafor",
  email: "maya@example.com",
  language: "en",
  mentions: false,
  weeklyDigest: true,
};

const samplePreferences: Preferences = {
  displayName: "Display name",
  email: "name@example.com",
  language: "en",
  mentions: true,
  weeklyDigest: true,
};

interface Settings {
  timezone: string;
  securityAlerts: boolean;
  productUpdates: boolean;
}

const settings: Settings = {
  productUpdates: false,
  securityAlerts: true,
  timezone: "Europe/Berlin",
};

const sampleSettings: Settings = {
  productUpdates: true,
  securityAlerts: true,
  timezone: "Europe/Berlin",
};

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const sessions: Session[] = [
  {
    current: true,
    device: "Safari on macOS",
    id: "1",
    lastActive: "Active now",
    location: "Berlin, Germany",
  },
  {
    current: false,
    device: "Erbium for iOS",
    id: "2",
    lastActive: "2 hours ago",
    location: "Berlin, Germany",
  },
  {
    current: false,
    device: "Chrome on Windows",
    id: "3",
    lastActive: "Nov 2",
    location: "Lisbon, Portugal",
  },
];

const sampleSessions: Session[] = sessions.map((session, index) => ({
  ...session,
  device: "Browser on System",
  id: `sample-${index}`,
  lastActive: "Some time ago",
  location: "City, Country",
}));

export {
  article,
  members,
  paragraphs,
  preferences,
  profile,
  sampleArticle,
  sampleMembers,
  sampleParagraphs,
  samplePreferences,
  sampleProfile,
  sampleSessions,
  sampleSettings,
  sessions,
  settings,
};

export type { Article, Member, Preferences, Profile, Session, Settings };
