import { scoreJobsForMember } from "./scoring";
import { Job, Member, TokenizedResult, ScoredJob } from "../types";

describe("scoreJobsForMember", () => {
    it("should correctly score jobs based on matched tokens", () => {
        const memberTokens: TokenizedResult<Member> = {
            data: {
                name: "Alice",
                bio: "UX Designer looking for work in London",
            },
            tokens: {
                "ux designer": 2,
                london: 1,
                work: 0.5,
            },
        };

        const allJobTokens: TokenizedResult<Job>[] = [
            {
                data: { title: "UX Designer", location: "London" },
                tokens: {
                    "ux designer": 3,
                    london: 1,
                },
            },
            {
                data: { title: "Software Developer", location: "New York" },
                tokens: {
                    "software developer": 4,
                    newyork: 1,
                },
            },
            {
                data: { title: "Graphic Designer", location: "Remote" },
                tokens: {
                    "graphic designer": 2,
                    remote: 1,
                },
            },
        ];

        const result = scoreJobsForMember(memberTokens, allJobTokens);

        expect(result).toEqual([
            {
                jobName: { title: "UX Designer", location: "London" },
                score: 7, // (2 * 3) + (1 * 1)
            },
        ]);
    });

    it("should return an empty array when there are no matching tokens", () => {
        const memberTokens: TokenizedResult<Member> = {
            data: {
                name: "Bob",
                bio: "Data scientist passionate about AI",
            },
            tokens: {
                "data scientist": 2,
                ai: 3,
            },
        };

        const allJobTokens: TokenizedResult<Job>[] = [
            {
                data: { title: "Marketing Intern", location: "San Francisco" },
                tokens: {
                    marketing: 2,
                    internship: 1,
                },
            },
            {
                data: { title: "Legal Advisor", location: "London" },
                tokens: {
                    legal: 3,
                    london: 1,
                },
            },
        ];

        const result = scoreJobsForMember(memberTokens, allJobTokens);

        expect(result).toEqual([]);
    });

    it("should calculate scores for multiple jobs and sort them in descending order", () => {
        const memberTokens: TokenizedResult<Member> = {
            data: {
                name: "Charlie",
                bio: "Software Developer passionate about working in London",
            },
            tokens: {
                "software developer": 3,
                london: 2,
                passionate: 1,
            },
        };

        const allJobTokens: TokenizedResult<Job>[] = [
            {
                data: { title: "Software Developer", location: "London" },
                tokens: {
                    "software developer": 4,
                    london: 1,
                },
            },
            {
                data: { title: "UX Designer", location: "London" },
                tokens: {
                    "ux designer": 2,
                    london: 2,
                },
            },
            {
                data: { title: "Data Scientist", location: "Remote" },
                tokens: {
                    "data scientist": 3,
                    remote: 1,
                },
            },
        ];

        const result = scoreJobsForMember(memberTokens, allJobTokens);

        expect(result).toEqual([
            {
                jobName: { title: "Software Developer", location: "London" },
                score: 14, // (3 * 4) + (2 * 1)
            },
            {
                jobName: { title: "UX Designer", location: "London" },
                score: 4, // (2 * 2)
            },
        ]);
    });

    it("should handle edge case where there are no tokens in the member's profile", () => {
        const memberTokens: TokenizedResult<Member> = {
            data: {
                name: "Dan",
                bio: "",
            },
            tokens: {}, // No tokens
        };

        const allJobTokens: TokenizedResult<Job>[] = [
            {
                data: { title: "Marketing Manager", location: "London" },
                tokens: {
                    marketing: 2,
                    london: 1,
                },
            },
            {
                data: { title: "Graphic Designer", location: "Remote" },
                tokens: {
                    designer: 2,
                    remote: 1,
                },
            },
        ];

        const result = scoreJobsForMember(memberTokens, allJobTokens);

        expect(result).toEqual([]); // No matches possible
    });

    it("should handle edge case where a job has no tokens", () => {
        const memberTokens: TokenizedResult<Member> = {
            data: {
                name: "Emma",
                bio: "Marketing expert in San Francisco",
            },
            tokens: {
                marketing: 2,
                "san francisco": 1,
                expert: 2,
            },
        };

        const allJobTokens: TokenizedResult<Job>[] = [
            {
                data: { title: "Marketing Lead", location: "San Francisco" },
                tokens: {}, // No tokens for this job
            },
        ];

        const result = scoreJobsForMember(memberTokens, allJobTokens);

        expect(result).toEqual([]); // No matches possible
    });
});