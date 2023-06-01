import { EmbedBuilder } from "discord.js";

abstract class BuildMethodBase {
    public map: Map<string, unknown>;

    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    constructor(...data: { [key: string]: unknown }[]) {
        this.map = new Map();

        data.forEach((data) => {
            const entries = Object.entries(data)[0];
            this.map.set(entries[0], entries[1]);
        });
    }

    abstract build(...data: unknown[]): EmbedBuilder[];
}

export default BuildMethodBase;