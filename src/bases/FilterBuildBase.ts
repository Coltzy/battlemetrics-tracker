import { EmbedBuilder } from "discord.js";

abstract class FitlerBuildBase {
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    constructor() {}

    abstract build(data: unknown): EmbedBuilder[];
}

export default FitlerBuildBase;