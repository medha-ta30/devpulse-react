/**
 * Users data processor
 * Pure functions only – takes arrays, returns summary numbers.
 * Used by Overview panel and anywhere user stats are needed.
 */

function getTotalUsers(users) {
    let count = 0;
  
    for (let i = 0; i < users.length; i++) {
      count = count + 1;
    }
  
    return count;
  }
  
  // Count each unique company name once (same company can appear on multiple users)
  function getTotalCompanies(users) {
    const companyNames = [];
  
    for (let i = 0; i < users.length; i++) {
      const name = users[i].company.name;
      let isDuplicate = false;
  
      for (let j = 0; j < companyNames.length; j++) {
        if (companyNames[j] === name) {
          isDuplicate = true;
          break;
        }
      }
  
      if (!isDuplicate) {
        companyNames.push(name);
      }
    }
  
    return companyNames.length;
  }
  
  export function userStats(users) {
    const totalUsers = getTotalUsers(users);
    const totalCompanies = getTotalCompanies(users);
  
    return {
      totalUsers,
      totalCompanies,
    };
  }