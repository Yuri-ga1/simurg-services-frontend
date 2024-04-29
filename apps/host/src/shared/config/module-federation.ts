const setupRemoteDefinitions = async (): Promise<RemoteDefinition[]> => {
  try {
    const response = await fetch('/mf-manifest.json');
    if (!response.ok) {
      throw new Error('Failed to load remote definitions');
    }
    const remoteDefinitions: RemoteDefinition[] = await response.json();
    return remoteDefinitions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};

export const REMOTE_DEFINITIONS = await setupRemoteDefinitions();
