export const args_parse = () => {
    const len = [];
    process.argv.slice(2).map((i) => i.indexOf("=") ? i.split("=").forEach((it) => len.push(it)) : len.push(i));
    if (len.length % 2 !== 0) return false;
    const argPairs = {};
    for (let i = 0; i < len.length; i += 2) argPairs[len[i].replace(/-+/gi, "")] = len[i + 1];
    return argPairs;
}
