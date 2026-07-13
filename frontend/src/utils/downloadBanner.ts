export const downloadBannerImage = async (url: string | null | undefined, businessName: string): Promise<void> => {
  if (!url) {
    throw new Error("Banner is not available for download.");
  }
  
  try {
    let downloadUrl = url;

    // If it's a Cloudinary URL, we can force a download by adding the fl_attachment transformation
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      const parts = url.split('/upload/');
      downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }

    // Direct download approach for cross-origin URLs (e.g. Cloudinary with fl_attachment)
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = "_blank"; // Fallback if browser decides to open it
    
    // Attempt to set a custom filename
    const formattedName = businessName.trim().replace(/\s+/g, '-');
    link.download = `${formattedName}-Business-Banner.png`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
    throw new Error("Failed to download the banner image.");
  }
};
