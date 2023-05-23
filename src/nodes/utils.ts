export const sortEntriesNumerically = (input) => input.sort(([a], [b]) => {
    return ~~a < ~~b ? -1 : 1;
});

export const sortEntriesAlphabetically = (input) => input.sort(([a], [b]) => {
    return a[0].localeCompare(b[0]);
});
