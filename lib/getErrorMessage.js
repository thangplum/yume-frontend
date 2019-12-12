export default error => {
  if (!error) return null;
  if (error.networkError) {
    return error.message || "";
  }
  if (error.graphQLErrors && error.graphQLErrors.length) {
    const msg = error.graphQLErrors[0].message;
    return msg ? msg.error : null;
  }
  return null;
};
