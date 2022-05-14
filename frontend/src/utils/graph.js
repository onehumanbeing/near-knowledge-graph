export function emptyGraph() {
    return {
        nodes: [],
        links: [],
    };
}

export function genLinkIndex(n, r) {
    let a = parseInt(n);
    let b = parseInt(r);
    if (a > b) {
        return r + "@" + n;
    } else {
        return n + "@" + r;
    }
}

export function parseNode(item, x, y) {
    var data = {
        id: item.index,
        name: item.name,
        account_id: item.account_id,
        x: x,
        y: y
    }
    if(item.media.length > 0) {
        data.svg = item.media;
    }
    if(item.data.length > 0) {
        data.href = item.data;
    }
    return data
}

export function parseLink(item) {
    var data = [];
    for(let i=0; i<item.relations.length; i++)
    {
        data.push({
            source: item.index,
            target: item.relations[i][1],
            label: item.relations[i][0].split("@")[0],
            index: genLinkIndex(item.index, item.relations[i][1])
        })
    }
    return data;
}
