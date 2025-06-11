export function certificateMapper(data) {
  return {
    title: data.title,
    institute: data.institute,
    link: data.link,
  };
}

export function mapCertificateFromAPI(data) {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    institute: data.institute,
    date: data.date,
    link: data.link,
  };
}
