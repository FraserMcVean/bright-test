import {Job, Member, TokenizedResult} from "../types";

const jobTitleMapping: Record<string, string> = {
    designer: "ux designer",
    design: "ux designer",
    developer: "software developer",
    scientist: "data scientist",
    project: "project manager",
    marketing: "marketing",
};

const jobBaseScore = 2

const locationModifiers: Record<string, number> = {
    relocate: 2,
    outside: -1,
};

const locations: Record<string,  number> = {
    york: 1,
    london: 1,
    edinburgh: 1,
    manchester: 1,
}


export function memberTokeniser(member: Member): TokenizedResult<Member> {
    const scoredTokens: Record<string, number> = {};
    const bio = member.bio.toLowerCase().replace(/[^\w\s]/g, '')
    
    const tokens = bio.split(/\s+/);

    tokens.forEach((word, index) => {
        // Normalize and add job titles
        if (jobTitleMapping[word]) {
            const normalizedJobTitle = jobTitleMapping[word];
            scoredTokens[normalizedJobTitle] = (scoredTokens[normalizedJobTitle] || 0) + jobBaseScore;
            return;
        }

        // Add 'internship' as a specific token
        if (word.includes("internship")) {
            scoredTokens["internship"] = (scoredTokens["internship"] || 0) + 1;
            return;
        }

        if (locations[word]) {
            let modifier = 1; // Default modifier is 1 (no effect)

            // Check up to two previous tokens for a location modifier (with bounds checking)
            const context1 = index > 0 ? tokens[index - 1] : null;
            const context2 = index > 1 ? tokens[index - 2] : null;

            if (context1 && locationModifiers[context1]) {
                modifier = locationModifiers[context1];
            } else if (context2 && locationModifiers[context2]) {
                modifier = locationModifiers[context2];
            }

            // Apply the modifier only to the location token
            scoredTokens[word] = (locations[word] || 0) * modifier;
            return;
        }

    });

    // Remove tokens with a value of 0 or less
    for (const token in scoredTokens) {
        if (scoredTokens[token] == 0) {
            delete scoredTokens[token];
        }
    }

    // Return the tokenized result
    return {
        data: member, 
        tokens: scoredTokens,
    };
}


export function jobTokeniser(job: Job): TokenizedResult<Job> {
    const tokens: Record<string, number> = {};

    // Add the location as a token with a value of 1
    if (job.location) {
        tokens[job.location.trim().toLowerCase()] = 1;
    }

    // Process the title
    let title = job.title.trim().toLowerCase(); // Convert title to lowercase for consistency

    // Check if the title contains "internship" and add it as a token
    if (title.includes("internship")) {
        tokens["internship"] = 1;
        title = title.replace("internship", "").trim(); // Remove "internship" from the title
    }

    // Add the remaining title as a token
    if (title) {
        tokens[title] = 1;
    }

    return {
        data: job,
        tokens,
    };
}
