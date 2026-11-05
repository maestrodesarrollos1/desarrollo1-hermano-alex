(() => {
  const targetPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.sessionStorage.setItem("spa-fallback-path", targetPath);
  window.location.replace(`${window.location.origin}/`);
})();
