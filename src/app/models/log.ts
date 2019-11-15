// export interface ILog {
//     method: string;
//     url: string;
//     status: string;
// }

export class Log {
    constructor(public method?: string,
                public url?: string,
                public status?: number,
                public message?: string) {
    }
}
