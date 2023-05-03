class GameUtils {
    static getTop(obj: { [key: string]: number }, limit: number) {
        const data = Object.entries(obj).map(([key, value]) => ({ key, value }));
        data.sort((a, b) => b.value - a.value);
        return data.slice(0, limit);
    }

    static isEmptyObject(obj: object) {
        return Object.keys(obj).length > 0;
    }
}

export default GameUtils;