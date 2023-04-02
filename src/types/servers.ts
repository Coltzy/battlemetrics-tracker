export interface RustServerData {
    type: string;
    id: string;
    attributes: RustAttributes;
    relationships: Relationships;
}

export interface RustServer {
    data: RustServerData;
}

interface ServerData {
    type: string;
    id: string;
    relationships: Relationships;
}

export interface Server {
    data: ServerData;
}

interface RustAttributes {
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
    details: RustDetails;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
    portQuery: number;
    country: string;
    queryStatus: string;
}

interface RustDetails {
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

interface Relationships {
    game: Game;
}

interface Game {
    data: GameData;
}

interface GameData {
    type: string;
    id: string;
}