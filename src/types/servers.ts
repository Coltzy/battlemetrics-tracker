import { PlayerServerData } from './players';

/* Base Server */
export interface Server {
    data: BaseServerData;
    included?: PlayerServerData[];
}

export interface ServerSearch {
    data: BaseServerData[];
    links: EndpointSliderLinks;
    included: unknown[];
}

/* Base Server Data */
export interface BaseServerData {
    type: string;
    id: string;
    attributes: ServerAttributesBase;
    relationships: Relationships;
}

/* Server Data */
export interface MinecraftServerData extends BaseServerData {
    attributes: MinecraftServerAttributes;
}

export interface CsgoServerData extends BaseServerData {
    attributes: CsgoServerAttributes;
}

export interface ArkServerData extends BaseServerData {
    attributes: ArkServerAttributes;
}

export interface RustServerData extends BaseServerData {
    attributes: RustServerAttributes;
}

export interface GmodServerData extends BaseServerData {
    attributes: GmodServerAttributes;
}

export interface DayzServerData extends BaseServerData {
    attributes: DayzServerAttributes;
}

export interface CsServerData extends BaseServerData {
    attributes: CsServerAttributes;
}

/* Attributes */
interface ServerAttributesBase {
    id: string;
    name: string;
    address: null;
    ip: string;
    port: number;
    players: number;
    maxPlayers: number;
    rank: number;
    location: number[];
    status: string;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
    portQuery: number;
    country: string;
    queryStatus: string;
}

export interface RustServerAttributes extends ServerAttributesBase {
    details: RustServerDetails;
}

export interface ArkServerAttributes extends ServerAttributesBase {
    details: ArkServerDetails;
}

export interface CsgoServerAttributes extends ServerAttributesBase {
    details: CsgoServerDetails;
}

export interface MinecraftServerAttributes extends ServerAttributesBase {
    details: MinecraftServerDetails;
}

export interface GmodServerAttributes extends ServerAttributesBase {
    details: GmodServerDetails;
}

export interface DayzServerAttributes extends ServerAttributesBase {
    details: DayzServerDetails;
}

export interface CsServerAttributes extends ServerAttributesBase {
    details: CsServerDetails;
}

/* Server Attribute Details */
interface CsServerDetails {
    map: string;
    password: boolean;
    numbots: number;
    version: string;
    game: string;
    secure: number;
    rules: CsgoRules;
}

interface DayzServerDetails {
    version: string;
    password: boolean;
    official: boolean;
    time: string;
    third_person: boolean;
    modded: true;
    modIds: number[];
    modNames: string[];
    serverSteamId: string;
}

interface GmodServerDetails {
    map: string;
    password: boolean;
    numbots: number;
    gameMode: string;
    rules: { [key: string]: string };
    serverSteamId: string;
}

interface MinecraftServerDetails {
    minecraft_clean_description: string;
    minecraft_description: MinecraftDescription | string;
    minecraft_modded: boolean;
    minecraft_mods?: string[];
    minecraft_mod_hash?: string;
    minecraft_modpack_checked?: string;
    minecraft_version_name: string;
    minecraft_hash: string;
    minecraft_version: MinecraftVersion;
}

interface MinecraftDescription {
    text: string;
}

interface MinecraftVersion {
    name: string;
    protocol: number;
}

interface CsgoServerDetails {
    map: string;
    password: boolean;
    numbots: number;
    tags: string;
    rules?: CsgoRules;
    serverSteamId?: string;
}

interface CsgoRules {
    [key: string]: string;
}

interface ArkServerDetails {
    modIds: string[];
    modHashes: string[];
    map: string;
    time: string;
    time_i: string;
    offical: boolean;
    gamemode: string;
    modNames: string[];
    pve: boolean;
    modded: boolean;
    crossplay: boolean;
    session_flags: string;
    serverSteamId: string;
}

interface RustServerDetails {
    official: boolean;
    rust_type: string;
    map: string;
    environment: string;
    rust_build: string;
    rust_ent_cnt_i: number;
    rust_fps: number;
    rust_fps_avg: number;
    rust_gc_cl: number;
    rust_gc_mb: number;
    rust_hash: string;
    rust_headerimage: string;
    rust_mem_pv: null;
    rust_mem_ws: null;
    pve: boolean;
    rust_uptime: number;
    rust_url: string;
    rust_world_seed: number;
    rust_world_size: number;
    rust_maps: RustMaps;
    rust_description: string;
    rust_modded: boolean;
    rust_queued_players: number;
    rust_gamemode: string;
    rust_born: string;
    rust_last_ent_drop: string;
    rust_last_seed_change: string;
    rust_last_wipe: string;
    rust_last_wipe_ent: number;
    serverSteamId: string;
}

interface RustMaps {
    seed: number;
    size: number;
    url: string;
    thumbnailUrl: string;
    monuments: number;
    barren: boolean;
}

/* Game Relationships */
interface Relationships {
    game: Game;
    serverGroup?: ServerGroup;
}

interface Game {
    data: GameData;
}

interface GameData {
    type: string;
    id: string;
}

interface ServerGroup {
    meta: ServerGroupMeta;
    data: ServerGroupData;
}

interface ServerGroupMeta {
    leader: boolean;
}

interface ServerGroupData {
    type: string;
    id: string;
}

/* Leaderboard */
export interface ServerLeaderboard {
    data: ServerLeaderboardPlayer[];
    links: EndpointSliderLinks;
}

/* Leaderboard Player */
export interface ServerLeaderboardPlayer {
    type: string;
    id: string;
    attributes: ServerLeaderboardPlayerAttributes;
}

/* Leaderboard Player Attributes */
interface ServerLeaderboardPlayerAttributes {
    name: string;
    value: number;
    rank: number;
}

/* Leaderboard Links */
export interface EndpointSliderLinks {
    next?: string;
    prev?: string;
}