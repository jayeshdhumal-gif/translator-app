const API_URL = 'http://localhost:8080/api/profiles';

export async function getProfiles() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Could not load profiles.');
  return response.json();
}

export async function createProfile(profile) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  if (!response.ok) throw new Error('Could not create profile.');
  return response.json();
}
