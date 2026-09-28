"""
Curated skill keyword database used by spaCy's PhraseMatcher to identify
technical and soft skills within resume text (Module 5: Skill Extraction).

Add to these lists over time as you see resumes with skills that aren't
being picked up.
"""

PROGRAMMING_LANGUAGES = [
    "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "C",
    "Go", "Golang", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala",
    "R", "MATLAB", "Perl", "Dart", "Shell Scripting", "Bash",
]

WEB_FRONTEND = [
    "React", "React.js", "Angular", "Vue.js", "Vue", "Next.js", "Svelte",
    "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "SASS",
    "Redux", "jQuery", "Webpack", "Framer Motion",
]

WEB_BACKEND = [
    "Node.js", "Express.js", "Express", "Django", "Flask", "FastAPI",
    "Spring Boot", "Spring", "Laravel", "Ruby on Rails", ".NET", "ASP.NET",
    "GraphQL", "REST API", "RESTful API", "Microservices",
]

DATABASES = [
    "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Oracle", "Redis",
    "Firebase", "Cassandra", "DynamoDB", "Elasticsearch", "SQL", "NoSQL",
    "Mongoose",
]

CLOUD_DEVOPS = [
    "AWS", "Amazon Web Services", "Azure", "Google Cloud Platform", "GCP",
    "Docker", "Kubernetes", "Jenkins", "CI/CD", "Terraform", "Ansible",
    "Linux", "Nginx", "Git", "GitHub", "GitLab", "Bitbucket",
]

DATA_AI_ML = [
    "Machine Learning", "Deep Learning", "Artificial Intelligence",
    "Natural Language Processing", "NLP", "Computer Vision",
    "TensorFlow", "PyTorch", "scikit-learn", "Keras", "Pandas", "NumPy",
    "Data Analysis", "Data Visualization", "Data Science",
    "Power BI", "Tableau", "Spark", "Hadoop", "Sentence Transformers",
    "spaCy", "OpenAI API", "Gemini API", "Prompt Engineering",
]

MOBILE = [
    "Android", "iOS", "React Native", "Flutter", "Swift", "Kotlin",
]

TOOLS = [
    "Postman", "Jira", "Figma", "VS Code", "Slack", "Notion", "Cloudinary",
    "jsPDF", "Recharts", "Chart.js",
]

SOFT_SKILLS = [
    "Communication", "Leadership", "Teamwork", "Problem Solving",
    "Critical Thinking", "Time Management", "Adaptability", "Creativity",
    "Collaboration", "Project Management", "Public Speaking",
    "Attention to Detail", "Analytical Skills",
]

ALL_SKILLS = sorted(
    set(
        PROGRAMMING_LANGUAGES
        + WEB_FRONTEND
        + WEB_BACKEND
        + DATABASES
        + CLOUD_DEVOPS
        + DATA_AI_ML
        + MOBILE
        + TOOLS
        + SOFT_SKILLS
    ),
    key=str.lower,
)
