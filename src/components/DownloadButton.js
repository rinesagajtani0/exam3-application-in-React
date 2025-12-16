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
    <button className="btn btn-outline-success w-100 mt-3" onClick={download}>
      Download Forecast (JSON)
    </button>
  );
}

export default DownloadButton;
