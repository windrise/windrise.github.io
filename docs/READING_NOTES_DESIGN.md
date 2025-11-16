# Reading Notes System Design

## 📋 Overview

A comprehensive reading notes system integrated into the papers collection website, allowing users to take, manage, and organize notes while reading academic papers.

## 🗂️ Data Structure

### Extended papers.yaml Schema

```yaml
papers:
  - id: paper-id-2023
    title: "Paper Title"
    authors: ["Author 1", "Author 2"]
    # ... existing fields ...

    # NEW: Reading Notes Fields
    reading_notes:
      status: "reading"  # Options: "to-read", "reading", "completed", "skipped"
      priority: 3  # 1-5, where 5 is highest
      progress: 60  # percentage (0-100)
      read_date: "2025-01-10"
      rating: 4  # 1-5 stars

      # Main notes content (Markdown)
      notes: |
        # My Reading Notes

        ## Key Insights
        - This paper introduces...
        - The main contribution is...

        ## Questions
        - How does this compare to XYZ?
        - What about edge cases?

        ## Code Implementation Ideas
        ```python
        def implement_method():
            pass
        ```

        ## Related Work
        - Paper A (similar approach)
        - Paper B (complementary method)

      # Quick annotations/highlights
      highlights:
        - text: "This is an important finding"
          page: 3
          color: "yellow"
          note: "Remember to cite this"

        - text: "Novel architecture design"
          page: 5
          color: "green"
          note: "Try implementing this"

      # Tags for organization
      tags: ["deep-learning", "medical-imaging", "novel-architecture"]

      # Quick summary (separate from AI summary)
      my_summary: "Brief personal summary of the paper..."

      # Actionable items
      todos:
        - action: "Implement the proposed method"
          status: "pending"  # "pending", "done", "skipped"
          due_date: "2025-02-01"

        - action: "Compare with baseline XYZ"
          status: "done"
          completed_date: "2025-01-15"

      # Metadata
      note_created: "2025-01-10T10:30:00Z"
      note_updated: "2025-01-15T14:20:00Z"
      note_version: 2
```

## 🎨 UI Components

### 1. Paper Card Enhancement

Add a "Notes" button to each paper card:
- 📝 Icon/button: "Add Notes" or "View Notes" (if notes exist)
- Badge showing reading status (to-read, reading, completed)
- Star rating display
- Progress bar (visual indicator of reading progress)

### 2. Notes Modal/Sidebar

Full-screen or sidebar interface for note-taking:

```
┌─────────────────────────────────────────────────────┐
│  Paper Title                            [Save] [✕]  │
│  Authors | Year | Venue                              │
├─────────────────────────────────────────────────────┤
│  ┌─ Status ──────────┐  ┌─ Priority ──┐            │
│  │ ● Reading         │  │ ⭐⭐⭐⭐⭐   │            │
│  └───────────────────┘  └─────────────┘            │
│                                                      │
│  ┌─ Progress ────────────────────────────────┐     │
│  │ ████████████████░░░░░░░░░░░░░░░░  60%    │     │
│  └───────────────────────────────────────────┘     │
│                                                      │
│  ┌─ Tabs ─────────────────────────────────────┐    │
│  │ [Notes] [Highlights] [To-Do] [Summary]     │    │
│  └───────────────────────────────────────────┘     │
│                                                      │
│  ┌─ Markdown Editor ───────────────────────────┐   │
│  │ # My Reading Notes                          │   │
│  │                                              │   │
│  │ ## Key Insights                             │   │
│  │ - Main contribution: ...                    │   │
│  │ -                                            │   │
│  │                                              │   │
│  │ [Formatting] [Preview] [Insert Code Block]  │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Tags: [#deep-learning] [#medical] [+ Add Tag]      │
│                                                      │
│  [Auto-save: Saved 2 seconds ago]                   │
└─────────────────────────────────────────────────────┘
```

### 3. Notes View Page

Dedicated page to view all notes:
- `/papers/notes/` - All notes overview
- `/papers/notes/{paper-id}` - Individual paper notes view

