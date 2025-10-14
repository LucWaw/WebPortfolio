// server/middleware/github-token.ts
// server/api/github/repos.get.ts
// server/api/github/repos.get.ts


// server/api/github/repos.get.ts
export default defineEventHandler(async (event) => {
const token = useRuntimeConfig().githubToken;
  const { public: { githubUser } } = useRuntimeConfig();


  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Nuxt-GitHub-Client'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    console.log(`[API] Fetching repos for user "${githubUser}"...`);

    // 🔍 Test de la validité du token avant de charger les repos
    if (token) {
      const userResp = await $fetch('https://api.github.com/user', { headers, ignoreResponseError: true });
      if ((userResp as any)?.message === 'Bad credentials') {
        console.warn('[API] ⚠️ Token GitHub invalide.');
        throw createError({ statusCode: 401, statusMessage: 'Token GitHub invalide ou expiré' });
      }
    }

    // 🔹 Appel normal pour récupérer les dépôts publics
    const repos = await $fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, {
      headers,
      ignoreResponseError: true,
    });

    // 🔍 Si la réponse contient une erreur
    if ((repos as any)?.message) {
      console.error('[API] Erreur GitHub:', (repos as any).message);
      throw createError({ statusCode: 500, statusMessage: `Erreur GitHub: ${(repos as any).message}` });
    }
    console.log(`[API] ✅ ${ (repos as any[]).length } repos récupérés.`);

    // ✅ Retourne la liste formatée
    return repos.map((r: any) => ({
      name: r.name,
      html_url: r.html_url,
      description: r.description,
    }));
  } catch (error: any) {
    console.error('[API] Exception:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur interne du serveur GitHub',
    });
  }
});
