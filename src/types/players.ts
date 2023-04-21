/* Player */
export interface Player {
    type: string;
    id: string;
    attributes: PlayerAttributes;
    relationships: PlayerRelationships;
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