// Experience data type definitions
export interface ExperienceDuty {
    id: string;
    title: string;
    description: string;
    technologies: string[];
}

export interface ExperienceAchievement {
    id: string;
    title: string;
    description: string;
    impact: string;
    technologies: string[];
    images?: { alt: string; src: string }[];
}

export interface ExperienceSystem {
    name: string;
    description: string;
    responsibilities: string[];
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    logo: string | null;
    summary: string;
    duties: ExperienceDuty[];
    achievements: ExperienceAchievement[];
    systems: ExperienceSystem[];
}
