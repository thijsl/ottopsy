export class Util {
    static getHostName(href) {
        const l = document.createElement("a");
        l.href = href;
        return l.hostname;
    }
}