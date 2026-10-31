import { FeedbackReport, JobRole } from '../types/interview';

export interface DemoInterviewScenario {
  role: JobRole;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Technical' | 'HR' | 'Mixed';
  questions: Array<{
    mainQuestion: string;
    sampleAnswer: string;
    followUpTriggerAnswers: string[];
    followUpQuestion: string;
    followUpSampleAnswer: string;
  }>;
  sampleReport: FeedbackReport;
}

export const DEMO_SCENARIOS: Record<JobRole, DemoInterviewScenario> = {
  'Software Developer': {
    role: 'Software Developer',
    level: 'Intermediate',
    type: 'Technical',
    questions: [
      {
        mainQuestion: 'Could you explain how you would design a URL shortening service like Bitly, focusing on high availability and hashing collisions?',
        sampleAnswer: 'To build a URL shortener, I would use a base62 encoding algorithm with an auto-incrementing ID or MurmurHash with collision resolution. For high availability, I would deploy stateless API services behind a round-robin load balancer and use Redis for caching popular redirect URLs with a 24-hour TTL. For the persistent store, PostgreSQL or DynamoDB would store the mapping of short code to original URL.',
        followUpTriggerAnswers: ['redis', 'hash', 'base62', 'collisions', 'scale', 'database'],
        followUpQuestion: 'You mentioned using Redis for caching and base62 encoding. How would you handle a distributed counter across multiple server instances without causing race conditions or duplicate IDs?',
        followUpSampleAnswer: 'I would use a distributed ID generator like Twitter Snowflake or allocate ID ranges to each server instance in batches of 10,000 using a central Redis atomic INCRBY or ZooKeeper coordination so each server can generate unique IDs locally without round-tripping for every request.',
      },
      {
        mainQuestion: 'How does the JavaScript event loop handle asynchronous tasks, specifically the difference between microtasks and macrotasks?',
        sampleAnswer: 'The event loop continuously checks the call stack. When it is empty, it first drains the entire microtask queue—which includes Promise callbacks, queueMicrotask, and MutationObservers. Only after the microtask queue is completely clear does it process the next macrotask from the task queue, like setTimeout, setInterval, or I/O events. If microtasks keep scheduling new microtasks, macrotasks get starved.',
        followUpTriggerAnswers: ['promise', 'microtask', 'macrotask', 'starvation', 'call stack'],
        followUpQuestion: 'What practical consequence does microtask starvation have on browser rendering and user interaction, and how would you diagnose it?',
        followUpSampleAnswer: 'Because the browser recalculates style and repaints between macrotask ticks, an infinite or deep microtask loop completely freezes the UI and blocks user clicks. I would diagnose this using Chrome DevTools Performance Profiler to look for Long Tasks with no rendering frames, and refactor recursion using requestAnimationFrame or setTimeout.',
      },
      {
        mainQuestion: 'Describe a situation where a database query became a performance bottleneck in your application. How did you identify and optimize it?',
        sampleAnswer: 'In our order history service, querying user orders took over 3 seconds under peak load. I enabled PostgreSQL slow query logs and ran EXPLAIN ANALYZE, discovering a sequential table scan on a table with 2 million rows because our composite query filtered by user_id and ordered by created_at descending. I added a composite B-tree index on (user_id, created_at DESC), which converted the scan to an index condition and dropped latency to 14ms.',
        followUpTriggerAnswers: ['explain', 'index', 'composite', 'slow query', 'latency'],
        followUpQuestion: 'What trade-offs did you consider when adding that composite index, especially regarding write throughput and memory overhead?',
        followUpSampleAnswer: 'Each index adds write overhead during INSERTs and UPDATEs because PostgreSQL must update the B-tree nodes in addition to the table heap. It also consumes buffer cache memory. We checked write volume—it was 90% reads to 10% writes—so the 4% write penalty was well worth the 200x read speedup.',
      },
      {
        mainQuestion: 'What are the core differences between optimistic locking and pessimistic locking, and when would you choose one over the other?',
        sampleAnswer: 'Pessimistic locking locks the database record upfront using SELECT FOR UPDATE, preventing any other transaction from reading or modifying it until commit. Optimistic locking does not lock records; instead, it checks a version column or timestamp during UPDATE. If the version changed, the transaction aborts and retries. I choose optimistic locking for read-heavy systems with low collision probability, and pessimistic locking for high-contention operations like ticket reservations.',
        followUpTriggerAnswers: ['pessimistic', 'optimistic', 'select for update', 'version', 'contention'],
        followUpQuestion: 'In an optimistic locking scenario with sudden flash-sale traffic spikes, what negative phenomenon can occur and how would you mitigate it?',
        followUpSampleAnswer: 'Under severe contention, optimistic locking suffers from high retry storms, where thousands of threads repeatedly abort and retry, consuming CPU and database connections without completing work. To mitigate this, I would switch high-contention inventory to an in-memory Redis atomic decrement (DECR) or rate-limit attempts using exponential backoff with jitter.',
      },
      {
        mainQuestion: 'Tell me about a time you had a technical disagreement with a teammate regarding system architecture. How did you resolve it?',
        sampleAnswer: 'A senior engineer wanted to migrate our monolithic backend to 12 microservices immediately, while I believed our team of four could not handle the operational overhead of Kubernetes, distributed tracing, and network latency. I scheduled a proof-of-concept spike and benchmarked the deployment complexity. We agreed on a compromise: a modular monolith with clean domain boundaries, with plans to extract only the high-throughput payment webhook service as a standalone service.',
        followUpTriggerAnswers: ['monolith', 'microservices', 'compromise', 'architecture', 'spike'],
        followUpQuestion: 'How did you ensure there was no lingering friction after that decision, and how did the architecture perform after 6 months?',
        followUpSampleAnswer: 'I documented the rationale in an Architecture Decision Record (ADR) acknowledging the merits of microservices for future stages. Six months later, team velocity increased by 40% because local testing was instantaneous, and when we finally extracted the payment service, the clear domain boundaries made the migration take less than two days.',
      },
    ],
    sampleReport: {
      id: 'demo-report-se-01',
      date: new Date().toISOString(),
      role: 'Software Developer',
      level: 'Intermediate',
      type: 'Technical',
      isDemo: true,
      durationSeconds: 780,
      overallScore: 88,
      technicalScore: 92,
      clarityScore: 86,
      relevanceScore: 89,
      problemSolvingScore: 85,
      summary: 'Demonstrated exceptional technical foundations across distributed systems, asynchronous runtimes, and database indexing. Answers were structured, analytical, and backed by concrete trade-off metrics.',
      strengths: [
        'Precise understanding of distributed ID generation and Redis caching mechanics.',
        'Clear articulation of JavaScript runtime internals and microtask starvation impact.',
        'Practical experience with EXPLAIN ANALYZE and composite index trade-offs.',
        'Mature approach to architectural disagreements using data and ADR documentation.',
      ],
      areasForImprovement: [
        'Could quantify throughput numbers (e.g. QPS, SLA percentiles) more specifically upfront.',
        'In system design questions, clarify functional vs non-functional requirements before presenting solutions.',
        'Elaborate more on disaster recovery and database replication lag.',
      ],
      questionFeedback: [
        {
          question: 'Could you explain how you would design a URL shortening service like Bitly, focusing on high availability and hashing collisions?',
          answer: 'To build a URL shortener, I would use a base62 encoding algorithm with an auto-incrementing ID or MurmurHash with collision resolution. For high availability, I would deploy stateless API services behind a round-robin load balancer and use Redis for caching popular redirect URLs with a 24-hour TTL.',
          score: 90,
          strengths: 'Good coverage of base62, caching, and stateless horizontally scalable services.',
          critique: 'Did not initially address how distributed IDs avoid collisions across multiple instances until prompted.',
          idealAnswer: 'Start by estimating scale: 100M URLs/month means ~40 QPS writes, 400 QPS reads. Use base62 with a 7-character string offering 3.5 trillion unique combinations. Utilize distributed Snowflake IDs to avoid centralized bottlenecks, cached via Redis cluster.',
        },
        {
          question: 'How does the JavaScript event loop handle asynchronous tasks, specifically the difference between microtasks and macrotasks?',
          answer: 'The event loop continuously checks the call stack. When it is empty, it first drains the entire microtask queue—which includes Promise callbacks, queueMicrotask, and MutationObservers. Only after the microtask queue is completely clear does it process the next macrotask.',
          score: 94,
          strengths: 'Accurately articulated the queue prioritization and starvation mechanics.',
          critique: 'Very thorough; could mention how NodeJS event loop differs with process.nextTick and libuv phases.',
          idealAnswer: 'Explain the call stack execution, callout microtasks (Promises, MutationObservers) which drain completely between macrotasks (timers, I/O), and mention the rendering pipeline tick.',
        },
        {
          question: 'Describe a situation where a database query became a performance bottleneck in your application. How did you identify and optimize it?',
          answer: 'In our order history service, querying user orders took over 3 seconds under peak load. I enabled PostgreSQL slow query logs and ran EXPLAIN ANALYZE, discovering a sequential table scan on a table with 2 million rows.',
          score: 86,
          strengths: 'Grounded in real diagnostic tools (EXPLAIN ANALYZE, composite indexes).',
          critique: 'Could mention monitoring metrics (p99 latency, connection pool saturation).',
          idealAnswer: 'Structure using the STAR framework: Situation (3s p99 latency during peak flash sale), Task (identify query bottleneck), Action (EXPLAIN ANALYZE, composite B-tree index on user_id, created_at DESC), Result (dropped to 14ms with zero index bloat).',
        },
      ],
      recommendedTopics: [
        'Distributed Consensus (Raft / Paxos)',
        'Database Sharding & Replication Lag Management',
        'System Design Capacity Estimations & Back-of-the-envelope Math',
      ],
    },
  },
  'Frontend Developer': {
    role: 'Frontend Developer',
    level: 'Intermediate',
    type: 'Technical',
    questions: [
      {
        mainQuestion: 'Can you explain React 19 server components and actions versus standard client components, and when to use each?',
        sampleAnswer: 'React Server Components execute strictly on the server and do not ship their JavaScript bundle to the browser, reducing hydration costs and improving Time to Interactive. Client components, marked with "use client", handle interactive UI state, browser event listeners, and browser APIs. Server Actions allow seamless asynchronous data mutations without manually writing boilerplate REST endpoints.',
        followUpTriggerAnswers: ['bundle', 'hydration', 'use client', 'server action'],
        followUpQuestion: 'How does hydration work under the hood with streaming SSR, and how does React recover from hydration mismatches?',
        followUpSampleAnswer: 'With streaming SSR and Suspense, the server sends HTML chunks progressively. Selective hydration allows React to hydrate interactive components prioritized by user clicks. If a mismatch occurs, React 19 logs a console warning and client-renders the mismatched subtree without completely discarding the entire DOM tree.',
      },
      {
        mainQuestion: 'What strategies do you employ to achieve optimal Core Web Vitals (LCP, INP, and CLS) on modern web applications?',
        sampleAnswer: 'For Largest Contentful Paint (LCP), I prioritize the hero image using fetchpriority="high", preload critical fonts with font-display: swap, and compress images to AVIF/WebP. For Interaction to Next Paint (INP), I break up long JavaScript tasks using requestPostAnimationFrame or web workers, and avoid expensive state updates in high-frequency events. For Cumulative Layout Shift (CLS), I set explicit aspect-ratio attributes on media containers and reserve skeleton space for dynamic banners.',
        followUpTriggerAnswers: ['lcp', 'inp', 'cls', 'web vitals', 'fetchpriority'],
        followUpQuestion: 'How do you monitor Core Web Vitals in production for real users (RUM) rather than just synthetic lab tests?',
        followUpSampleAnswer: 'I use the official web-vitals npm library to capture 75th percentile attribution data for real user sessions, and stream these metrics to Google Analytics 4 or Datadog RUM with user device, connection type, and route tags to spot real-world regressions.',
      },
    ],
    sampleReport: {
      id: 'demo-report-fe-01',
      date: new Date().toISOString(),
      role: 'Frontend Developer',
      level: 'Intermediate',
      type: 'Technical',
      isDemo: true,
      durationSeconds: 620,
      overallScore: 91,
      technicalScore: 94,
      clarityScore: 90,
      relevanceScore: 92,
      problemSolvingScore: 88,
      summary: 'Outstanding grasp of modern frontend architecture, React 19 concepts, and performance engineering around Core Web Vitals.',
      strengths: [
        'Deep understanding of Server Components vs Client Components trade-offs.',
        'Actionable knowledge of INP, LCP, and CLS optimization techniques.',
        'Production RUM monitoring awareness.',
      ],
      areasForImprovement: [
        'Include more details on state management across micro-frontends or large complex stores.',
        'Mention accessibility (ARIA, focus management, screen readers) when answering architecture questions.',
      ],
      questionFeedback: [
        {
          question: 'Can you explain React 19 server components and actions versus standard client components, and when to use each?',
          answer: 'React Server Components execute strictly on the server and do not ship their JavaScript bundle to the browser...',
          score: 95,
          strengths: 'Clear explanation of zero-bundle-size components and hydration reduction.',
          critique: 'Could touch on data serialization boundaries between server and client.',
          idealAnswer: 'Highlight that RSCs run exclusively at build time or request time on the server, fetch data adjacent to rendering, and pass serializable props across the boundary, while Client Components manage local interactive state.',
        },
      ],
      recommendedTopics: [
        'Advanced Web Accessibility (WCAG 2.2 AA Compliance)',
        'CSS Architecture & Subgrid/Container Queries',
        'State Machines with XState',
      ],
    },
  },
  'Backend Developer': {
    role: 'Backend Developer',
    level: 'Intermediate',
    type: 'Technical',
    questions: [
      {
        mainQuestion: 'How do you ensure idempotency in RESTful and event-driven API endpoints, particularly for financial transactions?',
        sampleAnswer: 'For idempotency, clients generate a unique Idempotency-Key UUID header with each transaction. The backend attempts to write this key into Redis or PostgreSQL with an atomic condition or unique constraint. If the key exists, the server checks if the previous operation is still in-flight or returns the cached response from the previous successful execution.',
        followUpTriggerAnswers: ['idempotency', 'redis', 'unique', 'transaction'],
        followUpQuestion: 'What happens if a request with that idempotency key crashes halfway through charging the payment gateway before updating your database?',
        followUpSampleAnswer: 'I implement the Saga pattern with transactional outbox and state machine transitions. The transaction state starts as PENDING. If a network timeout occurs, a background reconciliation worker queries the payment gateway using the order idempotency reference before retrying or executing a compensating rollback transaction.',
      },
    ],
    sampleReport: {
      id: 'demo-report-be-01',
      date: new Date().toISOString(),
      role: 'Backend Developer',
      level: 'Intermediate',
      type: 'Technical',
      isDemo: true,
      durationSeconds: 710,
      overallScore: 89,
      technicalScore: 91,
      clarityScore: 87,
      relevanceScore: 90,
      problemSolvingScore: 88,
      summary: 'Solid backend foundations with strong understanding of distributed transactions, idempotency semantics, and fault tolerance.',
      strengths: [
        'Idempotency key implementation using atomic storage.',
        'Distributed systems knowledge including Saga pattern and transactional outbox.',
      ],
      areasForImprovement: [
        'Detail connection pool sizing and thread saturation metrics.',
        'Address message ordering in distributed event streaming (Kafka/RabbitMQ).',
      ],
      questionFeedback: [
        {
          question: 'How do you ensure idempotency in RESTful and event-driven API endpoints, particularly for financial transactions?',
          answer: 'For idempotency, clients generate a unique Idempotency-Key UUID header with each transaction...',
          score: 90,
          strengths: 'Sound technical mechanism and header convention.',
          critique: 'Did not address in-flight duplicate handling until questioned.',
          idealAnswer: 'Explain HTTP Idempotency-Key specification, Redis distributed lock with TTL, transactional outbox pattern, and automated reconciliation for edge-case gateway timeouts.',
        },
      ],
      recommendedTopics: [
        'Kafka Partition Keying and Consumer Rebalances',
        'Zero-Downtime Database Migrations with Expand/Contract Pattern',
        'gRPC vs REST Benchmarking and Protobuf Serialization',
      ],
    },
  },
  'Data Analyst': {
    role: 'Data Analyst',
    level: 'Intermediate',
    type: 'Technical',
    questions: [
      {
        mainQuestion: 'Can you explain the difference between window functions like ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL, with a concrete use case?',
        sampleAnswer: 'All three assign rank based on an ORDER BY clause within a PARTITION. ROW_NUMBER assigns consecutive unique integers even for identical values. RANK assigns identical ranks to ties but skips subsequent rank numbers (e.g. 1, 2, 2, 4). DENSE_RANK assigns identical ranks to ties without skipping numbers (e.g. 1, 2, 2, 3). For example, finding the top 3 highest sales amounts in each department requires DENSE_RANK so third place is not skipped if there is a tie for first.',
        followUpTriggerAnswers: ['rank', 'dense_rank', 'row_number', 'ties', 'partition by'],
        followUpQuestion: 'How would you optimize that window function query if running over a table with 50 million sales records in Snowflake or BigQuery?',
        followUpSampleAnswer: 'I would ensure the table is clustered or partitioned by the department column to prevent full-table shuffle, filter date ranges early using a CTE or subquery before applying the window function, and avoid unnecessary ORDER BY columns.',
      },
    ],
    sampleReport: {
      id: 'demo-report-da-01',
      date: new Date().toISOString(),
      role: 'Data Analyst',
      level: 'Intermediate',
      type: 'Technical',
      isDemo: true,
      durationSeconds: 590,
      overallScore: 87,
      technicalScore: 90,
      clarityScore: 88,
      relevanceScore: 86,
      problemSolvingScore: 84,
      summary: 'Demonstrated crisp mastery of SQL analytical functions, data modeling concepts, and practical query optimization on cloud data warehouses.',
      strengths: [
        'Crystal clear differentiation between ROW_NUMBER, RANK, and DENSE_RANK.',
        'Strong awareness of cloud data warehouse partition pruning.',
      ],
      areasForImprovement: [
        'Incorporate business impact metrics (e.g. ROI, churn reduction) into data storytelling.',
        'Discuss statistical significance when reporting metric changes.',
      ],
      questionFeedback: [
        {
          question: 'Can you explain the difference between window functions like ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL, with a concrete use case?',
          answer: 'All three assign rank based on an ORDER BY clause within a PARTITION...',
          score: 92,
          strengths: 'Concise, correct mathematical definitions and realistic sales department scenario.',
          critique: 'Could provide the exact SQL syntax snippet to demonstrate complete fluency.',
          idealAnswer: 'Define how ties and gaps are handled, demonstrate partition by department_id order by revenue desc, and note when ROW_NUMBER is preferred for deduplication.',
        },
      ],
      recommendedTopics: [
        'A/B Testing Hypothesis Validation & Statistical Power',
        'Dimensional Modeling (Star vs Snowflake Schema)',
        'Cohort Retention Analysis in dbt',
      ],
    },
  },
  'HR': {
    role: 'HR',
    level: 'Intermediate',
    type: 'HR',
    questions: [
      {
        mainQuestion: 'Describe how you handle a situation where two senior team members have a toxic interpersonal conflict that is impacting team morale and sprint deliverables.',
        sampleAnswer: 'First, I meet with each individual privately to understand their perspectives without taking sides, listening for underlying root causes like ambiguous role ownership, communication breakdowns, or burnout. Next, I facilitate a structured, neutral mediation session focused on shared team objectives and professional boundaries. We establish documented agreements on working norms, and I conduct bi-weekly check-ins to monitor progress.',
        followUpTriggerAnswers: ['mediation', 'conflict', 'listen', 'private', 'burnout'],
        followUpQuestion: 'What specific steps would you take if one of the individuals refuses to abide by the agreed-upon norms and continues subtle passive-aggressive behavior?',
        followUpSampleAnswer: 'I would transition from coaching to formal performance management in partnership with leadership. I would document objective instances of non-compliance, explain the direct impact on team deliverables, and issue a clear Performance Improvement Plan (PIP) with concrete expectations and timelines, ensuring company policies and legal compliance are strictly upheld.',
      },
    ],
    sampleReport: {
      id: 'demo-report-hr-01',
      date: new Date().toISOString(),
      role: 'HR',
      level: 'Intermediate',
      type: 'HR',
      isDemo: true,
      durationSeconds: 680,
      overallScore: 92,
      technicalScore: 89,
      clarityScore: 95,
      relevanceScore: 93,
      problemSolvingScore: 91,
      summary: 'Exceptional communication clarity, empathy balanced with accountability, and professional conflict resolution methodology.',
      strengths: [
        'Methodical escalation path from private discovery to structured mediation.',
        'Objective, documentation-driven approach to performance management.',
      ],
      areasForImprovement: [
        'Could reference specific employment law frameworks or HRIS compliance tracking tools.',
        'Mention organizational pulse surveys or 360-degree feedback loops for early detection.',
      ],
      questionFeedback: [
        {
          question: 'Describe how you handle a situation where two senior team members have a toxic interpersonal conflict that is impacting team morale and sprint deliverables.',
          answer: 'First, I meet with each individual privately to understand their perspectives without taking sides...',
          score: 93,
          strengths: 'Empathetic, structured, and focused on shared business goals.',
          critique: 'Could emphasize proactive team health retrospectives.',
          idealAnswer: 'Use private exploratory sessions to separate facts from emotions, facilitate non-violent communication mediation, set clear RACI role boundaries, and follow up with documented milestones.',
        },
      ],
      recommendedTopics: [
        'Executive Coaching & Crucial Conversations',
        'DEI Policy Implementation & Retention Analytics',
        'HR Compliance & Progressive Discipline Procedures',
      ],
    },
  },
};
