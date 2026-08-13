window.AGILIX_BLOGS = [
    {
        id: 'intention-beats-features',
        date: '2026-06-12',
        dateLabel: 'Jun 12, 2026',
        title: 'why intention beats feature lists',
        popularity: 64,
        likes: 24,
        excerpt:
            'Most roadmaps fail from unclear intent—not missing features. Here’s how we frame problems before we write a line of code.',
        image: '/assets/blogs/intention-planning.jpg',
        imageAlt: 'Team collaborating around a table during product planning',
        body: [
            'Teams often treat a roadmap like a shopping list: more features, more progress. In practice, the opposite is true. When intent is fuzzy, every request looks urgent, every edge case becomes a ticket, and shipping becomes a negotiation instead of a decision.',
            'We start every engagement by naming the outcome in plain language. Who changes their behavior if this works? What decision gets faster? What risk shrinks? If we cannot answer those questions, we are not ready to size work—we are still exploring.',
            'A useful intention statement is short enough to remember and sharp enough to reject ideas. “Help ops resolve incidents in under ten minutes” beats “build a better dashboard.” The first one tells you what to measure. The second one invites endless UI debates.',
            'Feature lists still matter, but they come after the cut. Once intention is clear, we sequence the smallest set of capabilities that prove the outcome. Everything else waits—not because it is worthless, but because unfinished intent is more expensive than unfinished features.',
            'That discipline shows up in demos and releases. Stakeholders stop asking “when is everything done?” and start asking “did we move the needle?” That shift is how products stay calm while they grow.'
        ]
    },
    {
        id: 'shipping-saas-without-drama',
        date: '2026-05-03',
        dateLabel: 'May 3, 2026',
        title: 'shipping saas without the drama',
        popularity: 91,
        likes: 41,
        excerpt:
            'Practical rituals for releases, observability, and feedback loops that keep products calm under growth.',
        image: '/assets/blogs/saas-shipping.jpg',
        imageAlt: 'Developer writing code in a dark editor while shipping software',
        body: [
            'SaaS drama usually arrives as a surprise: a release that “worked in staging,” a silent failure in production, or a feature that users never find. Calm shipping is not luck. It is a set of boring rituals done every time.',
            'We treat every release as a reversible step. Feature flags, migration plans, and rollback paths are part of the definition of done—not extras for later. If you cannot undo a change safely, you have not finished designing the change.',
            'Observability comes before celebration. Dashboards for errors, latency, and the one business metric the release was meant to move sit next to the deploy button. If those signals are quiet for a measured window, we call it shipped. If they spike, we roll back first and debate later.',
            'Feedback loops close the week, not the quarter. Short release notes, in-product prompts, and a standing review of support tickets keep the team honest about what customers actually experience. Growth without that loop turns into noise with more users.',
            'The goal is not zero incidents. The goal is predictable recovery and clear ownership. When those are in place, shipping stops feeling like a high-wire act and starts feeling like craft.'
        ]
    },
    {
        id: 'ai-that-solves-real-work',
        date: '2026-03-18',
        dateLabel: 'Mar 18, 2026',
        title: 'ai that solves real work',
        popularity: 118,
        likes: 67,
        excerpt:
            'Where AI adds leverage in product teams—and where it just adds noise. A grounded take from delivery floors.',
        image: '/assets/blogs/ai-work.jpg',
        imageAlt: 'White robot representing practical AI applied to real work',
        body: [
            'AI earns its place when it removes a real bottleneck: drafting from messy notes, classifying support volume, summarizing long threads, or spotting patterns people miss under deadline pressure. It fails when it becomes a demo layered on top of an unclear process.',
            'We ask one filter question before adding a model: what work gets finished faster, cheaper, or with fewer errors—and how will we know? If the answer is “it feels modern,” we stop. If the answer names a measurable task, we keep going.',
            'The strongest patterns we see are assistive, not autonomous. AI drafts; people decide. AI clusters; people prioritize. AI suggests next steps; systems enforce permissions and audit trails. That split keeps quality high and trust intact.',
            'Noise shows up as unbounded chat widgets, hallucinated answers in customer-facing flows, and tools that create more review work than they remove. Those are process problems wearing AI clothing.',
            'Used with intention, AI is leverage for teams that already know how they work. Used without intention, it is another feature list—impressive until someone has to maintain it.'
        ]
    },
    {
        id: 'remote-teams-that-ship',
        date: '2026-02-04',
        dateLabel: 'Feb 4, 2026',
        title: 'building remote teams that actually ship',
        popularity: 83,
        likes: 33,
        excerpt:
            'How we keep distributed squads aligned—clear ownership, async rituals, and the habits that replace hallway talk.',
        image: '/assets/blogs/remote-teams.jpg',
        imageAlt: 'Remote team collaborating around sticky notes in a workshop',
        body: [
            'Remote teams do not fail from distance. They fail from ambiguous ownership and meetings that try to replace writing. Hallway talk used to carry context; remote work needs that context on purpose.',
            'We assign one accountable owner per outcome—not a committee. That person keeps the intention visible, sequences decisions, and makes trade-offs explicit. Collaboration stays wide; responsibility stays narrow.',
            'Async rituals beat status theater. Written updates, decision logs, and short recorded demos let people contribute across time zones without waiting for a shared hour. Live time is reserved for disagreement and design, not recaps.',
            'Trust is operational. Shared definitions of ready and done, predictable review windows, and honest capacity planning reduce the urge to micromanage. People ship when they know what “good” looks like and when feedback will arrive.',
            'The result is not a quieter Slack. The result is fewer surprises at release time—and a team that can grow without losing its pace.'
        ]
    }
];
