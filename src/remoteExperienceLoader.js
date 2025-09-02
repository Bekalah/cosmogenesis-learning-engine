// Utility to fetch experiences from a remote GitHub repository
// This allows running Cosmogenesis without cloning the other repo.

export async function fetchRemoteExperiences(repo, branch = 'main') {
  if (!repo) {
    throw new Error('Repository name is required (e.g. "user/project")');
  }
  const base = `https://raw.githubusercontent.com/${repo}/${branch}/`;

  // Load list of experiences
  const listRes = await fetch(`${base}data/experiences.json`);
  if (!listRes.ok) {
    throw new Error(`Unable to fetch experiences.json from ${repo}`);
  }
  const list = await listRes.json();

  // Fetch config for each experience and resolve component paths
  return Promise.all(
    list.map(async (exp) => {
      const cfg = await fetch(base + exp.src).then((r) => r.json());
      let prologue = '';
      if (cfg.pages && cfg.pages[0]) {
        const pageUrl = `${base}app/${exp.id}/pages/${cfg.pages[0]}`;
        prologue = await fetch(pageUrl).then((r) => r.text());
      }
      const components = Array.isArray(cfg.components)
        ? cfg.components.map((c) => `${base}app/${exp.id}/${c}`)
        : [];
      return {
        ...exp,
        title: cfg.title || exp.title,
        description: cfg.description,
        prologue,
        components,
      };
    })
  );
}
