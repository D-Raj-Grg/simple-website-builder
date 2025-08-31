# Documentation Directory

Comprehensive documentation for QuickPage Builder.

## Structure

```
docs/
├── USER-GUIDE.md        # End-user documentation
├── DEVELOPER-GUIDE.md   # Technical architecture guide
└── README.md            # This file
```

## Documentation Overview

### For End Users

**[USER-GUIDE.md](./USER-GUIDE.md)**
Complete guide for store owners and content creators:

- **Quick Start** (5-minute tutorial)
- **Interface Overview** (3-panel layout explanation)
- **Block Guide** (detailed guide for all 11 blocks)
- **Pro Tips & Tricks** (keyboard shortcuts, workflows)
- **Design Best Practices** (colors, typography, layouts)
- **Export & Publishing** (HTML/React export options)
- **Troubleshooting** (common issues and solutions)
- **Advanced Features** (templates, auto-save, history)

**Target Audience:**
- Store owners without technical background
- Content creators and marketers
- Small business owners
- Anyone building homepages quickly

**Key Sections:**
- ⚡ **Quick Start**: Get up and running in 5 minutes
- 🧩 **Block Guide**: Master all 11 block types
- 🎨 **Design Tips**: Create professional-looking pages
- 📤 **Export Options**: Publish your finished pages

### For Developers

**[DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)**
Technical documentation for developers and contributors:

- **Architecture Overview** (system design and patterns)
- **Project Structure** (file organization and conventions)
- **Block System** (how blocks work and how to create new ones)
- **State Management** (Zustand stores and data flow)
- **UI Components** (shadcn/ui integration and patterns)
- **Export System** (HTML/React code generation)
- **Testing** (testing strategy and examples)
- **API Reference** (functions, hooks, and utilities)

**Target Audience:**
- React/Next.js developers
- Open source contributors
- Technical team members
- Developers extending the platform

**Key Sections:**
- 🏗️ **Architecture**: Understand system design
- 🧱 **Block System**: Create and customize blocks
- 📊 **State Management**: Work with Zustand stores
- 🎨 **UI Patterns**: Use and extend UI components

## Documentation Standards

### Writing Guidelines

**Clarity and Concision:**
- Use simple, clear language
- Avoid jargon and technical terms when possible
- Include practical examples for everything
- Break up long sections with headers and lists

**Structure:**
- Start with quick examples
- Provide comprehensive references
- Include troubleshooting sections
- Use consistent formatting throughout

**Code Examples:**
```javascript
// Always include working code examples
import { useEditorStore } from '@/lib/store/editorStore';

function ExampleComponent() {
  const { addBlock } = useEditorStore();
  
  const handleAddHero = () => {
    addBlock('hero');
  };
  
  return (
    <button onClick={handleAddHero}>
      Add Hero Block
    </button>
  );
}
```

### Markdown Conventions

**Headers:**
- Use descriptive, scannable headers
- Maintain consistent hierarchy (H1 > H2 > H3)
- Include emoji where appropriate for visual clarity

**Code Blocks:**
- Always specify language for syntax highlighting
- Include complete, runnable examples
- Add comments explaining complex parts

**Links:**
- Use relative links within documentation
- Include external links for references
- Check all links work correctly

**Images and Diagrams:**
- Include screenshots for UI instructions
- Use ASCII diagrams for simple structures
- Optimize images for fast loading

## Content Maintenance

### Regular Updates

**User Guide:**
- Update screenshots when UI changes
- Add new blocks to the block guide
- Revise workflows based on user feedback
- Keep troubleshooting section current

**Developer Guide:**
- Update API references when code changes
- Add examples for new patterns
- Revise architecture docs for major changes
- Keep dependencies and versions current

### Version Control

**Documentation Versioning:**
- Tag documentation versions with releases
- Maintain compatibility notes
- Archive outdated versions
- Provide migration guides

**Change Tracking:**
- Document breaking changes clearly
- Include upgrade instructions
- Track feature additions and removals
- Maintain comprehensive changelogs

## Contributing to Documentation

### For Writers

**Improving User Guide:**
1. Test all instructions on a fresh installation
2. Write from the user's perspective
3. Include common pitfalls and solutions
4. Use real examples, not abstract concepts

**Style Guide:**
- Use active voice ("Click the button" not "The button should be clicked")
- Include specific steps, not general directions
- Use consistent terminology throughout
- Proofread for grammar and clarity

### For Developers

**Technical Documentation:**
1. Include code examples that actually work
2. Explain the "why" not just the "how"
3. Document edge cases and limitations
4. Keep API docs synchronized with code

**Code Documentation:**
```javascript
/**
 * Add JSDoc comments to all functions
 * @param {string} blockType - Type of block to add
 * @param {number} position - Position to insert (-1 for end)
 * @returns {string} ID of the newly created block
 */
function addBlock(blockType, position = -1) {
  // Implementation...
}
```

## Documentation Tools

**Authoring:**
- Markdown editors (Typora, Mark Text)
- Live preview tools
- Grammar checkers (Grammarly)
- Screenshot tools (CleanShot X)

**Review Process:**
- Peer review for technical accuracy
- User testing for clarity
- Regular audits for outdated content
- Feedback collection from users

**Publishing:**
- GitHub Pages for public documentation
- Internal wiki for development docs
- PDF exports for offline reading
- Search functionality for large docs

## Getting Help

### For Users
- Check the [USER-GUIDE.md](./USER-GUIDE.md) first
- Search the troubleshooting section
- Create issues on GitHub for bugs
- Join community discussions

### for Developers  
- Review the [DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)
- Check code comments and JSDoc
- Look at examples in the codebase
- Ask questions in developer discussions

### Documentation Issues
- Report unclear instructions
- Suggest improvements or additions
- Submit corrections for errors
- Request new examples or guides