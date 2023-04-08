export interface ServerLeaderboardMongoModel {
    server: string;
    id: string;
    name: string;
    value: number;
    rank: number;
    createdAt: Date;
    updatedAt: Date;
}