Features:
- Search notes by content, tags, or paper title
- Filter by status (to-read, reading, completed)
- Filter by rating, priority
- Sort by date added, last updated, reading progress
- Tag cloud for quick navigation

### 4. Reading Progress Dashboard

Visual dashboard showing:
- Papers by status (pie chart)
- Reading progress timeline
- Monthly reading stats
- Most used tags
- Recent notes

## 💾 Implementation Approach

### Phase 1: Basic Notes Support

1. **Update Data Schema**
   - Add `reading_notes` field to papers.yaml
   - Create migration script for existing papers

2. **Simple Notes Modal**
   - Basic text area for notes
   - Save/Cancel buttons
   - Status dropdown (to-read, reading, completed)
   - Star rating

3. **Display Notes Indicator**
   - Badge on paper card if notes exist
   - "Add Notes" button on all papers

### Phase 2: Markdown Editor

1. **Integrate Markdown Editor**
   - Use SimpleMDE or similar lightweight editor
   - Live preview
   - Formatting toolbar

2. **Notes Rendering**
   - Render Markdown to HTML
   - Syntax highlighting for code blocks
   - LaTeX support for formulas (optional)

### Phase 3: Advanced Features

1. **Highlights System**
   - In-modal highlighting interface
   - Color-coded highlights
   - Quick annotations

2. **To-Do Integration**
   - Task list within notes
   - Due dates and reminders
   - Check off completed items

3. **Tags and Organization**
   - Auto-suggest tags based on paper content
   - Tag cloud visualization
   - Filter papers by tags

### Phase 4: Collaborative Features (Future)

1. **Notes Sharing**
   - Export notes as Markdown
   - Generate shareable link
   - PDF export with notes

2. **Version Control**
   - Track note edits
   - Restore previous versions
   - Diff view

## 🔧 Technical Implementation

### Frontend (JavaScript)

```javascript
class NotesManager {
  constructor() {
    this.currentPaper = null;
    this.autosaveInterval = 5000; // 5 seconds
  }

  openNotesModal(paperId) {
    // Load existing notes or create new
    // Display modal
    // Start autosave timer
  }

  saveNotes(paperId, notesData) {
    // Validate notes
    // Update papers.yaml (via GitHub API or local storage)
    // Show save confirmation
  }

  autosave() {
    // Periodically save draft to localStorage
  }

  exportNotes(paperId, format) {
    // Export as Markdown, PDF, or JSON
  }
}
```

### Backend (Python Script)

```python
# scripts/notes_manager.py

def update_paper_notes(paper_id: str, notes_data: dict):
    """Update notes for a specific paper"""
    papers = load_papers_yaml()

    for paper in papers['papers']:
        if paper['id'] == paper_id:
            if 'reading_notes' not in paper:
                paper['reading_notes'] = {}

            paper['reading_notes'].update(notes_data)
            paper['reading_notes']['note_updated'] = datetime.now().isoformat()
            break

    save_papers_yaml(papers)

def get_notes_statistics():
    """Get statistics about reading notes"""
    papers = load_papers_yaml()
    stats = {
        'total_with_notes': 0,
        'by_status': defaultdict(int),
        'by_rating': defaultdict(int),
        'recent_notes': []
    }

    for paper in papers['papers']:
        if 'reading_notes' in paper:
            stats['total_with_notes'] += 1
            status = paper['reading_notes'].get('status', 'unknown')
            stats['by_status'][status] += 1
            # ... more statistics

    return stats
```

### Storage Options

**Option 1: GitHub-based (Current)**
- Store notes in `papers.yaml`
- Pros: Version controlled, backed up, accessible anywhere
- Cons: Need GitHub API for real-time updates

**Option 2: LocalStorage + Export**
- Store notes in browser localStorage
- Export/import to sync across devices
- Pros: Instant save, no API needed
- Cons: Not backed up, device-specific

**Option 3: Hybrid Approach** ⭐ Recommended
- LocalStorage for drafts and autosave
- Sync to GitHub on explicit "Save" action
- Best of both worlds

## 📊 Example Use Cases

### Use Case 1: Active Reading

