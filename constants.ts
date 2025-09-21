import { Challenge, ChallengeCategory, LeaderboardUser, Resource, Badge, Quiz, QuizTopic, LearnTopic, AssignmentWeek, Assignment, SubmissionType, Notification, NotificationType, LearningVideo, Student, CommunityEvent, EventCategory, RedemptionItem, RewardCategory, EcoItem, CommunityHighlight, OnboardingQuizQuestion, ResourceType } from './types';

export const LOGO_URL = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cdefs%3E%3CradialGradient id='rad-grad' cx='30%25' cy='30%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='%23a7f3d0' /%3E%3Cstop offset='100%25' stop-color='%23059669' /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='128' cy='128' r='128' fill='url(%23rad-grad)'/%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='14' d='M128,192 V80 M104,112 C104,96 112,88 128,80 M152,112 C152,96 144,88 128,80'/%3E%3C/svg%3E`;

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 1, titleKey: 'challenge1_title', descriptionKey: 'challenge1_desc', category: ChallengeCategory.WASTE_REDUCTION, points: 20, completed: true },
  { id: 2, titleKey: 'challenge2_title', descriptionKey: 'challenge2_desc', category: ChallengeCategory.WATER, points: 15, completed: false },
  { id: 3, titleKey: 'challenge3_title', descriptionKey: 'challenge3_desc', category: ChallengeCategory.ENERGY, points: 25, completed: false },
  { id: 4, titleKey: 'challenge4_title', descriptionKey: 'challenge4_desc', category: ChallengeCategory.COMMUNITY, points: 50, completed: true },
  { id: 5, titleKey: 'challenge5_title', descriptionKey: 'challenge5_desc', category: ChallengeCategory.RECYCLING, points: 30, completed: false },
  { id: 6, titleKey: 'challenge6_title', descriptionKey: 'challenge6_desc', category: ChallengeCategory.WASTE_REDUCTION, points: 40, completed: false },
];

export const MOCK_ECO_ITEMS: Omit<EcoItem, 'isPlaced' | 'x' | 'y'>[] = [
    { id: 'item1', nameKey: 'eco_item_tree', emoji: '🌳', challengeId: 1 },
    { id: 'item2', nameKey: 'eco_item_flower', emoji: '🌸', challengeId: 4 },
    { id: 'item3', nameKey: 'eco_item_windmill', emoji: '🌬️', challengeId: 3 },
    { id: 'item4', nameKey: 'eco_item_recycling_bin', emoji: '♻️', challengeId: 5 },
    { id: 'item5', nameKey: 'eco_item_clean_river', emoji: '💧', challengeId: 2 },
    { id: 'item6', nameKey: 'eco_item_bench', emoji: '🏞️', challengeId: 6 },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Priya Patel', avatar: 'https://i.pravatar.cc/100?u=a042581f4e29026704d', points: 1250, school: 'Greenwood High' },
  { rank: 2, name: 'You', avatar: 'https://picsum.photos/id/237/100/100', points: 1100, school: 'Oakwood Academy' },
  { rank: 3, name: 'Ben Carter', avatar: 'https://i.pravatar.cc/100?u=a042581f4e29026705d', points: 980, school: 'Maple Leaf School' },
  { rank: 4, name: 'Aisha Khan', avatar: 'https://i.pravatar.cc/100?u=a042581f4e29026706d', points: 950, school: 'Riverdale Int.' },
  { rank: 5, name: 'Carlos Gomez', avatar: 'https://i.pravatar.cc/100?u=a042581f4e29026707d', points: 820, school: 'Hilltop Prep' },
];

