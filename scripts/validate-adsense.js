/**
 * TrendBriefly — AdSense Compliance Validator
 * 
 * Usage: node scripts/validate-adsense.js
 *        node scripts/validate-adsense.js "specific-slug"
 * 
 * Checks all posts in data/posts.json against Google AdSense policies.
 * Run this AFTER every blog post creation or edit.
 * 
 * Exit codes:
 *   0 = All posts pass
 *   1 = Violations found
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS_FILE = path.join(ROOT, 'data', 'posts.json');

// ─── Prohibited Content Keywords ─────────────────────────────────────────────
// These trigger an ERROR — content must NOT contain these patterns.
// Organized by AdSense policy category.

const PROHIBITED_PATTERNS = {
    'Sexually Explicit Content': [
        /\bpornograph(y|ic)\b/i,
        /\bhentai\b/i,
        /\bescort\s+service/i,
        /\bstrip\s*club/i,
        /\bsex\s*worker/i,
        /\bprostitut(e|ion)\b/i,
        /\bdeepfake\s*(porn|nude|naked)/i,
        /\bnude\s*photo/i,
        /\bexplicit\s*sexual/i,
    ],
    'Violence & Threats': [
        /\bhow\s+to\s+(make|build)\s+(a\s+)?bomb/i,
        /\bbomb[\s-]*making/i,
        /\bhow\s+to\s+kill\b/i,
        /\bhow\s+to\s+poison\b/i,
        /\bterrorist\s*(attack|act|recruitment)/i,
        /\bjoin\s*(isis|al[\s-]*qaeda|taliban)/i,
        /\bschool\s*shoot/i,
        /\bmass\s*shoot/i,
    ],
    'Hate Speech': [
        /\bwhite\s*suprem/i,
        /\bneo[\s-]*nazi/i,
        /\bethnic\s*cleans/i,
        /\bracial\s*superi/i,
        /\bkill\s+all\s+\w+/i,
        /\bholocaust\s*denial/i,
    ],
    'Dangerous Health Misinformation': [
        /\bvaccines?\s*(cause|are\s+dangerous|are\s+poison|kill)/i,
        /\banti[\s-]*vax/i,
        /\bcovid\s*(is\s+)?(a\s+)?(hoax|fake|not\s+real)/i,
        /\b(aids|hiv)\s*(is\s+)?(a\s+)?(hoax|fake|not\s+real|doesn'?t\s+exist)/i,
        /\bgay\s*conversion\s*therapy/i,
        /\bclimate\s*change\s*(is\s+)?(a\s+)?(hoax|fake|not\s+real|myth|scam)/i,
    ],
    'Hacking & Exploitation': [
        /\bhow\s+to\s+hack\b/i,
        /\bcrack(ing|ed)?\s*(software|password|account)/i,
        /\bphishing\s*(kit|tutorial|guide)/i,
        /\bkeylogger\s*(tutorial|download|install)/i,
        /\bexploit\s*(kit|tutorial|download)/i,
        /\bddos\s*(attack|tool|tutorial)/i,
        /\bransomware\s*(create|build|tutorial)/i,
        /\bbypass\s*(security|firewall|antivirus)/i,
    ],
    'Drugs & Controlled Substances': [
        /\bbuy\s+(cocaine|heroin|meth|lsd|ecstasy|mdma)\b/i,
        /\bhow\s+to\s+(make|cook|grow)\s+(meth|cocaine|heroin|lsd|crack)/i,
        /\bdrug\s*dealer/i,
        /\bdark\s*web\s*(market|drug|buy)/i,
    ],
    'Weapons Sales': [
        /\bbuy\s+(gun|rifle|shotgun|pistol|firearm|ammunition|ammo)\s+online/i,
        /\b(gun|firearm)\s*for\s*sale/i,
        /\b3d[\s-]*print(ed|ing)?\s*(gun|firearm|weapon)/i,
    ],
    'Gambling Promotion': [
        /\bonline\s*casino\s*(bonus|sign[\s-]*up|register)/i,
        /\bbet(ting)?\s+site\s*(sign[\s-]*up|register|bonus)/i,
        /\bguaranteed\s*(win|profit|return)/i,
    ],
    'Deceptive Content': [
        /\bget\s*rich\s*quick/i,
        /\bmake\s*\$?\d+[,.]?\d*k?\s*(per|a|every)\s*(day|hour|minute)/i,
        /\b(earn|make)\s*money\s*fast\s*(and\s*easy|guaranteed)/i,
        /\b100%\s*guaranteed\s*(income|profit|return)/i,
        /\bno\s*risk\s*(investment|profit|income)/i,
    ],
    'Child Exploitation (ZERO TOLERANCE)': [
        /\bchild\s*(porn|abuse|exploit)/i,
        /\bpedophil/i,
        /\bunderage\s*(sex|nude|naked)/i,
        /\bminor\s*(sex|nude|naked)/i,
    ],
    'Counterfeit & Fraud': [
        /\bfake\s*(passport|diploma|id\s*card|driver.?s?\s*licen[cs]e)/i,
        /\bbuy\s*(fake|counterfeit)\b/i,
        /\bfraudulent\s*(document|certificate)/i,
    ],
};

// ─── Warning Patterns ────────────────────────────────────────────────────────
// These trigger a WARNING — content is restricted and will receive fewer ads.

const WARNING_PATTERNS = {
    'Alcohol Content': [
        /\bbinge\s*drink/i,
        /\bdrinking\s*game/i,
        /\bget\s*(drunk|wasted|hammered)/i,
    ],
    'Tobacco Content': [
        /\bbuy\s*(cigarettes?|cigars?|vape|e[\s-]*cig)/i,
        /\btobacco\s*(shop|store|buy|sale)/i,
    ],
    'Profanity (Excessive)': [
        /\bf+u+c+k+/i,
        /\bs+h+i+t+(?!ake)/i,
        /\bass+hole/i,
        /\bbitch/i,
        /\bdamn/i,
    ],
};

// ─── Clickbait Title Patterns ────────────────────────────────────────────────

const CLICKBAIT_PATTERNS = [
    /you\s*won'?t\s*believe/i,
    /doctors?\s*(hate|don'?t\s*want\s*you\s*to\s*know)/i,
    /this\s*one\s*(weird|simple)\s*trick/i,
    /shocking\s*(truth|secret|reveal)/i,
    /what\s*happens\s*next\s*will\s*(shock|amaze|surprise)/i,
    /\b(he|she|they)\s*did\s*what\?/i,
];

// ─── Validator Functions ─────────────────────────────────────────────────────

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
    return text.split(/\s+/).filter(w => w.length > 0).length;
}

function validatePost(post) {
    const errors = [];
    const warnings = [];
    const plainContent = stripHtml(post.content || '');
    const fullText = `${post.title || ''} ${plainContent}`;

    // 1. Check prohibited content
    for (const [category, patterns] of Object.entries(PROHIBITED_PATTERNS)) {
        for (const pattern of patterns) {
            const match = fullText.match(pattern);
            if (match) {
                errors.push(`[PROHIBITED] ${category}: Found "${match[0]}" — This violates Google AdSense policies and will get your account BANNED.`);
            }
        }
    }

    // 2. Check restricted/warning content
    let profanityCount = 0;
    for (const [category, patterns] of Object.entries(WARNING_PATTERNS)) {
        for (const pattern of patterns) {
            const matches = fullText.match(new RegExp(pattern.source, 'gi'));
            if (matches) {
                if (category === 'Profanity (Excessive)') {
                    profanityCount += matches.length;
                } else {
                    warnings.push(`[RESTRICTED] ${category}: Found "${matches[0]}" — This content will receive fewer or no ads.`);
                }
            }
        }
    }
    if (profanityCount > 3) {
        errors.push(`[PROHIBITED] Excessive Profanity: Found ${profanityCount} instances — Excessive profanity violates AdSense policies.`);
    } else if (profanityCount > 0) {
        warnings.push(`[RESTRICTED] Profanity: Found ${profanityCount} instance(s) — This may reduce ad revenue.`);
    }

    // 3. Check clickbait titles
    for (const pattern of CLICKBAIT_PATTERNS) {
        const match = (post.title || '').match(pattern);
        if (match) {
            warnings.push(`[CLICKBAIT] Title contains clickbait pattern: "${match[0]}" — May be flagged as deceptive by AdSense.`);
        }
    }

    // 4. Content length check
    const wordCount = countWords(plainContent);
    if (wordCount < 300) {
        errors.push(`[QUALITY] Content too short: ${wordCount} words — Google considers this "low-value content" and may disable ads. Minimum recommended: 500 words.`);
    } else if (wordCount < 500) {
        warnings.push(`[QUALITY] Content is short: ${wordCount} words — Recommend 500+ words for better ad performance.`);
    }

    // 5. Meta description check
    if (!post.meta_description) {
        warnings.push(`[SEO] Missing meta_description — Required for proper ad targeting and SEO.`);
    } else if (post.meta_description.length > 160) {
        warnings.push(`[SEO] meta_description too long: ${post.meta_description.length} chars — Should be under 160 characters.`);
    }

    // 6. Image check
    if (!post.image) {
        warnings.push(`[CONTENT] Missing featured image — Posts without images perform worse with ads.`);
    } else {
        const imgPath = path.join(ROOT, post.image);
        if (!fs.existsSync(imgPath)) {
            warnings.push(`[CONTENT] Featured image not found: ${post.image} — Broken images hurt user experience and ad performance.`);
        }
    }

    // 7. Required fields
    if (!post.title) errors.push(`[REQUIRED] Missing title.`);
    if (!post.slug) errors.push(`[REQUIRED] Missing slug.`);
    if (!post.category) warnings.push(`[SEO] Missing category.`);
    if (!post.date) warnings.push(`[SEO] Missing date.`);
    if (!post.author) warnings.push(`[SEO] Missing author.`);
    if (!post.tags || post.tags.length === 0) warnings.push(`[SEO] Missing tags — Helps with content categorization.`);
    if (!post.keywords || post.keywords.length === 0) warnings.push(`[SEO] Missing keywords array.`);

    // 8. Slug/folder check
    if (post.slug) {
        const postDir = path.join(ROOT, 'blog', post.slug);
        if (!fs.existsSync(postDir)) {
            warnings.push(`[STRUCTURE] Blog folder not found: blog/${post.slug}/ — Run: node scripts/new-post.js "${post.slug}"`);
        }
    }

    // 9. Content has images with alt text
    const imgTags = (post.content || '').match(/<img[^>]*>/gi) || [];
    for (const imgTag of imgTags) {
        if (!/alt\s*=\s*["'][^"']+["']/i.test(imgTag)) {
            warnings.push(`[ACCESSIBILITY] Image missing alt text: ${imgTag.substring(0, 80)}... — Required for SEO and accessibility.`);
        }
    }

    return { errors, warnings, wordCount };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     TrendBriefly — Google AdSense Compliance Validator      ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    if (!fs.existsSync(POSTS_FILE)) {
        console.error('❌ Error: data/posts.json not found!');
        process.exit(1);
    }

    let posts;
    try {
        const raw = fs.readFileSync(POSTS_FILE, 'utf-8');
        posts = JSON.parse(raw);
    } catch (e) {
        console.error(`❌ Error parsing posts.json: ${e.message}`);
        process.exit(1);
    }

    if (!Array.isArray(posts)) {
        posts = [posts];
    }

    const targetSlug = process.argv[2];
    if (targetSlug) {
        posts = posts.filter(p => p.slug === targetSlug);
        if (posts.length === 0) {
            console.error(`❌ Post with slug "${targetSlug}" not found in posts.json`);
            process.exit(1);
        }
    }

    let totalErrors = 0;
    let totalWarnings = 0;

    for (const post of posts) {
        const { errors, warnings, wordCount } = validatePost(post);

        const statusIcon = errors.length > 0 ? '❌' : warnings.length > 0 ? '⚠️' : '✅';
        console.log(`${statusIcon} Post: "${post.title || 'UNTITLED'}" (${post.slug || 'NO-SLUG'})`);
        console.log(`   Words: ${wordCount} | Category: ${post.category || 'none'} | Date: ${post.date || 'none'}`);

        if (errors.length > 0) {
            console.log('   ERRORS:');
            for (const err of errors) {
                console.log(`     🚫 ${err}`);
            }
        }

        if (warnings.length > 0) {
            console.log('   WARNINGS:');
            for (const warn of warnings) {
                console.log(`     ⚠️  ${warn}`);
            }
        }

        if (errors.length === 0 && warnings.length === 0) {
            console.log('   ✅ All AdSense compliance checks passed!');
        }

        console.log('');
        totalErrors += errors.length;
        totalWarnings += warnings.length;
    }

    // Summary
    console.log('────────────────────────────────────────────────────────────');
    console.log(`Posts checked: ${posts.length}`);
    console.log(`Total errors:   ${totalErrors}`);
    console.log(`Total warnings: ${totalWarnings}`);
    console.log('');

    if (totalErrors > 0) {
        console.log('🚫 RESULT: FAILED — Fix all errors before publishing.');
        console.log('   See docs/ADSENSE-RULES.md for full policy reference.');
        process.exit(1);
    } else if (totalWarnings > 0) {
        console.log('⚠️  RESULT: PASSED WITH WARNINGS — Content may receive reduced ad revenue.');
        console.log('   Review warnings and fix if possible.');
        process.exit(0);
    } else {
        console.log('✅ RESULT: ALL CLEAR — Content is AdSense compliant!');
        process.exit(0);
    }
}

main();
