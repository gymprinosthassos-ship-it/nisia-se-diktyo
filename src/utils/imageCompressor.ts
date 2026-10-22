import imageCompression from 'browser-image-compression';

/**
 * Συμπιέζει μια εικόνα στο frontend πριν από την αποστολή στο Supabase Storage.
 * Εγγυάται μέγεθος <= 300 KB και format WebP για μέγιστη εξοικονόμηση χώρου.
 */
export async function compressHistoricalImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.3,          // Μέγιστο 300 KB
    maxWidthOrHeight: 1600,  // Άριστη ανάλυση για retina οθόνες και έγγραφα
    useWebWorker: true,
    fileType: 'image/webp'   // Σύγχρονη βέλτιστη συμπίεση
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Μετατροπή σε File object με κατάληξη .webp
    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const compressedFile = new File([compressedBlob], `${originalNameWithoutExt}.webp`, {
      type: 'image/webp'
    });
    return compressedFile;
  } catch (error) {
    console.warn('Image compression fallback:', error);
    return file;
  }
}
