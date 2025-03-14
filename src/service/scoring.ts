import {Job, Member, ScoredJob, TokenizedResult} from "../types";

export function scoreJobsForMember(
    memberTokens: TokenizedResult<Member>,
    allJobTokens: TokenizedResult<Job>[]
): ScoredJob[] {
    // Array to store the scored jobs
    const scoredJobs: ScoredJob[] = [];

    // Loop through each job and calculate the score
    allJobTokens.forEach((jobToken) => {
        let totalScore = 0;

        // Compare each member token to the job tokens
        for (const [memberToken, memberScore] of Object.entries(memberTokens.tokens)) {
            if (jobToken.tokens[memberToken]) {
                // Multiply the member score and job token score for a match
                totalScore += memberScore * jobToken.tokens[memberToken];
            }
        }

        if (totalScore > 1) {
            scoredJobs.push({
                jobName: jobToken.data,
                score: totalScore,
            });
        }
        
    });

    scoredJobs.sort((a, b) => b.score - a.score);
    return scoredJobs;
}

