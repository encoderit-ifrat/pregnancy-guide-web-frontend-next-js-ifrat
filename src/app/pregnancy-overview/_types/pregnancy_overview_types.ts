import {Article} from "@/types/shared";

export type Baby = {
    upcoming: boolean;
    start_week_date: string | null;
    name: string | null;
};

export type UserProfile = {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    avatar?: string | null;
    dob: string;
    gender: "male" | "female" | "other";
    details?: {
        current_pregnancy_week: number | null;
        current_pregnancy_data?: {
            week: number;
            day: number;
            percentage: number;
        }
        due_date: string | null;
        last_period_date: string | null;
        family_name?: string;
        partner_name?: string;
        babies?: Baby[];
    };
};

export type WeeklyDetails = {
    _id: string;
    title: string;
    description: string;
    week: number;
};

export type Question = {
    _id: string;
    question: string;
    answer?: string;
    week: number;
};

export type ChecklistItem = {
    _id: string;
    title: string;
    description: string;
    week: number;
    is_completed: boolean;
};

export type Checklist = {
    _id: string;
    title: string;
    description: string;
    category: string;
    items: ChecklistItem[];
    is_active: boolean;
};

export type ArticlesData = {
    latest: Article[];
    popularWeek: Article[];
    specialArticle: Article[];
    bannerArticle: Article[];
    weeklyArticles: Article[];
};

export type QuestionsData = {
    data: Question[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type ChecklistData = {
    data: Checklist[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type PregnancyOverviewData = {
    articles: ArticlesData;
    questions: QuestionsData;
    checklist: ChecklistData;
    weeklyDetails: WeeklyDetails;
    userProfile: UserProfile;
};

export type PregnancyOverviewProps = {
    pregnancyData: PregnancyOverviewData;
};
