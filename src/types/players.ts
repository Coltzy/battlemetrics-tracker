import { BaseServerData } from "./servers";

/* Player */
export interface Player {
    data: PlayerData;
    included: PlayerServerMeta[];
}

export interface PlayerData {
    type: string;
    id: string;
    attributes: PlayerAttributes;
    relationships: PlayerRelationships;
}

/* Player Server Meta */
export interface PlayerServerMeta extends BaseServerData {
    meta: PlayerServerMetadata;
}

interface PlayerServerMetadata {
    timePlayed: number;
    firstSeen: string;
    lastSeen: string;
    online: boolean;
}

export interface ServerPlayer extends PlayerData {
    meta: PlayerMeta;
}

/* Player Attributes */
interface PlayerAttributes {
    id: string;
    name: string;
    private: boolean;
    positiveMatch: boolean;
    createdAt: string;
    updatedAt: string;
}

/* Player Relationships */
interface PlayerRelationships {
    server: PlayerRelationshipsServer;
}

interface PlayerRelationshipsServer {
    data: PlayerRelationshipsServerData;
}

interface PlayerRelationshipsServerData {
    type: string;
    id: string;
}

/* Player Meta */
interface PlayerMeta {
    metadata: PlayerMetaData;
}

interface PlayerMetaData {
    key: string;
    value: boolean;
    private: boolean;
}