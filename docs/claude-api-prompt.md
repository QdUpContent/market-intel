# Claude API Prompt for Make.com Episode Analysis

Use this prompt in the **Make.com → Claude API** module. Replace the `{{variables}}` with dynamic values pulled from the Monday.com trigger module.

---

## System Prompt

```
You are the data extraction engine for AI Market Intel, a weekly podcast about AI trends for content marketers. Your job is to analyze episode content and return structured JSON that will be merged into the website's data files.

You MUST return ONLY valid JSON — no markdown fences, no explanation, no preamble. Just the raw JSON object.
```

## User Prompt

```
Analyze this new episode and extract structured data for the Market Intel knowledge hub.

## Episode Info
- Number: {{episode_number}}
- Title: {{episode_title}}
- Date: {{publish_date}}
- Duration: {{duration}}

## Show Notes
{{show_notes}}

## Transcript
{{transcript}}

## Links Mentioned
{{links}}

---

Return a single JSON object with exactly these four keys:

{
  "episode": { ... },
  "newGlossaryTerms": [ ... ],
  "platformUpdates": [ ... ],
  "toolUpdates": [ ... ]
}

### Schema: episode

{
  "id": "ep{{episode_number}}",
  "num": {{episode_number}},
  "title": "{{episode_title}}",
  "date": "YYYY-MM-DD",
  "dateDisplay": "Mon DD, YYYY",
  "duration": "MM:SS",
  "description": "2-3 sentence summary of the episode's key stories. Keep it punchy and specific.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "isNew": true,
  "stats": {
    "downloads": 0,
    "uniqueListeners": 0,
    "completionRate": 0
  },
  "links": {
    "spotify": "",
    "apple": "",
    "youtube": "",
    "audio": ""
  }
}

Rules:
- tags: Extract 2-4 specific technology/company names discussed (e.g., "Gemini 3.1 Pro", "Kling 3.0"), not generic terms
- description: Write for someone scanning episode titles. Lead with the most important story.
- date: ISO format YYYY-MM-DD
- dateDisplay: "Feb 19, 2026" format
- stats: Always zeros — these are populated later from analytics

### Schema: newGlossaryTerms

Only include terms that are NEW and not already in the glossary. Each term:

{
  "term": "Term Name",
  "definition": "Plain-language explanation in 2-3 sentences. Written for a content marketer, not a developer. Explain what it is, why it matters, and how it's used.",
  "category": "One of: Concepts | Technical | Marketing | Content Creation | Legal | Skills | Companies | Podcasting",
  "episodes": [{{episode_number}}],
  "letter": "T"
}

Rules:
- Only extract terms that are explained or defined in the episode (not just mentioned in passing)
- definition: Write like you're explaining to a smart marketer who doesn't know AI jargon
- letter: First letter of the term, uppercase
- Skip terms that are common knowledge (e.g., "AI", "video", "app")
- Typical episode yields 0-3 new terms

### Schema: platformUpdates

Only include platforms that are substantively discussed (not just name-dropped). Two types:

NEW platform (not in current directory):
{
  "slug": "lowercase-hyphenated",
  "name": "Platform Name",
  "category": "One of: AI Assistant | Video Generation | Voice & Audio | Design & Creative | Advertising | Automation | Other",
  "pricing": "Brief pricing (e.g., 'Free / $20/mo Pro')",
  "description": "2-3 sentences on what the platform does, its market position, and why it matters for content marketers.",
  "status": "One of: Leading | Major Player | Rising Star | Growing | Disruptor | Emerging | Established | Watch List",
  "url": "https://...",
  "episodes": [{{episode_number}}],
  "lastMentioned": "YYYY-MM-DD",
  "lastMentionedDisplay": "Mon DD, YYYY",
  "tags": ["Tag1", "Tag2", "Tag3"]
}

EXISTING platform update (already in directory):
{
  "slug": "existing-slug",
  "_action": "update",
  "episodes": [{{episode_number}}],
  "lastMentioned": "YYYY-MM-DD",
  "lastMentionedDisplay": "Mon DD, YYYY",
  "description": "Updated description if there's significant news. Otherwise omit this field."
}

Rules:
- slug: lowercase, hyphens only, must be unique and stable
- status: Based on market position, not opinion. "Leading" = top 3 in category. "Rising Star" = gaining fast.
- Only flag _action: "update" for platforms already in the directory
- Typical episode yields 1-4 platform entries

### Schema: toolUpdates

Only include specific tools discussed with enough detail to be useful. Two types:

NEW tool:
{
  "name": "Tool Name",
  "category": "One of: Video Generation | Voice & Audio | Music Generation | Design | Automation | AI Agents | Video Avatars | Creative Suite | Advertising | Other",
  "pricing": "Brief pricing info",
  "useCase": "One sentence: what it does and who it's for. Be specific.",
  "rating": "One of: Top Pick | Essential | Trending | Rising | New | Established | Watch",
  "episodes": [{{episode_number}}],
  "lastUpdated": "YYYY-MM-DD",
  "lastUpdatedDisplay": "Mon DD, YYYY",
  "url": "https://..."
}

EXISTING tool update:
{
  "name": "Existing Tool Name",
  "_action": "update",
  "episodes": [{{episode_number}}],
  "lastUpdated": "YYYY-MM-DD",
  "lastUpdatedDisplay": "Mon DD, YYYY",
  "rating": "Updated rating if warranted",
  "useCase": "Updated use case if there's significant new capability. Otherwise omit."
}

Rules:
- rating: "Top Pick" = best in class. "Essential" = everyone should use. "Trending" = gaining momentum. "Watch" = too early to recommend.
- Only flag _action: "update" for tools already in the repository
- Typical episode yields 1-5 tool entries

---

IMPORTANT: Return ONLY the JSON object. No explanation. No markdown. No code fences. Just valid JSON.
```

---

## Make.com Merge Logic

After receiving Claude's response, Make.com needs to merge the data:

### episodes.json
1. Parse current `episodes.json` from GitHub
2. Set `isNew: false` on all existing episodes
3. Prepend the new episode object (newest first)
4. Stringify and commit

### glossary.json
1. Parse current `glossary.json`
2. For each item in `newGlossaryTerms`: append to array
3. Sort by `letter` then `term`
4. Stringify and commit

### platforms.json
1. Parse current `platforms.json`
2. For each item in `platformUpdates`:
   - If `_action === "update"`: find by `slug`, merge fields, append episode number to `episodes` array
   - Else: append as new entry
3. Stringify and commit

### tools.json
1. Parse current `tools.json`
2. For each item in `toolUpdates`:
   - If `_action === "update"`: find by `name`, merge fields, append episode number to `episodes` array
   - Else: append as new entry
3. Stringify and commit

### Git Commit
Single commit with all four files:
```
Auto-update: Episode {{episode_number}} — {{episode_title}}
```
