import buildListingEndpoint from '.';

describe(buildListingEndpoint, () => {
  const baseEndpoint = 'resources';
  const parameters = {
    page: 1,
    limit: 10,
    sort: { name: 'asc' },
  };
  it('builds the listing endpoint string using the given params', () => {
    const endpoint = buildListingEndpoint({ baseEndpoint, parameters });

    expect(decodeURIComponent(endpoint)).toEqual(
      'resources?page=1&limit=10&sort_by={"name":"asc"}',
    );
  });

  it('builds the listing endpoint string with a "$and" search expression between search options when search option patterns are found in the search input', () => {
    const endpoint = buildListingEndpoint({
      baseEndpoint,
      parameters: {
        ...parameters,
        search: {
          regex: {
            value: 'h.name:hvalue',
            fields: ['h.name'],
          },
        },
      },
    });

    expect(decodeURIComponent(endpoint)).toContain(
      '&search={"$and":[{"h.name":{"$rg":"hvalue"}}]}',
    );
  });

  it('builds the listing endpoint string with a "$or" search expression between search options when search option patterns are not found in the search input', () => {
    const endpoint = buildListingEndpoint({
      baseEndpoint,
      parameters: {
        ...parameters,
        search: {
          regex: {
            value: 'searchValue',
            fields: ['h.name', 's.description'],
          },
        },
      },
    });

    expect(decodeURIComponent(endpoint)).toContain(
      '&search={"$or":[{"h.name":{"$rg":"searchValue"}},{"s.description":{"$rg":"searchValue"}}]}',
    );
  });

  it('builds the listing endpoint string with a "$and" search expression between strings list search options', () => {
    const endpoint = buildListingEndpoint({
      baseEndpoint,
      parameters: {
        ...parameters,
        search: {
          lists: [
            {
              field: 'h.status',
              values: ['OK'],
            },
          ],
        },
      },
    });

    expect(decodeURIComponent(endpoint)).toContain(
      '&search={"$and":[{"h.status":{"$in":["OK"]}}]}',
    );
  });

  it('builds the listing endpoint string with a "$and" search expression between numbers list search options', () => {
    const endpoint = buildListingEndpoint({
      baseEndpoint,
      parameters: {
        ...parameters,
        search: {
          lists: [
            {
              field: 'h.status',
              values: [1, 2, 3, 4],
            },
          ],
        },
      },
    });

    expect(decodeURIComponent(endpoint)).toContain(
      '&search={"$and":[{"h.status":{"$in":[1,2,3,4]}}]}',
    );
  });
});