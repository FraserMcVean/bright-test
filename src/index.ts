import {jobTokeniser, memberTokeniser} from "./service/tokeniser";
import {Job, Member, ScoredJob, TokenizedResult} from "./types";
import {scoreJobsForMember} from "./service/scoring";


// Fetch members from the API and pass them to the member tokeniser
async function fetchAndTokenizeMembers(): Promise<TokenizedResult<Member>[]> {
    const membersResponse = await fetch('https://bn-hiring-challenge.fly.dev/members.json');
    const members: Member[] = await membersResponse.json();

    return members.map(memberTokeniser);
}

// Fetch jobs from the API and pass them to the job tokeniser
async function fetchAndTokenizeJobs(): Promise<TokenizedResult<Job>[]> {
    const jobsResponse = await fetch('https://bn-hiring-challenge.fly.dev/jobs.json');
    const jobs: Job[] = await jobsResponse.json();

    return jobs.map(jobTokeniser);
}

// Process all members and jobs, and map jobs to scores for each member
async function processAndScore(): Promise<Map<string, ScoredJob[]>> {
    const [membersTokens, jobsTokens] = await Promise.all([fetchAndTokenizeMembers(), fetchAndTokenizeJobs()]);

    const result = new Map<string, ScoredJob[]>();

    for (const member of membersTokens) {
        const scoredJobs = scoreJobsForMember(member, jobsTokens);
        result.set(member.data.name, scoredJobs);
    }

    return result;
}

// Main function to execute the process
async function main() {
    try {
        const memberJobScores = await processAndScore();
        memberJobScores.forEach((jobs, memberName) => {
            console.log(`${memberName}: ${jobs.map(job => 
                `${job.jobName.title} (${job.jobName.location})`)
                .join(', ')}`);
        })
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1)
    }
}

main().then(() => process.exit(0)).finally(() => process.exit(1));