export const MOCK_STUDENTS: Student[] = [
    { id: 'priya_p', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/100?u=priya', school: 'Greenwood High', points: 1250, challengesCompleted: 18 },
    { id: 'ben_c', name: 'Ben Carter', avatar: 'https://i.pravatar.cc/100?u=ben', school: 'Maple Leaf School', points: 980, challengesCompleted: 15 },
    { id: 'aisha_k', name: 'Aisha Khan', avatar: 'https://i.pravatar.cc/100?u=aisha', school: 'Riverdale Int.', points: 950, challengesCompleted: 14 },
    { id: 'carlos_g', name: 'Carlos Gomez', avatar: 'https://i.pravatar.cc/100?u=carlos', school: 'Hilltop Prep', points: 820, challengesCompleted: 12 },
    { id: 'sophia_l', name: 'Sophia Lee', avatar: 'https://i.pravatar.cc/100?u=sophia', school: 'Oakwood Academy', points: 780, challengesCompleted: 11 },
    { id: 'liam_w', name: 'Liam Wilson', avatar: 'https://i.pravatar.cc/100?u=liam', school: 'Greenwood High', points: 750, challengesCompleted: 11 },
    { id: 'olivia_m', name: 'Olivia Martin', avatar: 'https://i.pravatar.cc/100?u=olivia', school: 'Oakwood Academy', points: 690, challengesCompleted: 10 },
    { id: 'noah_t', name: 'Noah Taylor', avatar: 'https://i.pravatar.cc/100?u=noah', school: 'Maple Leaf School', points: 620, challengesCompleted: 9 },
    { id: 'emma_j', name: 'Emma Johnson', avatar: 'https://i.pravatar.cc/100?u=emma', school: 'Riverdale Int.', points: 550, challengesCompleted: 8 },
    { id: 'james_b', name: 'James Brown', avatar: 'https://i.pravatar.cc/100?u=james', school: 'Hilltop Prep', points: 480, challengesCompleted: 7 },
    { id: 'ava_d', name: 'Ava Davis', avatar: 'https://i.pravatar.cc/100?u=ava', school: 'Greenwood High', points: 410, challengesCompleted: 6 },
    { id: 'william_r', name: 'William Rodriguez', avatar: 'https://i.pravatar.cc/100?u=william', school: 'Oakwood Academy', points: 350, challengesCompleted: 5 },
    { id: 'isabella_h', name: 'Isabella Hernandez', avatar: 'https://i.pravatar.cc/100?u=isabella', school: 'Maple Leaf School', points: 280, challengesCompleted: 4 },
    { id: 'mason_p', name: 'Mason Perez', avatar: 'https://i.pravatar.cc/100?u=mason', school: 'Riverdale Int.', points: 210, challengesCompleted: 3 },
    { id: 'mia_g', name: 'Mia Gonzalez', avatar: 'https://i.pravatar.cc/100?u=mia', school: 'Hilltop Prep', points: 150, challengesCompleted: 2 },
    { id: 'alex_green', name: 'Alex Green', avatar: 'https://picsum.photos/id/237/100/100', school: 'Oakwood Academy', points: 1100, challengesCompleted: 16 },
];

export const MOCK_RESOURCES: Resource[] = [
  { id: 1, titleKey: 'resource1_title', summaryKey: 'resource1_summary', type: ResourceType.VIDEO, imageUrl: 'https://picsum.photos/seed/resource1/400/300' },
  { id: 2, titleKey: 'resource2_title', summaryKey: 'resource2_summary', type: ResourceType.ARTICLE, imageUrl: 'https://picsum.photos/seed/resource2/400/300' },
  { id: 3, titleKey: 'resource3_title', summaryKey: 'resource3_summary', type: ResourceType.GUIDE, imageUrl: 'https://picsum.photos/seed/resource3/400/300' },
];

export const MOCK_BADGES: Badge[] = [
    { id: 1, nameKey: 'badge_recycling_rookie', descriptionKey: 'badge_recycling_rookie_desc', emoji: '🥉', milestone: 1 },
    { id: 2, nameKey: 'badge_eco_initiate', descriptionKey: 'badge_eco_initiate_desc', emoji: '🥈', milestone: 3 },
    { id: 3, nameKey: 'badge_green_guardian', descriptionKey: 'badge_green_guardian_desc', emoji: '🥇', milestone: 5 },
    { id: 4, nameKey: 'badge_planet_protector', descriptionKey: 'badge_planet_protector_desc', emoji: '🏆', milestone: 10 },
];

export const MOCK_COMMUNITY_HIGHLIGHTS: CommunityHighlight[] = [
    {
      type: 'badge',
      userName: 'Aisha Khan',
      userAvatar: 'https://i.pravatar.cc/100?u=aisha',
      contentKey: 'community_highlight_badge',
      badgeNameKey: 'badge_planet_protector'
    },
    {
      type: 'challenge',
      userName: 'Carlos Gomez',
      userAvatar: 'https://i.pravatar.cc/100?u=carlos',
      contentKey: 'community_highlight_challenge',
      challengeTitleKey: 'challenge4_title',
      imageUrl: 'https://picsum.photos/seed/cleanup/400/300'
    },
    {
      type: 'badge',
      userName: 'Priya Patel',
      userAvatar: 'https://i.pravatar.cc/100?u=priya',
      contentKey: 'community_highlight_badge',
      badgeNameKey: 'badge_green_guardian'
    },
    {
      type: 'challenge',
      userName: 'Sophia Lee',
      userAvatar: 'https://i.pravatar.cc/100?u=sophia',
      contentKey: 'community_highlight_challenge',
      challengeTitleKey: 'challenge1_title',
      imageUrl: 'https://picsum.photos/seed/veggie/400/300'
    }
  ];

export const MOCK_ONBOARDING_QUIZ: OnboardingQuizQuestion[] = [
    {
        questionKey: 'onboarding_q1',
        options: [
            { textKey: 'onboarding_q1_a1', topic: 'Recycling' },
            { textKey: 'onboarding_q1_a2', topic: 'General' },
            { textKey: 'onboarding_q1_a3', topic: 'Water' },
        ],
    },
    {
        questionKey: 'onboarding_q2',
        options: [
            { textKey: 'onboarding_q2_a1', topic: 'Energy' },
            { textKey: 'onboarding_q2_a2', topic: 'General' },
            { textKey: 'onboarding_q2_a3', topic: 'Water' },
        ],
    },
    {
        questionKey: 'onboarding_q3',
        options: [
            { textKey: 'onboarding_q3_a1', topic: 'Recycling' },
            { textKey: 'onboarding_q3_a2', topic: 'Energy' },
            { textKey: 'onboarding_q3_a3', topic: 'General' },
        ],
    },
];

export const MOCK_QUIZZES: Record<string, Quiz> = {
    [QuizTopic.RECYCLING]: {
        titleKey: 'recycling_quiz',
        emoji: '♻️',
        questions: [
            { questionKey: 'main_quiz_recycling_q1', optionKeys: ['main_quiz_recycling_q1_o1', 'main_quiz_recycling_q1_o2', 'main_quiz_recycling_q1_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q2', optionKeys: ['main_quiz_recycling_q2_o1', 'main_quiz_recycling_q2_o2', 'main_quiz_recycling_q2_o3'], correctOptionIndex: 0 },
            { questionKey: 'main_quiz_recycling_q3', optionKeys: ['main_quiz_recycling_q3_o1', 'main_quiz_recycling_q3_o2', 'main_quiz_recycling_q3_o3'], correctOptionIndex: 0 },
            { questionKey: 'main_quiz_recycling_q4', optionKeys: ['main_quiz_recycling_q4_o1', 'main_quiz_recycling_q4_o2', 'main_quiz_recycling_q4_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q5', optionKeys: ['main_quiz_recycling_q5_o1', 'main_quiz_recycling_q5_o2', 'main_quiz_recycling_q5_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_recycling_q6', optionKeys: ['main_quiz_recycling_q6_o1', 'main_quiz_recycling_q6_o2', 'main_quiz_recycling_q6_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q7', optionKeys: ['main_quiz_recycling_q7_o1', 'main_quiz_recycling_q7_o2', 'main_quiz_recycling_q7_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q8', optionKeys: ['main_quiz_recycling_q8_o1', 'main_quiz_recycling_q8_o2', 'main_quiz_recycling_q8_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q9', optionKeys: ['main_quiz_recycling_q9_o1', 'main_quiz_recycling_q9_o2', 'main_quiz_recycling_q9_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_recycling_q10', optionKeys: ['main_quiz_recycling_q10_o1', 'main_quiz_recycling_q10_o2', 'main_quiz_recycling_q10_o3'], correctOptionIndex: 2 },
        ]
    },
    [QuizTopic.WATER]: {
        titleKey: 'water_conservation_quiz',
        emoji: '💧',
        questions: [
            { questionKey: 'main_quiz_water_q1', optionKeys: ['main_quiz_water_q1_o1', 'main_quiz_water_q1_o2', 'main_quiz_water_q1_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_water_q2', optionKeys: ['main_quiz_water_q2_o1', 'main_quiz_water_q2_o2', 'main_quiz_water_q2_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_water_q3', optionKeys: ['main_quiz_water_q3_o1', 'main_quiz_water_q3_o2', 'main_quiz_water_q3_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_water_q4', optionKeys: ['main_quiz_water_q4_o1', 'main_quiz_water_q4_o2', 'main_quiz_water_q4_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_water_q5', optionKeys: ['main_quiz_water_q5_o1', 'main_quiz_water_q5_o2', 'main_quiz_water_q5_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_water_q6', optionKeys: ['main_quiz_water_q6_o1', 'main_quiz_water_q6_o2', 'main_quiz_water_q6_o3'], correctOptionIndex: 0 },
            { questionKey: 'main_quiz_water_q7', optionKeys: ['main_quiz_water_q7_o1', 'main_quiz_water_q7_o2', 'main_quiz_water_q7_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_water_q8', optionKeys: ['main_quiz_water_q8_o1', 'main_quiz_water_q8_o2', 'main_quiz_water_q8_o3'], correctOptionIndex: 0 },
            { questionKey: 'main_quiz_water_q9', optionKeys: ['main_quiz_water_q9_o1', 'main_quiz_water_q9_o2', 'main_quiz_water_q9_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_water_q10', optionKeys: ['main_quiz_water_q10_o1', 'main_quiz_water_q10_o2', 'main_quiz_water_q10_o3'], correctOptionIndex: 1 },
        ]
    },
    [QuizTopic.ENERGY]: {
        titleKey: 'energy_saving_quiz',
        emoji: '⚡️',
        questions: [
            { questionKey: 'main_quiz_energy_q1', optionKeys: ['main_quiz_energy_q1_o1', 'main_quiz_energy_q1_o2', 'main_quiz_energy_q1_o3'], correctOptionIndex: 0 },
            { questionKey: 'main_quiz_energy_q2', optionKeys: ['main_quiz_energy_q2_o1', 'main_quiz_energy_q2_o2', 'main_quiz_energy_q2_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_energy_q3', optionKeys: ['main_quiz_energy_q3_o1', 'main_quiz_energy_q3_o2', 'main_quiz_energy_q3_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_energy_q4', optionKeys: ['main_quiz_energy_q4_o1', 'main_quiz_energy_q4_o2', 'main_quiz_energy_q4_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_energy_q5', optionKeys: ['main_quiz_energy_q5_o1', 'main_quiz_energy_q5_o2', 'main_quiz_energy_q5_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_energy_q6', optionKeys: ['main_quiz_energy_q6_o1', 'main_quiz_energy_q6_o2', 'main_quiz_energy_q6_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_energy_q7', optionKeys: ['main_quiz_energy_q7_o1', 'main_quiz_energy_q7_o2', 'main_quiz_energy_q7_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_energy_q8', optionKeys: ['main_quiz_energy_q8_o1', 'main_quiz_energy_q8_o2', 'main_quiz_energy_q8_o3'], correctOptionIndex: 2 },
            { questionKey: 'main_quiz_energy_q9', optionKeys: ['main_quiz_energy_q9_o1', 'main_quiz_energy_q9_o2', 'main_quiz_energy_q9_o3'], correctOptionIndex: 1 },
            { questionKey: 'main_quiz_energy_q10', optionKeys: ['main_quiz_energy_q10_o1', 'main_quiz_energy_q10_o2', 'main_quiz_energy_q10_o3'], correctOptionIndex: 1 },
        ]
    }
};

export const MOCK_REDEMPTION_ITEMS: RedemptionItem[] = [
    { id: 'v1', category: RewardCategory.VIRTUAL, titleKey: 'reward_title_avatar_frame', descriptionKey: 'reward_desc_avatar_frame', cost: 1500, icon: 'Badge', imageUrl: 'https://picsum.photos/seed/frame/200' },
    { id: 'v2', category: RewardCategory.VIRTUAL, titleKey: 'reward_title_profile_badge', descriptionKey: 'reward_desc_profile_badge', cost: 2500, icon: 'Badge', imageUrl: 'https://picsum.photos/seed/badge/200' },
    { id: 'd1', category: RewardCategory.DISCOUNT, titleKey: 'reward_title_cafe_coupon', descriptionKey: 'reward_desc_cafe_coupon', cost: 1000, icon: 'Coupon' },
    { id: 'd2', category: RewardCategory.DISCOUNT, titleKey: 'reward_title_store_discount', descriptionKey: 'reward_desc_store_discount', cost: 3000, icon: 'Coupon' },
    { id: 'c1', category: RewardCategory.DONATION, titleKey: 'reward_title_plant_tree', descriptionKey: 'reward_desc_plant_tree', cost: 500, icon: 'Donation' },
    { id: 'c2', category: RewardCategory.DONATION, titleKey: 'reward_title_ocean_cleanup', descriptionKey: 'reward_desc_ocean_cleanup', cost: 750, icon: 'Donation' },
    { id: 'a1', category: RewardCategory.AVATAR, titleKey: 'reward_title_avatar_warrior', descriptionKey: 'reward_desc_avatar_warrior', cost: 2000, icon: 'Gift', imageUrl: 'https://i.pravatar.cc/100?u=warrior' },
    { id: 'a2', category: RewardCategory.AVATAR, titleKey: 'reward_title_avatar_gardener', descriptionKey: 'reward_desc_avatar_gardener', cost: 2000, icon: 'Gift', imageUrl: 'https://i.pravatar.cc/100?u=gardener' },
];

export const MOCK_COMMUNITY_EVENTS: CommunityEvent[] = [
    { 
        id: 1, 
        titleKey: 'event_title_1', 
        descriptionKey: 'event_desc_1', 
        category: EventCategory.ECO_TRANSPORT, 
        points: 250, 
        maxMembers: 10, 
        currentMembers: 3, 
        isJoined: false, 
        proposer: { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/100?u=priya' },
        date: '2024-11-10',
        time: '2:00 PM',
        venue: 'University Quad',
        participants: ['Priya Patel', 'Ben Carter', 'Sophia Lee']
    },
    { 
        id: 2, 
        titleKey: 'event_title_2', 
        descriptionKey: 'event_desc_2', 
        category: EventCategory.OCEANS, 
        points: 300, 
        maxMembers: 15, 
        currentMembers: 2, 
        isJoined: true, 
        proposer: { name: 'Ben Carter', avatar: 'https://i.pravatar.cc/100?u=ben' },
        date: '2024-11-15',
        time: '9:00 AM - 12:00 PM',
        venue: 'Oakwood Beach',
        participants: ['Ben Carter', 'Alex Green']
    },
    { 
        id: 3, 
        titleKey: 'event_title_3', 
        descriptionKey: 'event_desc_3', 
        category: EventCategory.SUSTAINABLE_AGRICULTURE, 
        points: 400, 
        maxMembers: 15, 
        currentMembers: 1, 
        isJoined: false, 
        proposer: { name: 'Aisha Khan', avatar: 'https://i.pravatar.cc/100?u=aisha' },
        date: '2024-11-22',
        time: '1:00 PM',
        venue: 'Community Garden Plot 5',
        participants: ['Aisha Khan']
    },
    { 
        id: 4, 
        titleKey: 'event_title_4', 
        descriptionKey: 'event_desc_4', 
        category: EventCategory.AWARENESS_CAMPAIGNS, 
        points: 200, 
        maxMembers: 20, 
        currentMembers: 0, 
        isJoined: false, 
        proposer: { name: 'Carlos Gomez', avatar: 'https://i.pravatar.cc/100?u=carlos' },
        date: '2024-12-01',
        time: 'All Day',
        venue: 'Online / Campus Wide',
        participants: []
    },
    { 
        id: 5, 
        titleKey: 'event_title_5', 
        descriptionKey: 'event_desc_5', 
        category: EventCategory.GREEN_BUILDING, 
        points: 500, 
        maxMembers: 8, 
        currentMembers: 8, 
        isJoined: false, 
        proposer: { name: 'Sophia Lee', avatar: 'https://i.pravatar.cc/100?u=sophia' },
        date: '2024-11-18',
        time: '11:00 AM',
        venue: 'Engineering Building, Room 301',
        participants: ['Sophia Lee', 'Liam Wilson', 'Olivia Martin', 'Noah Taylor', 'Emma Johnson', 'James Brown', 'Ava Davis', 'William Rodriguez']
    },
];

export const MOCK_LEARN_TOPICS: LearnTopic[] = [
    {
        id: 'climate_change',
        titleKey: 'topic_climate_change_title',
        descriptionKey: 'topic_climate_change_desc',
        icon: 'ClimateChange',
        levels: [
            {
                level: 1,
                titleKey: 'level_1_intro_title',
                badgeEmoji: '🌡️',
                content: [
                    { id: 'cc_vid_1', type: 'video', titleKey: 'content_climate_video_title', points: 20, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
                    { id: 'cc_art_1', type: 'article', titleKey: 'content_climate_article_title', points: 15, contentKey: 'content_climate_article_body' },
                    { id: 'cc_quiz_1', type: 'quiz', titleKey: 'content_climate_quiz_title', points: 25, questions: [
                        { questionKey: 'learn_quiz_cc_q1', optionKeys: ['learn_quiz_cc_q1_o1', 'learn_quiz_cc_q1_o2', 'learn_quiz_cc_q1_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_cc_q2', optionKeys: ['learn_quiz_cc_q2_o1', 'learn_quiz_cc_q2_o2', 'learn_quiz_cc_q2_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_cc_q3', optionKeys: ['learn_quiz_cc_q3_o1', 'learn_quiz_cc_q3_o2', 'learn_quiz_cc_q3_o3'], correctOptionIndex: 2 },
                        { questionKey: 'learn_quiz_cc_q4', optionKeys: ['learn_quiz_cc_q4_o1', 'learn_quiz_cc_q4_o2', 'learn_quiz_cc_q4_o3'], correctOptionIndex: 0 },
                        { questionKey: 'learn_quiz_cc_q5', optionKeys: ['learn_quiz_cc_q5_o1', 'learn_quiz_cc_q5_o2', 'learn_quiz_cc_q5_o3'], correctOptionIndex: 0 },
                        { questionKey: 'learn_quiz_cc_q6', optionKeys: ['learn_quiz_cc_q6_o1', 'learn_quiz_cc_q6_o2', 'learn_quiz_cc_q6_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_cc_q7', optionKeys: ['learn_quiz_cc_q7_o1', 'learn_quiz_cc_q7_o2', 'learn_quiz_cc_q7_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_cc_q8', optionKeys: ['learn_quiz_cc_q8_o1', 'learn_quiz_cc_q8_o2', 'learn_quiz_cc_q8_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_cc_q9', optionKeys: ['learn_quiz_cc_q9_o1', 'learn_quiz_cc_q9_o2', 'learn_quiz_cc_q9_o3'], correctOptionIndex: 2 },
                        { questionKey: 'learn_quiz_cc_q10', optionKeys: ['learn_quiz_cc_q10_o1', 'learn_quiz_cc_q10_o2', 'learn_quiz_cc_q10_o3'], correctOptionIndex: 1 },
                    ]}
                ]
            },
            {
                level: 2,
                titleKey: 'level_2_solutions_title',
                badgeEmoji: '💡',
                content: [
                    { id: 'cc_ebook_1', type: 'ebook', titleKey: 'content_climate_ebook_title', points: 50, contentKey: 'content_climate_ebook_body' },
                    { id: 'cc_info_1', type: 'infographic', titleKey: 'content_climate_infographic_title', points: 20, imageUrl: 'https://picsum.photos/seed/renewable/600/800' },
                    { id: 'cc_case_1', type: 'case_study', titleKey: 'content_climate_case_study_title', points: 30, contentKey: 'content_climate_case_study_body' }
                ]
            }
        ]
    },
    {
        id: 'water_conservation',
        titleKey: 'topic_water_conservation_title',
        descriptionKey: 'topic_water_conservation_desc',
        icon: 'WaterConservation',
        levels: [
            {
                level: 1,
                titleKey: 'level_1_water_basics_title',
                badgeEmoji: '💧',
                content: [
                    { id: 'wc_vid_1', type: 'video', titleKey: 'content_water_video_title', points: 20, url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
                    { id: 'wc_ebook_1', type: 'ebook', titleKey: 'content_water_ebook_title', points: 40, contentKey: 'content_water_ebook_body' },
                    { id: 'wc_quiz_1', type: 'quiz', titleKey: 'content_water_quiz_title', points: 25, questions: [
                        { questionKey: 'learn_quiz_wc_q1', optionKeys: ['learn_quiz_wc_q1_o1', 'learn_quiz_wc_q1_o2', 'learn_quiz_wc_q1_o3'], correctOptionIndex: 0 },
                        { questionKey: 'learn_quiz_wc_q2', optionKeys: ['learn_quiz_wc_q2_o1', 'learn_quiz_wc_q2_o2', 'learn_quiz_wc_q2_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q3', optionKeys: ['learn_quiz_wc_q3_o1', 'learn_quiz_wc_q3_o2', 'learn_quiz_wc_q3_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q4', optionKeys: ['learn_quiz_wc_q4_o1', 'learn_quiz_wc_q4_o2', 'learn_quiz_wc_q4_o3'], correctOptionIndex: 2 },
                        { questionKey: 'learn_quiz_wc_q5', optionKeys: ['learn_quiz_wc_q5_o1', 'learn_quiz_wc_q5_o2', 'learn_quiz_wc_q5_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q6', optionKeys: ['learn_quiz_wc_q6_o1', 'learn_quiz_wc_q6_o2', 'learn_quiz_wc_q6_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q7', optionKeys: ['learn_quiz_wc_q7_o1', 'learn_quiz_wc_q7_o2', 'learn_quiz_wc_q7_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q8', optionKeys: ['learn_quiz_wc_q8_o1', 'learn_quiz_wc_q8_o2', 'learn_quiz_wc_q8_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q9', optionKeys: ['learn_quiz_wc_q9_o1', 'learn_quiz_wc_q9_o2', 'learn_quiz_wc_q9_o3'], correctOptionIndex: 1 },
                        { questionKey: 'learn_quiz_wc_q10', optionKeys: ['learn_quiz_wc_q10_o1', 'learn_quiz_wc_q10_o2', 'learn_quiz_wc_q10_o3'], correctOptionIndex: 2 },
                    ]}
                ]
            }
        ]
    },
    {
        id: 'circular_economy',
        titleKey: 'topic_circular_economy_title',
        descriptionKey: 'topic_circular_economy_desc',
        icon: 'CircularEconomy',
        levels: [
            { level: 1, titleKey: 'level_1_circular_intro_title', badgeEmoji: '🔄', content: [] }
        ]
    },
    {
        id: 'biodiversity',
        titleKey: 'topic_biodiversity_title',
        descriptionKey: 'topic_biodiversity_desc',
        icon: 'Biodiversity',
        levels: [
            { level: 1, titleKey: 'level_1_biodiversity_intro_title', badgeEmoji: '🦋', content: [] }
        ]
    }
];

export const MOCK_ASSIGNMENT_WEEKS: AssignmentWeek[] = [
    { 
        weekNumber: 1, titleKey: 'assignment_week_1_title', themeEmoji: '💧', 
        assignments: [
            { id: 101, titleKey: 'assignment_1_1_title', descriptionKey: 'assignment_1_1_desc', points: 100, submissionType: SubmissionType.IMAGE },
            { id: 102, titleKey: 'assignment_1_2_title', descriptionKey: 'assignment_1_2_desc', points: 150, submissionType: SubmissionType.TEXT }
        ]
    },
    { 
        weekNumber: 2, titleKey: 'assignment_week_2_title', themeEmoji: '♻️', 
        assignments: [
            { id: 201, titleKey: 'assignment_2_1_title', descriptionKey: 'assignment_2_1_desc', points: 120, submissionType: SubmissionType.VIDEO },
            { id: 202, titleKey: 'assignment_2_2_title', descriptionKey: 'assignment_2_2_desc', points: 130, submissionType: SubmissionType.IMAGE }
        ]
    },
    { 
        weekNumber: 3, titleKey: 'assignment_week_3_title', themeEmoji: '⚡️', 
        assignments: [
            { id: 301, titleKey: 'assignment_3_1_title', descriptionKey: 'assignment_3_1_desc', points: 125, submissionType: SubmissionType.IMAGE },
            { id: 302, titleKey: 'assignment_3_2_title', descriptionKey: 'assignment_3_2_desc', points: 125, submissionType: SubmissionType.TEXT }
        ]
    },
    { 
        weekNumber: 4, titleKey: 'assignment_week_4_title', themeEmoji: '🥦', 
        assignments: [
            { id: 401, titleKey: 'assignment_4_1_title', descriptionKey: 'assignment_4_1_desc', points: 150, submissionType: SubmissionType.IMAGE },
            { id: 402, titleKey: 'assignment_4_2_title', descriptionKey: 'assignment_4_2_desc', points: 100, submissionType: SubmissionType.TEXT }
        ]
    },
    { 
        weekNumber: 5, titleKey: 'assignment_week_5_title', themeEmoji: '🦋', 
        assignments: [
            { id: 501, titleKey: 'assignment_5_1_title', descriptionKey: 'assignment_5_1_desc', points: 150, submissionType: SubmissionType.IMAGE },
            { id: 502, titleKey: 'assignment_5_2_title', descriptionKey: 'assignment_5_2_desc', points: 150, submissionType: SubmissionType.VIDEO }
        ]
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: NotificationType.LEADERBOARD,
        titleKey: 'notification_leaderboard_up_title',
        messageKey: 'notification_leaderboard_up_message',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        read: false,
        relatedId: 2
    },
    {
        id: 2,
        type: NotificationType.ASSIGNMENT,
        titleKey: 'notification_assignment_due_title',
        messageKey: 'notification_assignment_due_message',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        relatedId: 101,
    },
    {
        id: 3,
        type: NotificationType.TIP,
        titleKey: 'notification_tip_title',
        messageKey: 'notification_tip_message',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
    },
    {
        id: 4,
        type: NotificationType.EVENT,
        titleKey: 'notification_event_title',
        messageKey: 'notification_event_message',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        read: true,
    },
];

export const MOCK_REWARDS = [
    { milestone: 2, nameKey: 'reward_1_name', emoji: '🌱' },
    { milestone: 4, nameKey: 'reward_2_name', emoji: '🌳' },
    { milestone: 6, nameKey: 'reward_3_name', emoji: '🏞️' },
    { milestone: 8, nameKey: 'reward_4_name', emoji: '🌍' },
    { milestone: 10, nameKey: 'reward_5_name', emoji: '🌟' },
];

// For Learning Videos feature
export const SUCCESS_SOUND_URL = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
export const FAILURE_SOUND_URL = 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg';

export const MOCK_LEARNING_VIDEOS: LearningVideo[] = [
    {
        id: 'lv1',
        titleKey: 'video_title_recycling',
        descriptionKey: 'video_desc_recycling',
        thumbnailUrl: 'https://picsum.photos/seed/recycling/600/400',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '1:15',
        points: 50,
        quiz: [
            { questionKey: 'video_quiz1_q1', options: ['video_quiz1_q1_op1', 'video_quiz1_q1_op2', 'video_quiz1_q1_op3'], correctOptionIndex: 0, hintKey: 'video_quiz1_q1_hint' },
            { questionKey: 'video_quiz1_q2', options: ['video_quiz1_q2_op1', 'video_quiz1_q2_op2', 'video_quiz1_q2_op3'], correctOptionIndex: 2, hintKey: 'video_quiz1_q2_hint' },
            { questionKey: 'video_quiz1_q3', options: ['video_quiz1_q3_op1', 'video_quiz1_q3_op2', 'video_quiz1_q3_op3'], correctOptionIndex: 1, hintKey: 'video_quiz1_q3_hint' },
            { questionKey: 'video_quiz1_q4', options: ['video_quiz1_q4_op1', 'video_quiz1_q4_op2', 'video_quiz1_q4_op3'], correctOptionIndex: 1, hintKey: 'video_quiz1_q4_hint' },
            { questionKey: 'video_quiz1_q5', options: ['video_quiz1_q5_op1', 'video_quiz1_q5_op2', 'video_quiz1_q5_op3'], correctOptionIndex: 0, hintKey: 'video_quiz1_q5_hint' },
            { questionKey: 'video_quiz1_q6', options: ['video_quiz1_q6_op1', 'video_quiz1_q6_op2', 'video_quiz1_q6_op3'], correctOptionIndex: 2, hintKey: 'video_quiz1_q6_hint' },
            { questionKey: 'video_quiz1_q7', options: ['video_quiz1_q7_op1', 'video_quiz1_q7_op2', 'video_quiz1_q7_op3'], correctOptionIndex: 0, hintKey: 'video_quiz1_q7_hint' },
            { questionKey: 'video_quiz1_q8', options: ['video_quiz1_q8_op1', 'video_quiz1_q8_op2', 'video_quiz1_q8_op3'], correctOptionIndex: 1, hintKey: 'video_quiz1_q8_hint' },
            { questionKey: 'video_quiz1_q9', options: ['video_quiz1_q9_op1', 'video_quiz1_q9_op2', 'video_quiz1_q9_op3'], correctOptionIndex: 2, hintKey: 'video_quiz1_q9_hint' },
            { questionKey: 'video_quiz1_q10', options: ['video_quiz1_q10_op1', 'video_quiz1_q10_op2', 'video_quiz1_q10_op3'], correctOptionIndex: 0, hintKey: 'video_quiz1_q10_hint' },
        ]
    },
    {
        id: 'lv2',
        titleKey: 'video_title_water',
        descriptionKey: 'video_desc_water',
        thumbnailUrl: 'https://picsum.photos/seed/water/600/400',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '2:30',
        points: 75,
        quiz: [
            { questionKey: 'video_quiz2_q1', options: ['video_quiz2_q1_op1', 'video_quiz2_q1_op2', 'video_quiz2_q1_op3'], correctOptionIndex: 1, hintKey: 'video_quiz2_q1_hint' },
            { questionKey: 'video_quiz2_q2', options: ['video_quiz2_q2_op1', 'video_quiz2_q2_op2', 'video_quiz2_q2_op3'], correctOptionIndex: 2, hintKey: 'video_quiz2_q2_hint' },
            { questionKey: 'video_quiz2_q3', options: ['video_quiz2_q3_op1', 'video_quiz2_q3_op2', 'video_quiz2_q3_op3'], correctOptionIndex: 0, hintKey: 'video_quiz2_q3_hint' },
            { questionKey: 'video_quiz2_q4', options: ['video_quiz2_q4_op1', 'video_quiz2_q4_op2', 'video_quiz2_q4_op3'], correctOptionIndex: 1, hintKey: 'video_quiz2_q4_hint' },
            { questionKey: 'video_quiz2_q5', options: ['video_quiz2_q5_op1', 'video_quiz2_q5_op2', 'video_quiz2_q5_op3'], correctOptionIndex: 2, hintKey: 'video_quiz2_q5_hint' },
            { questionKey: 'video_quiz2_q6', options: ['video_quiz2_q6_op1', 'video_quiz2_q6_op2', 'video_quiz2_q6_op3'], correctOptionIndex: 0, hintKey: 'video_quiz2_q6_hint' },
            { questionKey: 'video_quiz2_q7', options: ['video_quiz2_q7_op1', 'video_quiz2_q7_op2', 'video_quiz2_q7_op3'], correctOptionIndex: 1, hintKey: 'video_quiz2_q7_hint' },
            { questionKey: 'video_quiz2_q8', options: ['video_quiz2_q8_op1', 'video_quiz2_q8_op2', 'video_quiz2_q8_op3'], correctOptionIndex: 2, hintKey: 'video_quiz2_q8_hint' },
            { questionKey: 'video_quiz2_q9', options: ['video_quiz2_q9_op1', 'video_quiz2_q9_op2', 'video_quiz2_q9_op3'], correctOptionIndex: 0, hintKey: 'video_quiz2_q9_hint' },
            { questionKey: 'video_quiz2_q10', options: ['video_quiz2_q10_op1', 'video_quiz2_q10_op2', 'video_quiz2_q10_op3'], correctOptionIndex: 1, hintKey: 'video_quiz2_q10_hint' },
        ]
    },
    {
        id: 'lv3',
        titleKey: 'video_title_composting',
        descriptionKey: 'video_desc_composting',
        thumbnailUrl: 'https://picsum.photos/seed/compost/600/400',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '3:05',
        points: 100,
        quiz: [
            { questionKey: 'video_quiz3_q1', options: ['video_quiz3_q1_op1', 'video_quiz3_q1_op2', 'video_quiz3_q1_op3'], correctOptionIndex: 0, hintKey: 'video_quiz3_q1_hint' },
            { questionKey: 'video_quiz3_q2', options: ['video_quiz3_q2_op1', 'video_quiz3_q2_op2', 'video_quiz3_q2_op3'], correctOptionIndex: 1, hintKey: 'video_quiz3_q2_hint' },
            { questionKey: 'video_quiz3_q3', options: ['video_quiz3_q3_op1', 'video_quiz3_q3_op2', 'video_quiz3_q3_op3'], correctOptionIndex: 1, hintKey: 'video_quiz3_q3_hint' },
            { questionKey: 'video_quiz3_q4', options: ['video_quiz3_q4_op1', 'video_quiz3_q4_op2', 'video_quiz3_q4_op3'], correctOptionIndex: 2, hintKey: 'video_quiz3_q4_hint' },
            { questionKey: 'video_quiz3_q5', options: ['video_quiz3_q5_op1', 'video_quiz3_q5_op2', 'video_quiz3_q5_op3'], correctOptionIndex: 0, hintKey: 'video_quiz3_q5_hint' },
            { questionKey: 'video_quiz3_q6', options: ['video_quiz3_q6_op1', 'video_quiz3_q6_op2', 'video_quiz3_q6_op3'], correctOptionIndex: 1, hintKey: 'video_quiz3_q6_hint' },
            { questionKey: 'video_quiz3_q7', options: ['video_quiz3_q7_op1', 'video_quiz3_q7_op2', 'video_quiz3_q7_op3'], correctOptionIndex: 2, hintKey: 'video_quiz3_q7_hint' },
            { questionKey: 'video_quiz3_q8', options: ['video_quiz3_q8_op1', 'video_quiz3_q8_op2', 'video_quiz3_q8_op3'], correctOptionIndex: 0, hintKey: 'video_quiz3_q8_hint' },
            { questionKey: 'video_quiz3_q9', options: ['video_quiz3_q9_op1', 'video_quiz3_q9_op2', 'video_quiz3_q9_op3'], correctOptionIndex: 1, hintKey: 'video_quiz3_q9_hint' },
            { questionKey: 'video_quiz3_q10', options: ['video_quiz3_q10_op1', 'video_quiz3_q10_op2', 'video_quiz3_q10_op3'], correctOptionIndex: 2, hintKey: 'video_quiz3_q10_hint' },
        ]
    }
];