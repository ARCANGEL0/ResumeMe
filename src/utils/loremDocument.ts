import type { CVData, CVSection, PersonalInfo } from '../types/cv';

let loremId = 0;
const id = (prefix: string) => `lorem-${prefix}-${++loremId}`;

const LOREM_PHOTO =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#cfd8e6"/>
          <stop offset="1" stop-color="#9aa9c0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="320" fill="url(#bg)"/>
      <circle cx="160" cy="126" r="58" fill="#5f6f88"/>
      <path d="M40 320c0-66 54-104 120-104s120 38 120 104z" fill="#5f6f88"/>
    </svg>`,
  );

const personalInfo: PersonalInfo = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (415) 555-0132',
  location: 'San Francisco, CA',
  summary:
    'Senior product engineer with nine years of experience building and scaling web platforms. Leads small teams, owns delivery end to end, and keeps a strong bias toward measurable outcomes over process. Comfortable moving between architecture, hands-on implementation, and stakeholder communication.',
  photo: LOREM_PHOTO,
  dateOfBirth: '1991-04-17',
  socials: [
    { id: id('social'), platform: 'linkedin', value: 'https://linkedin.com/in/johndoe' },
    { id: id('social'), platform: 'github', value: 'https://github.com/johndoe' },
    { id: id('social'), platform: 'website', value: 'https://johndoe.dev' },
    { id: id('social'), platform: 'discord', value: 'johndoe' },
  ],
};

const sections: CVSection[] = [
  {
    id: id('section'),
    type: 'experience',
    title: 'Experience',
    entries: [
      {
        id: id('entry'),
        fields: {
          company: 'Northwind Systems',
          position: 'Principal Engineer',
          startDate: '2022-03',
          endDate: '',
          isCurrent: 'true',
          description:
            'Own the checkout platform serving 4M monthly transactions.\nCut p95 latency from 820ms to 240ms by reworking the pricing pipeline.\nMentor six engineers and run the architecture review board.',
        },
      },
      {
        id: id('entry'),
        fields: {
          company: 'Vertex Labs',
          position: 'Senior Software Engineer',
          startDate: '2019-01',
          endDate: '2022-02',
          description:
            'Led the migration of a monolith to eight domain services with zero downtime.\nIntroduced contract testing, dropping integration defects by 61%.\nShipped the public API used by 300+ partner integrations.',
        },
      },
      {
        id: id('entry'),
        fields: {
          company: 'Bluepeak Digital',
          position: 'Software Engineer',
          startDate: '2016-06',
          endDate: '2018-12',
          description:
            'Built the internal analytics suite adopted by every product team.\nAutomated the release pipeline, taking deploys from weekly to daily.',
        },
      },
    ],
  },
  {
    id: id('section'),
    type: 'education',
    title: 'Education',
    entries: [
      {
        id: id('entry'),
        fields: {
          institution: 'University of California, Berkeley',
          degree: 'B.Sc. Computer Science',
          startDate: '2012-09',
          endDate: '2016-05',
        },
      },
      {
        id: id('entry'),
        fields: {
          institution: 'Stanford Continuing Studies',
          degree: 'Distributed Systems Certificate',
          startDate: '2020-01',
          endDate: '2020-11',
        },
      },
    ],
  },
  {
    id: id('section'),
    type: 'skills',
    title: 'Skills',
    entries: [
      { id: id('entry'), fields: { name: 'TypeScript', level: '5' } },
      { id: id('entry'), fields: { name: 'React', level: '5' } },
      { id: id('entry'), fields: { name: 'Node.js', level: '4' } },
      { id: id('entry'), fields: { name: 'PostgreSQL', level: '4' } },
      { id: id('entry'), fields: { name: 'Kubernetes', level: '3' } },
      { id: id('entry'), fields: { name: 'Go', level: '3' } },
    ],
  },
  {
    id: id('section'),
    type: 'languages',
    title: 'Languages',
    entries: [
      { id: id('entry'), fields: { language: 'English', proficiency: 'native' } },
      { id: id('entry'), fields: { language: 'Spanish', proficiency: 'fluent' } },
      { id: id('entry'), fields: { language: 'Portuguese', proficiency: 'intermediate' } },
    ],
  },
  {
    id: id('section'),
    type: 'projects',
    title: 'Projects',
    entries: [
      {
        id: id('entry'),
        fields: {
          name: 'Orbit',
          description: 'Open-source scheduling engine for distributed cron workloads, 3.2k stars.',
          url: 'https://github.com/johndoe/orbit',
          technologies: 'Go, Redis, gRPC',
        },
      },
      {
        id: id('entry'),
        fields: {
          name: 'Paperless',
          description: 'Offline-first document signing app used by 12k small businesses.',
          url: 'https://paperless.example.com',
          technologies: 'React, IndexedDB, WebCrypto',
        },
      },
    ],
  },
  {
    id: id('section'),
    type: 'certifications',
    title: 'Certifications',
    entries: [
      {
        id: id('entry'),
        fields: {
          name: 'AWS Solutions Architect – Professional',
          issuer: 'Amazon Web Services',
          date: '2023-08',
          url: 'https://aws.amazon.com/certification',
        },
      },
      {
        id: id('entry'),
        fields: {
          name: 'Certified Kubernetes Administrator',
          issuer: 'Cloud Native Computing Foundation',
          date: '2021-04',
          url: '',
        },
      },
    ],
  },
  {
    id: id('section'),
    type: 'custom',
    title: 'Awards & Volunteering',
    entries: [
      {
        id: id('entry'),
        fields: {
          title: 'Engineering Excellence Award',
          description: 'Northwind Systems, 2024 — for the checkout platform rebuild.',
        },
      },
      {
        id: id('entry'),
        fields: {
          title: 'Mentor, Code the Bay',
          description: 'Weekly mentoring for career-changing developers since 2021.',
        },
      },
    ],
  },
];

export function createLoremDocument(): CVData {
  return JSON.parse(
    JSON.stringify({ personalInfo, sections, selectedTemplate: 'modern' } satisfies CVData),
  ) as CVData;
}
