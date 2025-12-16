function DownloadButton({ data, filename }) {
  if (!data) return null;

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="download-btn" onClick={download} aria-label="Download forecast data">
      <span className="btn-icon">📥</span>
      <span>Download Forecast Data (JSON)</span>
    </button>
  );
}

export default DownloadButton;
