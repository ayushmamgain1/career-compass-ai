/**
 * Module 8: Skill Gap Analysis (Machine Learning)
 * Compares a user's current skills against a job's required skills
 * to identify what's missing, what matches, and produce a readiness score.
 */

const normalize = (skills) => skills.map((s) => s.trim().toLowerCase()).filter(Boolean);

/**
 * @param {string[]} userSkills - skills extracted from resume
 * @param {string[]} requiredSkills - skills required by the target job/role
 */
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

/**
 * Given missing skills across multiple prospective jobs, ranks which skills
 * would unlock the most opportunities if learned (simple frequency-based priority).
 */
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