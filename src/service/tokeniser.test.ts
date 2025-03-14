import {Job, Member, TokenizedResult} from "../types";
import {jobTokeniser, memberTokeniser} from "./tokeniser";

const jobData: Job[] = [
    {title: "Software Developer", location: "London"},
    {title: "Marketing Internship", location: "York"},
    {title: "Data Scientist", location: "London"},
    {title: "Legal Internship", location: "London"},
    {title: "Project Manager", location: "Manchester"},
    {title: "Sales Internship", location: "London"},
    {title: "UX Designer", location: "London"},
    {title: "Software Developer", location: "Edinburgh"},
];

const members: Member[] = [
    {name: 'Joe', bio: "I'm a designer from London, UK"},
    {name: 'Marta', bio: "I'm looking for an internship in London"},
    {name: 'Hassan', bio: "I'm looking for a design job"},
    {name: 'Grace', bio: "I'm looking for a job in marketing outside of London"},
    {name: 'Daisy', bio: "I'm a software developer currently in Edinburgh but looking to relocate to London"},
];

describe("Tokeniser", () => {
    describe("jobTokeniser", () => {
        it("should tokenize jobs correctly", () => {
            const expectedResults: TokenizedResult<Job>[] = [
                {
                    data: {title: "Software Developer", location: "London"},
                    tokens: {
                        london: 1,
                        "software developer": 1,
                    },
                },
                {
                    data: {title: "Marketing Internship", location: "York"},
                    tokens: {
                        york: 1,
                        internship: 1,
                        marketing: 1,
                    },
                },
                {
                    data: {title: "Data Scientist", location: "London"},
                    tokens: {
                        london: 1,
                        "data scientist": 1,
                    },
                },
                {
                    data: {title: "Legal Internship", location: "London"},
                    tokens: {
                        london: 1,
                        internship: 1,
                        legal: 1,
                    },
                },
                {
                    data: {title: "Project Manager", location: "Manchester"},
                    tokens: {
                        manchester: 1,
                        "project manager": 1,
                    },
                },
                {
                    data: {title: "Sales Internship", location: "London"},
                    tokens: {
                        london: 1,
                        internship: 1,
                        sales: 1,
                    },
                },
                {
                    data: {title: "UX Designer", location: "London"},
                    tokens: {
                        london: 1,
                        "ux designer": 1,
                    },
                },
                {
                    data: {title: "Software Developer", location: "Edinburgh"},
                    tokens: {
                        edinburgh: 1,
                        "software developer": 1,
                    },
                },
            ];

            jobData.forEach((job, index) => {
                const result = jobTokeniser(job);
                expect(result).toEqual(expectedResults[index]);
            });
        });

        it("should return tokens with lowercase keys", () => {
            const job: Job = {title: "Data Scientist INTERNSHIP", location: "London"};

            const result = jobTokeniser(job);

            expect(result).toEqual({
                data: job,
                tokens: {
                    london: 1,
                    internship: 1,
                    "data scientist": 1,
                },
            });
        });

        it("should handle empty location and title gracefully", () => {
            const job: Job = {title: "", location: ""};

            const result = jobTokeniser(job);

            // Expect an empty result
            expect(result).toEqual({
                data: job,
                tokens: {},
            });
        });

        it("should trim whitespace properly", () => {
            const job: Job = {title: "  Internship Marketing ", location: "  York "};

            const result = jobTokeniser(job);

            expect(result).toEqual({
                data: job,
                tokens: {
                    york: 1,
                    internship: 1,
                    "marketing": 1,
                },
            });
        });
    });

    describe('memberTokeniser', () => {
        it('should tokenize and normalize job titles in member bio correctly', () => {
            const member = members[0];
            const result: TokenizedResult<Member> = memberTokeniser(member);
            expect(result).toEqual({
                data: member,
                tokens: {
                    london: 1,
                    'ux designer': 2,
                },
            });
        });

        it('should handle internship-specific tokens and location correctly', () => {
            const member = members[1];
            const result: TokenizedResult<Member> = memberTokeniser(member);
            expect(result).toEqual({
                data: member,
                tokens: {
                    internship: 1,
                    london: 1,
                },
            });
        });

        it('should normalize and tokenize design-related jobs correctly', () => {
            const member = members[2];
            const result: TokenizedResult<Member> = memberTokeniser(member);
            expect(result).toEqual({
                data: member,
                tokens: {
                    'ux designer': 2, 
                },
            });
        });

        it('should apply modifiers to token values correctly when "outside" is in bio', () => {
            const member = members[3];
            const result: TokenizedResult<Member> = memberTokeniser(member);
            expect(result).toEqual({
                data: member,
                tokens: {
                    marketing: 2,
                    london: -1,
                },
            });
        });

        it('should apply positive modifiers and account for relocation in tokens', () => {
            const member = members[4];
            const result: TokenizedResult<Member> = memberTokeniser(member);
            expect(result).toEqual({
                data: member,
                tokens: {
                    'software developer': 2, // Modifier "relocate" doubles token values
                    edinburgh: 1,
                    london: 2,
                },
            });
        });

        it('should handle bio with no keywords gracefully', () => {
            const memberWithNoKeywords: Member = {
                name: 'Empty Bio',
                bio: 'Just some irrelevant text here',
            };

            const result: TokenizedResult<Member> = memberTokeniser(memberWithNoKeywords);

            // Only basic tokens remain, as nothing matches job titles or modifiers
            expect(result).toEqual({
                data: memberWithNoKeywords,
                tokens: {},
            });
        });
    });

})
