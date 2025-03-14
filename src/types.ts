// Shared types definition

export type Member = {
    name: string;
    bio: string;
};

export type Job = {
    title: string;
    location: string;
};

export type TokenizedResult<K> = {
    data: K;
    tokens: Record<string, number>;
};

export type ScoredJob = {
    jobName: Job;
    score: number;
};