export async function pagination(req, service, limit) {
  let totalPage = (await service.findTotalPages({ limit })) || 1;
  let page = Number(req.query.page) || 1;
  if (page < 1) page = 1;
  if (page > totalPage) page = totalPage;

  const offset = (page - 1) * limit;

  const data = await service.findDataForPage({ offset, limit });

  const pageNumbers = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push({
      value: i,
      isActive: i === +page,
    });
  }

  return { data, totalPage, page, pageNumbers };
}