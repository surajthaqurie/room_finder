export const paginationQuery = (page: number, pageSize: number): { take?: number; skip?: number } => {
  let query: { limit?: number; skip?: number } = {};
  if (page && pageSize) {
    query = { skip: page * pageSize - pageSize, limit: pageSize };
  } else if (!page && pageSize) {
    query = { limit: pageSize };
  }

  return query;
};
