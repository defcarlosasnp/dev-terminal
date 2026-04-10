import backupRepos from '../assets/repos_backup.json';

export const getRepos = async (username) => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    
    if (!response.ok) {
      return backupRepos;
    }
    
    return await response.json();
  } catch (error) {
    return backupRepos;
  }
};