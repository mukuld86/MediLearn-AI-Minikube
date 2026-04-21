const activeUsersMap = new Map();
const ACTIVE_WINDOW = 5 * 60 * 1000;

function trackUser(userId) {
  activeUsersMap.set(userId, Date.now());
}

function cleanupUsers() {
  const now = Date.now();

  for (const [userId, lastSeen] of activeUsersMap.entries()) {
    if (now - lastSeen > ACTIVE_WINDOW) {
      activeUsersMap.delete(userId);
    }
  }
}

function getActiveUsers() {
  cleanupUsers();
  return activeUsersMap.size;
}

module.exports = {
  trackUser,
  getActiveUsers,
};