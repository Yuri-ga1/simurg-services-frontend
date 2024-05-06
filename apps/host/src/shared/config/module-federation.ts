const setupMfManifest = async (): Promise<MfManifest> => {
  try {
    const response = await fetch('/mf-manifest.json');
    if (!response.ok) {
      throw new Error('Failed to load mf-manifest.json');
    }
    const remotes: RemoteDefinition[] = await response.json();
    return { remotes };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { remotes: [] };
  }
};

export const mfManifest = await setupMfManifest();
