export function largeSizeToText(value) {
    const k = Math.trunc(value / 1024);
    const m = Math.trunc(k / 1024);
    const g = Math.trunc(m / 1024);
    const limit = 9;
    if (g > limit)
        return g + 'G';
    if (m > limit)
        return m + 'M';
    if (k > limit)
        return k + 'K';
    return value;
}