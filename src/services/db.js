// Mock Database Service using LocalStorage

const STORAGE_KEYS = {
  USERS: 'wyntrix_users',
  JOBS: 'wyntrix_jobs',
  APPLICATIONS: 'wyntrix_applications',
  CURRENT_USER: 'wyntrix_current_user',
};

// Initial Mock Data
const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (React)',
    company: 'InnovateTech',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60',
    location: 'San Francisco, CA',
    type: 'Job',
    workMode: 'Hybrid',
    salary: '$120,000 - $150,000',
    category: 'Software Development',
    description: 'We are seeking a talented Senior Frontend Developer to lead the development of our next-generation web platforms. You will collaborate closely with product managers and UX designers to build highly responsive, user-friendly, and visually stunning web interfaces using React, Vite, and modern CSS.',
    requirements: [
      '5+ years of experience with modern frontend development (React, Vue, or Angular).',
      'Strong proficiency in JavaScript, TypeScript, HTML5, and CSS3.',
      'Experience with performance optimization and responsive web design.',
      'Strong collaboration and mentorship skills.'
    ],
    benefits: [
      'Competitive salary + equity packages.',
      'Comprehensive health, dental, and vision insurance.',
      'Flexible working hours and hybrid arrangement (2 days/week in-office).',
      'Annual learning & development stipend.'
    ],
    postedDate: '2026-06-20',
    status: 'open'
  },
  {
    id: 'job-2',
    title: 'UI/UX Design Intern',
    company: 'CreativeFlow Studio',
    logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=80&auto=format&fit=crop&q=60',
    location: 'Remote',
    type: 'Internship',
    workMode: 'Remote',
    salary: '$25 - $35 / hour',
    category: 'Design & Creative',
    description: 'Join our award-winning design agency as a UI/UX Design Intern. You will work on real client projects, participate in brainstorming sessions, create wireframes, and design high-fidelity user interfaces. This is a hands-on learning experience under the direct guidance of senior art directors.',
    requirements: [
      'Currently enrolled in or recently graduated from a Design, HCI, or related program.',
      'A portfolio demonstrating digital product design projects.',
      'Proficiency in Figma, Adobe XD, or similar design tools.',
      'Eagerness to learn, collaborate, and receive feedback.'
    ],
    benefits: [
      'Mentorship program with senior designers.',
      'Fully remote work schedule.',
      'Possibility of full-time return offer upon graduation.',
      'Company provided laptop and home-office equipment stipend.'
    ],
    postedDate: '2026-06-21',
    status: 'open'
  },
  {
    id: 'job-3',
    title: 'Software Engineer Intern (Full-Stack)',
    company: 'CloudScale Solutions',
    logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&auto=format&fit=crop&q=60',
    location: 'Seattle, WA',
    type: 'Internship',
    workMode: 'On-site',
    salary: '$40 - $50 / hour',
    category: 'Software Development',
    description: 'CloudScale is looking for a Software Engineering Intern to join our cloud platform infrastructure team. You will work on developing scalable web services, API integrations, and backend databases while gaining exposure to high-volume distributed systems.',
    requirements: [
      'Pursuing a BS or MS in Computer Science, Software Engineering, or related technical field.',
      'Understanding of backend languages (Node.js, Python, Go, or Java).',
      'Familiarity with SQL/NoSQL databases and REST APIs.',
      'Solid fundamentals in algorithms, data structures, and object-oriented programming.'
    ],
    benefits: [
      'Competitive intern hourly pay.',
      'Housing assistance or stipend for the duration of the internship.',
      'Fully catered lunch daily at our Seattle headquarters.',
      'Regular team building events and local outings.'
    ],
    postedDate: '2026-06-18',
    status: 'open'
  },
  {
    id: 'job-4',
    title: 'Product Marketing Manager',
    company: 'MarketPulse Inc.',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60',
    location: 'New York, NY',
    type: 'Job',
    workMode: 'Hybrid',
    salary: '$100,000 - $130,000',
    category: 'Marketing',
    description: 'We are seeking a Product Marketing Manager to drive the go-to-market strategy, product positioning, and messaging for our leading SaaS products. You will build marketing campaigns, enable sales teams, and analyze user feedback to optimize customer acquisition and retention.',
    requirements: [
      '3+ years of experience in product marketing, brand management, or growth marketing in tech.',
      'Outstanding written and verbal communication skills.',
      'Experience analyzing market trends, competitive intelligence, and customer segmentation.',
      'Ability to collaborate across product, sales, and creative teams.'
    ],
    benefits: [
      'Comprehensive health coverage (medical, dental, vision).',
      '401(k) match up to 5%.',
      'Generous PTO and parental leave.',
      'Wellness and gym membership discounts.'
    ],
    postedDate: '2026-06-15',
    status: 'open'
  },
  {
    id: 'job-5',
    title: 'Data Analyst',
    company: 'Apex Analytics Corp',
    logo: 'https://images.unsplash.com/photo-1543286386-7a39501fdfdb?w=80&auto=format&fit=crop&q=60',
    location: 'Chicago, IL',
    type: 'Job',
    workMode: 'On-site',
    salary: '$85,000 - $110,000',
    category: 'Data Science & Analytics',
    description: 'Apex Analytics is looking for a Data Analyst to transform complex data into actionable business insights. You will design dashboards, conduct deep-dive analyses on user behavior, and present recommendations to executive stakeholders.',
    requirements: [
      'Bachelor\'s degree in Statistics, Mathematics, Economics, Computer Science, or business fields.',
      'Strong SQL skills (writing complex joins, aggregations, CTEs).',
      'Proficiency in data visualization tools (Tableau, PowerBI) and Excel.',
      'Familiarity with Python or R for data analysis is a plus.'
    ],
    benefits: [
      'Annual performance-based bonuses.',
      'Health and wellness HSA contributions.',
      'Commuter benefits and transit subsidies.',
      'Subsidized professional certifications and courses.'
    ],
    postedDate: '2026-06-12',
    status: 'open'
  }
];

