export const getAudioDurationInSeconds = (audioLink: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioLink);

    // Event listener to get metadata and duration
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration; // Duration in seconds
      if (!isNaN(duration)) {
        resolve(duration);
      } else {
        reject(new Error("Unable to retrieve audio duration"));
      }
    });

    // Error handling
    audio.addEventListener("error", () => {
      reject(new Error("Error loading audio file"));
    });
  });
};