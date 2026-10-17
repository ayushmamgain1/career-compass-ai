const normalize = (skills) => skills.map((s) => s.trim().toLowerCase()).filter(Boolean);

const analyzeSkillGap = (userSkills = [], requiredSkills = []) => {
  const normalizedUser = normalize(userSkills);
  const normalizedRequired = normalize(requiredSkills);

  const matchingSkills = normalizedRequired.filter((skill) =>
    normalizedUser.includes(skill)
  );

  const missingSkills = normalizedRequired.filter(
    (skill) => !normalizedUser.includes(skill)
  );

  const extraSkills = normalizedUser.filter(
    (skill) => !normalizedRequired.includes(skill)
  );

  const readinessScore = normalizedRequired.length
    ? Math.round((matchingSkills.length / normalizedRequired.length) * 100)
    : 100;

  return {
    matchingSkills,
    missingSkills,
    extraSkills,
    readinessScore, // 0-100, how ready the user is for this role
  };
};

const prioritizeSkillsToLearn = (jobGapResults = []) => {
  const frequency = {};

  for (const result of jobGapResults) {
    for (const skill of result.missingSkills) {
      frequency[skill] = (frequency[skill] || 0) + 1;
    }
  }

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({ skill, opportunitiesUnlocked: count }));
};

export { analyzeSkillGap, prioritizeSkillsToLearn };