


export function getMovingAverage (interval, data) {
    if (data.length < interval) return null;
    return data.map((v, i) => {
        if (i < interval - 1) return 0;
        return data.slice(i - interval + 1, i + 1)
            .reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / interval;
    });
}
