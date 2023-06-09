import { BaseServerData, PaginationLinks } from "./servers";

/* Player */
export interface Player {
    data: PlayerData;
}

export interface PlayerSearch {
    data: PlayerData[];
    links: PaginationLinks;
}

export interface PlayerWithServerMeta extends Player {
    included: PlayerServerMeta[];
}

export interface PlayerWithIdentifers extends Player {
    included: PlayerIdentifier[];
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

export interface PlayerServerData extends PlayerData {
    meta: PlayerMeta;
}

/* Player Sessions */
export interface PlayerSessionData {
    data: PlayerSession[];
}

export interface PlayerSessionDataWithServers extends PlayerSessionData {
    included: BaseServerData[];
}

interface PlayerSession {
    type: string;
    id: string;
    attributes: PlayerSessionAttributes;
    relationships: PlayerServerRelationship;
}

interface PlayerSessionAttributes {
    start: string;
    stop: string;
    firstTime: boolean;
    name: string;
    private: boolean;
}

/* Player Coplay */
export interface PlayerCoplayData {
    data: PlayerCoplay[];
}

interface PlayerCoplay {
    type: string;
    id: string;
    attributes: PlayerCoplayAttributes;
}

interface PlayerCoplayAttributes {
    name: string;
    duration: number;
}

/* Player Identifiers */
interface PlayerIdentifier {
    type: string;
    id: string;
    attributes: PlayerIdentifierAttributes;
    relationships: PlayerRelationships;
}

interface PlayerIdentifierAttributes {
    type: string;
    identifier: string;
    lastSeen: string;
    private: boolean;
    metadata: null;
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
    player: PlayerRelationshipsServer;
}

interface PlayerServerRelationship {
    server: PlayerRelationshipsServer;
    player: PlayerRelationshipsServer;

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