const INITIAL_USERS = [
  {
    id: 'user-candidate',
    username: 'candidate',
    email: 'candidate@wyntrix.com',
    password: 'candidate123',
    name: 'Jane Doe',
    role: 'candidate',
    bio: 'Aspiring Frontend Developer and UI/UX Designer. Enthusiastic about creating accessible, beautiful web applications with seamless user interfaces. Currently seeking internships and entry-level positions.',
    education: 'B.S. in Computer Science, State University (Expected Grad: May 2027)',
    experience: 'Web Developer Intern at Local Tech Shop (3 months) - Built client websites using HTML, CSS, and JavaScript.',
    skills: ['React', 'JavaScript', 'HTML & CSS', 'Figma', 'Responsive Design', 'Git'],
    resumeUrl: 'Jane_Doe_Resume.pdf'
  },
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@wyntrix.com',
    password: 'admin123',
    name: 'Wyntrix Admin',
    role: 'admin',
    bio: 'Administrator account for managing platform postings and user applications.',
    education: '',
    experience: '',
    skills: [],
    resumeUrl: ''
  }
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 'job-2',
    candidateId: 'user-candidate',
    coverLetter: 'I am incredibly excited about the UI/UX Design Intern opportunity at CreativeFlow Studio. As a student developer with a strong visual design leaning, I have spent the last year refining my Figma skills and designing layouts. I am eager to learn from your team and contribute to client projects.',
    appliedDate: '2026-06-21',
    status: 'Interview',
    statusNotes: 'We were impressed by your design portfolio. Let\'s schedule a 30-minute video interview for next Tuesday at 2 PM PST. Please check your email for a Google Meet link.'
  },
  {
    id: 'app-2',
    jobId: 'job-3',
    candidateId: 'user-candidate',
    coverLetter: 'I would love to join CloudScale Solutions as a Full-Stack Software Engineer Intern. I have built several projects using React and Node.js (available on my GitHub) and have taken advanced coursework in data structures and database systems. I would love the chance to apply my learning on your engineering team.',
    appliedDate: '2026-06-22',
    status: 'Applied',
    statusNotes: 'Your application has been received successfully and is awaiting review by our hiring team.'
  }
];

// DB Helper Functions
export const db = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
  },

  // Auth Operations
  login(email, password) {
    this.init();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const safeUser = { ...user };
    delete safeUser.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  },

  register(userData) {
    this.init();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password,
      name: userData.name || 'New User',
      role: userData.role || 'candidate',
      bio: userData.bio || '',
      education: userData.education || '',
      experience: userData.experience || '',
      skills: userData.skills || [],
      resumeUrl: userData.resumeUrl || ''
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const safeUser = { ...newUser };
    delete safeUser.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  },

  getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  updateProfile(userId, updatedData) {
    this.init();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return { success: false, error: 'User not found.' };

    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update current user cache if it matches
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const safeUser = { ...users[index] };
      delete safeUser.password;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    }

    return { success: true, user: users[index] };
  },

  // Job Operations
  getJobs() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS)) || [];
  },

  getJobById(id) {
    this.init();
    const jobs = this.getJobs();
    return jobs.find(j => j.id === id);
  },

  createJob(jobData) {
    this.init();
    const jobs = this.getJobs();
    const newJob = {
      id: 'job-' + Date.now(),
      ...jobData,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return newJob;
  },

  updateJob(id, updatedJob) {
    this.init();
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;

    jobs[index] = { ...jobs[index], ...updatedJob };
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return jobs[index];
  },

  deleteJob(id) {
    this.init();
    let jobs = this.getJobs();
    jobs = jobs.filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));

    // Clean up applications for this deleted job
    let apps = this.getApplications();
    apps = apps.filter(a => a.jobId !== id);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return true;
  },

  // Application Operations
  getApplications() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) || [];
  },

  getApplicationById(id) {
    this.init();
    const apps = this.getApplications();
    return apps.find(a => a.id === id);
  },

  getApplicationsByCandidate(candidateId) {
    const apps = this.getApplications();
    return apps.filter(a => a.candidateId === candidateId);
  },

  getApplicationsByJob(jobId) {
    const apps = this.getApplications();
    return apps.filter(a => a.jobId === jobId);
  },

  submitApplication(appData) {
    this.init();
    const apps = this.getApplications();

    // Check if candidate already applied to this job
    if (apps.some(a => a.jobId === appData.jobId && a.candidateId === appData.candidateId)) {
      return { success: false, error: 'You have already applied for this position.' };
    }

    const newApp = {
      id: 'app-' + Date.now(),
      jobId: appData.jobId,
      candidateId: appData.candidateId,
      coverLetter: appData.coverLetter || '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      statusNotes: 'Your application has been received successfully and is awaiting review by our hiring team.'
    };

    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return { success: true, application: newApp };
  },

  updateApplicationStatus(id, status, notes) {
    this.init();
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: 'Application not found.' };

    apps[index].status = status;
    apps[index].statusNotes = notes || `Status updated to ${status}.`;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    return { success: true, application: apps[index] };
  }
};
