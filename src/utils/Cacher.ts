class Cacher<T> {
    public data: { [key: string]: T[] };

    constructor() {
        this.data = {};
    }

    public set(key: string, value: T) {
        if (key in this.data) {
            if (this.data[key].includes(value)) return;
            this.data[key].push(value);

            return value;
        }

        this.data[key] = [value];

        return value;
    }

    public delete(key: string, value: T) {
        if (!(key in this.data)) return;
        const data = this.data[key];
        if (!data.includes(value)) return; 
        
        const index = data.indexOf(value);
        this.data[key].splice(index, 1);

        if (!this.data[key].length) {
            this.clear(key);
        }

        return value;
    }

    public clear(key: string) {
        if (!(key in this.data)) return;
        const data = this.data[key];

        delete this.data[key];

        return data;
    }

    public get(key: string) {
        return this.data[key] as T[] | undefined;
    }
}

export default Cacher;