1. User opens paper "3D Gaussian Splatting"
2. Clicks "Add Notes" button
3. Sets status to "Reading", progress 30%
4. Takes notes in Markdown editor:
   - Key insights
   - Questions to explore
   - Code ideas
5. Highlights important sentences with colors
6. Adds tags: #3d-reconstruction, #real-time
7. Creates todo: "Implement splatting kernel"
8. Notes auto-save to localStorage
9. Clicks "Save" to commit to GitHub

### Use Case 2: Note Review

1. User visits `/papers/notes/`
2. Sees all papers with notes
3. Filters by tag "#medical-imaging"
4. Sorts by "Last Updated"
5. Clicks paper to read notes
6. Exports notes as PDF for reference

### Use Case 3: Research Planning

1. User marks 10 papers as "to-read"
2. Sets priorities (1-5)
3. Views dashboard showing reading queue
4. Completes a paper, marks "completed"
5. Rates paper 4/5 stars
6. Adds final summary and conclusions

## 🚀 Next Steps

1. ✅ Design data structure
2. 📝 Create notes modal UI prototype
3. 🔧 Implement basic save/load functionality
4. 📚 Integrate Markdown editor
5. 🎨 Build notes view page
6. 📊 Create reading dashboard
7. 🧪 Test with real papers
8. 📱 Optimize for mobile

## 📝 Notes Storage Example

```yaml
# Example of a paper with complete notes

- id: gaussian-splatting-2023
  title: 3D Gaussian Splatting for Real-Time Radiance Field Rendering
  # ... other fields ...

  reading_notes:
    status: completed
    priority: 5
    progress: 100
    read_date: "2025-01-15"
    rating: 5

    notes: |
      # Reading Notes: 3D Gaussian Splatting

      ## Overview
      Revolutionary approach to real-time neural rendering using 3D Gaussians
      instead of volumetric representations.

      ## Key Innovations
      1. **3D Gaussian Primitives**: Explicit scene representation
      2. **Differentiable Rasterization**: Fast GPU rendering
      3. **Adaptive Density Control**: Quality vs. performance tradeoff

      ## Implementation Notes
      - Uses CUDA for splatting kernel
      - Training: ~30 mins for Mip-NeRF360 scenes
      - Real-time rendering: 100+ FPS at 1080p

      ## Comparisons
      - vs. NeRF: 100x faster rendering
      - vs. Instant-NGP: Better quality
      - vs. Plenoxels: More compact representation

      ## Questions & Future Work
      - How to handle dynamic scenes?
      - Can we compress Gaussians further?
      - Integration with other 3D representations?

      ## Code Snippets
      ```python
      # Pseudocode for Gaussian projection
      def project_gaussian_3d_to_2d(mean_3d, cov_3d, camera):
          mean_2d = camera.project(mean_3d)
          J = camera.jacobian(mean_3d)
          cov_2d = J @ cov_3d @ J.T
          return mean_2d, cov_2d
      ```

      ## Related Papers to Read
      - [x] Original 3DGS paper (this one)
      - [ ] 3DGS Extensions: DreamGaussian
      - [ ] 3DGS for Editing: GaussianEditor
      - [ ] Compression: LightGaussian

    highlights:
      - text: "anisotropic covariance matrices allow for better surface representation"
        page: 4
        color: "yellow"
        note: "Key insight for quality improvement"

    tags: ["3d-gaussian", "neural-rendering", "real-time", "foundation-paper"]

    my_summary: |
      Breakthrough paper that introduced 3D Gaussian Splatting for neural
      rendering. Achieves real-time performance while maintaining quality
      comparable to offline methods. Essential reading for anyone working in
      3D reconstruction or neural rendering.

    todos:
      - action: "Implement basic Gaussian rasterizer"
        status: "done"
        completed_date: "2025-01-20"

      - action: "Train on custom medical imaging dataset"
        status: "pending"
        due_date: "2025-02-01"

    note_created: "2025-01-10T10:00:00Z"
    note_updated: "2025-01-15T18:30:00Z"
    note_version: 3
```
