export default {
  readBlobAsFile(blob, win, filename) {
    const { URL: {
      createObjectURL,
      revokeObjectURL,
    }, document } = win;
    const hyperlink = document.createElement('a');
    const url = createObjectURL(blob);

    hyperlink.style.display = 'none';
    hyperlink.href = url;
    hyperlink.download = filename;
    document.body.appendChild(hyperlink);
    hyperlink.click();
    revokeObjectURL(url);
    document.body.removeChild(hyperlink);
  },
};
